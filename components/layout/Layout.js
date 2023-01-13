import Head from "next/head";
import Header from "./Header";

export default function Layout({ title, acct_type, children }) {
  return (
    <>
      <Head>
        <title>{title ? title + " | E-TERY" : "E-TERY"}</title>
        <meta name="description" content="delivery web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header acct_type={acct_type} />
      {children}
    </>
  );
}
