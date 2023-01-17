import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useState } from "react";
import { MdDoNotDisturbAlt } from "react-icons/md";

export default function Item({ data }) {
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
    <div className="drop-shadow-lg">
      <div className="relative">
        <Image
          className={"rounded-t-3xl " + (itemAvailable ? "" : "opacity-50")}
          src={`items/${data.id}`}
          alt={data.name}
          width={400}
          height={400}
        />
        {!itemAvailable ? (
          <MdDoNotDisturbAlt className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-maroon text-8xl shadow-lg" />
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col bg-teal text-cream text-md rounded-b-3xl px-4 py-2 w-full">
        <p className="truncate font-semibold">{data.name}</p>
        <p className="truncate">Php {data.base_price.toFixed(2)}</p>
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
