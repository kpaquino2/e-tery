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

  return (
    <>
      <header className="fixed top-0 max-w-[450px] w-screen left-1/2 -translate-x-1/2 m-auto bg-maroon z-30">
        <div className="flex justify-between items-center px-3 h-20">
          {acctType === "customer" ? (
            <CustomerNav customer_id={user?.id} />
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
