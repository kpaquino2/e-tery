import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import Banner from "./Banner";
import Item from "./Item";
import Link from "next/link";

export default function VendorHome({ id, data }) {
  return (
    <>
      <div className="flex flex-col items-center">
        <Banner url={`banners/${id}`} />
        <div className="font-bold text-4xl">{data.name}</div>
        <div className="flex flex-col px-2 w-full">
          {data.categories.length ? (
            data.categories.map((category, index) => (
              <div key={index}>
                <div className="text-2xl font-semibold">{category.name} </div>
                <div>{category.desc}</div>
                <div className="columns-2 gap-2">
                  {category.items.map((item, index) => (
                    <Item key={index} vendor_id={id} data={item} />
                  ))}
                  <div className="py-1 break-inside-avoid">
                    <Link
                      href={`add-item/${category.id}`}
                      className="flex flex-row py-4 gap-2 w-full items-center justify-center rounded-2xl bg-teal"
                    >
                      <FaPlus className="text-2xl text-maroon" />
                      <div className="text-xl font-bold text-cream">
                        add item
                      </div>
                    </Link>
                  </div>
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
          <Link
            href="add-category"
            className="bg-cream rounded-xl h-28 my-4 flex flex-row items-center justify-center gap-2"
          >
            <FaPlus className="text-4xl text-teal" />
            <p className="text-maroon font-bold text-2xl">add food category</p>
          </Link>
        </div>
      </div>
    </>
  );
}
