import enforceAuthenticated from "../components/enforceAuthenticated";
import Layout from "../components/layout/Layout";

export default function Home({ acct_type, data }) {
  console.log(data);

  return (
    <>
      <Layout title="Home" acct_type={acct_type}>
        {acct_type}
      </Layout>
    </>
  );
}

export const getServerSideProps = enforceAuthenticated();
