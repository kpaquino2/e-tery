import Head from "next/head";
import Header from "./Header";

export default function Layout({ title, acct_type, open, children }) {
  return (
    <>
      <Head>
        <title>{title ? title + " | E-TERY" : "E-TERY"}</title>
        <meta name="description" content="delivery web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col gap-2">
        <Header acct_type={acct_type} open={open} />
        <main className="w-full px-10 place-self-center">{children}</main>
      </div>
    </>
  );
}
