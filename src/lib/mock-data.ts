export type Category = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  gradient: string;
};

export const categories: Category[] = [
  { slug: "career", name: "Get a Job", emoji: "💼", description: "Resumes, cover letters, interview prep", gradient: "from-violet-500/20 to-fuchsia-500/20" },
  { slug: "productivity", name: "Productivity", emoji: "⚡", description: "Plan smarter, focus deeper, ship faster", gradient: "from-amber-400/20 to-orange-500/20" },
  { slug: "content", name: "Create Content", emoji: "🎬", description: "Hooks, scripts, captions, thumbnails", gradient: "from-rose-400/20 to-pink-500/20" },
  { slug: "study", name: "Study & Learn", emoji: "📚", description: "Summaries, flashcards, study plans", gradient: "from-sky-400/20 to-indigo-500/20" },
  { slug: "marketing", name: "Marketing", emoji: "📈", description: "Campaigns, ads, brand messaging", gradient: "from-emerald-400/20 to-teal-500/20" },
  { slug: "startup", name: "Start a Business", emoji: "🚀", description: "Ideation, validation, pitch decks", gradient: "from-purple-500/20 to-indigo-500/20" },
  { slug: "fitness", name: "Fitness", emoji: "🏋️", description: "Workout plans, nutrition, habits", gradient: "from-lime-400/20 to-emerald-500/20" },
  { slug: "travel", name: "Travel", emoji: "✈️", description: "Itineraries, packing, hidden gems", gradient: "from-cyan-400/20 to-sky-500/20" },
  { slug: "email", name: "Write Emails", emoji: "✉️", description: "Outreach, replies, negotiations", gradient: "from-yellow-400/20 to-amber-500/20" },
  { slug: "slides", name: "Presentations", emoji: "🎨", description: "Decks, outlines, speaker notes", gradient: "from-fuchsia-500/20 to-rose-500/20" },
  { slug: "social", name: "Social Media", emoji: "📱", description: "Posts, growth, engagement", gradient: "from-pink-400/20 to-rose-500/20" },
  { slug: "skills", name: "Learn a Skill", emoji: "🧠", description: "Roadmaps, practice, mastery", gradient: "from-indigo-400/20 to-violet-500/20" },
];

export type Creator = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  followers: number;
  prompts: number;
  verified: boolean;
};

export const creators: Creator[] = [
  { id: "c1", name: "Maya Chen", handle: "@mayawrites", bio: "Career coach helping 10k+ land dream jobs", avatar: "MC", followers: 24800, prompts: 42, verified: true },
  { id: "c2", name: "Leo Park", handle: "@leobuilds", bio: "Indie founder. Productivity systems.", avatar: "LP", followers: 18200, prompts: 31, verified: true },
  { id: "c3", name: "Sofia Reyes", handle: "@sofiacreates", bio: "Content strategist for creators", avatar: "SR", followers: 31500, prompts: 58, verified: true },
  { id: "c4", name: "Dr. Amelia Vance", handle: "@drvance", bio: "Learning scientist. Study smarter.", avatar: "AV", followers: 12700, prompts: 27, verified: true },
];

export type Prompt = {
  id: string;
  slug: string;
  title: string;
  outcome: string;
  description: string;
  category: string;
  price: number; // 0 = free
  rating: number;
  reviews: number;
  uses: number;
  beginner: boolean;
  tools: ("ChatGPT" | "Claude" | "Gemini" | "Midjourney")[];
  tags: string[];
  creatorId: string;
  cover: string; // gradient class
  body: string;
  examples: { input: string; output: string }[];
  instructions: string[];
};

const g = [
  "from-slate-600 via-slate-500 to-zinc-600 dark:from-slate-800 dark:via-slate-700 dark:to-zinc-800",
  "from-zinc-600 via-slate-600 to-stone-600 dark:from-zinc-800 dark:via-slate-700 dark:to-stone-800",
  "from-gray-600 via-slate-500 to-zinc-500 dark:from-gray-800 dark:via-slate-700 dark:to-zinc-800",
  "from-stone-600 via-zinc-500 to-slate-600 dark:from-stone-800 dark:via-zinc-700 dark:to-slate-800",
  "from-neutral-600 via-gray-600 to-slate-600 dark:from-neutral-800 dark:via-gray-700 dark:to-slate-800",
  "from-slate-500 via-zinc-600 to-stone-600 dark:from-slate-700 dark:via-zinc-800 dark:to-stone-800",
  "from-zinc-500 via-stone-600 to-gray-600 dark:from-zinc-700 dark:via-stone-800 dark:to-gray-800",
  "from-gray-500 via-neutral-600 to-zinc-600 dark:from-gray-700 dark:via-neutral-800 dark:to-zinc-800",
];

export const prompts: Prompt[] = [
  {
    id: "p1", slug: "land-a-dream-job-in-30-days", title: "Land a Dream Job in 30 Days",
    outcome: "Get more interviews this month",
    description: "A guided coaching prompt that rewrites your resume, tailors it to any job posting, and drafts a cover letter that actually sounds like you.",
    category: "career", price: 0, rating: 4.9, reviews: 1284, uses: 52310, beginner: true,
    tools: ["ChatGPT", "Claude"], tags: ["resume", "cover letter", "interview"],
    creatorId: "c1", cover: g[0],
    body: "You are an empathetic career coach...\n\nAsk me about my background, target role, and what excites me. Then rewrite my resume bullets to be outcome-driven, tailor to the role, and draft a cover letter in my voice.",
    examples: [{ input: "Product manager, 3 yrs, fintech", output: "✨ Tailored resume with 6 outcome bullets, ATS-friendly cover letter, 10 likely interview questions." }],
    instructions: ["Open ChatGPT or Claude", "Paste the prompt", "Share your current resume + the job description", "Iterate until it sounds like you"],
  },
  {
    id: "p2", slug: "weekly-deep-work-plan", title: "Weekly Deep Work Plan",
    outcome: "Reclaim 10 hours of focus a week",
    description: "Turn your messy todo list into a calm, themed weekly plan with focus blocks and shutdown routines.",
    category: "productivity", price: 4, rating: 4.8, reviews: 642, uses: 21400, beginner: true,
    tools: ["ChatGPT", "Claude", "Gemini"], tags: ["planning", "focus", "habits"],
    creatorId: "c2", cover: g[1],
    body: "Act as a calm productivity coach. Ask for my top 3 outcomes this week, my energy patterns, and unmovable commitments. Output a themed weekly plan with 90-min deep work blocks.",
    examples: [{ input: "3 goals, 4 meetings", output: "Themed week, focus blocks, daily shutdown ritual." }],
    instructions: ["Copy the prompt", "Paste into your AI of choice", "Answer the 3 questions", "Drop the plan into your calendar"],
  },
  {
    id: "p3", slug: "viral-short-form-hooks", title: "Viral Short-Form Hooks",
    outcome: "Stop the scroll in the first 3 seconds",
    description: "Generate 20 platform-aware hooks tuned to your niche, voice, and audience pain points.",
    category: "content", price: 9, rating: 4.9, reviews: 980, uses: 34020, beginner: false,
    tools: ["ChatGPT", "Claude"], tags: ["tiktok", "reels", "shorts"],
    creatorId: "c3", cover: g[2],
    body: "You are a short-form video strategist...",
    examples: [{ input: "Niche: personal finance for Gen Z", output: "20 hooks across curiosity, contrarian, story, and stat angles." }],
    instructions: ["Define your niche & voice", "Paste prompt", "Pick the best 5", "Record back-to-back"],
  },
  {
    id: "p4", slug: "study-anything-in-half-the-time", title: "Study Anything in Half the Time",
    outcome: "Actually remember what you read",
    description: "Turn any textbook chapter, lecture, or PDF into a Feynman-style explainer, flashcards, and a spaced-repetition plan.",
    category: "study", price: 0, rating: 4.9, reviews: 2210, uses: 78900, beginner: true,
    tools: ["ChatGPT", "Claude", "Gemini"], tags: ["flashcards", "exam prep", "memory"],
    creatorId: "c4", cover: g[3],
    body: "Act as a master tutor using the Feynman technique...",
    examples: [{ input: "Chapter 7 of an Econ textbook", output: "Plain-English explainer, 25 flashcards, 7-day SRS plan." }],
    instructions: ["Paste the prompt", "Drop in your material", "Practice the flashcards daily"],
  },
  {
    id: "p5", slug: "30-day-launch-campaign", title: "30-Day Launch Campaign",
    outcome: "A complete go-to-market plan",
    description: "Generate a 30-day launch calendar with channels, copy, and metrics — based on your product and audience.",
    category: "marketing", price: 19, rating: 4.7, reviews: 312, uses: 9020, beginner: false,
    tools: ["ChatGPT", "Claude"], tags: ["launch", "gtm", "campaign"],
    creatorId: "c2", cover: g[4],
    body: "You are a launch strategist...",
    examples: [{ input: "B2B SaaS for design teams", output: "Day-by-day calendar, channel mix, copy templates, KPIs." }],
    instructions: ["Describe your product", "Define your ICP", "Paste the prompt", "Adapt the calendar"],
  },
  {
    id: "p6", slug: "validate-your-startup-idea", title: "Validate Your Startup Idea",
    outcome: "Know if it's worth building",
    description: "A structured validation interview that pressure-tests your idea, finds your riskiest assumption, and designs the cheapest test.",
    category: "startup", price: 0, rating: 4.8, reviews: 540, uses: 18030, beginner: true,
    tools: ["ChatGPT", "Claude"], tags: ["validation", "lean", "research"],
    creatorId: "c2", cover: g[5],
    body: "Act as a lean startup coach...",
    examples: [{ input: "Marketplace for tutors", output: "Top 3 risky assumptions + a 1-week test for each." }],
    instructions: ["Paste prompt", "Describe the idea in 2 sentences", "Pick the cheapest test", "Ship it this week"],
  },
  {
    id: "p7", slug: "8-week-fitness-blueprint", title: "8-Week Fitness Blueprint",
    outcome: "A plan you'll actually stick to",
    description: "A personalized 8-week training & nutrition plan based on your goal, schedule, and gear.",
    category: "fitness", price: 7, rating: 4.8, reviews: 421, uses: 14210, beginner: true,
    tools: ["ChatGPT", "Claude"], tags: ["training", "nutrition", "habits"],
    creatorId: "c4", cover: g[6],
    body: "Act as a friendly evidence-based coach...",
    examples: [{ input: "Goal: lose 5kg, 3 days/wk, dumbbells", output: "8-week plan, weekly meals, habit ladder." }],
    instructions: ["Share your goal", "List your gear", "Paste the prompt", "Track weekly check-ins"],
  },
  {
    id: "p8", slug: "perfect-trip-itinerary", title: "The Perfect Trip Itinerary",
    outcome: "A trip that feels handcrafted",
    description: "Build a day-by-day itinerary with local gems, food, and rest — tuned to your pace and budget.",
    category: "travel", price: 0, rating: 4.9, reviews: 1840, uses: 61200, beginner: true,
    tools: ["ChatGPT", "Gemini"], tags: ["itinerary", "local", "budget"],
    creatorId: "c3", cover: g[7],
    body: "Act as a local insider in [city]...",
    examples: [{ input: "5 days, Lisbon, slow pace", output: "Themed days, restaurant picks, hidden viewpoints." }],
    instructions: ["Pick your city + dates", "Set your pace", "Paste the prompt", "Adjust to taste"],
  },
  {
    id: "p9", slug: "magnetic-cold-emails", title: "Magnetic Cold Emails",
    outcome: "Get replies, not ignored",
    description: "Write short, warm cold emails that earn replies — without sounding like every other template.",
    category: "email", price: 5, rating: 4.7, reviews: 290, uses: 8800, beginner: true,
    tools: ["ChatGPT", "Claude"], tags: ["outreach", "sales", "copy"],
    creatorId: "c1", cover: g[0],
    body: "You write cold emails that feel like a friend reaching out...",
    examples: [{ input: "Pitch a podcast guest spot", output: "3-line opener, soft ask, friendly close." }],
    instructions: ["Describe recipient", "Define the ask", "Paste prompt", "A/B the openers"],
  },
  {
    id: "p10", slug: "investor-ready-pitch-deck", title: "Investor-Ready Pitch Deck",
    outcome: "A deck you're proud to send",
    description: "Outline, write, and structure a 12-slide deck that tells your story clearly — no jargon, no fluff.",
    category: "slides", price: 14, rating: 4.8, reviews: 175, uses: 4900, beginner: false,
    tools: ["ChatGPT", "Claude"], tags: ["pitch", "deck", "fundraising"],
    creatorId: "c2", cover: g[5],
    body: "You are a deck doctor...",
    examples: [{ input: "Seed-stage AI startup", output: "12-slide outline, speaker notes, headline copy." }],
    instructions: ["Paste prompt", "Share company one-liner", "Iterate slide by slide"],
  },
  {
    id: "p11", slug: "instagram-growth-engine", title: "Instagram Growth Engine",
    outcome: "Grow without burning out",
    description: "Build a 30-day Instagram content engine: 3 pillars, content series, and weekly batching workflow.",
    category: "social", price: 9, rating: 4.6, reviews: 410, uses: 12010, beginner: true,
    tools: ["ChatGPT", "Claude"], tags: ["instagram", "growth", "content"],
    creatorId: "c3", cover: g[2],
    body: "Act as a social media strategist...",
    examples: [{ input: "Niche: minimalist home", output: "3 pillars, 12 series ideas, batch workflow." }],
    instructions: ["Define niche & voice", "Paste prompt", "Batch a week at a time"],
  },
  {
    id: "p12", slug: "learn-any-skill-roadmap", title: "Learn Any Skill — Roadmap",
    outcome: "From curious to capable",
    description: "Get a structured roadmap to learn any skill in 90 days with weekly milestones and real projects.",
    category: "skills", price: 0, rating: 4.9, reviews: 1620, uses: 44210, beginner: true,
    tools: ["ChatGPT", "Claude", "Gemini"], tags: ["learning", "roadmap", "projects"],
    creatorId: "c4", cover: g[1],
    body: "Act as a master mentor in [skill]...",
    examples: [{ input: "Skill: UI design", output: "12-week roadmap, weekly mini-projects, portfolio plan." }],
    instructions: ["Pick the skill", "Paste prompt", "Commit to weekly milestones"],
  },
];

export const reviews = [
  { id: "r1", promptId: "p1", author: "Jamie L.", avatar: "JL", rating: 5, body: "Got 3 interviews in 2 weeks. The cover letter literally sounded like me.", date: "2 weeks ago" },
  { id: "r2", promptId: "p1", author: "Priya S.", avatar: "PS", rating: 5, body: "Finally a resume I'm proud of. Simple, clear, real.", date: "1 month ago" },
  { id: "r3", promptId: "p1", author: "Andre K.", avatar: "AK", rating: 4, body: "Great structure. Took a couple tries to dial in my voice.", date: "1 month ago" },
];

export function getPrompt(slug: string) {
  return prompts.find(p => p.slug === slug);
}
export function getCreator(id: string) {
  return creators.find(c => c.id === id);
}
export function getCategory(slug: string) {
  return categories.find(c => c.slug === slug);
}
