export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  date: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "nexvi-copilot",
    title: "Nexvi Copilot: one chat for your entire job search",
    excerpt:
      "CV generator, cover letter writer, ATS optimizer, humanizer and prompt library — all inside a single chat workspace that remembers your resume and the job description.",
    category: "Product",
    readingTime: "7 min read",
    date: "2026-08-20",
  },
  {
    slug: "ats-optimization-and-ai-humanizer",
    title: "ATS optimization and why the humanizer matters when AI screens your application",
    excerpt:
      "Hiring runs through two machines before a person sees you: an ATS that parses and scores your documents, and a language model that ranks and summarises you. Here is how both gates work and how to pass them.",
    category: "ATS & AI screening",
    readingTime: "8 min read",
    date: "2026-08-02",
  },
  {

    slug: "how-to-write-a-resume",
    title: "How to write a resume in 2026",
    excerpt:
      "Most resumes are rejected by software before a human reads them. The seven steps that decide whether yours gets through — structure, wording, measurable achievements, keyword coverage and length.",
    category: "Resumes",
    readingTime: "9 min read",
    date: "2026-08-02",
  },
];
