import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function StoreItemAlt({ vendor_id, data }) {
  const [isImageLoaded, setisImageLoaded] = useState(true);
  return (
    <div
      className={
        "drop-shadoww-full h-full py-1 break-inside-avoid " +
        (!data.available && "opacity-50 pointer-events-none")
      }
    >
      <Link
        className="flex h-full"
        href={`/store/${vendor_id}/items/${data.id}`}
      >
        <Image
          className={
            "rounded-l-2xl bg-cream " + (isImageLoaded ? "" : "hidden")
          }
          src={`items/${vendor_id}/${data.id}`}
          alt=""
          width={112}
          height={112}
          onError={() => setisImageLoaded(false)}
        />
        <div
          className={
            (isImageLoaded ? "rounded-r-2xl" : "rounded-2xl") +
            " flex flex-col bg-cream text-dark text-md px-4 py-2 w-full break-words"
          }
        >
          <span className="font-semibold">{data.name}</span>
          <span className="text-sm">{data.description}</span>
          <span className="">₱ {data.base_price.toFixed(2)}</span>
        </div>
      </Link>
    </div>
  );
}
