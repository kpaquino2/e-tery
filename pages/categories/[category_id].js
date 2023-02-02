import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Layout from "../../components/layout/Layout";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import TextInputAlt from "../../components/forms/TextInputAlt";

const schema = yup.object({
  name: yup.string().required("name is required"),
  desc: yup.string(),
});

export default function EditCategoryPage({ category }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: category.name,
      desc: category.desc,
    },
  });
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const { error } = await supabaseClient.from("categories").upsert(
      [
        {
          id: category.id,
          name: data.name,
          desc: data.desc,
          vendor_id: category.vendor_id,
        },
      ],
      { onConflict: "id" }
    );
    if (!error) {
      router.push("/");
      return;
    }
    setLoading(false);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <>
      <Layout title={category.name}>
        <div className="relative flex h-full grow flex-col items-center bg-dark pb-12">
          <button
            type="button"
            className="absolute top-6 left-4 rounded-full p-1"
            onClick={() => router.push("/")}
            disabled={loading}
          >
            <FaChevronLeft className="text-3xl text-cream" />
          </button>
          <p className="mb-4 mt-12 text-4xl font-bold text-cream">
            Edit Category
          </p>
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
            <div className="flex w-full justify-center gap-2">
              <button
                type="submit"
                className="w-min whitespace-nowrap rounded-full bg-teal px-8 py-1 text-lg font-bold text-white disabled:brightness-50"
                disabled={loading || !isDirty}
              >
                SAVE CHANGES
              </button>
              <button
                type="button"
                className="w-min rounded-full bg-maroon px-8 py-1 text-lg font-bold text-white disabled:brightness-50"
                disabled={loading || !isDirty}
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

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, desc, vendor_id")
    .eq("id", ctx.params.category_id)
    .single();

  return { props: { category } };
};
