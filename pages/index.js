import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import CustomerHome from "../components/CustomerHome/CustomerHome";
import Layout from "../components/layout/Layout";
import Welcome from "../components/Welcome";
import { useEffect, useState } from "react";

export default function Home({ id, acct_type, stores }) {
  const [welcomed, setWelcomed] = useState(true);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("accounts_welcomed"));
    if (!stored?.includes(id)) setWelcomed(false);
  }, [id]);

  const hideWelcome = () => {
    const stored = JSON.parse(localStorage.getItem("accounts_welcomed"));
    if (!stored) {
      localStorage.setItem("accounts_welcomed", JSON.stringify([id]));
      setWelcomed(true);
      return;
    }
    localStorage.setItem("accounts_welcomed", JSON.stringify([id, ...stored]));
    setWelcomed(true);
  };

  return (
    <>
      {!welcomed ? <Welcome hideWelcome={hideWelcome} /> : <></>}
      <Layout title="Home" acct_type={acct_type}>
        {acct_type === "customer" ? <CustomerHome stores={stores} /> : <></>}
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

  return { props: { id: session?.user.id, acct_type } };
};
