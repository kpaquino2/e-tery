import Image from "next/image";
import AdCarousel from "./AdCarousel";
import Store from "./Store";
import StoreItem from "./StoreItem";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import StoreItemAlt from "./StoreItemAlt";

export default function CustomerHome({ stores, favorites }) {
  const [sliderRef] = useKeenSlider({
    mode: "free",
    slides: {
      perView: 1.5,
      spacing: 12,
    },
  });
  return (
    <div className="flex flex-col mx-4 my-6">
      <AdCarousel />
      <div className="font-bold text-4xl mb-2">Favorites</div>
      <div ref={sliderRef} className="keen-slider">
        {favorites?.map((fav, index) => (
          <div key={index} className="keen-slider__slide number-slide1">
            <StoreItemAlt vendor_id={fav.vendor_id} data={fav} />
          </div>
        ))}
      </div>
      <div className="font-bold text-4xl mb-2">Stores</div>
      <div className="flex flex-col gap-4">
        {stores.length ? (
          stores.map((value, index) => <Store details={value} key={index} />)
        ) : (
          <div className="place-self-center">
            <Image
              src="graphics/notready.png"
              alt="NO STORES"
              width={600}
              height={600}
            />
            <div className="text-2xl font-bold text-center">
              {"stores aren't ready yet"}
            </div>
            <div className="text-lg font-semibold text-center">
              come back later!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
