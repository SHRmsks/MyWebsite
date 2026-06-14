// projects.js
// Add a project by dropping an object in this array. The `demo` field is the
// flexible bit: set `src` to a video file, an image, a YouTube/embed URL, or any
// link — <ProjectDemo> auto-detects how to show it (see ProjectDemo.jsx). You can
// force the kind with `demo: { kind: "video" | "image" | "embed" | "link", src }`.

export const projects = [
  {
    id: "mygit",
    name: "mygit — Distributed VCS",
    framework: "C · Golang · gRPC",
    icon: null,
    intro:
      "A custom distributed version-control system with Content-Defined Chunking + Fast Gear Hash. ~7× faster than Git on large binary edits (0.19s vs 8.77s), 50% less disk via Merkle-tree manifest indexing and session packfiles.",
    demo: {
      kind: "link",
      src: "https://github.com/SHRmsks/DCVS-mygit-",
      label: "View on GitHub",
    },
    skills: {
      frontEnd: 0,
      backEnd: 9,
      database: 7,
      design: 2,
      management: 4,
      algorithms: 9,
    },
    tags: ["C", "Golang", "gRPC", "Merkle Tree", "Dedup"],
  },
  {
    id: "micros",
    name: "MICROS — Kernel & FS",
    framework: "C · x86 Assembly",
    icon: null,
    intro:
      "A preemptive rate-monotonic scheduler in x86 protected mode with low-level context switching, plus a standalone persistent filesystem talking directly to ATA/IDE controller I/O ports with custom IOCTL interfaces for Ring-3.",
    demo: {
      kind: "link",
      src: "https://github.com/SHRmsks",
      label: "More on GitHub",
    },
    skills: {
      frontEnd: 0,
      backEnd: 8,
      database: 5,
      design: 1,
      management: 3,
      algorithms: 8,
    },
    tags: ["C", "x86 ASM", "Scheduler", "Filesystem"],
  },
  {
    id: "workshift",
    name: "Work Shift Management",
    framework: "Flutter",
    icon: "/flutter.svg",
    intro:
      "A team-management app derived from a website: schedule shifts, swap them, and track hours in one tap.",
    demo: { src: "/demo.mp4", poster: "/demo-poster.jpg" },
    skills: {
      frontEnd: 7,
      backEnd: 6,
      database: 4,
      design: 5,
      management: 3,
      algorithms: 0,
    },
    tags: ["Flutter", "Dart", "Firebase"],
  },
  {
    id: "recyclemaster",
    name: "Recycle Master",
    framework: "React Native",
    icon: "/react.svg",
    intro:
      "A recyclable-detection mobile app powered by YOLOv8 — built end-to-end in a 24-hour hackathon.",
    demo: { src: "https://www.youtube.com/embed/ysVSmk_bnWM" },
    skills: {
      frontEnd: 5,
      backEnd: 5,
      database: 0,
      design: 2,
      management: 1,
      algorithms: 7,
    },
    tags: ["React Native", "YOLOv8", "PyTorch"],
  },
];

// Order the skill bars render in, with display labels.
export const SKILL_AXES = [
  ["frontEnd", "Front-End"],
  ["backEnd", "Back-End"],
  ["database", "Database"],
  ["design", "Design"],
  ["management", "Management"],
  ["algorithms", "Algorithms"],
];
