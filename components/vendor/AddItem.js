import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { HiUpload } from "react-icons/hi";
import TextInputAlt from "../forms/TextInputAlt";
import Drawer from "../layout/Drawer";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Upload from "../upload/Upload";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const schema = yup.object({
  name: yup.string().required("name is required"),
  price: yup
    .number()
    .typeError("please put a number")
    .required("base price is required"),
  desc: yup.string(),
});

export default function AddItem({ vendor_id, category_id }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    const {
      data: [responseData],
      error,
    } = await supabaseClient
      .from("items")
      .insert([
        {
          name: data.name,
          base_price: data.price,
          description: data.desc,
          vendor_id: vendor_id,
          category_id: category_id,
        },
      ])
      .select();

    if (!error) {
      if (image) {
        supabaseClient.storage
          .from("items")
          .upload(vendor_id + "/" + responseData.id, image);
      }
      router.replace(router.asPath).then(() => {
        setIsOpen(false);
      });
    }
    setLoading(false);
  };

  return (
    <>
      <button
        className="flex flex-row py-4 gap-2 w-full items-center justify-center rounded-2xl bg-teal"
        onClick={() => setIsOpen(true)}
      >
        <FaPlus className="text-2xl text-maroon" />
        <div className="text-xl font-bold text-cream">add item</div>
      </button>
      <Drawer title="New Item" isOpen={isOpen} setIsOpen={setIsOpen}>
        <p className="text-cream text-4xl font-bold mb-4 mt-12">Details</p>
        <form
          className="flex flex-col items-center gap-2 text-cream w-3/4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInputAlt
            label="Name"
            register={register}
            error={errors.name?.message}
            name="name"
          />
          <TextInputAlt
            label="Description"
            register={register}
            name="desc"
            placeholder="Optional"
          />
          <TextInputAlt
            label="Price"
            register={register}
            error={errors.price?.message}
            name="price"
          />
          <p className="text-cream text-4xl font-bold my-4">Insert Image:</p>
          <Upload
            finalImage={image}
            setFinalImage={setImage}
            aspect={1}
            height={400}
            width={400}
            register={register}
            name="image"
          >
            <div className="bg-teal rounded-2xl w-full p-4">
              <HiUpload className="m-auto text-5xl text-maroon" />
            </div>
          </Upload>
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
