import { auth, defineMcp } from "@lovable.dev/mcp-js";
import generateCvTool from "./tools/generate-cv";
import generateCoverLetterTool from "./tools/generate-cover-letter";
import scoreAtsTool from "./tools/score-ats";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "nexvi-mcp",
  title: "Nexvi",
  version: "0.1.0",
  instructions:
    "Tools for AI-assisted job applications: generate tailored CVs, cover letters, and ATS match scores from a job description and the candidate's background.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [generateCvTool, generateCoverLetterTool, scoreAtsTool],
});
