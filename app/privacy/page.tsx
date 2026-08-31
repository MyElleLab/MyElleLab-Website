import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

/*
  PLACEHOLDER PAGE — needs real content before this is fit to publish.

  Checklist for this page:
    - what each app collects (per app: MyGrowth, MyVisionLab, MyDarkMotivation,
      MyLooper, MyTwinLens, MyMoodLab, MyYahtzee, MySellingMate)
    - where that data is stored, and whether it ever leaves the device
    - third-party SDKs in use (RevenueCat, analytics, crash reporting) and what
      each one receives
    - data retention periods
    - user rights under GDPR (access, rectification, erasure, portability)
    - a contact address for data requests

  Nothing here was written by Claude on purpose: the answers depend on what the
  apps actually do, which is not knowable from this repository.
*/

export const metadata: Metadata = {
  title: "Privacy Policy — MyElleLab",
  // TODO: remove `robots` once real content replaces the placeholder, so the
  // page can be indexed. It exists to keep "PLACEHOLDER" out of search results.
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="text-muted">
        [PLACEHOLDER — content to be supplied. Do not publish as-is.]
      </p>
    </LegalPage>
  );
}
