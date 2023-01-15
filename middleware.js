import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient({ req, res });
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return NextResponse.redirect(new URL("/login", req.url));
  const acct_type = session?.user.email?.endsWith("@g.batstate-u.edu.ph")
    ? "customer"
    : "vendor";

  if (acct_type === "user") return;

  const {
    data: [details],
  } = await supabase
    .from("vendors")
    .select("activated")
    .eq("id", session.user.id);

  if (!details?.activated)
    return NextResponse.redirect(new URL("/unactivated", req.url));
}

export const config = {
  matcher: [
    "/((?!unactivated|login|signup/*|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
