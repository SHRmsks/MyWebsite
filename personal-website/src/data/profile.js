// profile.js
// Single source of truth for the "character sheet" — edit this to update the site.
// No JSX here, just data, so it stays easy to read and change. Content is pulled
// from Haoran's resume.

export const profile = {
  name: "Haoran",
  fullName: "Haoran Su",
  handle: "SHRmsks",
  title: "Full-Stack & Systems Engineer",
  tagline: "Distributed Systems · Low-Level · AI · Buttery UI",
  location: "Boston, MA · Ithaca, NY",
  portrait: "/haoran.webp",

  bio: `I'm Haoran — a Computer Science + Applied Math grad from Boston University (3.81 GPA, Dean's List, ICPC regional contestant), heading to Cornell for an M.Eng in CS.

I build across the whole stack and all the way down: high-throughput WebSocket platforms and event-driven services on one end, and x86 kernels, schedulers and a custom distributed version-control system on the other. I've interned at ByteDance and ZTE, taught web dev to 80+ students, and run React/Next.js workshops for Hack4Impact.

I care about performance, clean architecture, and interfaces that feel alive. Let's build something.`,

  // Radar "attributes" — label + value out of 10.
  attributes: [
    { label: "Front-End", value: 9 },
    { label: "Back-End", value: 8 },
    { label: "Systems / OS", value: 8 },
    { label: "Distributed", value: 8 },
    { label: "Algorithms", value: 8 },
    { label: "ML / AI", value: 6 },
    { label: "DevOps", value: 7 },
    { label: "UI / UX", value: 8 },
  ],

  // Grouped tech for the "arsenal" display.
  stack: {
    Languages: ["C / C++", "Golang", "TypeScript", "Python", "Java", "Kotlin", "x86 ASM", "Bash"],
    Frameworks: ["Next.js", "React", "FastAPI", "GraphQL", "Tailwind"],
    Data: ["PostgreSQL", "MongoDB", "Redis", "Kafka"],
    Infra: ["AWS", "Docker", "Nginx", "Git", "Figma"],
  },

  education: [
    {
      school: "Cornell University",
      degree: "M.Eng, Computer Science",
      place: "Ithaca, NY",
      period: "2027",
      note: "Incoming",
    },
    {
      school: "Boston University",
      degree: "B.A. Computer Science + Applied Mathematics",
      place: "Boston, MA",
      period: "2023 – 2026",
      note: "GPA 3.81 / 4.0 · Dean's List · ICPC NA Regional",
    },
  ],

  links: [
    { label: "GitHub", href: "https://github.com/SHRmsks", icon: "/github.svg" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/Suhaoran/", icon: null },
    { label: "Website", href: "https://www.haoran.us", icon: null },
    { label: "Email", href: "mailto:suhr08@bu.edu", icon: null },
  ],
};

// Professional experience timeline (most recent first).
export const experience = [
  {
    org: "ByteDance",
    role: "Software Engineer Intern — Lark",
    place: "Shanghai, CN",
    period: "Jul – Dec 2026",
    bullets: ["Incoming SWE intern on the Lark team."],
  },
  {
    org: "Boston University — CS Department",
    role: "Research Assistant, DriveOS Team",
    place: "Boston, MA",
    period: "May – Jul 2026",
    bullets: [
      "With Prof. Richard West, evaluated DriveOS performance by modifying Carla and Unreal Engine 5 source.",
    ],
  },
  {
    org: "Boston University — CS Department",
    role: "Course Instructor, Web Development",
    place: "Boston, MA",
    period: "Jan 2025 – May 2026",
    bullets: [
      "Mentored 80+ students on React and web dev across labs and 5 weekly office hours.",
      "Co-designed exams and assignments; 90% extremely-positive evaluations.",
    ],
  },
  {
    org: "ZTE Corporation",
    role: "Software Engineer Intern",
    place: "Nanjing, CN",
    period: "May – Aug 2025",
    bullets: [
      "Built a full-stack AI platform (React + FastAPI) with a fan-in/fan-out WebSocket architecture serving 5+ teams' concurrent model inference.",
      "Cut transmission latency 39% (1.5s → 0.9s) by replacing polling with batched, heartbeat-kept persistent WebSockets.",
    ],
  },
];
