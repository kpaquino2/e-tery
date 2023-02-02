import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MdDoNotDisturbAlt } from "react-icons/md";

export default function Item({ vendor_id, data }) {
  const supabaseClient = useSupabaseClient();
  const [itemAvailable, setItemAvailable] = useState(data.available);

  const updateAvailability = async () => {
    const { error } = await supabaseClient
      .from("items")
      .update({ available: !itemAvailable })
      .eq("id", data.id);
    if (!error) setItemAvailable(!itemAvailable);
  };

  return (
    <div
      className={
        "w-full break-inside-avoid py-1 drop-shadow-lg " +
        (!itemAvailable && "opacity-50")
      }
    >
      <Link href={`/items/${data.id}`}>
        {data.has_image && (
          <div className="relative">
            <Image
              className="rounded-t-2xl bg-teal"
              src={`items/${vendor_id}/${data.id}?time=${data.updated_at}`}
              alt=""
              width={400}
              height={400}
            />
            {!itemAvailable && (
              <MdDoNotDisturbAlt className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-8xl text-maroon" />
            )}
          </div>
        )}
        <div
          className={
            (data.has_image ? "rounded-b-2xl" : "rounded-2xl") +
            " text-md flex w-full flex-col break-words bg-teal px-4 py-2 text-cream"
          }
        >
          <span className="font-semibold">{data.name}</span>
          <span className="text-sm">{data.description}</span>
          <span className="">₱ {data.base_price.toFixed(2)}</span>
          <button
            className="pt-2 text-xs underline decoration-solid"
            onClick={updateAvailability}
          >
            SET AS {itemAvailable ? "UNAVAILABLE" : "AVAILABLE"}
          </button>
        </div>
      </Link>
    </div>
  );
}
