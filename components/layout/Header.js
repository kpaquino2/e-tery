import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ImCart } from "react-icons/im";
import { TiThMenu } from "react-icons/ti";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import VendorNav from "./VendorNav";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function Header() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const user = useUser();
  const [acctType, setAcctType] = useState("");

  useEffect(() => {
    if (user)
      setAcctType(
        user.email?.endsWith("@g.batstate-u.edu.ph") ? "customer" : "vendor"
      );
  }, [user]);

  const open = true;
  const handleSignOut = async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (!error) router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 bg-maroon">
        <div className="flex justify-between items-center px-3 h-20">
          {acctType === "customer" ? (
            <>
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
                <button onClick={handleSignOut} className="rounded-full">
                  <TiThMenu className="text-cream w-7 h-7" />
                </button>
              </div>
            </>
          ) : acctType === "vendor" ? (
            <VendorNav vendor_id={user?.id} />
          ) : (
            <div className="grid place-items-center w-full">
              <Image src="/logo-light.png" alt="" width={70} height={70} />
            </div>
          )}
        </div>
      </header>
    </>
  );
}
