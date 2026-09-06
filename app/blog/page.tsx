import type { Metadata } from "next";
import Link from "next/link";

import { TextPage } from "@/components/TextPage";
import { blogSeriesPath, suites } from "@/lib/products";

export const metadata: Metadata = {
  title: "Blog — MyElleLab",
  description:
    "Notes from the studio, one series per product suite.",
  // TODO: remove `robots` once the first real posts land. An empty blog
  // indexed as your blog is worse than not being indexed at all.
  robots: { index: false, follow: false },
};

export default function BlogIndexPage() {
  return (
    <TextPage
      title="Blog"
      subtitle="Notes from the studio — one series per suite, following the same shape as the apps themselves."
    >
      <ul className="space-y-3">
        {suites.map((suite) => (
          <li key={suite.id}>
            <Link
              href={blogSeriesPath(suite)}
              className="group block rounded-2xl border border-rule bg-surface px-6 py-5 transition hover:border-ink/20 hover:bg-canvas"
            >
              <span className="flex items-baseline justify-between gap-4">
                <span className="font-serif text-xl md:text-2xl font-semibold tracking-wordmark text-ink">
                  {suite.name}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 shrink-0 self-center text-muted transition group-hover:text-ink"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <span className="mt-1.5 block font-sans text-sm text-muted leading-relaxed">
                {suite.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </TextPage>
  );
}
