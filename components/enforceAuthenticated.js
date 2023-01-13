import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const enforceAuthenticated = () => {
  return async (ctx) => {
    const supabase = createServerSupabaseClient(ctx);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session)
      return { redirect: { destination: "/login", permanent: false } };

    const { data: user_data } = await supabase.from("users").select("*");
    const { data: vendor_data } = await supabase.from("vendors").select("*");
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
      return { redirect: { destination: "/unactivated", permanent: false } };
    return { props: { acct_type, data } };
  };
};

export default enforceAuthenticated;
