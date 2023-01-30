import Image from "next/image";
import Link from "next/link";
import Layout from "../components/layout/Layout";

export default function Custom404() {
  return (
    <>
      <Layout title="404">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image src="graphics/404.png" alt="" width={500} height={500} />
          <div className="text-2xl font-bold text-center">
            404 - Page not found
          </div>
          <div className="text-lg font-semibold text-center">
            {"Looks like you're lost"}
          </div>
          <Link href="/" className="bg-teal rounded-full text-cream py-2 px-4">
            Back to home page
          </Link>
        </div>
      </Layout>
    </>
  );
}
