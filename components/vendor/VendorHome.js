import Banner from "./Banner";
import Item from "./Item";

export default function VendorHome({ data }) {
  return (
    <div className="flex flex-col items-center">
      <Banner />
      <div className="font-bold text-4xl">{data.name}</div>
      <div className="flex flex-col">
        {data.categories.map((category, index) => (
          <div key={index}>
            <div className="text-2xl font-semibold">{category.name}</div>
            {category.items.map((item, index) => (
              <Item key={index} data={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
