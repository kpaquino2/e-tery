import Image from "next/image";
import AdCarousel from "./AdCarousel";
import Store from "./Store";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import StoreItemAlt from "./StoreItemAlt";
import useSearch from "../../lib/search";
import { useEffect, useState } from "react";

export default function CustomerHome({ stores, favorites }) {
  const [storesShown, setStoresShown] = useState(stores);
  const [sliderRef] = useKeenSlider({
    mode: "free",
    slides: {
      perView: 1.5,
      spacing: 12,
    },
  });
  const query = useSearch((state) => state.query);

  useEffect(() => {
    const search = async (q) => {
      const data = stores.filter((store) =>
        store.name.toLowerCase().includes(q)
      );
      setStoresShown(data);
    };
    const timeoutId = setTimeout(() => {
      search(query.toLowerCase());
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query, stores]);

  return (
    <div className="flex flex-col mx-4 my-6">
      {!query && (
        <>
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
        </>
      )}
      <div className="flex flex-col gap-4">
        {storesShown.length ? (
          storesShown.map((value, index) => (
            <Store details={value} key={index} />
          ))
        ) : (
          <div className="place-self-center">
            <Image
              src={`graphics/${query ? "noresults" : "notready"}.png`}
              alt="NO STORES"
              width={600}
              height={600}
            />
            <div className="text-2xl font-bold text-center">
              {query
                ? "no stores found with that name"
                : "stores aren't ready yet"}
            </div>
            <div className="text-lg font-semibold text-center">
              {query
                ? "check your spelling or try again with another one"
                : "come back later!"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
