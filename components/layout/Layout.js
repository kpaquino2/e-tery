import Head from "next/head";

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? title + " | E-TERY" : "E-TERY"}</title>
        <meta name="description" content="delivery web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col justify-between"></div>
    </>
  );
}
