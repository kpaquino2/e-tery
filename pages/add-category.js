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

const schema = yup.object({
  name: yup.string().required("name is required"),
  desc: yup.string(),
});

export default function AddCategoryPage({ vendor_id }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
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
      .insert([{ name: data.name, desc: data.desc, vendor_id: vendor_id }]);
    if (!error) {
      router.push("/");
      return;
    }
    setLoading(false);
  };

  return (
    <>
      <Layout title="New Category">
        <div
          className={
            "relative flex flex-col items-center bg-dark h-full grow pb-12" +
            (loading ? "opacity-75 cursor-wait" : "")
          }
        >
          <button
            type="button"
            className="absolute top-6 left-4 rounded-full p-1"
            onClick={() => router.push("/")}
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
              className="rounded-full bg-teal text-white font-bold text-lg w-min px-8 py-1 mt-8 "
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
    props: { vendor_id: session?.user.id },
  };
};
