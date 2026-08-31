import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

/*
  PLACEHOLDER PAGE — needs real content before this is fit to publish.

  Checklist for this page:
    - licence terms for the apps (what the user is granted, and on what terms)
    - acceptable use
    - subscription and refund terms, including how App Store purchases and
      Apple's own refund process interact with these
    - limitation of liability
    - governing law and jurisdiction

  Nothing here was written by Claude on purpose: these are commitments only the
  studio can make.
*/

export const metadata: Metadata = {
  title: "Terms of Use — MyElleLab",
  // TODO: remove `robots` once real content replaces the placeholder.
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <p className="text-muted">
        [PLACEHOLDER — content to be supplied. Do not publish as-is.]
      </p>
    </LegalPage>
  );
}
