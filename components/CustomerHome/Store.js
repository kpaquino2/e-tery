import { TiStarFullOutline } from "react-icons/ti";

export default function Store({ details }) {
  var price = [],
    i = 0,
    len = details.price_range;
  while (++i <= len) price.push("$");
  return (
    <div className="flex flex-col bg-teal rounded-2xl h-32 px-4 py-2 mx-6">
      <div className="text-cream font-bold text-xl">{details.name}</div>
      <div className="">
        {price.map(function (i) {
          return i;
        })}
      </div>
      <div className="self-end mt-auto">
        {details.rating ? (
          <div className="flex items-center text-cream font-semibold">
            <TiStarFullOutline className="w-5 h-5 text-maroon" />
            {details.rating}
          </div>
        ) : (
          "no ratings yet"
        )}
      </div>
    </div>
  );
}
