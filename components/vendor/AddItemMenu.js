import { HiUpload } from "react-icons/hi";
import TextInputAlt from "../forms/TextInputAlt";
import Drawer from "../layout/Drawer";
import Upload from "../upload/Upload";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

const schema = yup.object({
  name: yup.string().required("name is required"),
  price: yup
    .number()
    .required("base price is required")
    .typeError("please put a valid price"),
  desc: yup.string(),
  variations: yup.array().of(
    yup.object({
      name: yup.string().required("variation name is required"),
      min: yup
        .number()
        .typeError("please put a valid minimum")
        .required("please put a minimum"),
      max: yup
        .number()
        .typeError("please put a valid maximum")
        .required("please put a maximum"),
    })
  ),
});

export default function AddItemMenu({
  isOpen,
  setIsOpen,
  vendor_id,
  category_id,
}) {
  const supabaseClient = useSupabaseClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({ resolver: yupResolver(schema) });
  const { fields, append, remove } = useFieldArray({
    name: "desc",
    control,
  });
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(category_id);
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
        reset();
        setImage("");
        setLoading(false);
      });
    }
  };
  return (
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
        <button type="button" className="underline text-2xl">
          + add variation
        </button>
        <p className="text-cream text-4xl font-bold my-4">Insert Image:</p>
        <Upload
          finalImage={image}
          setFinalImage={setImage}
          aspect={1}
          height={400}
          width={400}
          register={register}
          name="image"
          loading={loading}
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
  );
}
