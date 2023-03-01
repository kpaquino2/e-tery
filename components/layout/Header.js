import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ImCart } from "react-icons/im";
import { TiThMenu } from "react-icons/ti";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import VendorNav from "../vendor/VendorNav";
import { useEffect, useState } from "react";
import CustomerNav from "../customer/CustomerNav";
import { useSession } from "@supabase/auth-helpers-react";

export default function Header() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const session = useSession();
  const [acctType, setAcctType] = useState("");

  useEffect(() => {
    if (session && session.user)
      setAcctType(
        session.user.email?.endsWith("@g.batstate-u.edu.ph")
          ? "customer"
          : "vendor"
      );
  }, [session]);

  return (
    <>
      <header className="fixed top-0 left-1/2 z-30 m-auto w-screen max-w-[450px] -translate-x-1/2 bg-maroon">
        <div className="flex h-20 items-center justify-between px-3">
          {acctType === "customer" ? (
            <CustomerNav customer_id={session?.user.id} />
          ) : acctType === "vendor" ? (
            <VendorNav vendor_id={session?.user.id} />
          ) : (
            <div className="grid w-full place-items-center">
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
