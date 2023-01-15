import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ImCart } from "react-icons/im";
import { TiThMenu } from "react-icons/ti";

export default function VendorNav({ open }) {
  const supabaseClient = useSupabaseClient();
  const [storeOpen, setStoreOpen] = useState(open);
  const [loading, setLoading] = useState(false);

  const openStore = async () => {
    setLoading(true);
    const { error } = await supabaseClient
      .from("vendors")
      .update({ open: !storeOpen })
      .eq("open", storeOpen);
    if (!error) setStoreOpen(!storeOpen);
    setLoading(false);
  };
  return (
    <>
      <button
        className={
          (loading ? "cursor-wait bg-gray-300" : "") +
          " flex items-center gap-2 rounded-lg bg-light px-3 py-1.5 w-28"
        }
        onClick={openStore}
        disabled={loading}
      >
        <div
          className={
            (storeOpen ? "bg-teal" : "bg-dark") + " w-3 h-3 rounded-full"
          }
        />
        <div className="grow text-dark font-semibold ">
          {storeOpen ? "OPEN" : "CLOSED"}
        </div>
      </button>
      <Link href="/" className="rounded-full">
        <Image src="/logo-light.png" alt="" width={70} height={70} />
      </Link>
      <div className="flex gap-3 items-center">
        <Link
          href="/orders"
          className="text-cream font-semibold text-xl rounded-lg"
        >
          ORDERS
        </Link>
        <button className="rounded-full">
          <TiThMenu className="text-cream w-7 h-7" />
        </button>
      </div>
    </>
  );
}
