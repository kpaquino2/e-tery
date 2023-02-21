import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TiThMenu } from "react-icons/ti";
import VendorMenu from "./VendorMenu";
import { motion } from "framer-motion";
import { FaRegBell } from "react-icons/fa";
import { useRouter } from "next/router";
import { useAnimationControls } from "framer-motion";

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
  const controls = useAnimationControls();

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
            controls.start("open");
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
        () => {
          setNewOrderId(null);
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseClient, vendor_id, newOrderId, controls, router]);

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

  const handleTap = () => {
    router.replace(`/orders/v/${newOrderId}`);
  };

  return (
    <>
      <motion.div
        initial={"closed"}
        animate={controls}
        variants={notifScreen}
        className="fixed inset-0 z-50 grid h-screen place-content-center place-items-center gap-4 bg-maroon"
        whileTap={"closed"}
        onTap={handleTap}
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
        <span className="text-center text-3xl font-bold text-light">
          You have a new order
        </span>
      </motion.div>
      <button
        className={
          (loading ? "cursor-wait bg-gray-300" : "") +
          " flex w-28 items-center gap-2 rounded-lg bg-light px-3 py-1.5"
        }
        onClick={openStore}
        disabled={loading}
      >
        <div
          className={
            (storeOpen ? "bg-teal" : "bg-dark") + " h-3 w-3 rounded-full"
          }
        />
        <div className="grow font-semibold text-dark ">
          {storeOpen ? "OPEN" : "CLOSED"}
        </div>
      </button>
      <Link href="/" className="rounded-full">
        <Image src="graphics/logo-light.png" alt="" width={60} height={60} />
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/orders"
          className="rounded-lg text-xl font-semibold text-cream"
        >
          ORDERS
        </Link>
        <button type="button" onClick={openMenu} className="rounded-full">
          <TiThMenu
            className={(isMenuOpen ? "text-dark" : "text-cream") + " h-7 w-7"}
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
