import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ImCart } from "react-icons/im";
import { TiThMenu } from "react-icons/ti";
import CustomerMenu from "./CustomerMenu";
import SearchBox from "../forms/SearchBox";

export default function CustomerNav({ customer_id }) {
  const [isMenuOpen, setisMenuOpen] = useState(false);

  const openMenu = () => {
    setisMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <Link href="/" className="rounded-full">
        <Image src="graphics/logo-light.png" alt="" width={60} height={60} />
      </Link>
      <div className="flex gap-3">
        <Link href="/cart" className="rounded-full">
          <ImCart className="text-cream w-6 h-6" />
        </Link>
        <button onClick={openMenu} className="rounded-full">
          <TiThMenu
            className={(isMenuOpen ? "text-dark" : "text-cream") + " w-7 h-7"}
          />
        </button>
      </div>
      <CustomerMenu
        customer_id={customer_id}
        isOpen={isMenuOpen}
        setIsOpen={setisMenuOpen}
      />
      <SearchBox isMenuOpen={isMenuOpen} />
    </>
  );
}
