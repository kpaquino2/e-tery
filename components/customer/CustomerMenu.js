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
        className="mb-8 mt-12 text-3xl font-bold text-cream"
      >
        Favorites
      </Link>
      <Link href="/orders" className="mb-8 text-3xl font-bold text-cream">
        Orders
      </Link>
      <p className="mb-4 text-3xl font-bold text-cream">Details</p>
      <div className="mx-12 mb-8 flex max-w-[80%] flex-col overflow-hidden text-2xl text-cream">
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
      <Link href="/suggestions" className="mb-8 text-3xl font-bold text-cream">
        Suggestions
      </Link>
      <button
        type="button"
        className="mb-8 rounded-full text-3xl font-bold text-cream"
        onClick={handleSignOut}
      >
        Log Out
      </button>
    </Drawer>
  );
}
