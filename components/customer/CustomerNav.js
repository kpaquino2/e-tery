import Image from "next/image";
import Link from "next/link";
import { ImCart } from "react-icons/im";
import { TiThMenu } from "react-icons/ti";

export default function CustomerNav() {
  return (
    <>
      <Link href="/" className="rounded-full">
        <Image src="graphics/logo-light.png" alt="" width={60} height={60} />
      </Link>
      <div className="flex gap-3">
        <Link href="/cart" className="rounded-full">
          <ImCart className="text-cream w-6 h-6" />
        </Link>
        <button className="rounded-full">
          <TiThMenu className="text-cream w-7 h-7" />
        </button>
      </div>
    </>
  );
}
