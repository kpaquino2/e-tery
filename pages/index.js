import { Inter } from "@next/font/google";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Layout from "../components/layout/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ user, acct_type }) {
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

  const { user } = session;
  const { data: user_data } = await supabase.from("users").select("*");
  const { data: vendor_data } = await supabase.from("vendors").select("*");
  const acct_type = user_data.length
    ? "customer"
    : vendor_data.length
    ? "vendor"
    : "unauth";
  return { props: { user, acct_type } };
};
