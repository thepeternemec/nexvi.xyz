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
    slug: "how-to-write-a-resume",
    title: "How to write a resume in 2026",
    excerpt:
      "Most resumes are rejected by software before a human reads them. The seven steps that decide whether yours gets through — structure, wording, measurable achievements, keyword coverage and length.",
    category: "Resumes",
    readingTime: "9 min read",
    date: "2026-08-02",
  },
];
