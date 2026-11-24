import Link from "next/link";
import { Tonia } from "@/components/Tonia";

export default function NotFound() {
  return (
    <div className="wrap" style={{ display: "grid", placeItems: "center", textAlign: "center", padding: "64px 16px 96px", gap: 16 }}>
      <Tonia loop="look_around" width={160} label="Tonia looking around for the missing page" />
      <h1 className="serif" style={{ fontSize: "clamp(2rem, 1.5rem + 2vw, 3rem)" }}>
        This page wandered off.
      </h1>
      <p className="lede">Tonia looked everywhere. It isn't here.</p>
      <Link href="/" className="btn btn-primary">
        Back to Etonia
      </Link>
    </div>
  );
}
