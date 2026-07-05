import { useState, useEffect, useRef, useCallback } from "react";
import {
  Stethoscope, PenLine, Globe, Languages, Palette,
  Heart, MessageCircle, ChevronRight, BookOpen, Lightbulb,
  Users, Flag, Sparkles, Clock, GraduationCap, Scale,
  Flame, Star, X, ZoomIn, RotateCcw, ChevronDown, Play,
} from "lucide-react";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const gold = "#D4AF37";
const navy = "#0F172A";
const navyCard = "#1E293B";
const navyDeep = "#080F1C";

// ─── Photos ───────────────────────────────────────────────────────────────────
const PHOTOS = {
  hero1:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Jose%20Rizal%20full.jpg",

  hero2:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait%20of%20Jos%C3%A9%20Rizal%20(1891).jpg",

  hero3:
    "https://images.squarespace-cdn.com/content/v1/669e7bc5e2c62a2978bdf3f4/81188d61-6b66-4924-95d1-96be49db4859/www.tayohelp.com+%281%29.png",
  
    manuscript1:
    "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1584970600i/1645545.jpg",

  manuscript2:
    "https://upload.wikimedia.org/wikipedia/commons/c/c6/First_page_of_El_filibusterismo_manuscript.jpg",

  manuscript3:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Jose%20Rizal%20full.jpg",

  philippines1:
    "https://d2nnykqiaju69u.cloudfront.net/photos/Tanya/Contributors/Karen%20Averion%20Pangan%20Rivers/Hinatuan%20Lawrence%20Craft.jpg",

  philippines2:
    "https://upload.wikimedia.org/wikipedia/commons/c/c1/Rizal_Shrine_Calamba_2023.jpg",

  philippines3:
    "https://lh3.googleusercontent.com/gps-cs-s/APNQkAG4gHqMc3xB4RTmLZehZj7a0qNJ6Lf-EJ3q6FEZ5KSp0BJCCTCsvVHVw3qx0u4VbCWBkoQr7KyeyBipmpw2OZ6CpZOhRhauPvPYcMMroTtvA09Wnc6NLG9y6u788oGFO3tTi_0uEA=s680-w680-h510-rw",

  colonial1:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait%20of%20Jos%C3%A9%20Rizal%20(1883).jpg",

  colonial2:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait%20of%20Jos%C3%A9%20Rizal%20(1883)%20with%20frame.jpg",

  civil:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Jose%20rizal%201896.jpg",



      kapitanTiago:
    "https://static.wikia.nocookie.net/cefilipinoclassics/images/8/84/Tiago%27s_First_Appearance.jpg/revision/latest/scale-to-width-down/1200?cb=20240731101717",

  basilio:
    "https://static.wikia.nocookie.net/cefilipinoclassics/images/6/69/Basilio.png/revision/latest?cb=20240613085535",

  sisa:
    "https://static.wikia.nocookie.net/cefilipinoclassics/images/6/66/Sisa.png/revision/latest?cb=20240703052136",

  kabesangTales:
    "https://static.wikia.nocookie.net/cefilipinoclassics/images/0/0e/Kabesang_Tales.png/revision/latest?cb=20240826055908",

  padreDamaso:
    "https://static.wikia.nocookie.net/cefilipinoclassics/images/c/c6/Father_Damaso.png/revision/latest?cb=20240615131953",
};

// ─── Scroll-into-view hook ────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { ref, inView } = useInView();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 1400;
    const step = 16;
    const inc = to / (dur / step);
    const timer = setInterval(() => {
      start += inc;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center transition-colors"
        style={{ background: "rgba(212,175,55,0.15)", border: `1px solid ${gold}`, color: gold }}
        onClick={onClose}
      >
        <X size={18} />
      </button>
      <img
        src={src.replace(/w=\d+&h=\d+/, "w=1200&h=900")}
        alt={alt}
        className="max-w-full max-h-[85vh] object-contain"
        style={{ border: `1px solid rgba(212,175,55,0.3)` }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { label: "Meet Rizal", href: "#meet" },
    { label: "Relevance Today", href: "#relevance" },
    { label: "The Characters", href: "#characters" },
    { label: "Digital Age", href: "#digital" },
    { label: "Timeline", href: "#timeline" },
    { label: "Lessons", href: "#lessons" },
  ];
  const go = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(8,15,28,0.97)" : "transparent",
        borderBottom: scrolled ? `1px solid rgba(212,175,55,0.2)` : "none",
        backdropFilter: scrolled ? "blur(20px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
        <a
          href="#"
          className="font-bold text-sm uppercase"
          style={{ fontFamily: "'Montserrat',sans-serif", color: gold, letterSpacing: "0.22em" }}
        >
          RIZAL REIMAGINED
        </a>
        <ul className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => go(l.href)}
                className="text-xs font-medium uppercase transition-all duration-200 hover:opacity-100"
                style={{ fontFamily: "'Montserrat',sans-serif", color: "#64748B", letterSpacing: "0.12em" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = gold)}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#64748B")}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
        <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {[0, 1, 2].map((i) => <span key={i} className="block h-px w-6" style={{ background: gold }} />)}
        </button>
      </div>
      {menuOpen && (
        <div className="lg:hidden px-6 pb-6 flex flex-col gap-5" style={{ background: "rgba(8,15,28,0.98)" }}>
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => go(l.href)}
              className="text-left text-xs font-medium uppercase"
              style={{ fontFamily: "'Montserrat',sans-serif", color: "#94A3B8", letterSpacing: "0.12em" }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const stats = [
    { num: 22, suffix: "", label: "languages spoken" },
    { num: 2, suffix: "", label: "landmark novels" },
    { num: 35, suffix: "", label: "age at execution" },
    { num: 130, suffix: "+", label: "years of influence" },
  ];
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: navyDeep }}
    >
      {/* Line texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(212,175,55,1) 28px,rgba(212,175,55,1) 29px)`,
        }}
      />
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at 70% 30%, rgba(212,175,55,0.07) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full pt-28 pb-20 lg:pt-0 lg:pb-0">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center min-h-screen">

          {/* Left */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <span className="h-px w-12" style={{ background: gold }} />
              <span
                className="text-xs font-semibold uppercase"
                style={{ fontFamily: "'Montserrat',sans-serif", color: gold, letterSpacing: "0.3em" }}
              >
                Philippine National Hero
              </span>
            </div>
            <h1
              className="text-5xl lg:text-[4.2rem] font-bold leading-[1.06] text-white"
              style={{ fontFamily: "'Playfair Display',serif" }}
            >
              José Rizal:
              <br />
              <em className="not-italic" style={{ color: gold }}>The Hero</em>
              <br />
              Who Still
              <br />
              Inspires Change
            </h1>
            <p
              className="text-base leading-relaxed max-w-md"
              style={{ fontFamily: "'Montserrat',sans-serif", color: "#94A3B8" }}
            >
              Physician. Novelist. Sculptor. Linguist. Reformer. Discover why
              a man executed at 35 remains the most urgent voice for the
              21st&nbsp;century.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                className="inline-flex items-center gap-3 px-8 py-4 font-semibold text-sm uppercase transition-all duration-300"
                style={{ fontFamily: "'Montserrat',sans-serif", background: gold, color: navy, letterSpacing: "0.1em" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.background = "#c4a030";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.background = gold;
                }}
                onClick={() => document.querySelector("#meet")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore His Legacy <ChevronRight size={15} />
              </button>
              <button
                className="text-sm font-medium transition-opacity hover:opacity-80"
                style={{ fontFamily: "'Montserrat',sans-serif", color: "#94A3B8" }}
                onClick={() => document.querySelector("#timeline")?.scrollIntoView({ behavior: "smooth" })}
              >
                View Timeline →
              </button>
            </div>

            {/* Stat counters */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6"
              style={{ borderTop: `1px solid rgba(212,175,55,0.15)` }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <p
                    className="text-3xl font-bold"
                    style={{ fontFamily: "'Playfair Display',serif", color: gold }}
                  >
                    <Counter to={s.num} suffix={s.suffix} />
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ fontFamily: "'Montserrat',sans-serif", color: "#64748B" }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — photo collage */}
          <div className="relative flex flex-col gap-4">
            {/* Corner frame accents */}
            {["top-0 left-0","top-0 right-0","bottom-0 left-0","bottom-0 right-0"].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-8 h-8 z-10 pointer-events-none`} style={{
                borderTop: i < 2 ? `2px solid ${gold}` : "none",
                borderBottom: i >= 2 ? `2px solid ${gold}` : "none",
                borderLeft: i % 2 === 0 ? `2px solid ${gold}` : "none",
                borderRight: i % 2 !== 0 ? `2px solid ${gold}` : "none",
              }} />
            ))}

            {/* Main portrait — large */}
            <div className="relative group cursor-pointer" onClick={() => setLightbox({ src: PHOTOS.hero1, alt: "Historical portrait of José Rizal era" })}>
              <div className="overflow-hidden" style={{ background: navyCard }}>
                <img
                  src={PHOTOS.hero1}
                  alt="Historical period portrait — José Rizal era, black and white formal suit"
                  className="w-full h-72 lg:h-96 object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "sepia(20%) contrast(1.05)" }}
                />
              </div>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ background: "rgba(212,175,55,0.15)" }}
              >
                <ZoomIn size={28} style={{ color: gold }} />
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 p-5"
                style={{ background: "linear-gradient(0deg,rgba(8,15,28,0.95) 0%,transparent 100%)" }}
              >
                <p className="text-xs uppercase tracking-widest mb-0.5" style={{ fontFamily: "'Montserrat',sans-serif", color: gold }}>1861 – 1896</p>
                <p className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display',serif" }}>José Protacio Rizal</p>
              </div>
            </div>

            {/* Two smaller photos */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: PHOTOS.hero2, alt: "Sepia portrait — 19th century intellectual" },
                { src: PHOTOS.manuscript1, alt: "Old handwritten manuscript page" },
              ].map((p) => (
                <div
                  key={p.src}
                  className="relative group cursor-pointer overflow-hidden"
                  style={{ background: navyCard }}
                  onClick={() => setLightbox(p)}
                >
                  <img
                    src={p.src}
                    alt={p.alt}
                    className="w-full h-36 object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ filter: "sepia(15%) contrast(1.1)" }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    style={{ background: "rgba(212,175,55,0.12)" }}
                  >
                    <ZoomIn size={20} style={{ color: gold }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: `linear-gradient(0deg,${navy} 0%,transparent 100%)` }}
      />
      {lightbox && <Lightbox {...lightbox} onClose={() => setLightbox(null)} />}
    </section>
  );
}

// ─── Meet Rizal ───────────────────────────────────────────────────────────────
const FACETS = [
  { icon: Stethoscope, label: "Doctor", desc: "Completed ophthalmology in Madrid and Paris — then returned to heal the poor in Dapitan for free.", stat: "Eye surgeon", img: PHOTOS.colonial1, imgAlt: "Colonial-era architecture representing Rizal's Europe years" },
  { icon: PenLine, label: "Writer", desc: "Authored Noli Me Tángere & El Filibusterismo — novels that shook Spanish colonial rule to its core.", stat: "2 novels", img: PHOTOS.manuscript2, imgAlt: "Open book representing Rizal's literary works" },
  { icon: Globe, label: "Traveler", desc: "Lived in Spain, Germany, France, and Hong Kong — carrying reformist ideas across four continents.", stat: "4 continents", img: PHOTOS.philippines3, imgAlt: "Philippine landscape river and countryside" },
  { icon: Languages, label: "Linguist", desc: "Mastered over 22 languages including Tagalog, Spanish, German, French, Arabic, and Malay.", stat: "22 languages", img: PHOTOS.manuscript3, imgAlt: "Old books and manuscripts" },
  { icon: Palette, label: "Artist", desc: "A sculptor, sketcher, and poet whose works revealed a poet's soul beneath the revolutionary mind.", stat: "Sculptor & poet", img: PHOTOS.hero3, imgAlt: "Period portrait representing artistic sensibility" },
];

function MeetRizal() {
  const [active, setActive] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const { ref, inView } = useInView();

  return (
    <section id="meet" className="py-24 lg:py-32" style={{ background: navyDeep }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={ref} className="flex items-center gap-4 mb-6">
          <span className="h-px w-10" style={{ background: gold }} />
          <span className="text-xs font-semibold uppercase" style={{ fontFamily: "'Montserrat',sans-serif", color: gold, letterSpacing: "0.3em" }}>01 — Introduction</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>Meet Rizal</h2>
        <p className="text-sm mb-12 max-w-lg" style={{ fontFamily: "'Montserrat',sans-serif", color: "#64748B" }}>
          Click any facet to see his world through images.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FACETS.map((f, i) => {
            const isOpen = active === i;
            return (
              <div
                key={f.label}
                className="flex flex-col cursor-pointer transition-all duration-300"
                style={{
                  background: isOpen ? "rgba(212,175,55,0.07)" : navyCard,
                  border: `1px solid ${isOpen ? gold : "rgba(212,175,55,0.13)"}`,
                  transform: isOpen ? "translateY(-6px)" : "none",
                }}
                onClick={() => setActive(isOpen ? null : i)}
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    height: isOpen ? 180 : 120,
                    transition: "height 0.4s cubic-bezier(0.4,0,0.2,1)",
                    background: navyCard,
                  }}
                >
                  <img
                    src={f.img}
                    alt={f.imgAlt}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{
                      filter: "sepia(20%) contrast(1.05)",
                      transform: isOpen ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: isOpen ? "rgba(212,175,55,0.1)" : "rgba(8,15,28,0.4)" }}
                  />
                  <button
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(0,0,0,0.6)", border: `1px solid ${gold}` }}
                    onClick={(e) => { e.stopPropagation(); setLightbox({ src: f.img, alt: f.imgAlt }); }}
                  >
                    <ZoomIn size={12} style={{ color: gold }} />
                  </button>
                </div>

                <div className="p-5 flex flex-col gap-3 flex-1">
                  <span className="absolute top-3 right-3 text-xs font-mono" style={{ color: "rgba(212,175,55,0.25)" }}>0{i+1}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)", border: `1px solid rgba(212,175,55,0.25)` }}>
                      <f.icon size={16} style={{ color: gold }} />
                    </div>
                    <p className="font-bold text-white" style={{ fontFamily: "'Playfair Display',serif" }}>{f.label}</p>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: "'Montserrat',sans-serif", color: "#94A3B8" }}>{f.desc}</p>
                  <div className="mt-auto pt-3" style={{ borderTop: `1px solid rgba(212,175,55,0.1)` }}>
                    <span className="text-xs font-semibold" style={{ fontFamily: "'Montserrat',sans-serif", color: gold }}>{f.stat}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wide photo strip */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { src: PHOTOS.philippines1, alt: "Philippine rice paddy with water buffalo — the land Rizal loved" },
            { src: PHOTOS.colonial2, alt: "Colonial-era dome architecture — the Spain Rizal studied in" },
            { src: PHOTOS.civil, alt: "Historical civil rights march — the reform movements Rizal inspired" },
          ].map((p) => (
            <div
              key={p.src}
              className="relative group cursor-pointer overflow-hidden"
              style={{ background: navyCard }}
              onClick={() => setLightbox(p)}
            >
              <img
                src={p.src}
                alt={p.alt}
                className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "sepia(10%) contrast(1.05)" }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"
                style={{ background: "linear-gradient(0deg,rgba(8,15,28,0.85) 0%,transparent 60%)" }}
              >
                <p className="text-xs text-white" style={{ fontFamily: "'Montserrat',sans-serif" }}>{p.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {lightbox && <Lightbox {...lightbox} onClose={() => setLightbox(null)} />}
    </section>
  );
}

// ─── Why Rizal Matters Today ──────────────────────────────────────────────────
const THEN = ["Colonial oppression", "Abuse of power", "Lack of freedom", "Inequality"];
const NOW  = ["Corruption", "Disinformation", "Poverty", "Social injustice"];

function RelevanceToday() {
  const [revealed, setRevealed] = useState(false);
  const { ref, inView } = useInView();

  return (
    <section id="relevance" className="py-24 lg:py-32" style={{ background: navy }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-6">
          <span className="h-px w-10" style={{ background: gold }} />
          <span className="text-xs font-semibold uppercase" style={{ fontFamily: "'Montserrat',sans-serif", color: gold, letterSpacing: "0.3em" }}>02 — Contemporary Parallels</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-16" style={{ fontFamily: "'Playfair Display',serif" }}>Why Rizal Matters Today</h2>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Then */}
          <div className="p-8 lg:p-10" style={{ background: navyCard, border: `1px solid rgba(212,175,55,0.15)` }}>
            <div className="flex items-center gap-3 mb-8">
              <Clock size={18} style={{ color: gold }} />
              <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display',serif" }}>Then</h3>
              <span className="text-xs font-mono ml-auto" style={{ color: "rgba(212,175,55,0.4)" }}>1861–1896</span>
            </div>
            {/* image */}
            <div className="relative mb-6 overflow-hidden" style={{ background: navyDeep }}>
              <img src={PHOTOS.manuscript2} alt="Old book representing Rizal's era" className="w-full h-32 object-cover opacity-60" style={{ filter: "sepia(30%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgba(30,41,59,0.8) 0%,transparent 60%)" }} />
            </div>
            <ul className="flex flex-col gap-3">
              {THEN.map((item, i) => (
                <li
                  key={item}
                  className="flex items-center gap-3 transition-all duration-300"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateX(0)" : "translateX(-16px)",
                    transitionDelay: `${i * 100}ms`,
                  }}
                  ref={i === 0 ? ref : undefined}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: gold }} />
                  <span className="text-sm font-medium" style={{ fontFamily: "'Montserrat',sans-serif", color: "#CBD5E1" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Now */}
          <div className="p-8 lg:p-10" style={{ background: navyCard, border: `1px solid rgba(212,175,55,0.4)` }}>
            <div className="flex items-center gap-3 mb-8">
              <Flame size={18} style={{ color: gold }} />
              <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display',serif" }}>Now</h3>
              <span className="text-xs font-mono ml-auto" style={{ color: "rgba(212,175,55,0.4)" }}>21st Century</span>
            </div>
            <div className="relative mb-6 overflow-hidden" style={{ background: navyDeep }}>
              <img src={PHOTOS.civil} alt="Civil rights march — modern relevance" className="w-full h-32 object-cover opacity-60" style={{ filter: "grayscale(20%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgba(30,41,59,0.8) 0%,transparent 60%)" }} />
            </div>
            <ul className="flex flex-col gap-3">
              {NOW.map((item, i) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: gold }} />
                  <span className="text-sm font-medium" style={{ fontFamily: "'Montserrat',sans-serif", color: "#CBD5E1" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Callout */}
        <div
          className="relative p-8 lg:p-12 cursor-pointer transition-all duration-300"
          style={{
            background: revealed
              ? "rgba(212,175,55,0.08)"
              : "rgba(212,175,55,0.04)",
            border: `1px solid ${revealed ? gold : "rgba(212,175,55,0.25)"}`,
          }}
          onClick={() => setRevealed(!revealed)}
        >
          <div className="absolute top-0 left-0 w-1 h-full" style={{ background: gold }} />
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <p
              className="text-xl lg:text-2xl font-semibold text-white leading-relaxed flex-1"
              style={{ fontFamily: "'Playfair Display',serif" }}
            >
              "Although society has changed, many of the issues Rizal criticized continue to challenge the Philippines today."
            </p>
            <ChevronDown
              size={20}
              style={{ color: gold, transform: revealed ? "rotate(180deg)" : "none", transition: "transform 0.3s", flexShrink: 0 }}
            />
          </div>
          {revealed && (
            <div className="mt-6 pt-6" style={{ borderTop: `1px solid rgba(212,175,55,0.2)` }}>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "'Montserrat',sans-serif", color: "#94A3B8" }}>
                Rizal wrote in 1887 that the Philippines was "a social cancer" — a metaphor for corruption, inequality, and the abuse of clerical power.
                In 2025, surveys show that corruption remains the #1 concern of Filipino youth. His diagnosis is 130 years old and still accurate.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Characters ───────────────────────────────────────────────────────────────
const CHARACTERS = [
  {
    name: "Kapitan Tiago",
    role: "The Opportunist",
    desc: "Values wealth and influence over the common good.",
    icon: Star,
    modern: "The elite who prioritize status over service.",
    color: "#7C3AED",
    img: PHOTOS.kapitanTiago,
  },
  {
    name: "Basilio",
    role: "The Scholar",
    desc: "Believes education can transform society.",
    icon: GraduationCap,
    modern: "Every student who studies to uplift their community.",
    color: "#D4AF37",
    img: PHOTOS.basilio,
  },
  {
    name: "Sisa",
    role: "The Marginalized",
    desc: "Marginalized families suffering from poverty.",
    icon: Heart,
    modern: "Millions living below the poverty line today.",
    color: "#DB2777",
    img: PHOTOS.sisa,
  },
  {
    name: "Kabesang Tales",
    role: "The Fighter",
    desc: "Ordinary citizens fighting for their rights.",
    icon: Scale,
    modern: "Advocates and activists demanding accountability.",
    color: "#0891B2",
    img: PHOTOS.kabesangTales,
  },
  {
    name: "Padre Damaso",
    role: "The Abuser",
    desc: "Individuals misusing authority and power.",
    icon: Flame,
    modern: "Officials who exploit position for personal gain.",
    color: "#EA580C",
    img: PHOTOS.padreDamaso,
  },
];

function Characters() {
  const [active, setActive] = useState(0);
  const c = CHARACTERS[active];

  return (
    <section id="characters" className="py-24 lg:py-32" style={{ background: navyDeep }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-6">
          <span className="h-px w-10" style={{ background: gold }} />
          <span className="text-xs font-semibold uppercase" style={{ fontFamily: "'Montserrat',sans-serif", color: gold, letterSpacing: "0.3em" }}>03 — Literary Archetypes</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-12" style={{ fontFamily: "'Playfair Display',serif" }}>The Characters Live On</h2>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CHARACTERS.map((ch, i) => (
            <button
              key={ch.name}
              onClick={() => setActive(i)}
              className="px-4 py-2 text-xs font-semibold uppercase transition-all duration-200"
              style={{
                fontFamily: "'Montserrat',sans-serif",
                background: active === i ? gold : "transparent",
                color: active === i ? navy : "#94A3B8",
                border: `1px solid ${active === i ? gold : "rgba(212,175,55,0.2)"}`,
                letterSpacing: "0.1em",
              }}
            >
              {ch.name}
            </button>
          ))}
        </div>

        {/* Active character spotlight */}
        <div
          className="grid lg:grid-cols-2 gap-0 mb-6 overflow-hidden transition-all duration-500"
          style={{ border: `1px solid rgba(212,175,55,0.3)` }}
        >
          {/* Image side */}
          <div className="relative overflow-hidden" style={{ minHeight: 320, background: navyCard }}>
            <img
              key={c.img}
              src={c.img}
              alt={`${c.name} — ${c.role}`}
              className="w-full h-full object-cover transition-all duration-700"
              style={{ filter: "sepia(15%) contrast(1.05)", minHeight: 320 }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,transparent 40%,rgba(8,15,28,0.8) 100%)" }} />
            <div
              className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center"
              style={{ background: `${c.color}22`, border: `2px solid ${c.color}` }}
            >
              <c.icon size={22} style={{ color: c.color }} />
            </div>
          </div>
          {/* Text side */}
          <div className="p-8 lg:p-12 flex flex-col justify-center gap-5" style={{ background: "rgba(212,175,55,0.04)" }}>
            <div>
              <span
                className="text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 inline-block"
                style={{ fontFamily: "'Montserrat',sans-serif", background: `${c.color}22`, color: c.color, letterSpacing: "0.15em" }}
              >
                {c.role}
              </span>
              <h3 className="text-3xl font-bold text-white mt-3" style={{ fontFamily: "'Playfair Display',serif" }}>{c.name}</h3>
            </div>
            <p className="text-base leading-relaxed" style={{ fontFamily: "'Montserrat',sans-serif", color: "#CBD5E1" }}>{c.desc}</p>
            <div className="pt-5" style={{ borderTop: `1px solid rgba(212,175,55,0.2)` }}>
              <p className="text-xs uppercase mb-2" style={{ fontFamily: "'Montserrat',sans-serif", color: gold, letterSpacing: "0.15em" }}>In Today's World</p>
              <p className="text-sm italic" style={{ fontFamily: "'Playfair Display',serif", color: "#94A3B8" }}>{c.modern}</p>
            </div>
          </div>
        </div>

        {/* Thumbnail grid */}
        <div className="grid grid-cols-5 gap-2">
          {CHARACTERS.map((ch, i) => (
            <div
              key={ch.name}
              className="relative cursor-pointer overflow-hidden group"
              style={{
                border: `2px solid ${active === i ? ch.color : "transparent"}`,
                transition: "border-color 0.2s",
              }}
              onClick={() => setActive(i)}
            >
              <img
                src={ch.img}
                alt={ch.name}
                className="w-full h-16 object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ filter: "sepia(20%) contrast(1.05)" }}
              />
              <div
                className="absolute inset-0 flex items-end p-1"
                style={{ background: "linear-gradient(0deg,rgba(8,15,28,0.85) 0%,transparent 60%)" }}
              >
                <span className="text-[10px] font-bold text-white" style={{ fontFamily: "'Montserrat',sans-serif" }}>{ch.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Digital Age ──────────────────────────────────────────────────────────────
const POSTS = [
  { text: "Ignorance remains the greatest obstacle to freedom. Educate yourself — and then educate your neighbor.", likes: "12.4K", comments: "2.3K", reposts: "8.1K", time: "1h" },
  { text: "Education empowers a nation. Every school built is a bastion against tyranny. Every mind awakened is a torch against the dark.", likes: "34.7K", comments: "5.6K", reposts: "21.3K", time: "3h" },
  { text: "Patriotism begins with responsible citizenship — not blind loyalty, but active and discerning love for one's people.", likes: "9.2K", comments: "1.8K", reposts: "6.4K", time: "6h" },
];

function DigitalAge() {
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  return (
    <section id="digital" className="py-24 lg:py-32" style={{ background: navy }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-6">
          <span className="h-px w-10" style={{ background: gold }} />
          <span className="text-xs font-semibold uppercase" style={{ fontFamily: "'Montserrat',sans-serif", color: gold, letterSpacing: "0.3em" }}>04 — Thought Experiment</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>Rizal in the Digital Age</h2>
        <p className="text-sm mb-12 max-w-lg" style={{ fontFamily: "'Montserrat',sans-serif", color: "#64748B" }}>
          If Rizal had a feed, his reformist ideas would still go viral. Click the heart to like his posts.
        </p>

        <div className="grid lg:grid-cols-3 gap-6">
          {POSTS.map((p, i) => (
            <div
              key={i}
              className="p-6 flex flex-col gap-5 transition-all duration-300"
              style={{ background: navyCard, border: `1px solid rgba(212,175,55,0.15)` }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.4)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.15)")}
            >
              {/* Profile */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-sm font-bold"
                  style={{ background: gold, color: navy, fontFamily: "'Playfair Display',serif" }}
                >
                  JR
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white" style={{ fontFamily: "'Montserrat',sans-serif" }}>José Rizal</span>
                    <svg width="13" height="13" viewBox="0 0 20 20" fill={gold}><path d="M10 0L12.39 7.26L20 7.64L14.18 12.37L16.18 20L10 15.87L3.82 20L5.82 12.37L0 7.64L7.61 7.26L10 0Z" /></svg>
                  </div>
                  <p className="text-xs" style={{ fontFamily: "'Montserrat',sans-serif", color: "#64748B" }}>@JoseRizal · {p.time} ago</p>
                </div>
              </div>
              {/* Text */}
              <p className="text-base leading-relaxed text-white flex-1 italic" style={{ fontFamily: "'Playfair Display',serif" }}>
                "{p.text}"
              </p>
              {/* Metrics */}
              <div className="flex items-center gap-5 pt-4" style={{ borderTop: `1px solid rgba(212,175,55,0.1)` }}>
                <button
                  className="flex items-center gap-1.5 transition-all duration-200"
                  onClick={() => setLiked((prev) => ({ ...prev, [i]: !prev[i] }))}
                >
                  <Heart
                    size={14}
                    style={{ color: liked[i] ? "#F43F5E" : "#94A3B8", fill: liked[i] ? "#F43F5E" : "none", transition: "all 0.2s" }}
                  />
                  <span className="text-xs font-medium" style={{ fontFamily: "'Montserrat',sans-serif", color: liked[i] ? "#F43F5E" : "#94A3B8" }}>
                    {liked[i] ? parseInt(p.likes.replace("K","")) * 1000 + 1 + (p.likes.includes("K") ? "" : "") : p.likes} Likes
                  </span>
                </button>
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={14} style={{ color: "#94A3B8" }} />
                  <span className="text-xs font-medium" style={{ fontFamily: "'Montserrat',sans-serif", color: "#94A3B8" }}>{p.comments} Comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Myth vs Fact ─────────────────────────────────────────────────────────────
const MYTHS = [
  {
    myth: "Rizal only wrote novels.",
    fact: "He was also a doctor, scientist, sculptor, linguist, and social reformer — one of the most polymathic minds of the 19th century.",
    img: PHOTOS.manuscript3,
  },
  {
    myth: "Rizal avoided politics.",
    fact: "His writings directly challenged colonial injustice and inspired the Propaganda Movement, laying the intellectual groundwork for Philippine reform.",
    img: PHOTOS.colonial1,
  },
  {
    myth: "Rizal was a passive, timid figure.",
    fact: "He founded La Liga Filipina, organized mass civic engagement, and willingly accepted martyrdom to ignite the spirit of reform.",
    img: PHOTOS.civil,
  },
];

function MythVsFact() {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <section id="myth" className="py-24 lg:py-32" style={{ background: navyDeep }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-6">
          <span className="h-px w-10" style={{ background: gold }} />
          <span className="text-xs font-semibold uppercase" style={{ fontFamily: "'Montserrat',sans-serif", color: gold, letterSpacing: "0.3em" }}>05 — Common Misconceptions</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>Myth vs Fact</h2>
        <p className="text-sm mb-12 max-w-lg" style={{ fontFamily: "'Montserrat',sans-serif", color: "#64748B" }}>
          Click each row to reveal the truth behind the myth.
        </p>

        <div className="flex flex-col gap-4">
          {MYTHS.map((m, i) => {
            const open = revealed[i];
            return (
              <div
                key={i}
                className="cursor-pointer transition-all duration-300 overflow-hidden"
                style={{ border: `1px solid ${open ? gold : "rgba(212,175,55,0.15)"}` }}
                onClick={() => setRevealed((prev) => ({ ...prev, [i]: !prev[i] }))}
              >
                {/* Myth row */}
                <div
                  className="grid lg:grid-cols-2 items-center"
                  style={{ background: open ? "rgba(212,175,55,0.04)" : "rgba(255,255,255,0.02)" }}
                >
                  <div className="p-7 flex items-start gap-4">
                    <span
                      className="text-xs font-bold uppercase px-2 py-1 flex-shrink-0 mt-1"
                      style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(239,68,68,0.15)", color: "#F87171", letterSpacing: "0.12em" }}
                    >
                      Myth
                    </span>
                    <p className="text-base lg:text-lg font-semibold text-white italic" style={{ fontFamily: "'Playfair Display',serif" }}>
                      "{m.myth}"
                    </p>
                  </div>
                  <div className="hidden lg:flex items-center justify-end p-7">
                    <ChevronDown
                      size={18}
                      style={{ color: gold, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}
                    />
                  </div>
                </div>

                {/* Fact reveal */}
                {open && (
                  <div
                    className="grid lg:grid-cols-2 gap-0"
                    style={{ borderTop: `1px solid rgba(212,175,55,0.2)`, background: "rgba(212,175,55,0.05)" }}
                  >
                    <div className="p-7 flex items-start gap-4">
                      <span
                        className="text-xs font-bold uppercase px-2 py-1 flex-shrink-0 mt-1"
                        style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(212,175,55,0.15)", color: gold, letterSpacing: "0.12em" }}
                      >
                        Fact
                      </span>
                      <p className="text-sm leading-relaxed" style={{ fontFamily: "'Montserrat',sans-serif", color: "#CBD5E1" }}>{m.fact}</p>
                    </div>
                    <div
                      className="relative overflow-hidden cursor-pointer"
                      style={{ minHeight: 120, background: navyCard }}
                      onClick={(e) => { e.stopPropagation(); setLightbox({ src: m.img, alt: m.fact }); }}
                    >
                      <img
                        src={m.img}
                        alt={m.fact}
                        className="w-full h-full object-cover opacity-70 transition-transform duration-500 hover:scale-105"
                        style={{ filter: "sepia(15%)" }}
                      />
                      <div className="absolute top-3 right-3">
                        <ZoomIn size={16} style={{ color: gold }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {lightbox && <Lightbox {...lightbox} onClose={() => setLightbox(null)} />}
    </section>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
const TIMELINE = [
  { year: "1861", label: "Birth", desc: "Born June 19 in Calamba, Laguna to a prosperous mestizo family", icon: Star, img: PHOTOS.philippines2 },
  { year: "Ateneo", label: "Education", desc: "Excelled at Ateneo Municipal de Manila, graduating with highest honors", icon: GraduationCap, img: PHOTOS.manuscript2 },
  { year: "Europe", label: "Reform", desc: "Studied in Madrid, Paris, Berlin; joined the Propaganda Movement", icon: Globe, img: PHOTOS.colonial2 },
  { year: "1887", label: "Noli Me Tángere", desc: "Published in Berlin — exposed colonial abuses and the friars' corruption", icon: BookOpen, img: PHOTOS.manuscript1 },
  { year: "1891", label: "El Filibusterismo", desc: "Darker, more radical sequel — a call for national awakening", icon: PenLine, img: PHOTOS.manuscript3 },
  { year: "Exile", label: "Dapitan", desc: "Exiled to Dapitan; continued healing the sick and educating children", icon: Lightbulb, img: PHOTOS.philippines3 },
  { year: "1896", label: "Martyrdom", desc: "Executed December 30 at Bagumbayan — sparking the Philippine Revolution", icon: Flame, img: PHOTOS.civil },
];

function Timeline() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="timeline" className="py-24 lg:py-32" style={{ background: navy }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-6">
          <span className="h-px w-10" style={{ background: gold }} />
          <span className="text-xs font-semibold uppercase" style={{ fontFamily: "'Montserrat',sans-serif", color: gold, letterSpacing: "0.3em" }}>06 — Chronology</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>Timeline</h2>
        <p className="text-sm mb-14 max-w-lg" style={{ fontFamily: "'Montserrat',sans-serif", color: "#64748B" }}>
          Click any milestone to explore it in detail.
        </p>

        {/* Desktop horizontal */}
        <div className="hidden lg:block relative">
          <div className="absolute top-16 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${gold},transparent)` }} />
          <div className="grid grid-cols-7 gap-2">
            {TIMELINE.map((n, i) => {
              const isOpen = active === i;
              return (
                <div key={n.year} className="flex flex-col items-center gap-3 relative">
                  {/* Node */}
                  <div className="relative z-10 mt-8 cursor-pointer" onClick={() => setActive(isOpen ? null : i)}>
                    <div
                      className="w-8 h-8 flex items-center justify-center transition-all duration-300"
                      style={{
                        background: isOpen ? gold : navyDeep,
                        border: `2px solid ${gold}`,
                        transform: isOpen ? "scale(1.2)" : "scale(1)",
                      }}
                    >
                      <n.icon size={14} style={{ color: isOpen ? navy : gold }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-center" style={{ fontFamily: "'Montserrat',sans-serif", color: gold, letterSpacing: "0.1em" }}>{n.year}</span>

                  {/* Card */}
                  <div
                    className="w-full text-center cursor-pointer transition-all duration-300"
                    style={{
                      background: isOpen ? "rgba(212,175,55,0.08)" : navyCard,
                      border: `1px solid ${isOpen ? gold : "rgba(212,175,55,0.12)"}`,
                      transform: isOpen ? "translateY(-4px)" : "none",
                    }}
                    onClick={() => setActive(isOpen ? null : i)}
                  >
                    {isOpen && (
                      <div className="overflow-hidden" style={{ height: 80 }}>
                        <img src={n.img} alt={n.label} className="w-full h-full object-cover opacity-70" style={{ filter: "sepia(20%)" }} />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-xs font-bold text-white mb-1" style={{ fontFamily: "'Montserrat',sans-serif" }}>{n.label}</p>
                      <p className="text-[10px] leading-relaxed" style={{ fontFamily: "'Montserrat',sans-serif", color: "#64748B" }}>{n.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile vertical */}
        <div className="lg:hidden flex flex-col relative">
          <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: `linear-gradient(180deg,${gold},transparent)` }} />
          {TIMELINE.map((n, i) => {
            const isOpen = active === i;
            return (
              <div key={n.year} className="flex gap-5 pb-6 pl-2">
                <div
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center relative z-10 cursor-pointer transition-all duration-300"
                  style={{ background: isOpen ? gold : navyDeep, border: `2px solid ${gold}` }}
                  onClick={() => setActive(isOpen ? null : i)}
                >
                  <n.icon size={14} style={{ color: isOpen ? navy : gold }} />
                </div>
                <div
                  className="flex-1 overflow-hidden cursor-pointer transition-all duration-300"
                  style={{ background: isOpen ? "rgba(212,175,55,0.07)" : navyCard, border: `1px solid ${isOpen ? gold : "rgba(212,175,55,0.12)"}` }}
                  onClick={() => setActive(isOpen ? null : i)}
                >
                  {isOpen && (
                    <img src={n.img} alt={n.label} className="w-full h-28 object-cover opacity-70" style={{ filter: "sepia(20%)" }} />
                  )}
                  <div className="p-4">
                    <span className="text-xs font-bold" style={{ fontFamily: "'Montserrat',sans-serif", color: gold }}>{n.year}</span>
                    <p className="text-sm font-bold text-white mt-0.5 mb-1" style={{ fontFamily: "'Montserrat',sans-serif" }}>{n.label}</p>
                    <p className="text-xs" style={{ fontFamily: "'Montserrat',sans-serif", color: "#94A3B8" }}>{n.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Lessons — flip cards ────────────────────────────────────────────────────
const LESSONS = [
  { num: "01", title: "Never stop learning", desc: "Rizal pursued knowledge across medicine, law, science, and the arts — curiosity was his compass.", icon: BookOpen, back: "Challenge yourself daily. Read broadly. Ask questions others won't. Your education does not end with graduation." },
  { num: "02", title: "Serve others", desc: "He treated the poor for free in Dapitan, proving that expertise is best used in service.", icon: Users, back: "Use your skills to uplift those around you. The measure of a person is not what they earn, but what they give." },
  { num: "03", title: "Think critically", desc: "He questioned colonial narratives and challenged the status quo through evidence and argument.", icon: Lightbulb, back: "Resist disinformation. Verify before sharing. Demand accountability from those in power. Democracy requires critical minds." },
  { num: "04", title: "Love your country", desc: "Patriotism for Rizal was not nostalgia but action — reforming and improving the nation you call home.", icon: Flag, back: "Real love for your country means calling it to be better — not excusing its failures, but working to fix them." },
  { num: "05", title: "Be the change", desc: "He did not wait for others to speak. He wrote, organized, healed, and ultimately sacrificed.", icon: Sparkles, back: "You are not too young, too poor, or too small. You have a pen, a voice, and a conscience. Use them." },
];

function FlipCard({ l }: { l: typeof LESSONS[0] }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="cursor-pointer"
      style={{ perspective: "1000px", height: 260 }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-600"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 p-6 flex flex-col gap-4"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: navyCard,
            border: `1px solid rgba(212,175,55,0.15)`,
          }}
        >
          <span className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display',serif", color: "rgba(212,175,55,0.15)" }}>{l.num}</span>
          <div className="w-10 h-10 flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)", border: `1px solid rgba(212,175,55,0.25)` }}>
            <l.icon size={18} style={{ color: gold }} />
          </div>
          <div>
            <p className="font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>{l.title}</p>
            <p className="text-xs leading-relaxed" style={{ fontFamily: "'Montserrat',sans-serif", color: "#94A3B8" }}>{l.desc}</p>
          </div>
          <div className="mt-auto flex items-center gap-1" style={{ color: "rgba(212,175,55,0.5)" }}>
            <RotateCcw size={11} />
            <span className="text-[10px]" style={{ fontFamily: "'Montserrat',sans-serif" }}>click to flip</span>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 p-6 flex flex-col justify-center gap-4"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(135deg,rgba(212,175,55,0.12),rgba(212,175,55,0.04))`,
            border: `1px solid ${gold}`,
          }}
        >
          <l.icon size={24} style={{ color: gold }} />
          <p className="text-sm leading-relaxed text-white italic" style={{ fontFamily: "'Playfair Display',serif" }}>
            "{l.back}"
          </p>
          <span className="text-xs font-bold uppercase" style={{ fontFamily: "'Montserrat',sans-serif", color: gold, letterSpacing: "0.15em" }}>— Apply This Today</span>
        </div>
      </div>
    </div>
  );
}

function Lessons() {
  return (
    <section id="lessons" className="py-24 lg:py-32" style={{ background: navyDeep }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-6">
          <span className="h-px w-10" style={{ background: gold }} />
          <span className="text-xs font-semibold uppercase" style={{ fontFamily: "'Montserrat',sans-serif", color: gold, letterSpacing: "0.3em" }}>07 — For Students</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>Five Lessons Every<br />College Student Can Learn</h2>
        <p className="text-sm mb-12 max-w-lg" style={{ fontFamily: "'Montserrat',sans-serif", color: "#64748B" }}>
          Click each card to flip it and read your challenge.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {LESSONS.map((l) => <FlipCard key={l.num} l={l} />)}
        </div>

        {/* Photo beneath */}
        <div className="mt-10 relative overflow-hidden" style={{ border: `1px solid rgba(212,175,55,0.15)` }}>
          <img
            src={PHOTOS.philippines2}
            alt="Aerial view of Philippine rice terraces — the land Rizal dreamed of freeing"
            className="w-full h-48 lg:h-64 object-cover"
            style={{ filter: "sepia(15%) contrast(1.05)" }}
          />
          <div className="absolute inset-0 flex items-end p-8" style={{ background: "linear-gradient(0deg,rgba(8,15,28,0.85) 0%,transparent 60%)" }}>
            <p className="text-white font-semibold text-lg max-w-xl" style={{ fontFamily: "'Playfair Display',serif" }}>
              "Rizal's Philippines — the land he gave his life for."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CallToAction() {
  return (
    <section
      className="relative py-32 lg:py-48 overflow-hidden"
      style={{ background: navyDeep }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={PHOTOS.philippines3}
          alt="Philippine countryside — the nation Rizal envisioned"
          className="w-full h-full object-cover opacity-10"
          style={{ filter: "sepia(30%)" }}
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%,rgba(212,175,55,0.07) 0%,transparent 70%)" }} />
      </div>

      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${gold},transparent)` }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${gold},transparent)` }} />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center flex flex-col items-center gap-8">
        <div className="flex items-center gap-4">
          <span className="h-px w-16" style={{ background: "rgba(212,175,55,0.4)" }} />
          <span className="w-2 h-2 rotate-45" style={{ background: gold }} />
          <span className="h-px w-16" style={{ background: "rgba(212,175,55,0.4)" }} />
        </div>

        <blockquote className="text-4xl lg:text-6xl font-bold leading-tight text-white" style={{ fontFamily: "'Playfair Display',serif" }}>
          <span style={{ color: gold }}>"</span>
          The youth is the hope of the nation.
          <span style={{ color: gold }}>"</span>
        </blockquote>

        <p className="text-sm uppercase tracking-widest" style={{ fontFamily: "'Montserrat',sans-serif", color: gold, letterSpacing: "0.25em" }}>— José Rizal</p>

        <h3 className="text-2xl lg:text-3xl font-bold text-white mt-4" style={{ fontFamily: "'Playfair Display',serif" }}>What Will Your Legacy Be?</h3>

        <p className="text-base leading-relaxed max-w-xl" style={{ fontFamily: "'Montserrat',sans-serif", color: "#94A3B8" }}>
          Rizal's legacy is not merely a chapter in a history book — it is a living challenge. Apply his ideals through integrity, education, and service.
          Study not for a grade, but to transform your nation. Speak not to impress, but to illuminate. Serve not for recognition, but because your community needs you.
        </p>

        <button
          className="mt-4 inline-flex items-center gap-3 px-10 py-4 font-semibold text-sm uppercase transition-all duration-300"
          style={{ fontFamily: "'Montserrat',sans-serif", background: gold, color: navy, letterSpacing: "0.1em" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#c4a030"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = gold; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to Top <ChevronRight size={15} />
        </button>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-10 px-6 lg:px-10" style={{ background: "#040A14", borderTop: `1px solid rgba(212,175,55,0.15)` }}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Montserrat',sans-serif", color: gold, letterSpacing: "0.22em" }}>RIZAL REIMAGINED</p>
          <p className="text-xs mt-1" style={{ fontFamily: "'Montserrat',sans-serif", color: "#475569" }}>An educational tribute to the Philippine National Hero</p>
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Playfair Display',serif" }}>Irene Parale</p>
          <p className="text-xs mt-1" style={{ fontFamily: "'Montserrat',sans-serif", color: "#64748B" }}>RZL110 CON11 &nbsp;•&nbsp; Mapua University</p>
        </div>

        <div className="flex items-center gap-6">
          {["About", "Sources", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs font-medium tracking-wider transition-colors duration-200"
              style={{ fontFamily: "'Montserrat',sans-serif", color: "#475569", textDecoration: "none" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = gold)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#475569")}
            >
              {link}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 flex justify-center" style={{ borderTop: `1px solid rgba(212,175,55,0.08)` }}>
        <p className="text-xs" style={{ fontFamily: "'Montserrat',sans-serif", color: "#1E293B" }}>
          In honor of Dr. José Protacio Rizal Mercado Alonzo y Realonda — June 19, 1861 – December 30, 1896
        </p>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen" style={{ background: navy }}>
      <style>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #040A14; }
        ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.35); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.65); }
        * { scrollbar-width: thin; scrollbar-color: rgba(212,175,55,0.35) #040A14; }
      `}</style>
      <Nav />
      <Hero />
      <MeetRizal />
      <RelevanceToday />
      <Characters />
      <DigitalAge />
      <MythVsFact />
      <Timeline />
      <Lessons />
      <CallToAction />
      <Footer />
    </div>
  );
}
