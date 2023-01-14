import enforceAuthenticated from "../components/enforceAuthenticated";
import SearchBox from "../components/forms/SearchBox";
import Layout from "../components/layout/Layout";

export default function Home({ acct_type, data }) {
  console.log(data);

  return (
    <>
      <Layout title="Home" acct_type={acct_type}>
        <SearchBox />
      </Layout>
    </>
  );
}

export const getServerSideProps = enforceAuthenticated();
