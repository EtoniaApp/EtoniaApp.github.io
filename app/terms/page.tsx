import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms for using Etonia and its optional AI plans.",
  alternates: { canonical: "/terms/" },
};

export default function Page() {
  return <LegalPage doc="terms" />;
}
