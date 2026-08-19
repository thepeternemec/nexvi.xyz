import { createStart, createMiddleware } from "@tanstack/react-start";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next, request }) => {
  const { pathname } = new URL(request.url);
  if (pathname.startsWith("/lovable/") || pathname === "/email/unsubscribe") {
    return next();
  }
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    // Server-function calls (RPC) must not be turned into an HTML error page:
    // the client cannot parse that and the app blanks out. Let TanStack
    // serialize the error so the caller's catch block can show it.
    if (pathname.startsWith("/_serverFn")) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});


export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
  functionMiddleware: [attachSupabaseAuth],
}));
