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
      <div className="flex min-h-screen h-screen flex-col">
        <Header />
        <main className="h-full w-full">{children}</main>
      </div>
    </>
  );
}
