import Head from "next/head";
import Header from "./Header";

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? title + " | E-TERY" : "E-TERY"}</title>
        <meta name="description" content="delivery web app" />
        <link
          rel="icon"
          href="/logo.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/logo-light.png"
          media="(prefers-color-scheme: dark)"
        />
      </Head>
      <Header />
      <div className="relative flex flex-col min-h-screen max-w-[450px] m-auto shadow-lg bg-light">
        <main className="mt-20 flex flex-col grow h-full w-full">
          {children}
        </main>
      </div>
    </>
  );
}
