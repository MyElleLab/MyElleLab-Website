"use client";

import { useEffect, useState } from "react";

/**
 * Share controls for a post.
 *
 * `url` is passed in already absolute, built from the site's canonical origin
 * on the server. It is deliberately not read from window.location: on a
 * preview or staging deployment that would put an unshareable host into
 * everything anyone posts.
 *
 * The fallback set is what renders on the server, so the first client render
 * matches it and there is no hydration mismatch. If navigator.share turns out
 * to exist, the effect swaps in the single native button afterwards.
 */

const CONTROL =
  "inline-flex items-center rounded-full border border-rule bg-surface px-3.5 py-1.5 " +
  "font-sans text-xs font-medium text-muted transition hover:border-ink/20 hover:text-ink " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/** How long "Copied" stays up before the label reverts. */
const COPIED_MS = 2000;

export function PostShare({ title, url }: { title: string; url: string }) {
  const [canShareNatively, setCanShareNatively] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanShareNatively(typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  async function shareNatively() {
    try {
      await navigator.share({ title, url });
    } catch {
      /* The user dismissed the sheet. Not an error worth surfacing. */
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      /* Clipboard access can be refused, and is absent on insecure origins.
         Leaving the label alone is a truthful way to say it did not happen. */
    }
  }

  if (canShareNatively) {
    return (
      <div className="mt-10">
        <button type="button" onClick={shareNatively} className={CONTROL}>
          Share
        </button>
      </div>
    );
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copyLink}
        className={CONTROL}
        /* The visible label changes, so the accessible name changes with it.
           aria-live lets a screen reader hear the confirmation too. */
        aria-live="polite"
      >
        {copied ? "Copied" : "Copy link"}
      </button>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={CONTROL}
      >
        Share on LinkedIn
      </a>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={CONTROL}
      >
        Share on X
      </a>
    </div>
  );
}
