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
  { slug: "humanizer", name: "Humanizer prompts", emoji: "🧑‍🎨", description: "Make AI-generated text sound natural, personal, and human", gradient: "from-amber-400/20 to-rose-500/20" },
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
  { slug: "cover-letter-lab", name: "Cover Letter Lab", emoji: "✉️", description: "Cover letters that land — for every application box" },
  { slug: "ats-audit", name: "ATS Audit Pack", emoji: "🤖", description: "Scores, keyword gaps and parser-safe rewrites" },
  { slug: "interview-sprint", name: "Interview Sprint", emoji: "🎤", description: "Stories, mock questions and offer negotiation scripts" },
  { slug: "career-switch", name: "Career Switch Kit", emoji: "🔄", description: "Reposition your experience for a new industry" },
  { slug: "outreach-referrals", name: "Outreach & Referrals", emoji: "🤝", description: "Recruiter messages, follow-ups and warm intros" },
  { slug: "profile-brand", name: "Profile & Personal Brand", emoji: "💼", description: "LinkedIn, portfolio and personal brand positioning" },
  { slug: "humanizer", name: "Humanizer Pack", emoji: "🧑‍🎨", description: "Turn robotic text into warm, natural, human-sounding copy" },
];

// Every prompt belongs to the pack that matches its category, so pack filters
// and category always agree.
const packByCategory: Record<string, string> = {
  cv: "jd-alignment",
  grad: "jd-alignment",
  "cover-letter": "cover-letter-lab",
  ats: "ats-audit",
  interview: "interview-sprint",
  negotiation: "interview-sprint",
  "career-change": "career-switch",
  outreach: "outreach-referrals",
  networking: "outreach-referrals",
  linkedin: "profile-brand",
  portfolio: "profile-brand",
  "personal-brand": "profile-brand",
  humanizer: "humanizer",
};


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
  // Humanizer — warm amber creative glow
  "from-amber-700 via-rose-900 to-neutral-950 dark:from-amber-900 dark:via-rose-950 dark:to-black",
];


const rawPrompts: Prompt[] = [
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
  {
    id: "p13", pack: "jd-alignment", slug: "jd-to-cv-line-by-line-alignment", title: "JD → CV Line-by-Line Alignment Matrix",
    outcome: "A requirement-by-requirement match table for your CV",
    description: "Claude reads the job description, extracts every stated and implied requirement, then maps each one to evidence in your CV — flagging gaps and drafting the missing bullets.",
    category: "cv", price: 0, rating: 4.9, reviews: 740, uses: 21400, beginner: true,
    tools: ["Claude", "ChatGPT"], tags: ["job description", "alignment", "matrix", "cv"],
    creatorId: "c2", cover: g[2],
    body: "You are a hiring manager who screens 200 CVs a week.\n\nStep 1 — Extract every requirement from the job description into a table: requirement | type (must-have / nice-to-have / implied) | exact phrasing used.\nStep 2 — For each requirement, quote the strongest evidence from my CV. If none exists, write MISSING.\nStep 3 — For each MISSING or WEAK row, draft one honest CV bullet I could add based on my real experience (ask me a clarifying question if you need facts).\nStep 4 — Give an overall alignment score /100 and the 3 changes with the biggest impact.\n\nJob description: <PASTE JD>\nMy CV: <PASTE CV>",
    examples: [{ input: "Senior Backend Engineer JD + 4-page CV", output: "18-row alignment table, 5 MISSING rows, 5 drafted bullets, score 68 → plan to 88." }],
    instructions: ["Paste the full JD (not the summary)", "Paste your complete CV", "Answer Claude's clarifying questions honestly", "Apply the top 3 changes first, then re-run"],
  },
  {
    id: "p14", pack: "jd-alignment", slug: "decode-the-hidden-requirements-in-a-job-ad", title: "Decode the Hidden Requirements in a Job Ad",
    outcome: "Know what they actually want before you apply",
    description: "Reads between the lines of a job ad — seniority signals, team pain points, the real must-haves vs filler — so you tailor to the job behind the job description.",
    category: "ats", price: 0, rating: 4.8, reviews: 520, uses: 16800, beginner: true,
    tools: ["Claude", "ChatGPT"], tags: ["job description", "research", "strategy"],
    creatorId: "c1", cover: g[5],
    body: "Analyse this job ad like a recruiter who wrote it.\n\nReturn:\n1. The real problem this hire is meant to solve (1 paragraph).\n2. Must-haves vs nice-to-haves vs boilerplate — three lists, with the evidence phrase for each.\n3. Seniority signals: what level are they truly hiring at, and why.\n4. The 5 keywords a screener will search for.\n5. Three things I should emphasise in my CV, and two I should cut.\n6. Two smart questions to ask them in the interview.\n\nJob ad: <PASTE>",
    examples: [{ input: "Growth Marketer job ad", output: "Hidden brief: fix paid CAC. 5 keywords, 3 emphasis points, 2 interview questions." }],
    instructions: ["Paste the full ad including 'about us'", "Note the 5 keywords", "Feed them into the CV alignment prompt", "Save the interview questions"],
  },
  {
    id: "p15", pack: "jd-alignment", slug: "rewrite-cv-bullets-with-jd-language", title: "Rewrite CV Bullets in the JD's Own Language",
    outcome: "Bullets that mirror the ad without lying",
    description: "Takes your existing bullets and rewrites each one using the employer's exact vocabulary, keeping every claim true and adding measurable outcomes.",
    category: "cv", price: 4, rating: 4.8, reviews: 460, uses: 13900, beginner: true,
    tools: ["Claude", "ChatGPT"], tags: ["bullets", "keywords", "rewrite"],
    creatorId: "c1", cover: g[0],
    body: "Rewrite each of my CV bullets so it uses the job description's terminology while staying 100% factually true.\n\nRules:\n- Formula: strong verb + scope + method/tool + measurable outcome.\n- Reuse the JD's exact nouns for tools, methods and metrics where they genuinely apply.\n- Never invent numbers. If a metric is missing, mark it [ADD METRIC] and tell me what to look up.\n- Max 2 lines per bullet.\n\nOutput a two-column list: Original → Rewritten, then a short note on which JD keywords are now covered.\n\nJD: <PASTE>\nMy bullets: <PASTE>",
    examples: [{ input: "12 bullets + Data Engineer JD", output: "12 rewritten bullets, 9 JD keywords covered, 3 [ADD METRIC] flags." }],
    instructions: ["Paste the JD, then your bullets", "Fill in the [ADD METRIC] flags", "Re-run for a second pass", "Keep the originals for other applications"],
  },
  {
    id: "p16", pack: "cover-letter-lab", slug: "jd-anchored-cover-letter-with-claude", title: "JD-Anchored Cover Letter (Claude)",
    outcome: "A letter built from the JD's top three priorities",
    description: "Claude picks the three priorities the employer cares about most, then writes a 250-word letter where each paragraph proves one of them with evidence from your CV.",
    category: "cover-letter", price: 0, rating: 4.9, reviews: 880, uses: 26700, beginner: true,
    tools: ["Claude", "ChatGPT"], tags: ["cover letter", "job description", "evidence"],
    creatorId: "c3", cover: g[3],
    body: "Act as a cover letter writer who only makes evidence-backed claims.\n\nStep 1 — From the JD, name the employer's top 3 priorities for this hire, in their words.\nStep 2 — For each priority, pick the single strongest proof point from my CV.\nStep 3 — Write a 250-word letter: hook tied to the company (specific, not flattery), one short paragraph per priority with its proof point, then a confident one-line close with a next step.\n\nBanned: 'I am writing to apply', 'passionate', 'team player', 'fast-paced environment'.\nTone: <warm / direct / formal>.\n\nJD: <PASTE>\nMy CV: <PASTE>",
    examples: [{ input: "Product Designer at a fintech", output: "3 priorities identified, 248-word letter with one proof point each." }],
    instructions: ["Paste JD then CV", "Check the 3 priorities look right before accepting the letter", "Ask for a shorter or blunter variant", "Read it aloud before sending"],
  },
  {
    id: "p17", pack: "cover-letter-lab", slug: "cover-letter-variants-ab-test", title: "Three Cover Letter Variants to A/B Test",
    outcome: "Three angles on the same role — pick the one that fits",
    description: "Generates a story-led, a metrics-led and a problem-solving-led version of your cover letter for the same job, plus guidance on which to send where.",
    category: "cover-letter", price: 4, rating: 4.7, reviews: 310, uses: 9600, beginner: false,
    tools: ["Claude", "ChatGPT"], tags: ["cover letter", "variants", "testing"],
    creatorId: "c3", cover: g[1],
    body: "Write three distinct cover letters (max 250 words each) for the same role:\nA) Story-led — opens with a specific moment from my career.\nB) Metrics-led — opens with my single most impressive quantified result.\nC) Problem-led — opens by naming the problem the company is likely hiring to solve, then how I have solved it before.\n\nAfter the three, add a short table: variant | best for (company type / culture) | main risk.\n\nJD: <PASTE>\nMy CV: <PASTE>",
    examples: [{ input: "Ops Manager role at a scale-up", output: "3 letters + a table recommending the problem-led version." }],
    instructions: ["Paste JD and CV", "Pick the variant matching the company culture", "Reuse the other openings for outreach DMs", "Track which variant gets replies"],
  },
  {
    id: "p18", pack: "cover-letter-lab", slug: "post-interview-thank-you-and-follow-up", title: "Post-Interview Thank-You & Follow-Up Sequence",
    outcome: "Stay top of mind without being annoying",
    description: "A same-day thank-you note, a one-week nudge and a polite final follow-up — each referencing something concrete from your interview.",
    category: "outreach", price: 0, rating: 4.8, reviews: 380, uses: 12100, beginner: true,
    tools: ["Claude", "ChatGPT"], tags: ["follow-up", "thank you", "interview"],
    creatorId: "c2", cover: g[4],
    body: "Write a three-message follow-up sequence after my interview:\n1. Same-day thank-you (max 120 words): reference one specific thing discussed, add one short idea or resource that shows thinking.\n2. Day-7 nudge (max 70 words): warm, no pressure, restate fit in one line.\n3. Day-14 close (max 60 words): ask for a decision or a clear timeline, leave the door open.\n\nTone: confident, human, zero grovelling.\n\nRole & company: <X>\nInterviewer: <NAME / ROLE>\nWhat we discussed: <NOTES>",
    examples: [{ input: "Final round, Head of Data role", output: "3 timed messages, each referencing the pipeline discussion." }],
    instructions: ["Write your interview notes right after the call", "Send message 1 within 12 hours", "Schedule messages 2 and 3", "Stop after the third"],
  },
  {
    id: "p23", pack: "cover-letter-lab", slug: "cover-letter-from-scratch-no-cv-needed", title: "Cover Letter From Scratch (No CV Needed)",
    outcome: "A full letter built from a five-question interview",
    description: "The model interviews you with five short questions, then writes a complete, specific cover letter — ideal when your CV is out of date or you're applying to your first role.",
    category: "cover-letter", price: 0, rating: 4.8, reviews: 260, uses: 8400, beginner: true,
    tools: ["Claude", "ChatGPT"], tags: ["cover letter", "beginner", "interview"],
    creatorId: "c3", cover: g[3],
    body: "You are a cover letter coach. Do NOT write anything yet.\n\nStep 1 — Ask me exactly 5 questions, one at a time, to gather: my strongest relevant result, why this company, a moment that shows how I work, a gap or risk the employer might see, and the tone I want.\nStep 2 — After my answers, write a 250-word cover letter using only what I told you. No invented facts.\nStep 3 — List any weak sentences and offer a stronger alternative for each.\n\nRole & company: <X>\nJD: <PASTE>",
    examples: [{ input: "Graduate marketing role", output: "5 questions, then a 240-word letter plus 4 suggested upgrades." }],
    instructions: ["Answer the questions honestly and briefly", "Ask for a second draft if it sounds generic", "Swap in the stronger alternatives", "Save your answers to reuse next time"],
  },
  {
    id: "p24", pack: "cover-letter-lab", slug: "cover-letter-tone-matcher-company-voice", title: "Company Voice Tone Matcher",
    outcome: "A letter that sounds like it belongs at that company",
    description: "Analyses the company's careers page, JD wording and public copy, then rewrites your letter to match their voice without losing your own.",
    category: "cover-letter", price: 4, rating: 4.7, reviews: 190, uses: 6200, beginner: false,
    tools: ["Claude", "ChatGPT"], tags: ["cover letter", "tone", "branding"],
    creatorId: "c3", cover: g[7],
    body: "Step 1 — From the company text I paste, describe their voice in 5 attributes (formality, warmth, jargon level, sentence length, use of humour) with a one-line quote as evidence for each.\nStep 2 — Rewrite my cover letter to match that voice while keeping every fact identical.\nStep 3 — Show a before/after of the three sentences that changed most and explain why.\n\nDo not copy their marketing clichés verbatim.\n\nCompany copy (careers page / JD / about): <PASTE>\nMy current letter: <PASTE>",
    examples: [{ input: "Playful DTC brand + a formal letter", output: "Voice profile + rewritten letter, 3 before/after sentences." }],
    instructions: ["Grab 200-400 words from their careers or about page", "Paste your existing letter", "Reject changes that overshoot into gimmick", "Keep facts unchanged"],
  },
  {
    id: "p25", pack: "cover-letter-lab", slug: "career-gap-and-red-flag-paragraph", title: "Career Gap & Red Flag Paragraph",
    outcome: "Address the awkward bit in two calm sentences",
    description: "Turns a gap, layoff, short tenure or career change into a short, confident paragraph that removes doubt instead of drawing attention to it.",
    category: "cover-letter", price: 0, rating: 4.9, reviews: 340, uses: 10400, beginner: true,
    tools: ["Claude", "ChatGPT"], tags: ["cover letter", "career gap", "confidence"],
    creatorId: "c1", cover: g[3],
    body: "Write 3 alternative paragraphs (max 45 words each) that address this concern in my application without apologising or over-explaining:\n\nConcern: <gap / layoff / short tenure / career change / relocation>\nContext (true facts only): <PASTE>\nRole & company: <X>\n\nRules:\n- Own it in one clause, pivot to value in the next.\n- No excuses, no self-pity, no over-sharing personal detail.\n- Rank the three options by how well they'd land with a cautious hiring manager and say why.",
    examples: [{ input: "14-month caregiving gap", output: "3 paragraph options, ranked, top one 38 words." }],
    instructions: ["Give only facts you're comfortable sharing", "Pick the shortest option that feels true", "Drop it into the letter's second half", "Use the same line in interviews"],
  },
  {
    id: "p26", pack: "cover-letter-lab", slug: "hiring-manager-critique-of-my-cover-letter", title: "Hiring Manager Critique of My Letter",
    outcome: "Brutal 30-second-read feedback before you send",
    description: "The model reads your letter the way a busy hiring manager does — skimming — and tells you exactly where it loses attention and what to cut.",
    category: "cover-letter", price: 4, rating: 4.8, reviews: 275, uses: 8900, beginner: false,
    tools: ["Claude", "ChatGPT"], tags: ["cover letter", "feedback", "editing"],
    creatorId: "c2", cover: g[2],
    body: "Act as a hiring manager for this role with 40 applications to read today.\n\n1. Skim my letter for 30 seconds and tell me what you actually retained.\n2. Mark the exact sentence where you'd stop reading, and why.\n3. Score /10 on: relevance to the JD, specificity, credibility, tone, length.\n4. List every sentence to cut and every claim that needs evidence.\n5. Give me one rewritten opening line that would have kept you reading.\n\nJD: <PASTE>\nMy letter: <PASTE>",
    examples: [{ input: "380-word letter for a PM role", output: "Stopped at sentence 4, scores, 6 cuts, new opening line." }],
    instructions: ["Paste the JD and your draft", "Cut everything flagged", "Rewrite using the suggested opener", "Re-run until it survives the skim"],
  },
  {
    id: "p27", pack: "cover-letter-lab", slug: "short-form-cover-letter-for-application-box", title: "150-Word Application Box Letter",
    outcome: "Fits the tiny 'why you?' text field perfectly",
    description: "A compressed version for application forms, LinkedIn Easy Apply and email bodies where nobody reads past the first screen.",
    category: "cover-letter", price: 0, rating: 4.9, reviews: 410, uses: 15200, beginner: true,
    tools: ["Claude", "ChatGPT"], tags: ["cover letter", "short form", "easy apply"],
    creatorId: "c1", cover: g[4],
    body: "Compress my cover letter into a 150-word version for an online application box.\n\nStructure:\n- Line 1: the role and the single reason I'm a strong fit.\n- Lines 2-3: two proof points with numbers.\n- Line 4: why this company specifically.\n- Line 5: one-line close with availability.\n\nNo greeting fluff, no markdown, plain text only — it must paste cleanly into a form field. Then give me a 60-word email-subject-plus-body variant.\n\nJD: <PASTE>\nMy letter or CV: <PASTE>",
    examples: [{ input: "Full 300-word letter", output: "148-word form version plus a 60-word email variant." }],
    instructions: ["Paste your long version or CV", "Check the word count before pasting", "Keep the numbers, drop the adjectives", "Save the email variant for referrals"],
  },
  {
    id: "p28", pack: "cover-letter-lab", slug: "referral-and-warm-intro-cover-note", title: "Referral & Warm Intro Cover Note",
    outcome: "A note your contact can forward without editing",
    description: "Writes both the message to your contact and the forwardable blurb about you, so a referral takes them 20 seconds instead of 20 minutes.",
    category: "outreach", price: 4, rating: 4.7, reviews: 220, uses: 7300, beginner: false,
    tools: ["Claude", "ChatGPT"], tags: ["referral", "outreach", "cover letter"],
    creatorId: "c2", cover: g[4],
    body: "Write two things:\n\nA) A message to my contact (max 90 words): remind them how we know each other, name the exact role and link, make the ask explicit and easy to decline.\nB) A forwardable blurb they can paste to the hiring manager (max 100 words), written in third person, with two concrete proof points and one line on why this company.\n\nTone: warm, low-pressure, zero guilt.\n\nMy contact & how we know each other: <X>\nRole, company & link: <X>\nMy CV: <PASTE>",
    examples: [{ input: "Ex-colleague at target company", output: "88-word ask + 96-word forwardable blurb." }],
    instructions: ["Fill in how you know the person", "Send part A, attach part B", "Follow up once after a week", "Thank them either way"],
  },

  {
    id: "p19", pack: "ats-audit", slug: "ats-parser-simulation-and-fix-list", title: "ATS Parser Simulation & Fix List",
    outcome: "See your CV the way the software sees it",
    description: "Simulates how an applicant tracking system parses your CV — section detection, dates, job titles, skills — and lists every formatting fix in priority order.",
    category: "ats", price: 5, rating: 4.8, reviews: 420, uses: 11800, beginner: false,
    tools: ["Claude", "ChatGPT"], tags: ["ats", "parsing", "formatting"],
    creatorId: "c2", cover: g[5],
    body: "Simulate an ATS parsing my CV text. Return:\n1. Parsed fields: name, contact, each role (title / company / dates), education, skills — showing anything the parser would mangle or miss.\n2. Structural risks: tables, columns, headers/footers, graphics, non-standard section names, date formats, acronyms without expansions.\n3. A prioritised fix list (highest impact first) with the exact replacement text.\n4. A cleaned, ATS-safe plain-text version of the CV.\n\nCV text: <PASTE>\nTarget role: <ROLE>",
    examples: [{ input: "Two-column designer CV", output: "6 parsing failures, 9 prioritised fixes, clean single-column rewrite." }],
    instructions: ["Copy your CV as plain text from the PDF", "Paste it exactly as copied", "Apply the fix list top-down", "Re-export as single-column PDF and re-run"],
  },
  {
    id: "p20", pack: "ats-audit", slug: "keyword-coverage-score-before-you-apply", title: "Keyword Coverage Score Before You Apply",
    outcome: "A go / no-go call in two minutes",
    description: "Scores your fit against the ad across hard skills, tools, domain and seniority — then tells you whether to apply now, tailor first, or skip it.",
    category: "ats", price: 0, rating: 4.9, reviews: 690, uses: 20400, beginner: true,
    tools: ["Claude", "ChatGPT"], tags: ["ats", "score", "keywords", "fit"],
    creatorId: "c2", cover: g[6],
    body: "Score my fit for this role. Return a table with four dimensions — hard skills, tools/tech, domain knowledge, seniority — each with score /25, matched terms, and missing terms.\n\nThen give:\n- Total /100 and a verdict: APPLY NOW / TAILOR FIRST / SKIP, with one sentence of reasoning.\n- If TAILOR FIRST: the 5 specific edits that raise the score the most, with expected new score.\n- The 3 missing items I genuinely cannot fake, and how to address them in the cover letter.\n\nJD: <PASTE>\nCV: <PASTE>",
    examples: [{ input: "Platform Engineer JD vs my CV", output: "Total 72/100 — TAILOR FIRST, 5 edits, projected 89." }],
    instructions: ["Run this before writing anything", "Only tailor for roles scoring 65+", "Apply the 5 edits", "Address the 3 real gaps in the cover letter"],
  },
  {
    id: "p21", pack: "interview-sprint", slug: "mock-interview-from-the-job-description", title: "Mock Interview Built From the Job Description",
    outcome: "The 15 questions they will actually ask",
    description: "Claude role-plays the hiring manager, generating questions derived from the JD, grading each answer against their criteria and coaching you on the weak ones.",
    category: "interview", price: 5, rating: 4.9, reviews: 560, uses: 17200, beginner: false,
    tools: ["Claude", "ChatGPT"], tags: ["mock interview", "job description", "coaching"],
    creatorId: "c4", cover: g[0],
    body: "You are the hiring manager for the role below. Run a mock interview.\n\n1. Derive 15 questions directly from the JD: 5 behavioural, 5 role-specific technical, 3 about my CV's weak spots, 2 about motivation.\n2. Ask them ONE at a time and wait for my answer.\n3. After each answer: score /5 against what this JD implies you'd look for, name the single biggest improvement, and show a stronger 60-second version.\n4. At the end: overall readiness score, my three strongest stories, and what to rehearse tonight.\n\nJD: <PASTE>\nMy CV: <PASTE>",
    examples: [{ input: "Engineering Manager JD", output: "15 tailored questions, per-answer scoring, readiness 7.5/10 with a rehearsal list." }],
    instructions: ["Paste JD and CV", "Answer out loud, then type a summary", "Do not skip the weak-spot questions", "Re-run the low-scoring questions the next day"],
  },
  {
    id: "p22", pack: "career-switch", slug: "transferable-skill-bridge-to-a-new-role", title: "Transferable Skill Bridge to a New Role",
    outcome: "Map what you have to what they want",
    description: "Builds a bridge table from your current experience to the target JD's requirements, with proof points, honest gaps and a 30-day plan to close them.",
    category: "career-change", price: 5, rating: 4.8, reviews: 260, uses: 8300, beginner: false,
    tools: ["Claude", "ChatGPT"], tags: ["pivot", "transferable", "gap plan"],
    creatorId: "c1", cover: g[7],
    body: "I want to move into the role in the JD below. Build:\n1. A bridge table: JD requirement | closest thing I have done | how to phrase it truthfully | strength (strong / partial / none).\n2. The 3 genuine gaps, ranked by how much they'd block an offer.\n3. A 30-day plan to close them (course, side project, or evidence I already have but haven't written down).\n4. A 4-sentence 'why the switch' answer I can use in interviews.\n\nJD: <PASTE>\nMy background: <PASTE>",
    examples: [{ input: "Consultant → Product Manager", output: "14-row bridge table, 3 gaps, 30-day plan, switch narrative." }],
    instructions: ["Paste the target JD and your background", "Be honest in the 'none' rows", "Start the 30-day plan this week", "Rehearse the switch narrative"],
  },
];

export const prompts: Prompt[] = rawPrompts.map(p => ({
  ...p,
  pack: packByCategory[p.category] ?? p.pack,
}));



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
