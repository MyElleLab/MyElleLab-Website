import type { ComponentPropsWithoutRef } from "react";
import type React from "react";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

import { AppCard } from "@/components/mdx/AppCard";
import { Figure } from "@/components/mdx/Figure";
import { ClipsToLibrary } from "@/components/mdx/ClipsToLibrary";
import { HabitWeek } from "@/components/mdx/HabitWeek";
import { PhotoToListing } from "@/components/mdx/PhotoToListing";
import { SproutChecklist } from "@/components/mdx/SproutChecklist";
import { ScatterToTrend } from "@/components/mdx/ScatterToTrend";
import { Scorecard } from "@/components/mdx/Scorecard";
import { codeTheme } from "@/lib/code-theme";

/**
 * Markdown rendered in the site's own type language rather than browser
 * defaults: Playfair for headings, Geist for prose, the same rule and radius
 * tokens the cards use.
 */

/**
 * Syntax highlighting.
 *
 * The site is near-black serif on pale lavender. A dark theme — Dracula,
 * Night Owl — would drop a black slab into the middle of a pale editorial
 * page and read as a foreign object, so the theme is light and the block sits
 * on white with a hairline rule, like a quiet inset card.
 *
 * keepBackground: false discards the theme's own background so the block
 * takes ours (`--surface`) and stays consistent with every other panel.
 *
 * The theme itself is min-light pulled toward the site's palette — stock
 * min-light's comments fail contrast and its keywords are the loudest thing
 * on the page. lib/code-theme.ts has the measurements and the way back.
 */
const prettyCodeOptions: PrettyCodeOptions = {
  theme: codeTheme as unknown as PrettyCodeOptions["theme"],
  keepBackground: false,
  defaultLang: "plaintext",
};

type P<T extends keyof React.JSX.IntrinsicElements> = ComponentPropsWithoutRef<T>;

const components = {
  /* Section titles follow the post title down a step: the same Playfair 700,
     the same tight tracking, so the page has one heading voice. The top
     margin is the section break; nothing else divides sections. */
  h2: (props: P<"h2">) => (
    <h2
      className="mt-16 mb-6 font-serif text-[2rem] md:text-[2.5rem] font-bold leading-[1.08] tracking-[-0.02em] text-balance text-ink scroll-mt-24"
      {...props}
    />
  ),
  h3: (props: P<"h3">) => (
    <h3
      className="mt-10 mb-3 font-serif text-xl md:text-2xl font-bold leading-snug tracking-[-0.015em] text-ink scroll-mt-24"
      {...props}
    />
  ),
  h4: (props: P<"h4">) => (
    <h4 className="mt-8 mb-2 font-sans text-base font-semibold text-ink" {...props} />
  ),
  p: (props: P<"p">) => <p className="my-5 leading-relaxed text-ink" {...props} />,
  a: (props: P<"a">) => (
    <a
      className="text-ink underline decoration-rule decoration-1 underline-offset-4 transition hover:decoration-ink"
      {...props}
    />
  ),
  ul: (props: P<"ul">) => (
    <ul className="my-5 list-disc space-y-2 pl-5 marker:text-muted" {...props} />
  ),
  ol: (props: P<"ol">) => (
    <ol className="my-5 list-decimal space-y-2 pl-5 marker:text-muted" {...props} />
  ),
  li: (props: P<"li">) => <li className="leading-relaxed text-ink" {...props} />,
  blockquote: (props: P<"blockquote">) => (
    <blockquote
      /* text-ink, not text-muted: a pull-quote should carry more weight than
         the body, not less. Playfair italic and the 2px rule stay. */
      className="my-7 border-l-2 border-rule pl-5 font-serif text-lg italic text-ink"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-0 hairline" />,
  strong: (props: P<"strong">) => <strong className="font-semibold text-ink" {...props} />,
  /* Inline code only. The CSS in globals.css unsets all of this inside a
     <pre>, where the highlighter owns the colours. */
  code: (props: P<"code">) => (
    <code
      className="rounded-md border border-rule bg-wisp/25 px-1.5 py-0.5 font-mono text-[0.85em] text-ink"
      {...props}
    />
  ),
  /* Tables read as a lookup: a tinted header row, the first column as the
     row label (ink, semibold, a rule to its right), values in muted text,
     and the last column washed in lavender so the answer column stands out.
     A two-column table is label and answer; a wider one keeps the wash on
     its final column. Sentence case headers, not eyebrows: a table header
     is read, not scanned past. */
  table: (props: P<"table">) => (
    <div className="my-9 overflow-x-auto">
      <table className="w-full border-collapse border-y border-rule font-sans text-sm" {...props} />
    </div>
  ),
  th: (props: P<"th">) => (
    <th
      className="border-b border-rule bg-wisp/30 px-4 py-3.5 text-left align-bottom font-semibold text-ink first:border-r last:bg-wisp/50"
      {...props}
    />
  ),
  td: (props: P<"td">) => (
    <td
      className="border-b border-rule bg-surface px-4 py-3.5 align-top leading-relaxed text-muted first:border-r first:font-semibold first:text-ink last:bg-wisp/20"
      {...props}
    />
  ),
  /* Capitalised entries are components a post calls by name rather than
     element mappings. Figure is the frame for anything visual in a body;
     the visuals themselves register alongside it, so a post writes
     <Figure caption="..."><ScatterToTrend /></Figure> and nothing about the
     frame is restated per post. */
  Figure,
  AppCard,
  ClipsToLibrary,
  HabitWeek,
  PhotoToListing,
  ScatterToTrend,
  Scorecard,
  SproutChecklist,
  /* Only src/alt/title are carried through. Markdown types width and height
     as strings, which next/image rejects, and the rest of an <img>'s props
     have no meaning here. */
  img: ({ src, alt, title }: P<"img">) => (
    <Image
      src={typeof src === "string" ? src : ""}
      alt={alt ?? ""}
      title={title}
      width={1280}
      height={720}
      className="my-7 w-full rounded-2xl border border-rule object-cover"
    />
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="mdx">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            /* GFM for pipe tables, which plain MDX does not parse. */
            remarkPlugins: [remarkGfm],
            rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
          },
        }}
      />
    </div>
  );
}
