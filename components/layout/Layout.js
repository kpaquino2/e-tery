import Head from "next/head";
import Header from "./Header";

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? title + " | E-TERY" : "E-TERY"}</title>
        <meta name="description" content="delivery web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex flex-col grow h-full w-full">{children}</main>
      </div>
    </>
  );
}
