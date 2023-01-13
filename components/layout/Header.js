import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";

export default function Header() {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
  };

  return (
    <>
      <header className="bg-maroon">
        {user ? (
          <button onClick={handleSignOut}>brother</button>
        ) : (
          <div className="flex justify-center">
            <Image src="/logo-light.png" alt="" width={80} height={80} />
          </div>
        )}
      </header>
    </>
  );
}
