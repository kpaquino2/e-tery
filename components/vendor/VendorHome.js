import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import Banner from "./Banner";
import Item from "./Item";
import Link from "next/link";
import { MdDelete, MdEdit } from "react-icons/md";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function VendorHome({ id, data }) {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const handleDelete = async (category_id) => {
    const { error } = await supabaseClient
      .from("categories")
      .delete()
      .eq("id", category_id);
    if (!error) router.replace(router.asPath);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <Banner url={`banners/${id}`} />
        <div className="text-4xl font-bold">{data.name}</div>
        <div className="flex w-full flex-col px-2">
          {data.categories.length ? (
            data.categories.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-dark">
                  <div className="text-2xl font-semibold">{category.name}</div>
                  <div className="flex gap-2">
                    <Link
                      href={`/categories/${category.id}`}
                      className="text-2xl"
                    >
                      <MdEdit />
                    </Link>
                    <button
                      type="button"
                      className="text-2xl disabled:opacity-50"
                      onClick={() => handleDelete(category.id)}
                      disabled={category.items.length}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
                <div>{category.desc}</div>
                <div className="columns-2 gap-2">
                  {category.items.map((item, index) => (
                    <Item key={index} vendor_id={id} data={item} />
                  ))}
                  <div className="break-inside-avoid py-1">
                    <Link
                      href={`add-item/${category.id}`}
                      className="flex w-full flex-row items-center justify-center gap-2 rounded-2xl bg-teal py-4"
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
              <div className="text-center text-2xl font-bold">
                your store seems empty
              </div>
              <div className="text-center text-lg font-semibold">
                add a category to get started!
              </div>
            </>
          )}
          <Link
            href="add-category"
            className="my-4 flex h-28 flex-row items-center justify-center gap-2 rounded-xl bg-cream"
          >
            <FaPlus className="text-4xl text-teal" />
            <p className="text-2xl font-bold text-maroon">add food category</p>
          </Link>
        </div>
      </div>
    </>
  );
}
