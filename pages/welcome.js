import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useKeenSlider } from "keen-slider/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Welcome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });
  const router = useRouter();
  const supabaseClient = useSupabaseClient();

  const finishWelcome = async () => {
    const { error } = await supabaseClient
      .from("vendors")
      .update({ new_account: false })
      .eq("new_account", true);

    if (!error) router.push("/");
  };

  return (
    <>
      <div ref={sliderRef} className="keen-slider h-[85vh]">
        <div className="keen-slider__slide flex flex-col items-center justify-center gap-6 pt-52 bg-welcome bg-[right_top_2rem] bg-no-repeat bg-[length:115%]">
          <p className="text-4xl font-bold z-50">Welcome to E-tery</p>
          <p className="text-3xl font-semibold mx-12 z-50">
            {"We are here to help you conquer the new online food service app"}
          </p>
        </div>
        <div className="keen-slider__slide flex flex-col justify-center gap-6 pt-72 bg-features bg-top bg-no-repeat bg-[length:90%]">
          <p className="text-4xl font-bold z-50 text-start ml-12">
            Main Features
          </p>
          <ul className="list-disc text-2xl text-start w-3/5 ml-16 text-maroon place-self-center z-50">
            <li>Accept or Decline orders efficiently</li>
            <li>Open and Close your store online</li>
            <li>Set available items in the menu</li>
          </ul>
        </div>
        <div className="keen-slider__slide flex flex-col justify-center pt-48 bg-delivery bg-top bg-no-repeat bg-[length:95%]">
          <p className="text-3xl font-bold z-50 text-center">
            Delivery Options
          </p>
          <ul className="list-disc text-2xl text-start w-3/5 ml-16 mb-4 text-maroon place-self-center z-50">
            <li>Transporters</li>
            <li>Pick up</li>
          </ul>
          <p className="text-3xl font-bold z-50 text-center">Payment Options</p>
          <ul className="list-disc text-2xl text-start w-3/5 ml-16 text-maroon place-self-center z-50">
            <li>Cash on Delivery</li>
            <li>Over the Counter</li>
          </ul>
          <button
            className="bg-teal text-cream rounded-full w-min px-3 py-2 place-self-center mt-6"
            onClick={finishWelcome}
          >
            proceed
          </button>
        </div>
      </div>
      {loaded && instanceRef.current && (
        <div className="flex justify-center gap-6">
          {[
            ...Array(instanceRef.current.track.details.slides.length).keys(),
          ].map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={
                  "w-3 h-3 rounded-full " +
                  (currentSlide === idx ? " bg-teal" : "bg-maroon")
                }
              ></button>
            );
          })}
        </div>
      )}
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return { redirect: { destination: "/login", permanent: false } };

  const { data: user_data } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id);

  if (user_data.length > 0)
    return { redirect: { destination: "/", permanent: false } };

  return { props: {} };
};
