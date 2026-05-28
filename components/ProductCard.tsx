import type { Product } from "@/lib/products";

function AppStoreBadge() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.05 12.54c-.02-2.07 1.69-3.07 1.77-3.12-.96-1.4-2.46-1.6-3-1.62-1.27-.13-2.5.75-3.15.75-.66 0-1.66-.73-2.74-.71-1.41.02-2.71.82-3.43 2.08-1.46 2.53-.37 6.27 1.05 8.32.7 1 1.52 2.12 2.6 2.08 1.05-.04 1.45-.67 2.71-.67s1.62.67 2.73.65c1.13-.02 1.84-1.02 2.53-2.02.8-1.16 1.13-2.28 1.15-2.34-.03-.01-2.2-.85-2.22-3.4zM15.06 5.5c.58-.7.97-1.67.86-2.64-.83.04-1.84.55-2.45 1.24-.54.62-1.02 1.61-.89 2.56.93.07 1.89-.47 2.48-1.16z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const isAvailable = product.status === "AVAILABLE";

  return (
    <article className="glass group relative flex flex-col rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 shadow-card">
      <div className="flex items-start justify-between">
        <div
          className={`size-14 rounded-[18px] bg-gradient-to-br ${product.iconGradient} grid place-items-center font-display font-semibold text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_30px_-10px_rgba(0,0,0,0.6)]`}
          aria-hidden
        >
          {product.initials}
        </div>
        <StatusBadge status={product.status} />
      </div>

      <div className="mt-5">
        <h3 className="font-display text-xl font-semibold tracking-tight">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm text-white/55 leading-relaxed">
          {product.tagline}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 pt-5 border-t border-white/[0.06]">
        {isAvailable ? (
          <>
            <a
              href={product.appStoreUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-flame-500 px-3.5 py-2 text-xs font-medium text-ink-950 transition hover:bg-flame-400"
            >
              <AppStoreBadge />
              Download
            </a>
            {product.domain && (
              <a
                href={`https://${product.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-2 text-xs text-white/75 hover:text-white hover:bg-white/[0.06] transition"
              >
                Visit site
                <ExternalIcon />
              </a>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white/80 hover:text-white hover:border-flame-500/40 transition"
            >
              Notify me
            </button>
            {product.domain && (
              <a
                href={`https://${product.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-2 text-xs text-white/55 hover:text-white transition"
              >
                {product.domain}
                <ExternalIcon />
              </a>
            )}
          </>
        )}
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: Product["status"] }) {
  if (status === "AVAILABLE") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-flame-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-950">
        <span className="size-1.5 rounded-full bg-ink-950" />
        Available
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">
      <span className="size-1.5 rounded-full bg-white/40" />
      Coming soon
    </span>
  );
}
