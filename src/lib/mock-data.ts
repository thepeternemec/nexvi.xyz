export type Category = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  gradient: string;
};

export const categories: Category[] = [
  { slug: "cv", name: "CV & Resume", emoji: "📄", description: "Tailored, ATS-friendly CVs for any role", gradient: "from-violet-500/20 to-fuchsia-500/20" },
  { slug: "cover-letter", name: "Cover Letters", emoji: "✉️", description: "Personalized letters that sound like you", gradient: "from-amber-400/20 to-orange-500/20" },
  { slug: "ats", name: "ATS Optimization", emoji: "🎯", description: "Beat the bots with keyword-perfect rewrites", gradient: "from-emerald-400/20 to-teal-500/20" },
  { slug: "interview", name: "Interview Prep", emoji: "🎤", description: "STAR answers, mock Qs, salary scripts", gradient: "from-rose-400/20 to-pink-500/20" },
  { slug: "linkedin", name: "LinkedIn", emoji: "💼", description: "Headlines, summaries, content that lands recruiters", gradient: "from-sky-400/20 to-indigo-500/20" },
  { slug: "outreach", name: "Recruiter Outreach", emoji: "📨", description: "Cold messages and follow-ups that get replies", gradient: "from-yellow-400/20 to-amber-500/20" },
  { slug: "career-change", name: "Career Change", emoji: "🔄", description: "Reposition skills for a new industry or role", gradient: "from-purple-500/20 to-indigo-500/20" },
  { slug: "negotiation", name: "Offer & Negotiation", emoji: "💰", description: "Counter-offers, comp research, leverage scripts", gradient: "from-lime-400/20 to-emerald-500/20" },
  { slug: "portfolio", name: "Portfolio & Case Studies", emoji: "🗂️", description: "Story-driven case studies and portfolio copy", gradient: "from-cyan-400/20 to-sky-500/20" },
  { slug: "networking", name: "Networking", emoji: "🤝", description: "Intros, coffee chats, referral asks", gradient: "from-fuchsia-500/20 to-rose-500/20" },
  { slug: "personal-brand", name: "Personal Brand", emoji: "✨", description: "Bio, About page, narrative arc", gradient: "from-pink-400/20 to-rose-500/20" },
  { slug: "grad", name: "Students & Grads", emoji: "🎓", description: "First-CV, internships, no-experience moves", gradient: "from-indigo-400/20 to-violet-500/20" },
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
  { id: "c1", name: "Maya Chen", handle: "@mayahires", bio: "Career coach. Helped 10k+ land interviews at FAANG, Stripe & Linear.", avatar: "MC", followers: 24800, prompts: 42, verified: true },
  { id: "c2", name: "Leo Park", handle: "@leorecruits", bio: "Ex-Google recruiter. ATS, resumes, salary negotiation.", avatar: "LP", followers: 18200, prompts: 31, verified: true },
  { id: "c3", name: "Sofia Reyes", handle: "@sofiawrites", bio: "Cover letter ghostwriter for senior PMs & designers.", avatar: "SR", followers: 31500, prompts: 58, verified: true },
  { id: "c4", name: "Dr. Amelia Vance", handle: "@drvance", bio: "Interview psychologist. STAR stories that stick.", avatar: "AV", followers: 12700, prompts: 27, verified: true },
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
  pack?: string; // prompt pack slug
};

export type Pack = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
};

export const packs: Pack[] = [
  { slug: "jd-alignment", name: "JD Alignment Pack", emoji: "🎯", description: "Match your CV line-by-line to any job description" },
  { slug: "cover-letter-lab", name: "Cover Letter Lab", emoji: "✉️", description: "Cover letters, follow-ups and thank-you notes that land" },
  { slug: "ats-audit", name: "ATS Audit Pack", emoji: "🤖", description: "Scores, keyword gaps and parser-safe rewrites" },
  { slug: "interview-sprint", name: "Interview Sprint", emoji: "🎤", description: "Stories, mock questions and closing scripts" },
  { slug: "career-switch", name: "Career Switch Kit", emoji: "🔄", description: "Reposition your experience for a new industry" },
];

const g = [
  // Interview prep — deep indigo dusk
  "from-indigo-900 via-slate-800 to-slate-950 dark:from-indigo-950 dark:via-slate-900 dark:to-black",
  // Salary negotiation — emerald money
  "from-emerald-800 via-teal-900 to-slate-900 dark:from-emerald-950 dark:via-teal-950 dark:to-black",
  // CV / resume — warm graphite
  "from-stone-700 via-neutral-800 to-zinc-900 dark:from-stone-900 dark:via-neutral-900 dark:to-black",
  // Cover letters — burgundy ink
  "from-rose-900 via-rose-950 to-slate-900 dark:from-rose-950 dark:via-neutral-950 dark:to-black",
  // Networking — twilight blue
  "from-sky-900 via-blue-950 to-slate-950 dark:from-sky-950 dark:via-blue-950 dark:to-black",
  // ATS optimization — brass on graphite
  "from-amber-800 via-stone-800 to-zinc-950 dark:from-amber-900 dark:via-stone-900 dark:to-black",
  // Career pivot — violet horizon
  "from-violet-900 via-purple-950 to-slate-950 dark:from-violet-950 dark:via-purple-950 dark:to-black",
  // Personal branding — moss & ink
  "from-teal-900 via-emerald-950 to-neutral-950 dark:from-teal-950 dark:via-emerald-950 dark:to-black",
];


export const prompts: Prompt[] = [
  {
    id: "p1", pack: "jd-alignment", slug: "tailored-cv-for-any-job-description", title: "Tailored CV for Any Job Description",
    outcome: "An ATS-ready CV in under 60 seconds",
    description: "Paste the JD and your background. Get a rewritten CV with outcome-driven bullets, keyword coverage, and a clean ATS-safe structure.",
    category: "cv", price: 0, rating: 4.9, reviews: 1840, uses: 78310, beginner: true,
    tools: ["ChatGPT", "Claude"], tags: ["resume", "ats", "tailoring"],
    creatorId: "c1", cover: g[0],
    body: "You are a senior career coach and ex-recruiter.\n\nGiven the job description below and the candidate's background, rewrite their CV with:\n1. A 3-line summary mirroring the JD's top keywords.\n2. 5-7 bullets per role using the formula: action verb + scope + measurable outcome.\n3. A skills section that mirrors the exact phrasing from the JD (no buzzword inflation).\n4. ATS-safe formatting: no tables, no graphics, single-column.\n\nJob description: <PASTE JD>\nCandidate background: <PASTE CV / NOTES>",
    examples: [{ input: "Senior PM, fintech, 5y", output: "Tailored summary + 6 quantified bullets per role + JD-aligned skills section." }],
    instructions: ["Open ChatGPT or Claude", "Paste the prompt", "Paste the job description, then your background", "Iterate one bullet at a time until it sounds like you"],
  },
  {
    id: "p2", pack: "cover-letter-lab", slug: "personalized-cover-letter-that-sounds-human", title: "Cover Letter That Sounds Human",
    outcome: "A cover letter recruiters actually read",
    description: "Generate a one-page cover letter that connects your story to the company's mission — without sounding like a template.",
    category: "cover-letter", price: 0, rating: 4.8, reviews: 1290, uses: 42400, beginner: true,
    tools: ["ChatGPT", "Claude", "Gemini"], tags: ["cover letter", "story", "warm"],
    creatorId: "c3", cover: g[1],
    body: "Act as a senior cover letter writer.\n\nWrite a 3-paragraph letter (max 280 words):\n1. Opening hook tied to something specific about the company.\n2. Why I'm a fit — 2 concrete proof points from my background that map to the JD.\n3. A confident close with a clear next-step.\n\nTone: warm, specific, no corporate cliches. No 'I am writing to apply for'.\n\nJD: <PASTE>\nMy background: <PASTE>",
    examples: [{ input: "Designer applying to Linear", output: "3-paragraph letter, opens with a Linear product detail, ends with a clear ask." }],
    instructions: ["Copy the prompt", "Paste the JD and your CV", "Pick the tone (warm / formal / direct)", "Iterate until the hook feels like you"],
  },
  {
    id: "p3", pack: "ats-audit", slug: "ats-keyword-gap-analyzer", title: "ATS Keyword Gap Analyzer",
    outcome: "See exactly which keywords you're missing",
    description: "Compares your CV against the JD and returns a match score, the keywords you have, the ones you're missing, and concrete rewrites.",
    category: "ats", price: 4, rating: 4.9, reviews: 980, uses: 34020, beginner: false,
    tools: ["ChatGPT", "Claude"], tags: ["ats", "keywords", "score"],
    creatorId: "c2", cover: g[2],
    body: "You are a strict ATS analyzer. Compare the candidate's CV to the JD and return:\n- match_score: 0-100\n- matched_keywords: array\n- missing_keywords: array (hard skills, tools, certifications)\n- rewrite_suggestions: 5 concrete bullet-level rewrites that naturally fold in the missing keywords without lying.\n\nJD: <PASTE>\nCV: <PASTE>",
    examples: [{ input: "Data Analyst JD vs my CV", output: "Score 71/100. Missing: SQL, dbt, Looker. 5 bullet rewrites." }],
    instructions: ["Open Claude or ChatGPT", "Paste prompt + JD + CV", "Apply the rewrites", "Re-run until score ≥ 85"],
  },
  {
    id: "p4", pack: "interview-sprint", slug: "star-method-interview-stories", title: "STAR Interview Stories from Your CV",
    outcome: "10 polished stories you can reuse in any interview",
    description: "Pulls 10 STAR-formatted stories from your resume — covering leadership, conflict, failure, ambiguity, and impact.",
    category: "interview", price: 0, rating: 4.9, reviews: 2210, uses: 58900, beginner: true,
    tools: ["ChatGPT", "Claude", "Gemini"], tags: ["star", "behavioral", "stories"],
    creatorId: "c4", cover: g[3],
    body: "Act as an interview coach. From the CV below, draft 10 STAR stories covering: leadership, conflict, failure, ambiguity, cross-functional influence, customer obsession, prioritization, mentoring, technical depth, business impact.\n\nFor each: 1 line situation, 1 line task, 3-4 line action, 1 line measurable result.\n\nCV: <PASTE>",
    examples: [{ input: "Senior engineer CV", output: "10 STAR stories, each ≤ 90 seconds when spoken." }],
    instructions: ["Paste your CV", "Pick the 5 strongest stories", "Practice each out loud, time them", "Map them to common behavioral Qs"],
  },
  {
    id: "p5", slug: "linkedin-headline-and-about-rewrite", title: "LinkedIn Headline & About Rewrite",
    outcome: "Recruiters reach out instead of you",
    description: "Rewrites your LinkedIn headline and About section to surface in recruiter searches and convert profile views into messages.",
    category: "linkedin", price: 4, rating: 4.7, reviews: 612, uses: 19020, beginner: true,
    tools: ["ChatGPT", "Claude"], tags: ["linkedin", "headline", "inbound"],
    creatorId: "c1", cover: g[4],
    body: "Rewrite my LinkedIn headline (max 220 chars) and About (max 2000 chars) to:\n- Lead with the role I want next, not the role I have.\n- Stack 3-4 search keywords recruiters in <target industry> actually filter for.\n- Open the About with a 1-line hook, then 3 short paragraphs (story / proof / what I'm looking for).\n\nCurrent profile: <PASTE>\nTarget role: <ROLE>",
    examples: [{ input: "Engineer → AI PM transition", output: "Keyword-stacked headline + 3-paragraph About with clear ask." }],
    instructions: ["Paste your current profile", "State your target role", "Paste output into LinkedIn", "Turn on Open to Work (recruiters only)"],
  },
  {
    id: "p6", slug: "recruiter-cold-message-that-gets-replies", title: "Recruiter Cold Message That Gets Replies",
    outcome: "Get on a recruiter's screen the same week",
    description: "A 3-line cold message template you can send to any recruiter or hiring manager on LinkedIn — designed to get a reply in <48h.",
    category: "outreach", price: 0, rating: 4.8, reviews: 540, uses: 22030, beginner: true,
    tools: ["ChatGPT", "Claude"], tags: ["cold message", "linkedin", "recruiter"],
    creatorId: "c2", cover: g[5],
    body: "Write a 3-sentence LinkedIn message to a recruiter for a specific role:\n1. Specific reason I'm reaching out (mention the role + something specific about the company).\n2. One proof point from my background that maps to the JD.\n3. A small, low-friction ask (15-min chat / pass my CV along).\n\nMax 600 chars. No 'I hope this finds you well'.\n\nRecruiter / company: <X>\nRole: <Y>\nMy background: <Z>",
    examples: [{ input: "Outreach to Stripe recruiter for Senior PM", output: "3-sentence DM, 480 chars, ends with 15-min ask." }],
    instructions: ["Paste prompt", "Add the recruiter, role, and your 1-line pitch", "Send within 24h of seeing the role", "Follow up once after 5 business days"],
  },
  {
    id: "p7", pack: "career-switch", slug: "career-change-positioning-narrative", title: "Career Change Positioning Narrative",
    outcome: "Sound like you belong in the new industry",
    description: "Builds a 90-second pitch that reframes your past experience for a new role, plus 5 CV bullets translated into the new industry's language.",
    category: "career-change", price: 7, rating: 4.8, reviews: 421, uses: 14210, beginner: false,
    tools: ["ChatGPT", "Claude"], tags: ["pivot", "narrative", "positioning"],
    creatorId: "c1", cover: g[6],
    body: "I'm pivoting from <old role> to <new role>. Build:\n1. A 90-second 'why this pivot' narrative (3 beats: where I came from, what I learned, why <new role> is the logical next step).\n2. 5 CV bullets from my past roles re-translated into <new industry> vocabulary.\n3. The top 3 objections an interviewer will raise and a 2-sentence answer to each.\n\nBackground: <PASTE>",
    examples: [{ input: "Teacher → Product Manager", output: "90s pitch + 5 translated bullets + 3 objection answers." }],
    instructions: ["State both roles clearly", "Paste your background", "Practice the 90s pitch out loud", "Rehearse the 3 objections"],
  },
  {
    id: "p8", slug: "salary-negotiation-counter-offer-script", title: "Salary Negotiation & Counter-Offer Script",
    outcome: "Walk away with 10-25% more comp",
    description: "Generates a calm, data-backed counter-offer script — base, equity, sign-on, and the email that goes with it.",
    category: "negotiation", price: 9, rating: 4.9, reviews: 612, uses: 18800, beginner: false,
    tools: ["ChatGPT", "Claude"], tags: ["negotiation", "comp", "counter-offer"],
    creatorId: "c2", cover: g[7],
    body: "You are a senior compensation negotiator. Given the offer and my target, produce:\n1. A counter-offer with specific numbers for base / equity / sign-on.\n2. The 3-sentence email I send the recruiter (calm, grateful, anchored to market data).\n3. The verbal script for the follow-up call, including how to handle 'this is our best offer'.\n\nOffer: <PASTE>\nTarget: <NUMBER>\nLeverage: <competing offer / not yet>",
    examples: [{ input: "Offer $180k base, target $210k", output: "Counter-offer + email + 5-line phone script." }],
    instructions: ["Paste the offer breakdown", "State your target & any leverage", "Send the email, then schedule the call", "Stay quiet after the ask"],
  },
  {
    id: "p9", slug: "case-study-from-a-resume-bullet", title: "Case Study from a Resume Bullet",
    outcome: "A portfolio piece from work you've already done",
    description: "Turns one resume bullet into a structured case study — context, problem, approach, result, learnings — ready for your portfolio.",
    category: "portfolio", price: 5, rating: 4.7, reviews: 290, uses: 8800, beginner: true,
    tools: ["ChatGPT", "Claude"], tags: ["portfolio", "case study", "design"],
    creatorId: "c3", cover: g[0],
    body: "Turn the resume bullet below into a 600-800 word case study with these sections: Context, Problem, Constraints, Approach, Result (quantified), Learnings.\n\nWrite in first person, past tense, no jargon. End with a 1-line takeaway.\n\nBullet: <PASTE>\nExtra context: <OPTIONAL>",
    examples: [{ input: "'Redesigned onboarding, +18% activation'", output: "750-word case study with all 6 sections." }],
    instructions: ["Pick your strongest bullet", "Add 2-3 sentences of context", "Run the prompt", "Drop into Notion / your portfolio"],
  },
  {
    id: "p10", slug: "warm-intro-and-referral-request", title: "Warm Intro & Referral Request",
    outcome: "Get referred without feeling awkward",
    description: "Drafts the message you send to a former colleague to ask for a referral — short, specific, easy for them to say yes to.",
    category: "networking", price: 0, rating: 4.8, reviews: 410, uses: 15010, beginner: true,
    tools: ["ChatGPT", "Claude"], tags: ["referral", "intro", "network"],
    creatorId: "c1", cover: g[5],
    body: "Write a 4-line message asking <person> for a referral to <company> for the <role> position:\n1. Reconnect briefly (1 specific shared memory).\n2. Why this role / company specifically.\n3. The ask: would you be open to passing my CV to <hiring manager / recruiter>?\n4. Make it easy: I've attached the JD and a 3-line blurb you can copy.\n\nContext: <relationship + role + company>",
    examples: [{ input: "Ex-coworker now at Notion, applying for PM", output: "4-line DM + a forwardable blurb." }],
    instructions: ["Pick 5 people from your network", "Personalize the shared memory line", "Attach the JD + your CV", "Follow up once after a week"],
  },
  {
    id: "p11", slug: "personal-brand-bio-and-about-page", title: "Personal Brand Bio & About Page",
    outcome: "A bio that works on LinkedIn, X, and your site",
    description: "Generates a 3-tier bio (50, 100, 250 words) plus a full About page — consistent voice, clear narrative, no cringe.",
    category: "personal-brand", price: 5, rating: 4.6, reviews: 320, uses: 9010, beginner: true,
    tools: ["ChatGPT", "Claude"], tags: ["bio", "about", "brand"],
    creatorId: "c3", cover: g[2],
    body: "Write me a bio in 3 lengths (50w / 100w / 250w) and a 600-word About page.\n\nVoice: <warm / direct / playful>. Anchor every version around: what I do, who I help, why it matters. No clichés ('passionate', 'results-driven', 'team player').\n\nBackground: <PASTE>",
    examples: [{ input: "Independent ML consultant", output: "Tiered bio + About page in a single voice." }],
    instructions: ["Pick your voice", "Paste your background", "Use the 100w version on LinkedIn About header", "Put the 600w version on your site"],
  },
  {
    id: "p12", pack: "jd-alignment", slug: "first-cv-with-no-experience", title: "First CV With No Experience",
    outcome: "A one-page CV recruiters take seriously",
    description: "Structured prompt for students and grads — turns coursework, side-projects, and volunteer work into a credible first CV.",
    category: "grad", price: 0, rating: 4.9, reviews: 1620, uses: 44210, beginner: true,
    tools: ["ChatGPT", "Claude", "Gemini"], tags: ["student", "grad", "internship"],
    creatorId: "c4", cover: g[1],
    body: "I'm a student / recent grad with no formal work experience. Build a one-page CV with these sections in this order: Summary (3 lines), Education, Projects (3, with outcomes), Coursework + Skills, Volunteer / Leadership, Languages.\n\nFor each project, write 3 bullets in the format: action + tool + outcome. No fluff.\n\nBackground: <PASTE major + projects + volunteering>",
    examples: [{ input: "CS undergrad, 2 side projects, club lead", output: "One-page CV, projects in outcome-bullet format." }],
    instructions: ["List every project and club role", "Run the prompt", "Save as PDF, single column", "Tailor per application with prompt #1"],
  },
];

export const reviews = [
  { id: "r1", promptId: "p1", author: "Jamie L.", avatar: "JL", rating: 5, body: "3 interviews in 2 weeks after using this. The bullets finally sound like real impact.", date: "2 weeks ago" },
  { id: "r2", promptId: "p1", author: "Priya S.", avatar: "PS", rating: 5, body: "Got me past the ATS for the first time in months. Worth every minute.", date: "1 month ago" },
  { id: "r3", promptId: "p1", author: "Andre K.", avatar: "AK", rating: 4, body: "Great structure. Took a couple iterations to dial in my voice but very useful.", date: "1 month ago" },
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
