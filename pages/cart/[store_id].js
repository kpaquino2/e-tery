import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import RadioInput from "../../components/forms/RadioInput";
import Footer from "../../components/layout/Footer";
import Layout from "../../components/layout/Layout";
import useCart from "../../lib/cart";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaChevronLeft, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import SelectInputAlt from "../../components/forms/SelectInputAlt";
import * as moment from "moment";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const schema = yup.object({});

const getTimes = () => {
  const times = [];
  const ms = 1000 * 60 * 15;
  const now = moment();
  const time = moment(Math.ceil(now / ms) * ms);
  const closing = moment("23:59", "HH:mm");

  while (time.isBefore(closing)) {
    let from = time.clone();
    time.add(15, "m");
    let to = time.clone();
    times.push({ from, to });
  }

  return times;
};

export default function StoreCartPage({ id, open }) {
  const times = useMemo(() => getTimes(), []);
  const { register, watch, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      option: "delivery",
      building: 1,
      room: 1,
      when: "now",
      time: times?.[0].from.format("HH:mm:ss"),
    },
  });
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const cart = useCart((state) => state.getCartStore(router.query.store_id));
  const removeItemFromCart = useCart((state) => state.removeItemFromCart);
  const removeStoreFromCart = useCart((state) => state.removeStoreFromCart);
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const selected_bldg = watch("building");

  useEffect(() => {
    const fetchBuldings = async () => {
      const { error, data } = await supabaseClient
        .from("buildings")
        .select("id, name");
      if (!error) setBuildings(data);
    };
    fetchBuldings();
  }, [supabaseClient]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { error, data } = await supabaseClient
        .from("rooms")
        .select("id, code")
        .eq("building_id", selected_bldg);
      if (!error) setRooms(data);
    };
    fetchRooms();
  }, [watch, selected_bldg, supabaseClient]);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

  const onSubmit = async (data) => {
    const time = data.when === "now" ? moment().format("HH:mm:ss") : data.time;

    const insertOrder =
      data.option === "delivery"
        ? await supabaseClient
            .from("orders")
            .insert([
              {
                payment_option: "cod",
                delivery_option: data.option,
                time: time,
                status: "pending",
                vendor_id: router.query.store_id,
                customer_id: id,
                room_id: data.room,
                note: data.note,
                total: cart.subtotal + 10,
              },
            ])
            .select()
            .single()
        : await supabaseClient
            .from("orders")
            .insert([
              {
                payment_option: "counter",
                delivery_option: data.option,
                time: time,
                status: "pending",
                vendor_id: router.query.store_id,
                customer_id: id,
                total: cart.subtotal + 10,
              },
            ])
            .select()
            .single();
    if (insertOrder.error) return;
    cart.items.forEach(async (item) => {
      const insertOrderItem = await supabaseClient
        .from("order_items")
        .insert([
          {
            order_id: insertOrder.data.id,
            item_id: item.item_id,
            quantity: item.quantity,
            price: item.price,
          },
        ])
        .select()
        .single();
      if (insertOrderItem.error) throw insertOrder.error;
      if (item.options) {
        const insertOrderItemOptions = await supabaseClient
          .from("order_item_options")
          .insert(
            item.options.map((option) => {
              return {
                option_id: option.id,
                order_item_id: insertOrderItem.data.id,
              };
            })
          );
        if (insertOrderItemOptions.error) throw insertOrderItemOptions.error;
      }
    });
    router
      .push(`/orders/c/${insertOrder.data.id}`)
      .then(() => removeStoreFromCart(router.query.store_id));
  };

  const removeItem = (item) => {
    if (cart.items.length > 1) {
      removeItemFromCart(router.query.store_id, item);
      return;
    }
    removeStoreFromCart(router.query.store_id);
    router.back();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Layout title={cart?.name}>
        <button
          type="button"
          className="absolute top-24 left-4 z-20 rounded-full py-2 pl-1.5 pr-2.5"
          onClick={() => router.push("/cart")}
        >
          <FaChevronLeft className="text-3xl text-maroon drop-shadow-lg" />
        </button>
        <div className="mx-2 pb-20">
          <p className="my-2 text-center text-5xl font-bold text-dark">
            My Cart
          </p>
          <p className="my-2 mx-12 text-center text-3xl font-bold text-dark">
            {cart?.name}
          </p>
          {!open && (
            <p className="my-2 mx-12 text-center text-lg font-semibold text-maroon">
              This store is currently closed
            </p>
          )}
          <div className="text-xl font-semibold">Order Summary</div>
          {cart?.items.map((item, index) => (
            <div className="mx-2 grid grid-cols-[2rem_auto_6rem]" key={index}>
              <div className="font-semibold text-maroon">{item.quantity}x</div>
              <div className="flex flex-col">
                <span className="font-semibold">{item.item_name}</span>
                {item.options?.map((option, index) => (
                  <div key={index} className="text-sm">
                    {option.name}
                  </div>
                ))}
              </div>
              <div className="justify-self-end font-semibold text-dark">
                {item.price?.toFixed(2)}
              </div>
              <button
                type="button"
                className="col-span-3 w-fit place-self-end text-maroon underline"
                onClick={() => removeItem(item)}
              >
                remove from cart
              </button>
            </div>
          ))}
          <div className="m-2 grid grid-cols-2 border-t-2 border-cream">
            <span>Subtotal</span>
            <span className="text-end">{cart?.subtotal.toFixed(2)}</span>
            <span>Service Fee</span>
            <span className="text-end">10.00</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="col-span-2 text-xl font-semibold">
              Delivery Option
            </div>
            <span className="mx-2">
              <RadioInput
                size={5}
                id="delivery"
                value="delivery"
                register={register}
                name="option"
              />
              <label className="pl-2" htmlFor="delivery">
                Room Delivery
              </label>
            </span>
            <span className="mx-2">
              <RadioInput
                size={5}
                id="pickup"
                value="pickup"
                register={register}
                name="option"
              />
              <label className="pl-2" htmlFor="pickup">
                Pick-up
              </label>
            </span>
            <div className="col-span-2 mt-2 flex gap-2 rounded-lg bg-teal p-3 text-cream">
              <FaMapMarkerAlt className="text-xl text-maroon" />
              {watch("option") === "pickup" ? (
                <>{cart?.address}</>
              ) : (
                <div className="grid grid-cols-[auto_auto] gap-1">
                  <SelectInputAlt register={register} name="room">
                    {rooms?.map((room, index) => (
                      <option key={index} value={room.id}>
                        {room.code}
                      </option>
                    ))}
                  </SelectInputAlt>
                  <SelectInputAlt register={register} name="building">
                    {buildings?.map((bldg, index) => (
                      <option key={index} value={bldg.id}>
                        {bldg.name}
                      </option>
                    ))}
                  </SelectInputAlt>
                  <label className="col-span-2 text-sm" htmlFor="note">
                    Note to transporter:
                  </label>
                  <input
                    id="note"
                    className="col-span-2 rounded-lg border-maroon bg-cream p-1 text-sm text-dark placeholder-dark focus:border-maroon focus:ring-cream"
                    type="text"
                    placeholder="Optional..."
                    {...register("note")}
                  ></input>
                </div>
              )}
            </div>
            <div className="col-span-2 text-xl font-semibold">
              Mode of Payment
            </div>
            <span className="mx-2">
              {watch("option") === "delivery"
                ? "Cash on Delivery"
                : "Over the counter"}
            </span>
            <div className="col-span-2 text-xl font-semibold">
              Delivery Time
            </div>
            <span className="mx-2">
              <RadioInput
                size={5}
                id="now"
                value="now"
                register={register}
                name="when"
              />
              <label className="pl-2" htmlFor="now">
                Now
              </label>
            </span>
            <span className="mx-2">
              <RadioInput
                size={5}
                id="later"
                value="later"
                register={register}
                name="when"
              />
              <label className="pl-2" htmlFor="later">
                Later
              </label>
            </span>
            {watch("when") === "now" ? (
              <></>
            ) : (
              <div className="col-span-2 mt-2 flex gap-2 rounded-lg bg-teal p-3 text-cream">
                <FaClock className="text-xl text-maroon" />
                <SelectInputAlt register={register} name="time">
                  {times?.map((time, index) => (
                    <option key={index} value={time.from.format("HH:mm:ss")}>
                      {time.from.format("hh:mm a")} to{" "}
                      {time.to.format("hh:mm a")}
                    </option>
                  ))}
                </SelectInputAlt>
              </div>
            )}
          </div>
        </div>
      </Layout>
      <Footer>
        <div className="mx-4 grid h-full grid-cols-2 gap-3">
          <div className="flex items-center justify-around text-cream">
            <span className="font-semibold">TOTAL</span>
            <span className="text-xl font-bold">
              {(cart?.subtotal + 10).toFixed(2)}
            </span>
          </div>
          <button
            className="my-2 rounded-full bg-teal text-xl font-bold text-light disabled:grayscale"
            disabled={!open}
          >
            CHECK OUT
          </button>
        </div>
      </Footer>
    </form>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: open } = await supabase
    .from("vendors")
    .select("open")
    .eq("id", ctx.params.store_id)
    .single();

  return { props: { id: session?.user.id, open: open.open } };
};
