import { HiUpload } from "react-icons/hi";

import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import TextInputAlt from "../../components/forms/TextInputAlt";
import Upload from "../../components/upload/Upload";
import OptionsFields from "../../components/vendor/OptionsFields";
import Layout from "../../components/layout/Layout";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";

const schema = yup.object({
  name: yup.string().required("name is required"),
  price: yup
    .number()
    .required("base price is required")
    .typeError("please put a valid price"),
  desc: yup.string(),
  variants: yup.array(
    yup.object({
      name: yup.string().required("variant name is required"),
      min: yup
        .number()
        .typeError("please put a valid minimum")
        .required("please put a minimum"),
      max: yup
        .number()
        .typeError("please put a valid maximum")
        .required("please put a maximum"),
      options: yup.array(
        yup.object({
          name: yup.string().required("option name is required"),
          addtl_price: yup
            .number()
            .typeError("please put a valid price")
            .required("please put a valid price"),
        })
      ),
    })
  ),
});

export default function AddItemPage({ vendor_id, category_id }) {
  const supabaseClient = useSupabaseClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({ resolver: yupResolver(schema) });
  const { fields, append, remove } = useFieldArray({
    name: "variants",
    control,
  });
  const router = useRouter();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    const { data: itemData, error: itemError } = await supabaseClient
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
      .select()
      .single();

    if (itemError) {
      throw itemError;
    }

    for (let i = 0; i < data.variants.length; i++) {
      const { data: variantData } = await supabaseClient
        .from("item_variants")
        .insert([
          {
            name: data.variants[i].name,
            min: data.variants[i].min,
            max: data.variants[i].max,
            item_id: itemData.id,
          },
        ])
        .select()
        .single();

      for (let j = 0; j < data.variants[i].options.length; j++) {
        console.log("a");
        const { data: optionData } = await supabaseClient
          .from("item_options")
          .insert([
            {
              name: data.variants[i].options[j].name,
              addtl_price: data.variants[i].options[j].addtl_price,
              variant_id: variantData.id,
            },
          ]);
      }
    }

    if (!itemError) {
      if (image) {
        supabaseClient.storage
          .from("items")
          .upload(vendor_id + "/" + itemData.id, image);
      }
      router.push("/");
      return;
    }
    setLoading(false);
  };

  const addVariant = () => {
    append({ name: "", min: "", max: "" });
  };

  return (
    <>
      <Layout title="New Item">
        <div
          className={
            "relative flex flex-col items-center bg-dark h-full grow pb-12" +
            (loading ? "opacity-75 cursor-wait" : "")
          }
        >
          <button
            type="button"
            className="absolute top-6 left-4 rounded-full p-1"
            onClick={() => router.back()}
            disabled={loading}
          >
            <FaChevronLeft className="text-3xl text-cream" />
          </button>
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

            {fields.map((field, index) => {
              return (
                <div className="flex flex-col items-cnter" key={field.id}>
                  <TextInputAlt
                    label={`Variant ${index + 1}`}
                    register={register}
                    error={errors.variants?.[index]?.name?.message}
                    name={`variants.${index}.name`}
                  />
                  <TextInputAlt
                    label="Minimum selection"
                    register={register}
                    error={errors.variants?.[index]?.min?.message}
                    name={`variants.${index}.min`}
                  />
                  <TextInputAlt
                    label="Maximum selection"
                    register={register}
                    error={errors.variants?.[index]?.max?.message}
                    name={`variants.${index}.max`}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="underline text-xl self-end"
                  >
                    - remove variant
                  </button>
                  <OptionsFields
                    index={index}
                    register={register}
                    control={control}
                    errors={errors}
                  />
                </div>
              );
            })}
            <button
              type="button"
              onClick={addVariant}
              className="underline text-2xl"
            >
              + add variant
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
                "rounded-full bg-teal text-white font-bold text-lg w-min px-8 py-1 mt-8 "
              }
              disabled={loading}
            >
              SUBMIT
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    props: { vendor_id: session?.user.id, category_id: ctx.params.category_id },
  };
};
