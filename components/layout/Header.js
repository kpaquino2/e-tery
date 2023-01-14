import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@supabase/auth-helpers-react";
import { ImArrowLeft2, ImCart } from "react-icons/im";
import { TiThMenu } from "react-icons/ti";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Header({ acct_type }) {
  console.log(acct_type);
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
        {acct_type === "customer" ? (
          <div className="flex justify-between items-center px-3 h-20">
            <button className="rounded-full" onClick={() => router.push("/")}>
              <Image src="/logo-light.png" alt="" width={70} height={70} />
            </button>
            <div className="flex gap-3">
              <button
                className="rounded-full"
                onClick={() => router.push("/cart")}
              >
                <ImCart className="text-cream w-6 h-6" />
              </button>
              <button className="rounded-full">
                <TiThMenu className="text-cream w-7 h-7" />
              </button>
            </div>
          </div>
        ) : acct_type === "vendor" ? (
          <button onClick={handleSignOut}>Sign out</button>
        ) : (
          <div className="grid grid-cols-3 px-3 place-items-center">
            <div className="justify-self-start">
              <button className="rounded-full" onClick={() => router.back()}>
                <ImArrowLeft2 className="text-cream w-6 h-6" />
              </button>
            </div>
            <Image src="/logo-light.png" alt="" width={70} height={70} />
          </div>
        )}
      </header>
    </>
  );
}
