import Link from "next/link";
import Layout from "../../components/layout/Layout";
import useCart from "../../lib/cart";

export default function CartPage() {
  const cart = useCart((state) => state.cart);

  return (
    <>
      <Layout title="My Cart">
        <p className="text-5xl font-bold text-dark text-center my-2">My Cart</p>
        {cart.map((store, index) => (
          <Link
            href={`cart/${store.id}`}
            key={index}
            className="m-2 p-4 rounded-xl border-b-2 bg-teal text-cream"
          >
            <div className="text-lg font-bold">{store.name}</div>
            <span>
              {store.items.length +
                " item" +
                (store.items.length > 1 ? "s" : "")}
            </span>
          </Link>
        ))}
      </Layout>
    </>
  );
}
