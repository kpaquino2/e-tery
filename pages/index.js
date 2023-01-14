import CustomerHome from "../components/CustomerHome/CustomerHome";
import enforceAuthenticated from "../components/enforceAuthenticated";
import Layout from "../components/layout/Layout";

export default function Home({ acct_type, data }) {
  return (
    <>
      <Layout title="Home" acct_type={acct_type}>
        <CustomerHome />
      </Layout>
    </>
  );
}

export const getServerSideProps = enforceAuthenticated();
