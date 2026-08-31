import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

/*
  PLACEHOLDER PAGE — needs real content before this is fit to publish.

  Checklist for this page:
    - legal entity name (and whether MyElleLab is a registered company at all)
    - registered address
    - CVR / VAT number, if registered
    - contact email for legal and business correspondence

  Nothing here was written by Claude on purpose: stating a registration that
  does not exist, or the wrong entity, would be a false claim on a live
  commercial site.
*/

export const metadata: Metadata = {
  title: "Company Details — MyElleLab",
  // TODO: remove `robots` once real content replaces the placeholder.
  robots: { index: false, follow: false },
};

export default function CompanyPage() {
  return (
    <LegalPage title="Company Details">
      <p className="text-muted">
        [PLACEHOLDER — content to be supplied. Do not publish as-is.]
      </p>
    </LegalPage>
  );
}
