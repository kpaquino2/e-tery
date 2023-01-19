import Image from "next/image";
import { useState } from "react";
import AddCategory from "./AddCategory";
import { FaPlus } from "react-icons/fa";
import AddItemMenu from "./AddItemMenu";
import Banner from "./Banner";
import Item from "./Item";

export default function VendorHome({ id, data }) {
  const [isAddItemMenuOpen, setIsAddItemMenuOpen] = useState(false);
  const [categoryToAdd, setCategoryToAdd] = useState("");

  return (
    <>
      <AddItemMenu
        isOpen={isAddItemMenuOpen}
        setIsOpen={setIsAddItemMenuOpen}
        vendor_id={id}
        category_id={categoryToAdd}
      />
      <div className="flex flex-col items-center">
        <Banner id={id} />
        <div className="font-bold text-4xl">{data.name}</div>
        <div className="flex flex-col px-2 pb-12 w-full">
          {data.categories.length ? (
            data.categories.map((category, index) => (
              <div key={index}>
                <div className="text-2xl font-semibold">{category.name} </div>
                <div>{category.desc}</div>
                <div className="columns-2 gap-2">
                  {category.items.map((item, index) => (
                    <Item key={index} vendor_id={id} data={item} />
                  ))}
                  <div className="py-1">
                    <button
                      type="button"
                      className="flex flex-row py-4 gap-2 w-full items-center justify-center rounded-2xl bg-teal"
                      onClick={() => {
                        setCategoryToAdd(category.id);
                        setIsAddItemMenuOpen(true);
                      }}
                    >
                      <FaPlus className="text-2xl text-maroon" />
                      <div className="text-xl font-bold text-cream">
                        add item
                      </div>
                    </button>
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
          <AddCategory vendor_id={id} />
        </div>
      </div>
    </>
  );
}
