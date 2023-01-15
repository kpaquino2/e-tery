import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import CustomerHome from "../components/CustomerHome/CustomerHome";
import Layout from "../components/layout/Layout";

export default function Home({ acct_type, stores }) {
  return (
    <>
      <Layout title="Home" acct_type={acct_type}>
        <CustomerHome stores={stores} />
      </Layout>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const acct_type = session?.user.email?.endsWith("@g.batstate-u.edu.ph")
    ? "customer"
    : "vendor";

  if (acct_type === "customer") {
    const { data: stores } = await supabase
      .from("vendors")
      .select("name,rating,price_range")
      .eq("open", true);
    return { props: { acct_type, stores } };
  }

  return { props: {} };
};
