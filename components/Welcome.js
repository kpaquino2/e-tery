import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";

export default function Welcome({ hideWelcome }) {
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

  return (
    <div className="fixed h-screen left-1/2 -translate-x-1/2 max-w-[450px] w-screen bg-light z-50">
      <div ref={sliderRef} className="keen-slider h-[85vh]">
        <div className="keen-slider__slide flex flex-col items-center pb-4 gap-6 pt-[340px]">
          <div className="absolute top-0 w-max">
            <Image src="graphics/welcome.png" alt="" width={500} height={500} />
          </div>
          <p className="text-4xl font-bold z-50">Welcome to E-tery</p>
          <p className="text-3xl font-semibold mx-12 z-50">
            {"We are here to help you conquer the new online food service app"}
          </p>
        </div>
        <div className="keen-slider__slide flex flex-col pb-4 gap-2 pt-[370px]">
          <div className="absolute top-0 w-max place-self-center">
            <Image
              src="graphics/features.png"
              alt=""
              width={400}
              height={400}
            />
          </div>
          <p className="text-3xl font-bold z-50 text-start ml-12">
            Main Features
          </p>
          <ul className="list-disc text-xl w-4/5 text-start ml-12 font-semibold place-self-center z-50">
            <li>Accept or Decline orders efficiently</li>
            <li>Open and Close your store online</li>
            <li>Set available items in the menu</li>
          </ul>
        </div>
        <div className="keen-slider__slide flex flex-col pb-4 pt-[330px]">
          <div className="absolute top-8 w-max place-self-center">
            <Image
              src="graphics/delivery.png"
              alt=""
              width={375}
              height={375}
            />
          </div>
          <p className="text-3xl font-bold z-50 text-center">
            Delivery Options
          </p>
          <ul className="list-disc text-xl text-start w-3/5 ml-16 text-maroon place-self-center z-50">
            <li>Transporters</li>
            <li>Pick up</li>
          </ul>
          <p className="text-3xl font-bold z-50 text-center">Payment Options</p>
          <ul className="list-disc text-xl text-start w-3/5 ml-16 text-maroon place-self-center z-50">
            <li>Cash on Delivery</li>
            <li>Over the Counter</li>
          </ul>
          <button
            className="bg-teal text-cream rounded-full w-min px-4 py-1.5 place-self-center"
            onClick={hideWelcome}
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
    </div>
  );
}
