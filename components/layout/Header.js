import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ImCart } from "react-icons/im";
import { TiThMenu } from "react-icons/ti";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import VendorNav from "../vendor/VendorNav";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import CustomerNav from "../customer/CustomerNav";

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
      <header className="sticky top-0 bg-maroon z-40">
        <div className="flex justify-between items-center px-3 h-20">
          {acctType === "customer" ? (
            <CustomerNav />
          ) : acctType === "vendor" ? (
            <VendorNav vendor_id={user?.id} />
          ) : (
            <div className="grid place-items-center w-full">
              <Image
                src="graphics/logo-light.png"
                alt=""
                width={60}
                height={60}
              />
            </div>
          )}
        </div>
      </header>
    </>
  );
}
