import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TiThMenu } from "react-icons/ti";
import VendorMenu from "./VendorMenu";
import { motion } from "framer-motion";
import { FaRegBell } from "react-icons/fa";
import { useRouter } from "next/router";

const notifScreen = {
  open: {
    clipPath: `circle(2000px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  },
  closed: {
    clipPath: "circle(0)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

export default function VendorNav({ vendor_id }) {
  const supabaseClient = useSupabaseClient();
  const [storeOpen, setStoreOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [isNotifScreenOpen, setIsNotifScreenOpen] = useState(true);
  const [newOrderId, setNewOrderId] = useState(null);
  const router = useRouter();

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

  useEffect(() => {
    const subscription = supabaseClient
      .channel("db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `vendor_id=eq.${vendor_id}`,
        },
        (payload) => {
          if (newOrderId === null) {
            setNewOrderId(payload.new.id);
            setIsNotifScreenOpen(true);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `vendor_id=eq.${vendor_id}`,
        },
        (payload) => {
          setNewOrderId(null);
        }
      )
      .subscribe();
  }, [supabaseClient, vendor_id, isNotifScreenOpen, newOrderId]);

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

  const handleClick = () => {
    router.replace(`/orders/${newOrderId}`).then(() => {
      setIsNotifScreenOpen(false);
    });
  };

  return (
    <>
      <motion.div
        animate={isNotifScreenOpen && newOrderId ? "open" : "closed"}
        variants={notifScreen}
        className="fixed inset-0 bg-maroon grid place-content-center place-items-center gap-4 p-12"
        onClick={handleClick}
      >
        <motion.div
          animate={{
            rotate: [-10, 10, -10],
            transition: {
              delay: -1,
              repeat: Infinity,
              duration: 0.2,
            },
          }}
        >
          <FaRegBell className="text-7xl text-light" />
        </motion.div>
        <span className="text-3xl font-bold text-light text-center">
          You have a new order
        </span>
      </motion.div>
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
