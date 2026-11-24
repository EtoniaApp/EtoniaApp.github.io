import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Support",
  description: "Help with Etonia: subscriptions, backups and your account.",
  alternates: { canonical: "/support/" },
};

export default function Page() {
  return <LegalPage doc="support" />;
}
