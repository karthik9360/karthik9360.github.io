// Everything here comes from the resume. Add measured outcomes as you get them (uptime,
// plants served, time saved): real numbers are what move a recruiter most.

export interface Project {
  id: string;
  title: string;
  summary: string;
  details: string[];
  /** Only technologies the resume names for this project. */
  tech: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const profile = {
  name: "M. Karthik",
  role: "full stack developer",
  location: "Chennai, India",
  email: "karthik202m@gmail.com",
  resume: "/Karthik_Python_Fullstack_Developer.pdf",
  links: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/karthik-m-090182274",
    },
    { label: "GitHub", href: "https://github.com/karthik9360" },
  ],
  headline: "Real-time software for the factory floor.",
  intro:
    "I build the dashboards, APIs and mobile apps that show plant teams what their machines are doing, live.",
  coreStack: [
    "Python",
    "Django",
    "React",
    "React Native",
    "PostgreSQL",
    "MQTT",
  ],
  proof: [
    { value: "100+", label: "industrial devices monitored in real time" },
    { value: "5", label: "industrial systems built" },
    { value: "3 years", label: "across web, mobile and servers" },
  ],
  reasons: [
    {
      title: "I own the whole feature",
      body: "Django APIs, PostgreSQL, React dashboards, React Native apps and the Linux servers they run on.",
    },
    {
      title: "I build for live data",
      body: "MQTT, WebSockets, Django Channels and Redis. My monitoring platform tracks 100+ industrial devices in real time.",
    },
    {
      title: "I make slow systems fast",
      body: "I tune PostgreSQL with indexing and query work. On Crane IQ I replaced multiple per-operation queries with one conditional aggregate query.",
    },
    {
      title: "I know the plant floor",
      body: "I've built software for energy monitoring, crane operations, production counting and forklift tracking.",
    },
  ],
  experience: {
    role: "Full Stack Developer",
    company: "Febinosolution",
    period: "2023 to present",
    highlights: [
      "Built REST APIs, authentication systems, RBAC modules and reporting services.",
      "Integrated third-party APIs, notification services and cloud-based solutions.",
      "Delivered responsive UI solutions while collaborating in Agile/Scrum teams.",
    ],
  },
  education: {
    degree: "B.Tech in Information Technology",
    school: "Ponjesly College of Engineering",
    period: "2019 to 2023",
  },
};

export const projects: Project[] = [
  {
    id: "ems",
    title: "Energy Monitoring System (EMS)",
    summary:
      "Monitors 100+ industrial devices in real time, with a companion React Native app for alerts on the go.",
    details: [
      "Tracks electrical, gas, diesel, water-level and flow parameters.",
      "Analytics dashboards, reports and consumption-per-production insights.",
      "Organization management, including logo and branding uploads.",
    ],
    tech: ["React Native"],
  },
  {
    id: "crane-iq",
    title: "Crane IQ",
    summary:
      "Streams live hoist-up and hoist-down data to a React dashboard for crane operators and supervisors.",
    details: [
      "Replaced multiple per-operation database queries with a single conditional aggregate query (Django Q-filtered Sum).",
      "Managed the Linux server deployment.",
    ],
    tech: ["Django", "Django Channels", "WebSockets", "React"],
  },
  {
    id: "production-count",
    title: "Production Count Monitoring System",
    summary:
      "Web and mobile applications for tracking production against targets.",
    details: [
      "Shift-wise production tracking.",
      "Target-versus-actual analysis.",
      "Performance reporting.",
    ],
    tech: [],
  },
  {
    id: "forklift-tracking",
    title: "Forklift Tracking Dashboard",
    summary: "A map-based operations dashboard for tracking forklifts live.",
    details: [
      "Live location tracking and route visualization.",
      "Speed monitoring.",
      "Idle-time analysis.",
    ],
    tech: [],
  },
  {
    id: "email-tracking",
    title: "Email Tracking System",
    summary:
      "An automated IMAP-based monitor that turns machine emails into live production data.",
    details: [
      "Processes machine emails and extracts production counts.",
      "Triggers alerts.",
      "Displays live analytics.",
    ],
    tech: ["IMAP"],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: "Core stack",
    items: [
      "Python",
      "Django",
      "Django REST Framework",
      "React.js",
      "React Native",
      "PostgreSQL",
      "MQTT",
      "Redis",
      "WebSockets",
    ],
  },
  {
    label: "Frontend",
    items: [
      "Redux",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Bootstrap",
    ],
  },
  { label: "Mobile", items: ["Expo"] },
  { label: "Backend", items: ["FastAPI", "Flask"] },
  { label: "Database", items: ["MySQL", "MongoDB", "SQLite"] },
  {
    label: "Realtime and messaging",
    items: ["Django Channels", "Celery"],
  },
  {
    label: "DevOps and infrastructure",
    items: [
      "Linux",
      "Server administration",
      "Nginx",
      "Docker",
      "Cloud deployment",
      "CI/CD basics",
    ],
  },
  {
    label: "Tools",
    items: ["Git", "GitHub", "GitLab", "VS Code", "Postman", "Webpack"],
  },
  { label: "Testing", items: ["PyTest", "React Testing Library"] },
];
