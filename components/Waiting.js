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
    <div className="bg-white fixed top-0 left-0 right-0 bottom-0 z-50 flex flex-col gap-6 items-center justify-center">
      <Image src="/graphics/waiting.png" alt="" width={380} height={380} />
      <p className="text-3xl font-bold"></p>
      <p className="text-3xl font-bold">Registration Completed</p>
      <p className="text-xl font-semibold text-center mx-12">
        {
          "Thank you! Please wait for your account to be activated. This may take a couple of days."
        }
      </p>
      <button
        type="button"
        onClick={handleSignOut}
        className="bg-teal text-cream rounded-full px-5 py-2 hover:opacity-75"
      >
        sign out
      </button>
    </div>
  );
}
