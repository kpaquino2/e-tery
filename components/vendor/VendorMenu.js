import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Drawer from "../layout/Drawer";
import Link from "next/link";

export default function VendorMenu({ vendor_id, isOpen, setIsOpen }) {
  const supabaseClient = useSupabaseClient();
  const [vendorDetails, setVendorDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getVendorDetails = async () => {
      const { data } = await supabaseClient
        .from("vendors")
        .select("*")
        .eq("id", vendor_id);
      if (data) setVendorDetails(data[0]);
    };

    getVendorDetails();
  }, [supabaseClient, vendor_id]);

  const handleSignOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
      setIsOpen(false);
      router.push("/login");
    }
  };

  return (
    <Drawer isOpen={isOpen} setIsOpen={setIsOpen} title="Menu">
      <p className="mb-4 mt-12 text-4xl font-bold text-cream">Details</p>
      <div className="mx-12 mb-4 flex flex-col gap-2 text-3xl text-cream">
        <p>
          Store Name: <b>{vendorDetails?.name}</b>
        </p>
        <p>
          Contact Number: <b>{vendorDetails?.phone}</b>
        </p>
        <p>
          Address: <b>{vendorDetails?.address}</b>
        </p>
        <p>
          BIR Number: <b>{vendorDetails?.bir_no}</b>
        </p>
      </div>
      <Link href="/suggestions" className="mb-8 text-3xl font-bold text-cream">
        Suggestions
      </Link>
      <button
        type="button"
        className="rounded-full text-3xl font-bold text-cream"
        onClick={handleSignOut}
      >
        Log Out
      </button>
    </Drawer>
  );
}
