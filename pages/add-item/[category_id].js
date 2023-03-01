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
import CheckboxInputAlt from "../../components/forms/CheckboxInputAlt";
import { ImSpinner5 } from "react-icons/im";

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
      optional: yup.boolean().required(),
      select: yup
        .number()
        .typeError("please put a valid number")
        .min(1, "put a number greater than 0")
        .test(
          "max-select",
          "number should be less than or equal to the number of options",
          (value, ctx) => value <= ctx.parent.options.length
        ),
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
    formState: { errors, isSubmitting, isSubmitSuccessful },
    control,
  } = useForm({ resolver: yupResolver(schema) });
  const { fields, append, remove } = useFieldArray({
    name: "variants",
    control,
  });
  const router = useRouter();
  const [image, setImage] = useState("");
  const [initialImage, setInitialImage] = useState("");

  const onSubmit = async (data) => {
    const { data: itemData, error: itemError } = await supabaseClient
      .from("items")
      .insert([
        {
          name: data.name,
          base_price: data.price,
          description: data.desc,
          vendor_id: vendor_id,
          category_id: category_id,
          has_image: image ? true : false,
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
            optional: data.variants[i].optional,
            select: data.variants[i].select,
            item_id: itemData.id,
          },
        ])
        .select()
        .single();

      for (let j = 0; j < data.variants[i].options.length; j++) {
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
          .upload(vendor_id + "/" + itemData.id, image, { cacheControl: 3600 });
      }
      router.push("/");
      return;
    }
  };

  const addVariant = () => {
    append({ name: "", optional: false, select: "" });
  };

  return (
    <>
      <Layout title="New Item">
        <div className="relative flex h-full grow flex-col items-center bg-dark pb-12">
          <button
            type="button"
            className="absolute top-6 left-4 rounded-full p-1"
            onClick={() => router.push("/")}
            disabled={isSubmitting || isSubmitSuccessful}
          >
            <FaChevronLeft className="text-3xl text-cream" />
          </button>
          <p className="mb-4 mt-12 text-4xl font-bold text-cream">Details</p>
          <form
            className="flex w-3/4 flex-col items-center gap-2 text-cream"
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
              label="Base Price"
              register={register}
              error={errors.price?.message}
              name="price"
            />
            {fields.map((field, index) => {
              return (
                <div className="items-cnter flex flex-col" key={field.id}>
                  <TextInputAlt
                    label={`Variant ${index + 1} Name`}
                    register={register}
                    error={errors.variants?.[index]?.name?.message}
                    name={`variants.${index}.name`}
                  />
                  <TextInputAlt
                    label="Number of options to select"
                    register={register}
                    error={errors.variants?.[index]?.select?.message}
                    name={`variants.${index}.select`}
                  />
                  <div className="flex items-center justify-evenly gap-3">
                    <CheckboxInputAlt
                      id={`variant${index}`}
                      value={true}
                      size={7}
                      register={register}
                      name={`variants.${index}.optional`}
                    />
                    <label
                      htmlFor={`variant${index}`}
                      className="text-xl text-light"
                    >
                      Optional
                    </label>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="self-end text-xl underline"
                    >
                      - remove variant
                    </button>
                  </div>

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
              className="text-2xl underline"
            >
              + add variant
            </button>
            <p className="my-4 text-4xl font-bold text-cream">Insert Image:</p>
            <Upload
              initialImage={initialImage}
              setInitialImage={setInitialImage}
              setFinalImage={setImage}
              height={400}
              width={400}
              name="image"
              register={register}
              loading={isSubmitting || isSubmitSuccessful}
            >
              <div className="w-full rounded-2xl bg-teal p-4">
                <HiUpload className="m-auto text-5xl text-maroon" />
              </div>
            </Upload>
            <button
              type="submit"
              className="mt-8 flex w-min items-center justify-center gap-2 rounded-full bg-teal px-8 py-1 text-lg font-bold text-light disabled:brightness-75"
              disabled={isSubmitting || isSubmitSuccessful}
            >
              {(isSubmitting || isSubmitSuccessful) && (
                <ImSpinner5 className="animate-spin" />
              )}
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
