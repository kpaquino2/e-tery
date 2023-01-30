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
      <div className="sticky max-w-[450px] m-auto bg-light h-screen flex flex-col items-center shadow-lg gap-6 justify-end pb-20 overflow-x-hidden">
        <div className="absolute top-8 w-max">
          <Image src="graphics/waiting.png" alt="" width={600} height={600} />
        </div>
        <p className="text-3xl font-bold text-center z-50">
          Registration Completed
        </p>
        <p className="text-xl font-semibold text-center mx-12 z-50">
          {
            "Please wait for your account to be activated. This may take a couple of days."
          }
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          className="bg-teal text-cream rounded-full px-5 py-2 z-10 hover:opacity-75"
        >
          sign out
        </button>
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
