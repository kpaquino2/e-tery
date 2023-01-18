import Image from "next/image";
import AddCategory from "./AddCategory";
import AddItem from "./AddItem";
import Banner from "./Banner";
import Item from "./Item";

export default function VendorHome({ id, data }) {
  return (
    <div className="flex flex-col items-center">
      <Banner id={id} />
      <div className="font-bold text-4xl">{data.name}</div>
      <div className="flex flex-col px-2 pb-12 w-full">
        {data.categories.length ? (
          data.categories.map((category, index) => (
            <div key={index}>
              <div className="text-2xl font-semibold">{category.name}</div>
              <div className="columns-2 gap-2">
                {category.items.map((item, index) => (
                  <Item key={index} vendor_id={id} data={item} />
                ))}
                <AddItem vendor_id={id} category_id={category.id} />
              </div>
            </div>
          ))
        ) : (
          <>
            <Image
              src="graphics/empty.png"
              alt="empty store"
              width={600}
              height={500}
            />
            <div className="text-2xl font-bold text-center">
              your store seems empty
            </div>
            <div className="text-lg font-semibold text-center">
              add a category to get started!
            </div>
          </>
        )}
        <AddCategory vendor_id={id} />
      </div>
    </div>
  );
}
