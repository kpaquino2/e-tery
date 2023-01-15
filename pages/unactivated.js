import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Waiting() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const handleSignOut = async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (!error) router.push("/login");
  };

  return (
    <>
      <div className="bg-white fixed top-0 left-0 right-0 bottom-0 z-50 flex flex-col gap-6 items-center justify-center pt-48">
        <p className="text-3xl font-bold z-50">Registration Completed</p>
        <p className="text-xl font-semibold text-center mx-12 z-50">
          {
            "Please wait for your account to be activated. This may take a couple of days."
          }
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          className="bg-teal text-cream rounded-full px-5 py-2 hover:opacity-75"
        >
          sign out
        </button>
        <Image
          className="absolute top-16"
          src="/graphics/waiting.png"
          alt=""
          width={500}
          height={500}
        />
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return { redirect: { destination: "/login", permanent: false } };

  const acct_type = session?.user.email?.endsWith("@g.batstate-u.edu.ph")
    ? "customer"
    : "vendor";

  if (acct_type === "customer")
    return { redirect: { destination: "/", permanent: false } };

  const {
    data: [details],
  } = await supabase
    .from("vendors")
    .select("activated")
    .eq("id", session.user.id);

  if (acct_type === "vendor" && details.activated)
    return { redirect: { destination: "/", permanent: false } };

  return { props: {} };
};
