import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TiThMenu } from "react-icons/ti";
import VendorMenu from "./VendorMenu";

export default function VendorNav({ vendor_id }) {
  const supabaseClient = useSupabaseClient();
  const [storeOpen, setStoreOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setisMenuOpen] = useState(false);

  useEffect(() => {
    const fetchOpen = async () => {
      const { data } = await supabaseClient
        .from("vendors")
        .select("open")
        .eq("id", vendor_id);
      if (data) setStoreOpen(data[0]?.open);
    };
    fetchOpen();
  }, [supabaseClient, vendor_id]);

  const openStore = async () => {
    setLoading(true);
    const { error } = await supabaseClient
      .from("vendors")
      .update({ open: !storeOpen })
      .eq("open", storeOpen);
    if (!error) setStoreOpen(!storeOpen);
    setLoading(false);
  };

  const openMenu = () => {
    setisMenuOpen(!isMenuOpen);
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
        <Image src="graphics/logo-light.png" alt="" width={60} height={60} />
      </Link>
      <div className="flex gap-3 items-center">
        <Link
          href="/orders"
          className="text-cream font-semibold text-xl rounded-lg"
        >
          ORDERS
        </Link>
        <button onClick={openMenu} className="rounded-full">
          <TiThMenu
            className={(isMenuOpen ? "text-dark" : "text-cream") + " w-7 h-7"}
          />
        </button>
      </div>
      <VendorMenu
        vendor_id={vendor_id}
        isOpen={isMenuOpen}
        setIsOpen={setisMenuOpen}
      />
    </>
  );
}
