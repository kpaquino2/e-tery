import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@supabase/auth-helpers-react";
import { ImArrowLeft2 } from "react-icons/im";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Header() {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (!error) router.push("/login");
  };

  return (
    <>
      <header className="bg-maroon">
        {user ? (
          <button onClick={handleSignOut}>Sign out</button>
        ) : (
          <div className="grid grid-cols-3 px-3 place-items-center">
            <div className="justify-self-start">
              <button className="rounded-full" onClick={() => router.back()}>
                <ImArrowLeft2 className="text-cream w-6 h-6" />
              </button>
            </div>
            <Image src="/logo-light.png" alt="" width={80} height={80} />
          </div>
        )}
      </header>
    </>
  );
}
