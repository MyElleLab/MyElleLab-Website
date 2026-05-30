import { suites } from "@/lib/products";

export function Footer() {
  const sites = suites
    .flatMap((s) => s.products)
    .filter((p) => p.siteUrl)
    .map((p) => ({
      name: p.name,
      siteUrl: p.siteUrl!,
      label: p.siteUrl!.replace(/^https?:\/\//, ""),
    }));

  return (
    <footer id="contact" className="relative border-t border-white/5 mt-12">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-flame-500 shadow-[0_0_18px_rgba(249,115,22,0.7)]" />
              <span className="font-display font-semibold tracking-tight text-lg">
                MyElleLab
              </span>
            </div>
            <p className="mt-4 max-w-sm text-white/55 leading-relaxed text-sm">
              An independent iOS studio building focused apps, crafted in
              suites.
            </p>
            <a
              href="mailto:hello@myellelab.com"
              className="mt-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-flame-400 transition"
            >
              hello@myellelab.com
              <svg
                viewBox="0 0 24 24"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-[0.18em] text-white/40">
              Apps
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {sites.map((s) => (
                <li key={s.siteUrl}>
                  <a
                    href={s.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition"
                  >
                    {s.name}{" "}
                    <span className="text-white/35">— {s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.18em] text-white/40">
              Follow
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="https://www.linkedin.com/company/myellelab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition"
                >
                  LinkedIn @MyElleLab
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} MyElleLab. All rights reserved.</p>
          <p>Designed & built in-house.</p>
        </div>
      </div>
    </footer>
  );
}
