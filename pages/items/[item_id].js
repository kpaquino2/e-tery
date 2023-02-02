import { yupResolver } from "@hookform/resolvers/yup";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa";
import { HiUpload } from "react-icons/hi";
import { MdDelete, MdEdit } from "react-icons/md";
import * as yup from "yup";
import CheckboxInputAlt from "../../components/forms/CheckboxInputAlt";
import TextInputAlt from "../../components/forms/TextInputAlt";
import Layout from "../../components/layout/Layout";
import Upload from "../../components/upload/Upload";
import OptionsFields from "../../components/vendor/OptionsFields";

const schema = yup.object({
  name: yup.string().required("name is required"),
  price: yup
    .number()
    .required("base price is required")
    .typeError("please put a valid price"),
  desc: yup.string(),
  image: yup.mixed(),
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

export default function ItemPage({ id, item, imageUrl }) {
  const supabaseClient = useSupabaseClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: item.name,
      price: String(item.base_price),
      desc: item.description,
      image: null,
      variants: item.item_variants.map((v) => ({
        name: v.name,
        optional: v.optional,
        select: String(v.select),
        options: v.item_options.map((o) => ({
          name: o.name,
          addtl_price: String(o.addtl_price),
        })),
      })),
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "variants",
    control,
  });
  const router = useRouter();
  const [image, setImage] = useState("");
  const [editImage, setEditImage] = useState(false);
  const [initialImage, setInitialImage] = useState(item.has_image && imageUrl);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const { data: itemData, error: itemError } = await supabaseClient
      .from("items")
      .update([
        {
          name: data.name,
          base_price: data.price,
          description: data.desc,
          vendor_id: id,
          category_id: item.category_id,
          has_image: image ? true : editImage ? false : item.has_image,
        },
      ])
      .eq("id", router.query.item_id)
      .select()
      .single();

    if (itemError) {
      console.error(itemError);
      return;
    }

    for (let i = 0; i < data.variants.length; i++) {
      const { data: variantData, error: variantError } = await supabaseClient
        .from("item_variants")
        .upsert(
          [
            {
              id: item.item_variants[i]?.id ?? null,
              name: data.variants[i].name,
              optional: data.variants[i].optional,
              select: data.variants[i].select,
              item_id: itemData.id,
            },
          ],
          { onConflict: "id" }
        )
        .select()
        .single();

      for (let j = 0; j < data.variants[i].options.length; j++) {
        await supabaseClient.from("item_options").upsert(
          [
            {
              id: item.item_variants[i]?.item_options[j]?.id ?? null,
              name: data.variants[i].options[j].name,
              addtl_price: data.variants[i].options[j].addtl_price,
              variant_id: variantData.id,
            },
          ],
          { onConflict: "id" }
        );
      }
    }

    if (!itemError) {
      if (image) {
        supabaseClient.storage
          .from("items")
          .upload(id + "/" + itemData.id, image, {
            cacheControl: "3600",
            upsert: true,
          });
      }
      router.push("/");
      return;
    }
    setLoading(false);
  };

  const addVariant = () => {
    append({ name: "", optional: false, select: "" });
  };

  const handleReset = () => {
    reset();
    setInitialImage(item.has_image && imageUrl);
    setImage("");
    setEditImage(false);
  };

  return (
    <>
      <Layout title={item.name}>
        <div className="relative flex h-full grow flex-col items-center bg-dark pb-12">
          <button
            type="button"
            className="absolute top-6 left-4 rounded-full p-1"
            onClick={() => router.push("/")}
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
            {!editImage && item.has_image ? (
              <div className="relative">
                <Image
                  src={`items/${id}/${router.query.item_id}?time=${item.updated_at}`}
                  alt=""
                  height={400}
                  width={400}
                />
                <button
                  type="button"
                  onClick={() => setEditImage(true)}
                  className="absolute top-2 right-12 rounded-full bg-maroon p-1 text-xl drop-shadow"
                >
                  <MdEdit />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditImage(true);
                    setInitialImage("");
                  }}
                  className="absolute top-2 right-2 rounded-full bg-maroon p-1 text-xl drop-shadow"
                >
                  <MdDelete />
                </button>
              </div>
            ) : (
              <>
                <p className="my-4 text-4xl font-bold text-cream">
                  {item.has_image ? "Edit" : "Insert"} Image:
                </p>
                <Upload
                  initialImage={initialImage}
                  setInitialImage={setInitialImage}
                  setFinalImage={setImage}
                  height={400}
                  width={400}
                  name="image"
                  register={register}
                  loading={loading}
                >
                  <div className="mb-4 w-full rounded-2xl bg-teal p-4">
                    <HiUpload className="m-auto text-5xl text-maroon" />
                  </div>
                </Upload>
              </>
            )}
            <div className="flex w-full justify-center gap-2">
              <button
                type="submit"
                className="w-min whitespace-nowrap rounded-full bg-teal px-8 py-1 text-lg font-bold text-white disabled:brightness-50"
                disabled={loading || !(editImage || isDirty)}
              >
                SAVE CHANGES
              </button>
              <button
                type="button"
                className="w-min rounded-full bg-maroon px-8 py-1 text-lg font-bold text-white disabled:brightness-50"
                disabled={loading || !(editImage || isDirty)}
                onClick={handleReset}
              >
                RESET
              </button>
            </div>
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
  const { data: item } = await supabase
    .from("items")
    .select(
      "name, base_price, description, category_id, has_image, updated_at, item_variants (id, name, select, optional, item_options(id, name, addtl_price))"
    )
    .eq("id", ctx.params.item_id)
    .single();
  if (!item) return { notFound: true };
  const { data: image } = await supabase.storage
    .from("items")
    .getPublicUrl(`${session?.user.id}/${ctx.params.item_id}`);

  return { props: { id: session?.user.id, item, imageUrl: image.publicUrl } };
};
