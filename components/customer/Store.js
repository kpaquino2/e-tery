import Image from "next/image";
import { TiStarFullOutline } from "react-icons/ti";

export default function Store({ details }) {
  console.log(details);
  var price = [],
    i = 0,
    len = details.price_range;
  while (++i <= len) price.push("$");
  return (
    <div className="flex flex-col drop-shadow-md">
      <Image
        className="rounded-t-2xl"
        src={`banners/${details.id}`}
        alt="banner"
        width={1200}
        height={600}
      />
      <div className="flex flex-row justify-between bg-teal rounded-b-2xl px-4 py-2 w-full">
        <div className="text-cream font-bold text-xl">{details.name}</div>
        <div className="">
          {price.map(function (i) {
            return i;
          })}
        </div>
        <div className="self-end mt-auto text-cream font-semibold">
          {details.rating ? (
            <div className="flex items-center ">
              <TiStarFullOutline className="w-5 h-5 text-maroon" />
              {details.rating}
            </div>
          ) : (
            "no ratings yet"
          )}
        </div>
      </div>
    </div>
  );
}
