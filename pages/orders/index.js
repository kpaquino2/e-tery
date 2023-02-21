import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { FaChevronLeft } from "react-icons/fa";
import CustomerOrders from "../../components/customer/CustomerOrders";
import Layout from "../../components/layout/Layout";
import VendorOrders from "../../components/vendor/VendorOrders";

export default function OrdersPage({ orders, acct_type }) {
  const router = useRouter();

  return (
    <>
      <Layout title="Orders">
        <button
          type="button"
          className="absolute top-24 left-4 rounded-full p-1"
          onClick={() => router.back()}
        >
          <FaChevronLeft className="text-3xl text-maroon" />
        </button>
        {acct_type === "customer" ? (
          <CustomerOrders orders={orders} />
        ) : (
          <VendorOrders orders={orders} />
        )}
      </Layout>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const acct_type = session?.user.email?.endsWith("@g.batstate-u.edu.ph")
    ? "customer"
    : "vendor";

  const { data } = await supabase
    .from("orders")
    .select(
      "id, total, payment_option, delivery_option, time, status, room_id, order_rating, number, created_at, customer_id, vendor:vendor_id(name), order_items (id)"
    )
    .eq(acct_type === "customer" ? "customer_id" : "vendor_id", session.user.id)
    .order("created_at", { ascending: false });

  return { props: { orders: data, acct_type } };
};
