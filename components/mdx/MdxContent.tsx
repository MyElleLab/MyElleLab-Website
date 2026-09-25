import type { ComponentPropsWithoutRef } from "react";
import type React from "react";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";

import { Figure } from "@/components/mdx/Figure";
import { ScatterToTrend } from "@/components/mdx/ScatterToTrend";
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
  h2: (props: P<"h2">) => (
    <h2
      className="mt-12 mb-4 font-serif text-2xl md:text-3xl font-semibold tracking-wordmark text-ink scroll-mt-24"
      {...props}
    />
  ),
  h3: (props: P<"h3">) => (
    <h3
      className="mt-9 mb-3 font-serif text-xl md:text-2xl font-semibold tracking-wordmark text-ink scroll-mt-24"
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
  table: (props: P<"table">) => (
    <div className="my-7 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: P<"th">) => (
    <th
      className="border-b border-rule px-3 py-2 text-left font-sans text-[11px] font-medium uppercase tracking-eyebrow text-muted"
      {...props}
    />
  ),
  td: (props: P<"td">) => (
    <td className="border-b border-rule px-3 py-2 align-top text-ink" {...props} />
  ),
  /* Capitalised entries are components a post calls by name rather than
     element mappings. Figure is the frame for anything visual in a body;
     the visuals themselves register alongside it, so a post writes
     <Figure caption="..."><ScatterToTrend /></Figure> and nothing about the
     frame is restated per post. */
  Figure,
  ScatterToTrend,
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
        options={{ mdxOptions: { rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]] } }}
      />
    </div>
  );
}
