import { createFileRoute } from "@tanstack/react-router";
import { AccountSettings } from "@/routes/account";

export const Route = createFileRoute("/fr/account")({ component: AccountSettings });
