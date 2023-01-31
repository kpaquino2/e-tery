import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
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
        "w-full py-1 drop-shadow-lg break-inside-avoid " +
        (!itemAvailable && "opacity-50")
      }
    >
      {data.has_image && (
        <div className="relative">
          <Image
            className="rounded-t-2xl bg-teal"
            src={`items/${vendor_id}/${data.id}`}
            alt=""
            width={400}
            height={400}
          />
          {!itemAvailable && (
            <MdDoNotDisturbAlt className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-maroon text-8xl" />
          )}
        </div>
      )}
      <div
        className={
          (data.has_image ? "rounded-b-2xl" : "rounded-2xl") +
          " flex flex-col bg-teal text-cream text-md px-4 py-2 w-full break-words"
        }
      >
        <span className="font-semibold">{data.name}</span>
        <span className="text-sm">{data.description}</span>
        <span className="">₱ {data.base_price.toFixed(2)}</span>
        <button
          className="underline decoration-solid text-xs pt-2"
          onClick={updateAvailability}
        >
          SET AS {itemAvailable ? "UNAVAILABLE" : "AVAILABLE"}
        </button>
      </div>
    </div>
  );
}
