import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { TiStarFullOutline } from "react-icons/ti";

export default function Store({ details }) {
  var price = [],
    i = 0,
    len = details.price_range;
  while (++i <= len) price.push("$");

  const [imgSrc, setImgSrc] = useState(`banners/${details.id}`);

  return (
    <Link href={"store/" + details.id} className="flex flex-col drop-shadow-md">
      <Image
        className="rounded-t-2xl bg-cream"
        src={imgSrc}
        alt=""
        width={1200}
        height={600}
        onError={() => setImgSrc("graphics/default.png")}
      />
      <div className="flex w-full flex-row justify-between rounded-b-2xl bg-teal px-4 py-2">
        <div className="text-xl font-bold text-cream">{details.name}</div>
        <div className="">
          {price.map(function (i) {
            return i;
          })}
        </div>
        <div className="mt-auto self-end font-semibold text-cream">
          {details.rating ? (
            <div className="flex items-center ">
              <TiStarFullOutline className="h-5 w-5 text-maroon" />
              {details.rating.toFixed(1)}
            </div>
          ) : (
            "no ratings yet"
          )}
        </div>
      </div>
    </Link>
  );
}
