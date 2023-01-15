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
  const { data: user_data } = await supabase
    .from("customers")
    .select("*")
    .eq("id", session.user.id);
  const { data: vendor_data } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", session.user.id);
  const acct_type = user_data.length
    ? "customer"
    : vendor_data.length
    ? "vendor"
    : 0;
  const data = user_data.length
    ? user_data[0]
    : vendor_data.length
    ? vendor_data[0]
    : {};
  if (acct_type === "vendor" && !data.activated)
    return NextResponse.redirect(new URL("/unactivated", req.url));
  if (acct_type === "vendor" && data.new_account)
    return NextResponse.redirect(new URL("/welcome", req.url));
}

export const config = {
  matcher: [
    "/((?!welcome|unactivated|login|signup/*|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
