import Banner from "./Banner";
import Item from "./Item";

export default function VendorHome({ id, data }) {
  return (
    <div className="flex flex-col items-center">
      <Banner id={id} />
      <div className="font-bold text-4xl">{data.name}</div>
      <div className="flex flex-col px-4">
        {data.categories.map((category, index) => (
          <div key={index}>
            <div className="text-2xl font-semibold">{category.name}</div>
            <div className="grid grid-cols-2 gap-4 pb-10">
              {category.items.map((item, index) => (
                <Item key={index} data={item} />
              ))}
              {category.items.map((item, index) => (
                <Item key={index} data={item} />
              ))}
              {category.items.map((item, index) => (
                <Item key={index} data={item} />
              ))}
              {category.items.map((item, index) => (
                <Item key={index} data={item} />
              ))}
              {category.items.map((item, index) => (
                <Item key={index} data={item} />
              ))}
              {category.items.map((item, index) => (
                <Item key={index} data={item} />
              ))}
              {category.items.map((item, index) => (
                <Item key={index} data={item} />
              ))}
              {category.items.map((item, index) => (
                <Item key={index} data={item} />
              ))}
              {category.items.map((item, index) => (
                <Item key={index} data={item} />
              ))}
              {category.items.map((item, index) => (
                <Item key={index} data={item} />
              ))}
              {category.items.map((item, index) => (
                <Item key={index} data={item} />
              ))}
              {category.items.map((item, index) => (
                <Item key={index} data={item} />
              ))}
              {category.items.map((item, index) => (
                <Item key={index} data={item} />
              ))}
              {category.items.map((item, index) => (
                <Item key={index} data={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
