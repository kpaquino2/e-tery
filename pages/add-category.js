import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Drawer from "../components/layout/Drawer";
import TextInputAlt from "../components/forms/TextInputAlt";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Layout from "../components/layout/Layout";
import { FaChevronLeft } from "react-icons/fa";
import { ImSpinner5 } from "react-icons/im";

const schema = yup.object({
  name: yup.string().required("name is required"),
  desc: yup.string(),
});

export default function AddCategoryPage({ vendor_id }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(schema) });
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const categorySamples = [
    "Drinks",
    "Pastas",
    "Rice Meals",
    "Desserts",
    "Breakfast",
  ];

  const onSubmit = async (data) => {
    const { error } = await supabaseClient
      .from("categories")
      .insert([{ name: data.name, desc: data.desc, vendor_id: vendor_id }]);
    if (!error) {
      router.push("/");
      return;
    }
  };

  return (
    <>
      <Layout title="New Category">
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
              placeholder={"eg. " + categorySamples[(5 * Math.random()) | 0]}
            />
            <TextInputAlt
              label="Description"
              register={register}
              name="desc"
              placeholder="Optional"
            />
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
    props: { vendor_id: session?.user.id },
  };
};
