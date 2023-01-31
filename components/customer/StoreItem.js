import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function StoreItem({ vendor_id, data }) {
  return (
    <div
      className={
        "drop-shadow w-full py-1 break-inside-avoid " +
        (!data.available && "opacity-50 pointer-events-none")
      }
    >
      <Link href={`/store/${vendor_id}/items/${data.id}`}>
        {data.has_image && (
          <Image
            className="rounded-t-2xl bg-cream"
            src={`items/${vendor_id}/${data.id}`}
            alt=""
            width={400}
            height={400}
          />
        )}
        <div
          className={
            (data.has_image ? "rounded-b-2xl" : "rounded-2xl") +
            " flex flex-col bg-cream text-dark text-md px-4 pb-2"
          }
        >
          <span className="font-semibold mt-2">{data.name}</span>
          <span className="text-sm">{data.description}</span>
          <span className="">₱ {data.base_price.toFixed(2)}</span>
        </div>
      </Link>
    </div>
  );
}
