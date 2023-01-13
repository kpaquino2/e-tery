import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Layout from "../components/layout/Layout";

export default function Home({ user, acct_type, data }) {
  return (
    <>
      <Layout title="Home" acct_type={acct_type}>
        {acct_type}
      </Layout>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
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
    : "unauth";
  const data = user_data.length
    ? user_data[0]
    : vendor_data.length
    ? vendor_data[0]
    : {};
  return { props: { acct_type, data } };
};
