import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ToniaGuide } from "@/components/ToniaGuide";
import "./globals.css";

const inter = localFont({
  src: "./fonts/Inter.ttf",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const newsreader = localFont({
  src: "./fonts/Newsreader.ttf",
  variable: "--font-newsreader",
  weight: "200 800",
  display: "swap",
});

const title = "Etonia — Handwritten notes that think with you";
const description =
  "Etonia is a handwriting notebook for iPad, iPhone and Android. Every note-taking feature is free with no ads, with AI that plots and writes on your page and a Study Desk tutor that teaches from your own notes.";

export const metadata: Metadata = {
  metadataBase: new URL("https://etonia.io"),
  title: { default: title, template: "%s · Etonia" },
  description,
  applicationName: "Etonia",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://etonia.io",
    siteName: "Etonia",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  verification: {
    google: ["T7rlwO6ltehRD-U4car5UaOnSBPToeL8soglDfOxcjA", "ZmD1EHfQ-CjBnSWnRcU-3zQwqHnmQ2YAllk7P6MMmgs"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fffbf3",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        <a href="#main" className="sr-only">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <ToniaGuide />
      </body>
    </html>
  );
}
