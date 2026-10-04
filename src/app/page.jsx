import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  const features = [
    { label: "Instant transfers", desc: "Move money between accounts or to anyone else in seconds, any time of day." },
    { label: "Bank-grade security", desc: "Encrypted sessions and admin-reviewed activity keep every account protected." },
    { label: "Always available", desc: "Your dashboard, transfers, and statements — live, around the clock." },
  ];

  const lifeStages = [
    { label: "Students", file: "life-1.jpg" },
    { label: "Freelancers", file: "life-2.jpg" },
    { label: "Families", file: "life-3.webp" },
    { label: "Business owners", file: "life-4.webp" },
  ];

  const highlightCards = [
    { title: "Mobile banking app", desc: "Check balances, move money, and manage cards from your phone wherever you are.", file: "feature-1.jpeg" },
    { title: "24/7 customer support", desc: "Real help from our team any time you need it, day or night.", file: "feature-2.jpeg" },
  ];

  return (
    <div className="min-h-screen bg-page overflow-x-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-[28rem] -right-32 w-[28rem] h-[28rem] rounded-full bg-navy/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Top nav */}
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Image src="/logo-blue.png" alt="Anadolu-Bank logo" width={32} height={32} />
          <span className="font-semibold text-navy">Anadolu-Bank</span>
        </div>
        <nav className="hidden md:flex items-center gap-1 bg-surface border border-border rounded-full px-2 py-2 shadow-sm">
          <a href="#features" className="px-4 py-1.5 text-sm text-text-secondary hover:text-navy rounded-full">Features</a>
          <a href="#why" className="px-4 py-1.5 text-sm text-text-secondary hover:text-navy rounded-full">Why us</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:inline text-sm font-medium text-navy">Sign in</Link>
          <Link href="/signup" className="rounded-full bg-navy text-white text-sm font-medium px-5 py-2.5 hover:bg-primary-dark transition">
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-6 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl font-bold text-navy leading-[1.1]">
            Banking built for <br /> modern Türkiye
          </h1>
          <p className="mt-5 text-text-secondary max-w-md">
            Anadolu-Bank brings secure, simple digital banking to everyone —
            manage accounts, send money, and track every lira in real time.
          </p>
          <Link
            href="/signup"
            className="inline-block mt-8 rounded-full bg-navy text-white font-medium px-7 py-3.5 hover:bg-primary-dark transition"
          >
            Open an account →
          </Link>
        </div>
        <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden">
          <Image
            src="/landing-hero.jpeg"
            alt="Customer using the Anadolu-Bank app"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Sub-nav strip */}
      <section className="max-w-6xl mx-auto px-6 flex items-center justify-between pb-6">
        <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
          <span className="text-navy font-medium">Accounts</span>
          <span>Cards</span>
          <span>Transfers</span>
          <span>Savings</span>
        </div>
        <Link
          href="/signup"
          className="rounded-full border border-navy text-navy text-sm font-medium px-5 py-2 hover:bg-primary-light transition"
        >
          Compare accounts
        </Link>
      </section>

      {/* Grow banner */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="relative rounded-[2.5rem] bg-navy text-white overflow-hidden px-10 py-14 md:py-20">
          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-white/5" />
          <div className="relative max-w-md">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Let&apos;s grow your savings together!
            </h2>
            <Link
              href="/signup"
              className="inline-block mt-6 rounded-full bg-white text-navy font-medium px-6 py-3 hover:bg-primary-light transition"
            >
              Start saving →
            </Link>
          </div>
          <div className="relative mt-10 w-full md:w-80 md:absolute md:right-10 md:top-1/2 md:-translate-y-1/2 aspect-[4/3] rounded-3xl overflow-hidden">
            <Image
              src="/landing-save.jpeg"
              alt="Customer saving with Anadolu-Bank"
              fill
              sizes="(min-width: 768px) 320px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Three-column features */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div key={f.label}>
            <div className="w-10 h-10 rounded-full bg-primary-light text-navy font-semibold flex items-center justify-center mb-4">
              ✓
            </div>
            <h3 className="font-semibold text-navy mb-2">{f.label}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Built for every stage of life */}
      <section id="why" className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-xl font-semibold text-navy mb-6">Built for every stage of life</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {lifeStages.map(({ label, file }) => (
            <div key={label} className="rounded-3xl overflow-hidden border border-border bg-surface">
              <div className="relative aspect-square">
                <Image
                  src={`/${file}`}
                  alt={label}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <p className="text-sm font-medium text-navy text-center py-3">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlight cards */}
      <section className="max-w-6xl mx-auto px-6 pb-20 flex flex-col gap-6">
        {highlightCards.map((item) => (
          <div
            key={item.title}
            className="flex flex-col md:flex-row gap-6 items-center rounded-3xl border border-border bg-surface p-6"
          >
            <div className="relative w-full md:w-48 aspect-video md:aspect-square shrink-0 rounded-2xl overflow-hidden">
              <Image
                src={`/${item.file}`}
                alt={item.title}
                fill
                sizes="(min-width: 768px) 192px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-navy text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
            <Link
              href="/signup"
              className="rounded-full bg-navy text-white text-sm font-medium px-5 py-2.5 hover:bg-primary-dark transition shrink-0"
            >
              Learn more
            </Link>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white/80 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo-white.png" alt="Anadolu-Bank logo" width={28} height={28} />
              <span className="font-semibold text-white">Anadolu-Bank</span>
            </div>
            <p className="text-sm text-white/50">Digital banking built for modern Türkiye.</p>
          </div>
          <div>
            <p className="text-white font-medium mb-3 text-sm">Company</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <p className="text-white font-medium mb-3 text-sm">Resources</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Security</li>
              <li>Support</li>
              <li>FAQs</li>
            </ul>
          </div>
          <div>
            <p className="text-white font-medium mb-3 text-sm">Legal</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Privacy policy</li>
              <li>Terms of service</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Anadolu-Bank. Portfolio demo project — not a real bank.
        </div>
      </footer>
    </div>
  );
}