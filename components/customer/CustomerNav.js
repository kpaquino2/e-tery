import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoCart } from "react-icons/io5";
import { TiThMenu } from "react-icons/ti";
import CustomerMenu from "./CustomerMenu";
import SearchBox from "../forms/SearchBox";
import { useRouter } from "next/router";

export default function CustomerNav({ customer_id }) {
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const router = useRouter();

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
          <IoCart className="text-cream text-4xl" />
        </Link>
        <button onClick={openMenu} className="rounded-full">
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
