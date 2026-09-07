import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { suiteSlug, suites, type Suite } from "@/lib/products";

/**
 * The blog's content layer: MDX files on disk, read at build time.
 *
 * A post's series is implied by its directory — content/blog/<series-slug>/
 * where <series-slug> is suiteSlug() output. There is no `series` field in
 * the frontmatter to contradict the path, and a directory naming a series
 * that does not exist fails the build rather than quietly vanishing.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const PUBLIC_DIR = path.join(process.cwd(), "public");

/** Drafts render in dev so they can be previewed, and do not exist in prod. */
export const SHOW_DRAFTS = process.env.NODE_ENV === "development";

export type Post = {
  title: string;
  description: string;
  /** As authored, ISO 8601. */
  date: string;
  tags: string[];
  cover?: string;
  coverAlt?: string;
  draft: boolean;
  /** File basename without the extension. */
  slug: string;
  seriesSlug: string;
  suite: Suite;
  /** Sort key. */
  timestamp: number;
  /** MDX source, frontmatter stripped. */
  body: string;
  href: string;
};

/**
 * Frontmatter problems throw. A post that renders blank, or silently drops
 * out of every listing because a date failed to parse, is far more expensive
 * to notice than a build that stops and says which file and which field.
 */
function fail(file: string, problem: string): never {
  throw new Error(
    [
      "",
      "  Invalid blog post frontmatter",
      `    file:    ${file}`,
      `    problem: ${problem}`,
      "",
      "  Required: title (string), description (string), date (ISO 8601).",
      "  Optional: tags (string[]), cover (path under /public), draft (boolean).",
      "  coverAlt (string) is required whenever cover is set.",
      "",
    ].join("\n"),
  );
}

function requireString(file: string, data: Record<string, unknown>, key: string) {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    fail(file, `"${key}" is required and must be a non-empty string (got ${JSON.stringify(value)})`);
  }
  return value.trim();
}

function parsePost(filePath: string, seriesSlug: string, suite: Suite): Post {
  const relative = path.relative(process.cwd(), filePath);
  const parsed = matter(fs.readFileSync(filePath, "utf8"));
  const data = parsed.data as Record<string, unknown>;

  const title = requireString(relative, data, "title");
  const description = requireString(relative, data, "description");

  /* YAML turns an unquoted 2026-09-06 into a Date, and a quoted one into a
     string. Both are reasonable things to write in frontmatter, so both are
     accepted and normalised to an ISO string here rather than making authors
     remember the quotes. */
  const rawDate = data.date;
  let date: string;
  if (rawDate instanceof Date && !Number.isNaN(rawDate.getTime())) {
    date = rawDate.toISOString();
  } else if (typeof rawDate === "string" && !Number.isNaN(Date.parse(rawDate))) {
    date = new Date(rawDate).toISOString();
  } else {
    fail(
      relative,
      `"date" is required and must be an ISO 8601 date such as 2026-09-06 (got ${JSON.stringify(rawDate)})`,
    );
  }
  const timestamp = Date.parse(date);

  let tags: string[] = [];
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags) || data.tags.some((t) => typeof t !== "string")) {
      fail(relative, `"tags" must be an array of strings (got ${JSON.stringify(data.tags)})`);
    }
    tags = data.tags as string[];
  }

  let cover: string | undefined;
  let coverAlt: string | undefined;
  if (data.cover !== undefined) {
    cover = requireString(relative, data, "cover");
    if (!cover.startsWith("/")) {
      fail(relative, `"cover" must be a path under /public beginning with "/" (got ${JSON.stringify(cover)})`);
    }
    if (!fs.existsSync(path.join(PUBLIC_DIR, cover))) {
      fail(relative, `"cover" points at public${cover}, which does not exist`);
    }
    if (data.coverAlt === undefined) {
      fail(relative, `"coverAlt" is required whenever "cover" is set — a cover image needs alternative text`);
    }
    coverAlt = requireString(relative, data, "coverAlt");
  } else if (data.coverAlt !== undefined) {
    fail(relative, `"coverAlt" is set but "cover" is not`);
  }

  if (data.draft !== undefined && typeof data.draft !== "boolean") {
    fail(relative, `"draft" must be a boolean (got ${JSON.stringify(data.draft)})`);
  }

  const slug = path.basename(filePath, path.extname(filePath));

  return {
    title,
    description,
    date,
    tags,
    cover,
    coverAlt,
    draft: data.draft === true,
    slug,
    seriesSlug,
    suite,
    timestamp,
    body: parsed.content,
    href: `/blog/${seriesSlug}/${slug}`,
  };
}

function readAllPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const posts: Post[] = [];
  for (const dir of fs.readdirSync(CONTENT_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;

    const suite = suites.find((s) => suiteSlug(s) === dir.name);
    if (!suite) {
      fail(
        path.join("content", "blog", dir.name),
        `no suite has the slug "${dir.name}" — a post directory must match a suite in lib/products.ts`,
      );
    }

    for (const entry of fs.readdirSync(path.join(CONTENT_DIR, dir.name))) {
      if (!entry.endsWith(".mdx")) continue;
      posts.push(parsePost(path.join(CONTENT_DIR, dir.name, entry), dir.name, suite));
    }
  }

  /* Newest first everywhere. Ties broken by slug so the order is stable
     across builds rather than dependent on readdir. */
  return posts.sort(
    (a, b) => b.timestamp - a.timestamp || a.slug.localeCompare(b.slug),
  );
}

/* Read once per process in production; re-read every call in dev so editing
   an MDX file shows up without restarting the server. */
let cached: Post[] | null = null;
function allPosts(): Post[] {
  if (SHOW_DRAFTS) return readAllPosts();
  cached ??= readAllPosts();
  return cached;
}

/** Every post that should be visible in this environment, newest first. */
export function getPosts(): Post[] {
  return allPosts().filter((post) => SHOW_DRAFTS || !post.draft);
}

export function getPostsInSeries(seriesSlug: string): Post[] {
  return getPosts().filter((post) => post.seriesSlug === seriesSlug);
}

export function getPost(seriesSlug: string, slug: string): Post | undefined {
  return getPosts().find((p) => p.seriesSlug === seriesSlug && p.slug === slug);
}

export function getLatestPosts(limit: number): Post[] {
  return getPosts().slice(0, limit);
}

/**
 * Neighbours within the same series. "Previous" is the older post and "next"
 * the newer one, which is the direction a reader working through a series
 * expects. Either may be absent at the ends.
 */
export function getSeriesNeighbours(post: Post): {
  previous?: Post;
  next?: Post;
} {
  const series = getPostsInSeries(post.seriesSlug); // newest first
  const i = series.findIndex((p) => p.slug === post.slug);
  if (i === -1) return {};
  return { previous: series[i + 1], next: series[i - 1] };
}

/** Recent posts from any series but this one. */
export function getPostsElsewhere(post: Post, limit: number): Post[] {
  return getPosts()
    .filter((p) => p.seriesSlug !== post.seriesSlug)
    .slice(0, limit);
}

/** "8 August 2026". UTC so the rendered day cannot drift with the builder's
    timezone. */
export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
