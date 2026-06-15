
export const profile = {
  name: "Haoran",
  fullName: "Haoran Su",
  handle: "SHRmsks",
  title: "Full-Stack and System Engineer",
  tagline: "Software Infra, OS, Distributed Sys, Applied ML",
  location: "Nanjing, Boston, Shanghai, Ithaca",
  portrait: "/haoran.webp",

  bio: `Glad you find me here. My name is Haoran — a Computer Science guy with Applied Math who recently graduated from Boston University.I will head to Cornell for an M.Eng in CS in Spring 2027. \n\nI have built across the multiple subfields and I am currenly focusing on learning and creating infrastructure and useful wheels.
  My past projects and experiences have largely spanned on following: a custom distributed version-control system, a custom WebGL-based rich text editor, monotonic scheduler and file system in protected mode, and a full-stack AI platform experience in ZTE communication corporation plus mutiple instructor expeiences in Boston University and Hack4Impact Club.\n\nI care about performance, clean architecture, and interfaces and love build from scratch in my free timethat make me feel alive. If you are intereted, contact me and let's do some serious business🔥 .`,

  // Radar "attributes" — label + value out of 10.
  attributes: [
    { label: "Front-End", value: 5 },
    { label: "Back-End", value: 7 },
    { label: "Systems / OS", value: 7 },
    { label: "Distributed", value: 6 },
    { label: "Algorithms", value: 5 },
    { label: "ML / AI", value: 3},
    { label: "DevOps", value: 2 },
    { label: "UI / UX", value: 2},
  ],

  // Grouped tech for the "arsenal" display.
  stack: {
    Languages: ["C","C++", "Golang", "TypeScript", "Python", "Java", "Kotlin", "x86 ASM", "Bash"],
    Frameworks: ["Next.js", "React", "FastAPI", "GraphQL", "Tailwind"],
    Data: ["PostgreSQL", "MongoDB", "Redis", "Kafka"],
    Infra: ["AWS", "Docker", "Nginx", "Git", "Linux"],
  },

  education: [
    {
      school: "Cornell University",
      degree: "M.Eng, Computer Science",
      place: "Ithaca, NY",
      period: "2027",
      note: "Incoming",
      icon : "/cornell.png",
    },
    {
      school: "Boston University",
      degree: "B.A. Computer Science, Applied Mathematics",
      place: "Boston, MA",
      period: "2023 – 2026",
      note: "GPA 3.81 / 4.0 · Dean's List · ICPC NA Regional",
      icon: "/BU.svg",
    },
  ],

  links: [
    { label: "GitHub", href: "https://github.com/SHRmsks", icon: "/github.svg" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/Suhaoran/", icon: "/linkedin.svg" },
    { label: "Website", href: "https://www.haoran.us", icon: "/website.svg" },
    { label: "Email", href: "mailto:shr1424456949@gmail.com", icon: "/email.svg" },
    { label: "WeChat", href: "biblehamandluigi", icon: "/wechat.svg" }
  ],
};

// Professional experience timeline (most recent first).
export const experience = [
  {
    org: "ByteDance",
    role: "Software Engineer Intern — Lark",
    place: "Shanghai, CN",
    period: "Jul – Dec 2026",
    icon: "/bytedance.svg",
    bullets: ["Incoming SWE intern on the Lark team."],
  },
  {
    org: "Boston University — CS Department",
    role: "Research Assistant, DriveOS Team",
    place: "Boston, MA",
    period: "May – Jul 2026",
    icon: "/BU.svg",
    bullets: [
      "With Prof. Richard West, evaluated DriveOS performance by modifying Carla and Unreal Engine 5 source.",
    ],
  },
  {
    org: "Boston University — CS Department",
    role: "Course Instructor, Web Development",
    place: "Boston, MA",
    period: "Jan 2025 – May 2026",
    icon: "/BU.svg",
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
    icon: "/zte.svg",
    bullets: [
      "Built a full-stack AI platform (React + FastAPI) with a fan-in/fan-out WebSocket architecture serving 5+ teams' concurrent model inference.",
      "Cut transmission latency 39% (1.5s → 0.9s) by replacing polling with batched, heartbeat-kept persistent WebSockets.",
    ],
  },
];
