import AdCarousel from "./AdCarousel";
import Store from "./Store";

export default function CustomerHome({ stores }) {
  return (
    <dic className="flex flex-col mx-8 mt-6">
      <AdCarousel />
      <div className="font-bold text-4xl mb-2">Stores</div>
      <div className="flex flex-col gap-4">
        {stores.map((value, index) => (
          <Store details={value} key={index} />
        ))}
      </div>
    </dic>
  );
}
