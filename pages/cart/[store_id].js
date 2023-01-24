import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import RadioInput from "../../components/forms/RadioInput";
import Footer from "../../components/layout/Footer";
import Layout from "../../components/layout/Layout";
import useCart from "../../lib/cart";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import SelectInputAlt from "../../components/forms/SelectInputAlt";
import * as moment from "moment";

const schema = yup.object({});

const getTimes = () => {
  const times = [];
  const ms = 1000 * 60 * 15;
  const now = moment();
  const time =
    now.hours() >= 7 ? moment(Math.ceil(now / ms) * ms) : moment("07", "hh");

  while (time.hours() < 19) {
    let from = time.clone();
    time.add(15, "m");
    let to = time.clone();
    times.push({ from, to });
  }

  return times;
};

export default function StoreCartPage() {
  const { register, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      option: "delivery",
      payment: "cod",
      building: 1,
      room: 1,
      when: "now",
      time: "",
    },
  });
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const cart = useCart((state) => state.getCartStore(router.query.store_id));
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const times = useMemo(() => getTimes(), []);
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

  return (
    <>
      <Layout title={cart?.name}>
        <div className="mx-2">
          <p className="text-3xl font-bold text-dark text-center my-2">
            {cart?.name} - Cart
          </p>
          <div className="text-xl font-semibold">Order Summary</div>
          {cart?.items.map((item, index) => (
            <div className="grid grid-cols-[2rem_auto_6rem] mx-2" key={index}>
              <div className="text-maroon font-semibold">{item.quantity}x</div>
              <div className="flex flex-col">
                <span className="font-semibold">{item.item_name}</span>
                {item.options.map((option, index) => (
                  <div key={index} className="text-sm">
                    {option.name}
                  </div>
                ))}
              </div>
              <div className="text-dark font-semibold justify-self-end">
                {item.price.toFixed(2)}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 m-2 border-t-2 border-cream">
            <span>Subtotal</span>
            <span className="text-end">{cart?.subtotal.toFixed(2)}</span>
            <span>Delivery Fee</span>
            <span className="text-end">10.00</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-xl font-semibold col-span-2">
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
            <div className="col-span-2 flex bg-teal rounded-lg gap-2 p-3 mt-2 text-cream">
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
                    className="col-span-2 p-1 bg-cream rounded-lg border-maroon placeholder-dark text-dark text-sm focus:border-maroon focus:ring-cream"
                    type="text"
                    placeholder="Optional..."
                  ></input>
                </div>
              )}
            </div>
            <div className="text-xl font-semibold col-span-2">
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
              <div className="col-span-2 flex bg-teal rounded-lg gap-2 p-3 mt-2 text-cream">
                <FaClock className="text-xl text-maroon" />
                <SelectInputAlt register={register} name="time">
                  <option value="" disabled>
                    Select time
                  </option>
                  {times?.map((time, index) => (
                    <option key={index} value={time}>
                      {time.from.format("hh:mm a")} to{" "}
                      {time.to.format("hh:mm a")}
                    </option>
                  ))}
                </SelectInputAlt>
              </div>
            )}
            <div className="text-xl font-semibold col-span-2">
              Mode of Payment
            </div>
            <span className="mx-2">
              <RadioInput
                size={5}
                id="cod"
                value="cod"
                register={register}
                name="payment"
              />
              <label className="pl-2" htmlFor="cod">
                Cash on Delivery
              </label>
            </span>
            <span className="mx-2">
              <RadioInput
                size={5}
                id="counter"
                value="counter"
                register={register}
                name="payment"
              />
              <label className="pl-2" htmlFor="counter">
                Over the counter
              </label>
            </span>
          </div>
        </div>
      </Layout>
      <Footer>
        <div className="grid grid-cols-2 gap-3 h-full mx-4">
          <div className="text-cream flex items-center justify-around">
            <span className="font-semibold">TOTAL</span>
            <span className="font-bold text-xl">
              {(cart?.subtotal + 10).toFixed(2)}
            </span>
          </div>
          <button className="bg-teal my-2 rounded-full text-xl font-bold text-light disabled:grayscale">
            ADD TO CART
          </button>
        </div>
      </Footer>
    </>
  );
}
