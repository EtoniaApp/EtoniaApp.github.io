import screens from "@/lib/screens.json";
import { AiPlot, LinkedReading } from "@/components/AiShowcase";
import { StudyDesk } from "@/components/StudyDesk";
import { Pricing } from "@/components/Pricing";
import { WaitlistCard, WaitlistForm } from "@/components/Waitlist";
import { Reveal, Scribble } from "@/components/Reveal";
import { Doodle, type DoodleKind } from "@/components/Doodles";
import styles from "./home.module.css";

const FREE: { title: string; body: string; color: string; icon: DoodleKind }[] = [
  { title: "120 Hz ink", body: "Ballpoint, fountain pen, pencil and highlighter with low-latency vector strokes.", color: "var(--butter)", icon: "squiggle" },
  { title: "Hold to shape", body: "Pause at the end of a stroke and it snaps to a clean line, circle or polygon.", color: "var(--lavender)", icon: "circle" },
  { title: "Every paper", body: "Blank, lined, grid, dotted or infinite, in A4, Letter or square.", color: "var(--sky)", icon: "check" },
  { title: "Sticky notes", body: "Movable notes, images and typed text boxes you can drop anywhere.", color: "var(--pink)", icon: "heart" },
  { title: "Audio, synced", body: "Record a lecture and replay it alongside your strokes, transcribed on device.", color: "var(--mint)", icon: "sparkle" },
  { title: "Your handwriting", body: "Calibrate once so the AI's notes look like you wrote them.", color: "var(--butter)", icon: "pencil" },
  { title: "PDF markup", body: "Import and annotate PDFs, with a chapter overview of every page.", color: "var(--lavender)", icon: "star" },
  { title: "Export anything", body: "PDF, PNG or vector SVG, with no watermark, ever.", color: "var(--sky)", icon: "sprout" },
];

function Shot({ name, alt, className }: { name: keyof typeof screens; alt: string; className?: string }) {
  const [w, h] = screens[name];
  return <img src={`/screens/${name}.webp`} alt={alt} width={w} height={h} loading="lazy" className={className} />;
}

export default function Home() {
  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section id="top" data-guide="hero" className={`${styles.hero} paper-ruled`}>
        <div className={`wrap ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <Reveal>
              <span className={styles.platform}>
                <span className={styles.dot} /> Coming soon to iPad, iPhone &amp; Android
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className={`serif ${styles.h1}`}>
                Handwritten notes that <Scribble>think with you.</Scribble>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lede">
                Circle a problem and Etonia plots the graph and writes the steps right on your page. Open the Study
                Desk and a patient tutor teaches from your own notes. Every notebook feature is free, with no ads.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className={styles.heroForm}>
                <WaitlistForm source="etonia_io_hero" />
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <a href="#ai-plot" className={styles.tour}>
                <Doodle kind="arrow" size={26} /> Take the tour with Tonia
              </a>
            </Reveal>
          </div>
          <div className={styles.heroArt} aria-hidden>
            <div className={styles.heroBlob} />
            <Doodle kind="star" className={styles.hd1} />
            <Doodle kind="squiggle" className={styles.hd2} />
            <Doodle kind="heart" className={styles.hd3} />
            <Doodle kind="sparkle" className={styles.hd4} />
            <div className={styles.heroTablet}>
              <img src="/screens/ai-after.webp" alt="" width={1600} height={1118} />
            </div>
            <div className={styles.heroPhone}>
              <img src="/screens/phone-library.webp" alt="" width={640} height={1385} />
            </div>
            <div className={styles.heroSticky}>
              Exam Friday!
              <br />
              <span>✓ derivatives</span>
              <br />
              <span>✓ vertex form</span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- AI plot */}
      <section id="ai-plot" data-guide="ai-plot" className={`section bg-butter wavy-top ${styles.colored}`}>
        <Doodle kind="star" className={styles.floatA} />
        <Doodle kind="pencil" className={styles.floatB} />
        <div className="wrap">
          <Reveal className={styles.head}>
            <span className="eyebrow">
              <span className="num">1</span> AI Plot &amp; Notation
            </span>
            <h2 className="section-title">
              From a circled equation to a <span className="mark-lilac mark">graph on your page.</span>
            </h2>
            <p className="lede">
              Select your handwritten maths and ask. Instead of a detached chat box, Etonia draws the axes, plots the
              curve with its roots and extrema, and writes each step beside your work, in handwriting matched to your
              own.
            </p>
          </Reveal>
          <Reveal>
            <AiPlot />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------- linked reading */}
      <section id="linked-reading" data-guide="linked-reading" className={`section bg-lilac wavy-top ${styles.colored}`}>
        <Doodle kind="sparkle" className={styles.floatC} />
        <div className="wrap">
          <Reveal className={styles.head}>
            <span className="eyebrow">
              <span className="num">2</span> Linked reading
            </span>
            <h2 className="section-title">
              Every sentence points at <span className="mark">real ink.</span>
            </h2>
            <p className="lede">
              Each paragraph of the explanation is linked to the strokes and plot points it talks about. Scroll
              through it and the matching step lights up on your page.
            </p>
          </Reveal>
          <LinkedReading />
        </div>
      </section>

      {/* ------------------------------------------------------ study desk */}
      <section id="study-desk" data-guide="study-desk" className={`section paper-dots wavy-top ${styles.colored} ${styles.paperBg}`}>
        <Doodle kind="heart" className={styles.floatA} />
        <Doodle kind="sprout" className={styles.floatD} />
        <div className="wrap">
          <Reveal className={styles.head}>
            <span className="eyebrow">
              <span className="num">3</span> Study Desk
            </span>
            <h2 className="section-title">
              Your classes, your notes, <span className="mark-mint mark">one patient tutor.</span>
            </h2>
            <p className="lede">
              Etonia opens on the Study Desk. Each class keeps its notes, chats, practice tests and flashcards
              together, and everything the tutor says is grounded in pages you wrote or imported.
            </p>
          </Reveal>
          <Reveal>
            <StudyDesk />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- free */}
      <section id="free" data-guide="free" className={`section bg-mint wavy-top ${styles.colored}`}>
        <Doodle kind="star" className={styles.floatB} />
        <div className="wrap">
          <Reveal className={styles.head}>
            <span className="eyebrow">
              <span className="num">4</span> Free notebook
            </span>
            <h2 className="section-title">
              Every notebook feature. <Scribble color="var(--sprout)">Free.</Scribble>
            </h2>
            <p className="lede">No paywalls, no ads and no watermarks on everyday note-taking. Plans only add more AI.</p>
          </Reveal>
          <ul className={styles.freeGrid}>
            {FREE.map((f, i) => (
              <Reveal as="li" key={f.title} delay={(i % 4) * 0.06} className={styles.freeItem}>
                <span className={styles.freeIcon} style={{ background: f.color }}>
                  <Doodle kind={f.icon} size={26} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal className={styles.studio}>
            <Shot
              name="ink-studio"
              alt="An Etonia notebook with every tool showing, on dotted paper with snapped shapes and a yellow sticky note."
            />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- switch */}
      <section id="switch" data-guide="switch" className={`section bg-sky wavy-top ${styles.colored}`}>
        <div className={`wrap ${styles.switchGrid}`}>
          <Reveal className={styles.head}>
            <span className="eyebrow">
              <span className="num">5</span> Switch &amp; sync
            </span>
            <h2 className="section-title">
              Bring <span className="mark">last semester</span> with you.
            </h2>
            <p className="lede">
              Import your Goodnotes library straight from Google Drive, alongside your PDFs. Back up notes, chats and
              settings to your own Google Drive or iCloud. Your notes stay on your device, never on our servers.
            </p>
            <ul className={styles.list}>
              <li>Goodnotes import via Google Drive</li>
              <li>Unlimited notebooks and nested folders</li>
              <li>Handwriting search across everything</li>
              <li>Google Drive and iCloud backup</li>
            </ul>
          </Reveal>
          <div className={styles.phones}>
            <Reveal className={`${styles.phone} ${styles.p1}`} y={40}>
              <Shot name="phone-library" alt="Etonia's library of class folders on iPhone." />
            </Reveal>
            <Reveal className={`${styles.phone} ${styles.p2}`} y={60} delay={0.08}>
              <Shot name="phone-ai" alt="Etonia's AI plotting a parabola on a handwritten note on iPhone." />
            </Reveal>
            <Reveal className={`${styles.phone} ${styles.p3}`} y={80} delay={0.16}>
              <Shot name="phone-studio" alt="A free Etonia notebook page with shapes and sticky notes on iPhone." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- plans */}
      <section id="plans" data-guide="plans" className={`section bg-lilac wavy-top ${styles.colored}`}>
        <Doodle kind="sparkle" className={styles.floatD} />
        <div className="wrap">
          <Reveal className={styles.head}>
            <span className="eyebrow">Plans</span>
            <h2 className="section-title">
              Notes are <span className="mark">free forever.</span> Upgrade only for more AI.
            </h2>
          </Reveal>
          <Pricing />
        </div>
      </section>

      {/* -------------------------------------------------------- waitlist */}
      <section id="waitlist" data-guide="waitlist" className={`section paper-dots wavy-top ${styles.colored} ${styles.paperBg} ${styles.cta}`}>
        <div className="wrap">
          <WaitlistCard />
        </div>
      </section>
    </>
  );
}
