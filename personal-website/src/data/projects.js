// projects.js
// Add a project by dropping an object in this array. The `demo` field is the
// flexible bit: set `src` to a video file, an image, a YouTube/embed URL, or any
// link — <ProjectDemo> auto-detects how to show it (see ProjectDemo.jsx). You can
// force the kind with `demo: { kind: "video" | "image" | "embed" | "link", src }`.

export const projects = [
  {
    id: "RichTextEditor",
    name: "Custom Rich Text Editor 2026",
    framework: "WebASM(C),WebGL",
    icon: "/webasm.svg",
    intro:
      "A custom rich text editor that is built from scratch with WebAssembly and WebGL. Manually implemented layout and rendering engine based on Piece Table and Red-Black Tree, with GPU-accelerated text rendering.",
    demos: [
      {
        kind: "link",
        src: "https://github.com/SHRmsks/Editor",
        label: "Please View on GitHub",
      },
    ],
    skills: {
      frontEnd: 1,
      backEnd: 8,
      database: 0,
      design: 1,
      management: 0,
      algorithms: 9,
    },
    tags: ["C", "GLSL", "Piece Table", "Red-Black Tree"],
  },
  {
    id: "mygit",
    name: "mygit — Distributed VCS 2026",
    framework: "C · Golang · gRPC",
    icon: "/C.svg",
    intro:
      "A custom distributed version-control system with Content-Defined Chunking + Fast Gear Hash. ~7× faster than Git on large binary edits (0.19s vs 8.77s), 50% less disk via Merkle-tree manifest indexing and session packfiles.",
    demos: [
      { kind: "video", src: "/MygitDemo.mp4", poster: "/MygitDemoPoster.png" },
      {
        kind: "link",
        src: "https://github.com/SHRmsks/DCVS-mygit-",
        label: "View on GitHub",
      },
    ],
    skills: {
      frontEnd: 0,
      backEnd: 9,
      database: 7,
      design: 5,
      management: 4,
      algorithms: 10,
    },
    tags: [
      "C",
      "Golang",
      "gRPC",
      "Merkle Tree",
      "Content-Defined Chunking",
      "Gear Hash",
    ],
  },
  {
    id: "MineSweeper",
    name: "MineSweeper 2025",
    framework: "Typescript · React",
    icon: "/react.svg",
    intro:
      "Hack4Impact 2025 final project: a Minesweeper clone built with React, featuring multiple difficulty levels based on React VDOM rendering",
    demos: [
      {
        kind: "link",
        src: "https://github.com/SHRmsks/hack4impact_minesweeper",
        label: "Please View on GitHub",
      },
    ],
    skills: {
      frontEnd: 7,
      backEnd: 0,
      database: 0,
      design: 10,
      management: 0,
      algorithms: 3,
    },
    tags: ["React", "BFS"],
  },
  {
    id: "micros",
    name: "MICROS — Kernel & FS 2025",
    framework: "C · x86 Assembly",
    icon: "/C.svg",
    intro:
      "A preemptive rate-monotonic scheduler in x86 protected mode with low-level context switching, plus a standalone persistent filesystem talking directly to ATA/IDE controller I/O ports with custom IOCTL interfaces for Ring-3. Currently private and not avaible for demo.",
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
    id: "recyclemaster",
    name: "Recycle Master 2024",
    framework: "React Native",
    icon: "/react.svg",
    intro:
      "A recyclable-detection mobile app powered by YOLOv8 — built end-to-end in a 24-hour hackathon.",
    demos: [
      { kind: "embed", src: "https://www.youtube.com/embed/ysVSmk_bnWM" },
      {
        kind: "link",
        src: "https://github.com/SHRmsks",
        label: "Repo / Devpost",
      },
    ],
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
  {
    id: "workshift",
    name: "Work Shift Management 2023",
    framework: "Flutter",
    icon: "/flutter.svg",
    intro:
      "A team-management app derived from a website: schedule shifts, swap them, and track hours in one tap.",
    // A project can list any mix of demo kinds — they all render, in order.
    demos: [
      { kind: "video", src: "/demo.mp4", poster: "/demo-poster.jpg" },
      {
        kind: "link",
        src: "https://github.com/SHRmsks",
        label: "Source on GitHub",
      },
    ],
    skills: {
      frontEnd: 7,
      backEnd: 6,
      database: 4,
      design: 5,
      management: 3,
      algorithms: 0,
    },
    tags: ["Flutter", "Dart"],
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
