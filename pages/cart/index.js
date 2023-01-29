import Link from "next/link";
import { useRouter } from "next/router";
import { FaChevronLeft } from "react-icons/fa";
import Layout from "../../components/layout/Layout";
import useCart from "../../lib/cart";

export default function CartPage() {
  const cart = useCart((state) => state.cart);
  const router = useRouter();

  return (
    <>
      <Layout title="My Cart">
        <button
          type="button"
          className="absolute top-24 left-4 rounded-full py-2 pl-1.5 pr-2.5 z-20"
          onClick={() => router.back()}
        >
          <FaChevronLeft className="text-3xl text-maroon drop-shadow-lg" />
        </button>
        <p className="text-5xl font-bold text-dark text-center my-2">My Cart</p>
        {cart.map((store, index) => {
          const qty = store.items
            .map((item) => item.quantity)
            .reduce((a, b) => a + b);
          return (
            <Link
              href={`cart/${store.id}`}
              key={index}
              className="m-2 p-4 rounded-xl border-b-2 bg-teal text-cream"
            >
              <div className="text-lg font-bold">{store.name}</div>
              <span>{qty + " item" + (qty > 1 ? "s" : "")}</span>
            </Link>
          );
        })}
      </Layout>
    </>
  );
}
