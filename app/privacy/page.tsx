import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Etonia handles your data: your notes stay on your device.",
  alternates: { canonical: "/privacy/" },
};

export default function Page() {
  return <LegalPage doc="privacy" />;
}
