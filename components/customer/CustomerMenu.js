import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Drawer from "../layout/Drawer";

export default function CustomerMenu({ customer_id, isOpen, setIsOpen }) {
  const supabaseClient = useSupabaseClient();
  const [customerDetails, setCustomerDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getVendorDetails = async () => {
      const { data } = await supabaseClient
        .from("customers")
        .select("*")
        .eq("id", customer_id);
      if (data) setCustomerDetails(data[0]);
    };

    getVendorDetails();
  }, [supabaseClient, customer_id]);

  const handleSignOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
      setIsOpen(false);
      router.push("/login");
    }
  };

  return (
    <Drawer isOpen={isOpen} setIsOpen={setIsOpen} title="Menu">
      <Link
        href="/favorites"
        className="text-cream text-3xl font-bold mb-8 mt-12"
      >
        Favorites
      </Link>
      <Link href="/orders" className="text-cream text-3xl font-bold mb-8">
        Orders
      </Link>
      <p className="text-cream text-3xl font-bold mb-4">Details</p>
      <div className="flex flex-col text-cream text-2xl mx-12 mb-8 max-w-[80%] overflow-hidden">
        <p>
          Name:{" "}
          <b>{customerDetails?.firstname + " " + customerDetails?.lastname}</b>
        </p>
        <p>
          Contact Number: <b>{customerDetails?.contact_no}</b>
        </p>
        <p>
          Classification: <b>{customerDetails?.classification}</b>
        </p>
      </div>
      <button
        type="button"
        className="rounded-full text-cream font-bold text-3xl mb-8"
        onClick={handleSignOut}
      >
        Log Out
      </button>
    </Drawer>
  );
}
