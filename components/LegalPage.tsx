import type { ReactNode } from "react";
import { TextPage } from "@/components/TextPage";

/**
 * The legal routes' entry point into the shared prose shell. Kept as its own
 * name because /privacy, /terms and /company read better calling LegalPage
 * than calling the generic shell — and because they may yet want chrome the
 * blog does not, at which point this is where it goes.
 */
export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return <TextPage title={title}>{children}</TextPage>;
}
