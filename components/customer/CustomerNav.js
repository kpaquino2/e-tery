import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoCart } from "react-icons/io5";
import { TiThMenu } from "react-icons/ti";
import CustomerMenu from "./CustomerMenu";
import SearchBox from "../forms/SearchBox";
import { useRouter } from "next/router";
import useCart from "../../lib/cart";

export default function CustomerNav({ customer_id }) {
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const router = useRouter();
  const totalQty = useCart((state) => state.totalQty);
  const cart_owner = useCart((state) => state.cart_owner);
  const clearCart = useCart((state) => state.clearCart);

  if (customer_id && cart_owner !== customer_id) clearCart(customer_id);

  console.log(customer_id);

  const openMenu = () => {
    setisMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <Link href="/" className="rounded-full">
        <Image src="graphics/logo-light.png" alt="" width={70} height={70} />
      </Link>
      <div className="flex gap-2">
        <Link href="/cart" className="rounded-full">
          <div className="relative">
            <IoCart className="text-4xl text-cream" />
            {totalQty > 0 && (
              <div className="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-cream bg-red-500 text-xs font-bold text-light">
                {totalQty}
              </div>
            )}
          </div>
        </Link>
        <button type="button" onClick={openMenu} className="rounded-full">
          <TiThMenu
            className={(isMenuOpen ? "text-dark" : "text-cream") + " text-3xl"}
          />
        </button>
      </div>
      <CustomerMenu
        customer_id={customer_id}
        isOpen={isMenuOpen}
        setIsOpen={setisMenuOpen}
      />
      {router.asPath === "/" ? <SearchBox isMenuOpen={isMenuOpen} /> : <></>}
    </>
  );
}
