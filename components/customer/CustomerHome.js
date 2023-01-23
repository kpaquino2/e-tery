import Image from "next/image";
import AdCarousel from "./AdCarousel";
import Store from "./Store";

export default function CustomerHome({ stores }) {
  return (
    <div className="flex flex-col mx-4 mt-6">
      <AdCarousel />
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
