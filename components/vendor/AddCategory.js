import Drawer from "../layout/Drawer";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import TextInputAlt from "../forms/TextInputAlt";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const schema = yup.object({
  name: yup.string().required("name is required"),
  desc: yup.string(),
});

export default function AddCategory({ id }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const categorySamples = [
    "Drinks",
    "Pastas",
    "Rice Meals",
    "Desserts",
    "Breakfast",
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    const { error } = await supabaseClient
      .from("categories")
      .insert([{ name: data.name, desc: data.desc, vendor_id: id }]);
    if (!error) {
      router.replace(router.asPath).then(() => {
        setLoading(false);
        setIsOpen(false);
      });
    }
  };

  return (
    <>
      <button
        className="bg-cream rounded-xl h-28 my-4 flex flex-row items-center justify-center gap-2 hover:scale-110 transition"
        onClick={() => setIsOpen(true)}
      >
        <FaPlus className="text-4xl text-teal" />
        <p className="text-maroon font-bold text-2xl">add food category</p>
      </button>
      <Drawer
        title="New Category"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        loading={loading}
      >
        <p className="text-cream text-4xl font-bold mb-4 mt-12">Details</p>
        <form
          className="flex flex-col items-center gap-2 text-cream mx-12"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInputAlt
            label="Name"
            register={register}
            error={errors.name?.message}
            name="name"
            placeholder={"eg. " + categorySamples[(5 * Math.random()) | 0]}
          />
          <TextInputAlt label="Description" register={register} name="desc" />
          <button
            type="submit"
            className={
              "rounded-full bg-teal text-white font-bold text-lg w-min px-8 py-1 mt-8 " +
              (loading ? "opacity-75 cursor-wait" : "")
            }
            disabled={loading}
          >
            SUBMIT
          </button>
        </form>
      </Drawer>
    </>
  );
}
