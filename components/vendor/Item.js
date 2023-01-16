import Image from "next/image";

export default function Item({ data }) {
  console.log(data);
  return (
    <>
      <Image
        className="rounded-t-3xl"
        src={`items/${data.id}`}
        alt={data.name}
        width={200}
        height={200}
      />
      <div className="flex flex-col bg-teal text-cream text-md rounded-b-3xl px-4 py-2 w-[200px]">
        <p className="truncate font-semibold">{data.id}</p>
        <p>Php {data.base_price.toFixed(2)}</p>
        <p>SET AS {data.available ? "UNAVAILABLE" : "AVAILABLE"}</p>
      </div>
    </>
  );
}
