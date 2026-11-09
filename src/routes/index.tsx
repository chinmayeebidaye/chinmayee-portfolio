import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { RobotArm } from "@/components/RobotArm";
import resume from "@/assets/resume.pdf.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chinmayee Bidaye — Computer Vision & Robotics Engineer" },
      { name: "description", content: "Computer vision, robotic task planning and AI systems by Chinmayee Bidaye, MS CS at UMass Lowell." },
      { property: "og:title", content: "Chinmayee Bidaye — Computer Vision & Robotics Engineer" },
      { property: "og:description", content: "Production CV models, HTN robot planning research and real-time assistive AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ROLES = ["computer vision developer", "software engineer", "machine learning and data engineer", "robotics researcher"];

const EXPERIENCE = [
  { org: "UMass Lowell · PEARL Lab", role: "KCS Science Masters Researcher", date: "Summer 2026", pts: ["Researched Hierarchical Task Network (HTN) planning and robotic task decomposition using SHOP3 and classical planning frameworks.", "Built a benchmarking harness (7 domains × 20 problems × 100 trials) with incremental checkpointing and automated stats extraction."] },
  { org: "UMass Lowell · Manning School of Business", role: "Graduate Assistant - Software & Data Automation", date: "Oct 2025 – present", pts: ["Python + Selenium automation with SQL backends cut manual data entry by 50%.", "Airflow pipeline generating and monitoring 6 recurring reports with alerts and retries.", "Tuned a GenAI advising assistant, validated with 50 test cases."] },
  { org: "LiveSitter", role: "AI / Computer Vision Developer & Researcher", date: "Dec 2023 – Sep 2025", pts: ["Owned the full lifecycle of production CV models (PyTorch, YOLO, DGL) from prototype to live traffic.", "Built accuracy/latency evaluation pipelines that drove a 22% cost reduction.", "Translated user feedback on false alerts into detection threshold targets."] },
  { org: "DataAstraa", role: "Web Developer & UI/UX Intern", date: "Nov 2023 – Feb 2024", pts: ["Mobile app mockups that helped secure a signed client contract.", "Built and launched a React client site in 5 weeks, on budget."] },
  { org: "Engaze", role: "UI/UX Designer", date: "Dec 2023 – Feb 2024", pts: ["Designed user interface for the initial launch using Figma, created intuitive user experience for digital products"] },
];

const PROJECTS = [
  { id: "AVA", title: "Assistive Voice Assistant", tags: ["Computer Vision", "LLM", "Embedded"], metric: "<500ms", label: "gesture → speech", desc: "Real-time sign language recognition feeding an LLM with custom tool calls to produce context-aware speech on embedded hardware.", link: "https://github.com/chinmayeebidaye/AI-BOT-AVA" },
  { id: "SSS", title: "Smart Surveillance System", tags: ["OpenCV", "ML", "Flask", "Twilio"], metric: "30 FPS", label: "@ 90% accuracy", desc: "CCTV unsafe-behaviour detection on railway tracks with automated SMS alerts and fine-enforcement workflow.", link: "https://github.com/chinmayeebidaye/SmartSurveillanceSystem" },
  { id: "UAV", title: "Autonomous Interceptor Drones", tags: ["Robotics", "Vision", "Autonomy"], metric: "1st", label: "MahaHackathon 1.0", desc: "Autonomous kamikaze interceptor drone concept - winning project at the MahaHackathon Challenge 1.0." },
  { id: "HTN", title: "HTN Planning Benchmark", tags: ["Robotics", "SHOP3", "Planning"], metric: "14k", label: "planner trials", desc: "Harness evaluating planner search tractability across task decomposition strategies for robot tasks." },
  { id: "ALP", title: "AI Adaptive Learning Platform", tags: ["BKT", "IRT", "React", "Node.js"], metric: "25", label: "learners tested", desc: "Routes content in real time using Bayesian Knowledge Tracing and Item Response Theory models.", link: "https://github.com/chinmayeebidaye/Edu-Elites"},
  { id: "WG", title: "WebGuard", tags: ["Random Forest", "Security"], metric: "JETIR", label: "published 2025", desc: "AI-powered malicious URL finder and access control with feature-engineered Random Forest.", link: "https://github.com/chinmayeebidaye/WebGuard" },
];

const SKILLS: Record<string, string[]> = {
  "vision & ml": ["PyTorch", "TensorFlow", "YOLO", "OpenCV", "Hugging Face", "LangChain", "LLMs / RAG", "Reinforcement Learning", "Agentic Systems"],
  "robotics & algorithms": ["HTN Planning", "SHOP3", "Heuristic Search", "Classical Planning", "DSA", "LISP"],
  languages: ["Python", "C/C++", "Java", "SQL", "TypeScript", "JavaScript"],
  "data & backend": ["Spark", "Airflow", "Kafka", "PostgreSQL", "pgvector", "MongoDB", "DynamoDB", "OpenSearch", "Flask", "Django", "Node.js", "React"],
  "cloud & devops": ["AWS (S3, EC2, Lambda, Athena)", "GCP", "Docker", "Jenkins CI/CD", "Git"],
};

function useTyped(words: string[]) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i] ?? "";
    const t = setTimeout(() => {
      if (!del && n === w.length) return setDel(true);
      if (del && n === 0) { setDel(false); setI((i + 1) % words.length); return; }
      setN(n + (del ? -1 : 1));
    }, !del && n === w.length ? 1600 : del ? 35 : 70);
    return () => clearTimeout(t);
  }, [n, del, i, words]);
  return (words[i] ?? "").slice(0, n);
}

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-24">
      <div className="reveal mb-12 flex items-baseline gap-4 font-mono">
        <span className="text-primary">{n}</span>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</h2>
        <span className="h-px flex-1 bg-border" />
      </div>
      {children}
    </section>
  );
}

function Index() {
  const typed = useTyped(ROLES);
  useReveal();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 font-mono text-sm">
          <a href="#top" className="text-primary">&gt; cb_</a>
          <div className="hidden gap-6 text-muted-foreground md:flex">
            {["about", "experience", "projects", "skills", "contact"].map((s, i) => (
              <a key={s} href={`#${s}`} className="transition-colors hover:text-primary"><span className="text-primary">0{i + 1}.</span>{s}</a>
            ))}
          </div>
          <a href={"https://drive.google.com/file/d/1SPvUP6LsEf2QXDtYVcRkZRBVimD6Q_Qb/view?usp=sharing"} target="_blank" rel="noreferrer" className="rounded-sm border border-primary px-3 py-1 text-primary transition-colors hover:bg-primary hover:text-primary-foreground">resume.pdf</a>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="relative flex min-h-screen items-center overflow-hidden grid-bg">
        <RobotArm className="pointer-events-none absolute inset-0 h-full w-full opacity-90 md:left-1/3" />
        <div className="pointer-events-none absolute inset-0 scanlines" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pt-20">
          <p className="font-mono text-sm text-primary">[ sys.init ] perception_module online</p>
          <h1 className="mt-6 text-5xl font-bold leading-none tracking-tight md:text-8xl">
            Chinmayee<br /><span className="text-primary glow-text">Bidaye</span>
          </h1>
          <p className="mt-6 h-8 font-mono text-lg text-muted-foreground md:text-xl">
            &gt; {typed}<span className="caret text-primary">█</span>
          </p>
          <p className="mt-6 max-w-xl text-muted-foreground">
            I build machines that see and plan - production computer vision models, robot task planners and real-time assistive AI. I engineer software that turns intelligent ideas into scalable, real-world systems. MS Computer Science @ UMass Lowell.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 font-mono text-sm">
            <a href="#projects" className="rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">view_projects()</a>
            <a href="#contact" className="rounded-sm border border-border px-6 py-3 text-foreground transition-colors hover:border-primary hover:text-primary">contact --me</a>
          </div>
          <div className="mt-16 grid max-w-xl grid-cols-3 gap-4 font-mono">
            {[["22%", "CV cost cut"], ["3.95", "MS GPA"], ["30fps", "real-time det."]].map(([v, l]) => (
              <div key={l} className="border-l-2 border-primary pl-3"><div className="text-2xl text-foreground">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <Section id="about" n="01" title="about">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="reveal space-y-4 text-muted-foreground md:col-span-3">
            <p>I'm a computer vision and ml engineer who enjoys taking models from a notebook to a live system. At LiveSitter I owned production CV models end to end - architecture, data pipelines, evaluation and deployment.</p>
            <p>Now at UMass Lowell's PEARL lab, I researched Hierarchical Task Network planning and robotic task decomposition, building benchmarks that test how planners scale.</p>
            <p>Off the keyboard: sketching concepts, leading workshops (I led Google Developer Group On Campus, 120+ students), and dreaming up the next build.</p>
          </div>
          <div className="reveal hud-corners border border-border bg-card p-6 font-mono text-sm md:col-span-2">
            <div className="mb-4 text-primary">// education.json</div>
            <div className="space-y-5">
              <div><div className="text-foreground">M.S. Computer Science</div><div className="text-muted-foreground">UMass Lowell · 2027 · GPA 3.95</div></div>
              <div><div className="text-foreground">B.E. Information Technology</div><div className="text-muted-foreground">University of Mumbai · 2025 · GPA 3.85</div><div className="text-muted-foreground">Honors in Data Science</div></div>
              <div><div className="text-foreground">Publications</div><div className="text-muted-foreground">ICSTEMSD 2025 · JETIR 12(4) 2025</div></div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="experience" n="02" title="experience">
        <ol className="relative space-y-10 border-l border-border pl-8">
          {EXPERIENCE.map((e) => (
            <li key={e.org + e.date} className="reveal relative">
              <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-xl font-semibold">{e.role}</h3>
                <span className="font-mono text-xs text-muted-foreground">{e.date}</span>
              </div>
              <div className="font-mono text-sm text-accent">@ {e.org}</div>
              <ul className="mt-3 space-y-1.5 text-muted-foreground">
                {e.pts.map((p) => <li key={p} className="flex gap-2"><span className="text-primary">▹</span>{p}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="projects" n="03" title="projects">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <article key={p.id} className="reveal group relative overflow-hidden border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary" style={{ animationDelay: `${(i % 3) * 90}ms` }}>
              <span className="scan-line pointer-events-none absolute inset-x-0 h-px bg-primary opacity-0 transition-opacity group-hover:opacity-70" />
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="border border-primary/60 px-2 py-0.5 text-primary">obj_{p.id} · conf 0.9{9 - i}</span>
                <span className="text-muted-foreground">#{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-5 font-mono"><span className="text-2xl text-primary">{p.metric}</span> <span className="text-xs text-muted-foreground">{p.label}</span></div>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => <span key={t} className="bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground">{t}</span>)}
              </div>
              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 border border-primary/50 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                  view_project<span aria-hidden>↗</span>
                </a>
              )}
            </article>
          ))}
        </div>
      </Section>

      <Section id="skills" n="04" title="skills">
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(SKILLS).map(([k, v]) => (
            <div key={k} className="reveal border border-border bg-card/60 p-5">
              <div className="mb-3 font-mono text-sm text-primary">$ ls ./{k.replace(/ /g, "_")}</div>
              <div className="flex flex-wrap gap-2">
                {v.map((s) => <span key={s} className="border border-border px-2.5 py-1 text-sm transition-colors hover:border-accent hover:text-accent">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="reveal mt-10 grid gap-4 md:grid-cols-3">
          {[["🏆", "MahaHackathon 1.0 — Winner", "Autonomous interceptor drones · Apr 2025"], ["◆", "GDG On Campus — Lead", "120+ students, AI/ML workshops"], ["◇", "IEEE Hackmania — Top 8", "AI adaptive learning · Oct 2023"]].map(([i, t, d]) => (
            <div key={t} className="flex gap-3 border border-border p-4"><span className="text-xl text-warn">{i}</span><div><div className="font-semibold">{t}</div><div className="text-sm text-muted-foreground">{d}</div></div></div>
          ))}
        </div>
      </Section>

      <Section id="contact" n="05" title="contact">
        <div className="reveal hud-corners mx-auto max-w-2xl border border-border bg-card p-10 text-center">
          <p className="font-mono text-sm text-primary">[ awaiting_input ]</p>
          <h3 className="mt-4 text-3xl font-bold md:text-4xl">Let's build something that sees.</h3>
          <p className="mt-4 text-muted-foreground">Open to software, computer vision and ML engineering roles and research collaborations.</p>
          <a href="mailto:chinmayeebidaye28@gmail.com" className="mt-8 inline-block rounded-sm bg-primary px-8 py-3 font-mono font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">chinmayeebidaye28@gmail.com</a>
          <div className="mt-6 flex justify-center gap-6 font-mono text-sm text-muted-foreground">
            <a href="https://www.linkedin.com/in/chinmayeebidaye" target="_blank" rel="noreferrer" className="hover:text-primary">linkedin</a>
            <a href="https://github.com/chinmayeebidaye" target="_blank" rel="noreferrer" className="hover:text-primary">github</a>
            <a href="tel:+13512080302" className="hover:text-primary">+1 351-208-0302</a>
          </div>
        </div>
      </Section>

      <footer className="border-t border-border py-8 text-center font-mono text-xs text-muted-foreground">
        © 2026 Chinmayee Bidaye · rendered at 60fps
      </footer>
    </div>
  );
}
