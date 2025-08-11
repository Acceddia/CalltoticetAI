"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, ShieldCheck, ArrowRight, Check, Sparkles, Phone, Clock, Database, Lock, Zap, ChevronRight, Server, CalendarCheck, Inbox } from "lucide-react";

// Toggle this to "/api/contact" to use the built-in API route, or leave empty to use mailto.
const CONTACT_ENDPOINT = ""; // "/api/contact";

const brand = {
  name: "NovaFlow AI",
  tagline: "AI answers your business calls and turns them into tickets — instantly.",
  sub: "Client calls in. Our AI listens in real time, captures all details (who/what/when), creates a technician ticket, schedules the appointment, and notifies everyone. Email parsing is included, but calls are where the magic happens.",
};

const features = [
  {
    icon: <Phone className="w-6 h-6" />, title: "Live call → Ticket",
    text: "AI joins or receives the call, transcribes live, extracts customer + vehicle + issue, and creates a ticket for the right person.",
    bullets: ["Real-time transcription", "Entity & intent extraction", "Assigns tech automatically"],
  },
  {
    icon: <CalendarCheck className="w-6 h-6" />, title: "Auto-schedule appointments",
    text: "If it’s an appointment, we propose a time, book it in your calendar/app, and send confirmations.",
    bullets: ["Conflict-aware booking", "Time‑zone & buffer rules", "Reschedule links"],
  },
  {
    icon: <Database className="w-6 h-6" />, title: "Push to your tools",
    text: "Tickets and events sync into the systems you already use (Jira, Asana, Notion, HubSpot, shop management software).",
    bullets: ["Two‑way sync", "Attachments & photos", "Audit trail with source call"],
  },
  {
    icon: <Inbox className="w-6 h-6" />, title: "Email → Actions (optional)",
    text: "We also parse emails for tasks, deadlines, and approvals, but the core is call automation.",
    bullets: ["Detects assignees & due dates", "Understands attachments", "Links back to the email"],
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />, title: "Trust & security",
    text: "Encryption in transit & at rest, least‑privilege access, and EU/EEA hosting options.",
    bullets: ["SOC2 in progress", "SAML/SSO", "Audit logs"],
  },
  {
    icon: <Zap className="w-6 h-6" />, title: "Automation rules",
    text: "No‑code rules to route, label, escalate, and auto‑approve common cases.",
    bullets: ["If/Then flows", "Human‑in‑the‑loop", "Versioned changes"],
  },
];

const logos = ["Microsoft 365", "Google Workspace", "HubSpot", "Slack", "Asana", "Jira", "Notion", "Zoom"];

export default function Page() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const bizRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const { scrollYProgress } = useScroll();
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -60]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    const name = nameRef.current?.value?.trim();
    const business = bizRef.current?.value?.trim();
    const message = msgRef.current?.value?.trim();
    if (!name || !message) {
      alert("Please fill in your name and message.");
      return;
    }
    const payload = { name, business, message, to: "casperlohk@hotmail.com" };

    if (CONTACT_ENDPOINT) {
      try {
        setSending(true);
        const res = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to send");
        setSent(true);
      } catch (err) {
        console.error(err);
        alert("Couldn't reach the server. We'll open your email client instead.");
        const mailto = makeMailto(payload);
        window.location.href = mailto;
      } finally {
        setSending(false);
      }
    } else {
      const mailto = makeMailto(payload);
      window.location.href = mailto;
    }
  }

  function makeMailto({ name, business, message, to }: {name:string; business?:string; message:string; to:string}) {
    const subject = encodeURIComponent(`Website contact from ${name}${business ? " (" + business + ")" : ""}`);
    const body = encodeURIComponent(message);
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-300/30 selection:text-white">
      <Decor />
      <Navbar />
      <Hero />

      <Section id="integrations" title="Connects to what you use" kicker="Integrations">
        <motion.div style={{ y: y2 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-90">
          {logos.map((l) => (
            <div key={l} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 text-center text-sm sm:text-base shadow-lg">
              {l}
            </div>
          ))}
        </motion.div>
      </Section>

      <Section id="features" title="From phone chaos to clear next steps" kicker="Features">
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl hover:bg-white/10/50 group"
            >
              <div className="flex items-center gap-3 text-indigo-300">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white/10 border border-white/10 shadow-inner">{f.icon}</span>
                <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
              </div>
              <p className="mt-3 text-slate-300 leading-relaxed">{f.text}</p>
              <ul className="mt-4 space-y-2">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-slate-200"><Check className="w-4 h-4 mt-1" /> {b}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      <HowItWorks />
      <Security />
      <Testimonials />
      <CTA />
      <Contact onSubmit={onSubmit} sending={sending} sent={sent} refs={{ nameRef, bizRef, msgRef }} />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <div className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md border-b border-white/10" />
      <nav className="relative max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-400/60 to-cyan-300/60 border border-white/20 shadow-xl grid place-items-center">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div className="font-bold tracking-tight">{brand.name}</div>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm text-slate-200">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#security" className="hover:text-white">Security</a>
          <a href="#contact" className="hover:text-white">Contact</a>
          <a href="#contact" className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 shadow">
            Get a demo <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </nav>
    </div>
  );
}

function Hero() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.6]);
  const y = useTransform(scrollYProgress, [0, 0.3], [0, 40]);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-[32rem] h-[32rem] rounded-full bg-cyan-400/20 blur-3xl" />
      </div>
      <motion.div style={{ opacity, y }} className="max-w-6xl mx-auto px-4 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="grid lg:grid-cols-2 items-center gap-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-200 text-sm">
              <Sparkles className="w-4 h-4" /> Call-first automation
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {brand.tagline}
            </h1>
            <p className="mt-5 text-lg text-slate-300 max-w-xl">{brand.sub}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#contact" className="px-5 py-3 rounded-2xl bg-white text-slate-950 font-semibold shadow-lg hover:shadow-xl">
                Talk to us
              </a>
              <a href="#features" className="px-5 py-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 font-semibold inline-flex items-center gap-2">
                See features <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-slate-300">
              <div className="inline-flex items-center gap-2"><Lock className="w-4 h-4" /> End‑to‑end TLS</div>
              <div className="inline-flex items-center gap-2"><Server className="w-4 h-4" /> EU/EEA hosting option</div>
              <div className="inline-flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> GDPR‑ready</div>
            </div>
          </div>
          <div className="relative">
            <MockGlassPanel />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function MockGlassPanel() {
  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-white/20 to-transparent blur" />
      <div className="relative rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">
        <div className="text-sm text-slate-200 flex items-center gap-2"><Phone className="w-4 h-4" /> Live call (transcribing…)</div>
        <div className="mt-3 rounded-xl bg-slate-950/40 border border-white/10 p-4">
          <p className="text-slate-100 text-sm">Caller: Marko</p>
          <p className="text-slate-300 text-sm mt-2">“Hi, I’ve got a 2016 VW Golf, license 123 ABC. Front brakes are squeaking and steering pulls right. I’m free Friday morning.”</p>
        </div>
        <div className="mt-4 text-sm text-slate-400">NovaFlow AI understood:</div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { k: "Customer", v: "Marko" },
            { k: "Vehicle", v: "VW Golf (2016) — 123 ABC" },
            { k: "Issue", v: "Front brake squeak, steering drift" },
          ].map((row) => (
            <div key={row.k} className="rounded-xl bg-white/10 border border-white/10 p-3">
              <div className="text-xs text-slate-300">{row.k}</div>
              <div className="text-sm font-semibold">{row.v}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/10 border border-white/10 p-3">
            <div className="text-xs text-slate-300">Ticket</div>
            <div className="text-sm font-semibold">#T‑1042 — Assign to Brake Specialist</div>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/10 p-3">
            <div className="text-xs text-slate-300">Proposed time</div>
            <div className="text-sm font-semibold">Fri 10:00–11:00</div>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-white text-slate-950 text-sm font-semibold shadow">Approve & notify</button>
          <button className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-sm">Edit details</button>
        </div>
        <div className="mt-3 text-xs text-slate-400">On approve: technician ticket created in your app, calendar booked, email/SMS sent to client & repairman.</div>
      </div>
    </div>
  );
}

function Section({ id, kicker, title, children }: {id:string; kicker?:string; title:string; children: React.ReactNode}) {
  return (
    <section id={id} className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
      <div className="mb-8">
        {kicker && <div className="text-sm text-indigo-300/90 font-semibold tracking-wide">{kicker}</div>}
        <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { title: "Call comes in", text: "AI joins/receives the call and transcribes in real time." },
    { title: "Understand", text: "Extracts who/vehicle/issue/urgency and detects if it’s a ticket or an appointment." },
    { title: "Create", text: "Makes a technician ticket in your system and proposes/locks a time slot." },
    { title: "Notify", text: "Sends confirmations to client & technician with all context and links." },
  ];

  return (
    <Section id="how" kicker="Workflow" title="How it works">
      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-xl"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/10 grid place-items-center font-bold">{i + 1}</div>
            <h3 className="mt-4 font-semibold">{s.title}</h3>
            <p className="mt-2 text-slate-300 text-sm">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Security() {
  const items = [
    { icon: <Lock className="w-5 h-5" />, title: "Encryption", text: "TLS in transit, AES‑256 at rest." },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Access controls", text: "RBAC, least‑privilege, IP allow‑listing." },
    { icon: <Database className="w-5 h-5" />, title: "Data residency", text: "EU/EEA region option; data minimisation." },
    { icon: <Clock className="w-5 h-5" />, title: "Retention", text: "Configurable retention and redaction policies." },
  ];

  return (
    <Section id="security" kicker="Trust" title="Security by default">
      <div className="grid md:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.title} className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-indigo-200 text-xs">
              {it.icon}
              <span>{it.title}</span>
            </div>
            <p className="mt-3 text-slate-300 text-sm">{it.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-sm text-slate-300">
        We never sell data. Admins get full audit trails. DPA available on request.
      </div>
    </Section>
  );
}

function Testimonials() {
  const quotes = [
    { name: "Anu, COO", text: "Our phones used to create chaos. NovaFlow turns calls into tickets and calendar blocks." },
    { name: "Marek, Head of Sales", text: "Follow‑ups finally happen on time. No more ‘lost in call notes’." },
    { name: "Liis, PM", text: "Standups are shorter because context from calls is already in our tools." },
  ];
  return (
    <Section id="love" kicker="What teams say" title="Quietly making teams look organised">
      <div className="grid md:grid-cols-3 gap-6">
        {quotes.map((q, i) => (
          <motion.blockquote
            key={i}
            initial={{ y: 12, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-xl text-slate-200"
          >
            “{q.text}”
            <footer className="mt-3 text-slate-400 text-sm">{q.name}</footer>
          </motion.blockquote>
        ))}
      </div>
    </Section>
  );
}

function CTA() {
  return (
    <section className="relative max-w-6xl mx-auto px-4 py-16">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 shadow-2xl">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="md:flex items-center justify-between gap-6 relative">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">Start with a friendly demo</h3>
            <p className="mt-2 text-slate-300 max-w-2xl">We’ll show how NovaFlow turns your real calls (and emails) into tickets and calendar events — with your tools and your constraints.</p>
          </div>
          <a href="#contact" className="mt-6 md:mt-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-950 font-semibold shadow-lg hover:shadow-xl">
            Book my demo <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Contact({ onSubmit, sending, sent, refs }: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  sending: boolean;
  sent: boolean;
  refs: { nameRef: React.RefObject<HTMLInputElement>; bizRef: React.RefObject<HTMLInputElement>; msgRef: React.RefObject<HTMLTextAreaElement>; };
}) {
  return (
    <Section id="contact" kicker="Say hello" title="Contact us">
      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-xl">
          <label className="block text-sm text-slate-300">Your name *</label>
          <input ref={refs.nameRef} required className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-300/40" placeholder="Your name" />
          <label className="block mt-4 text-sm text-slate-300">Business</label>
          <input ref={refs.bizRef} className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-300/40" placeholder="Company / team" />
          <label className="block mt-4 text-sm text-slate-300">Message *</label>
          <textarea ref={refs.msgRef} required rows={6} className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-300/40" placeholder="Tell us what you want to automate…" />
          <button disabled={sending || sent} className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-950 font-semibold shadow-lg hover:shadow-xl disabled:opacity-60">
            {sent ? "Sent — check your email client" : sending ? "Sending…" : "Send"}
            <Mail className="w-4 h-4" />
          </button>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-xl">
          <h4 className="text-lg font-semibold">What happens next</h4>
          <ul className="mt-3 space-y-3 text-slate-300 text-sm">
            <li className="flex gap-2"><ArrowRight className="w-4 h-4 mt-0.5" /> We reply within 1 business day with a proposed time.</li>
            <li className="flex gap-2"><ArrowRight className="w-4 h-4 mt-0.5" /> Bring a sample call/email and we’ll show the workflow end to end.</li>
            <li className="flex gap-2"><ArrowRight className="w-4 h-4 mt-0.5" /> We sign an NDA if needed.</li>
          </ul>
          <div className="mt-6 rounded-2xl bg-white/10 border border-white/10 p-4">
            <div className="text-sm text-slate-200 font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Trust & data protection</div>
            <p className="mt-2 text-slate-300 text-sm">We operate privacy‑first: least‑privilege auth, encryption, and clear data processing agreements. Opt‑out any time.</p>
          </div>
        </div>
      </form>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="relative max-w-6xl mx-auto px-4 pt-8 pb-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="font-bold">{brand.name}</div>
            <div className="text-sm text-slate-300">© {new Date().getFullYear()} — All rights reserved</div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <a className="hover:text-white" href="#security">Security</a>
            <a className="hover:text-white" href="#integrations">Integrations</a>
            <a className="hover:text-white" href="#contact">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Decor() {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_35%)]" />
      <motion.div
        aria-hidden
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="pointer-events-none fixed inset-x-0 top-0 h-20 bg-gradient-to-b from-white/10 to-transparent"
      />
    </>
  );
}

// Keep TS happy: make this file a module for Next's type generator
export {};
