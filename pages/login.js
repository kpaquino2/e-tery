import { MdEmail, MdLock } from "react-icons/md";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import RadioInput from "../components/forms/RadioInput";
import InputGroup from "../components/forms/InputGroup";
import { useRouter } from "next/router";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Loading from "../components/layout/Loading";
import { useState } from "react";

const schema = yup.object({
  loginas: yup.string().typeError("choose either customer or vendor"),
  email: yup
    .string()
    .email("enter a valid email address")
    .required("email is required"),
  password: yup.string().required("password is required"),
});

export default function LogInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (!error) {
      router.push("/");
    }
  };

  return (
    <>
      <Loading isLoading={loading} />
      <div className="flex flex-col items-center">
        <Image src="/logo.png" alt="" width={350} height={350} />
        <p className="text-3xl font-bold mb-8">Log in</p>
        <p className="text-2xl font-light">as</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center w-full"
        >
          <div className="flex items-center w-32">
            <RadioInput
              register={register}
              name="loginas"
              id="customer"
              value="customer"
              size="5"
            />
            <label htmlFor="customer" className="ml-2 mb-[7px] text-2xl">
              customer
            </label>
          </div>
          <div className="flex items-center w-32">
            <RadioInput
              register={register}
              name="loginas"
              id="vendor"
              value="vendor"
              size="5"
            />
            <label htmlFor="vendor" className="ml-5 mb-[7px] text-2xl">
              vendor
            </label>
          </div>
          <p className="mb-5 text-red-500 font-semibold">
            {errors.loginas?.message}
          </p>
          <InputGroup
            register={register}
            name="email"
            placeholder="email"
            type="text"
            error={errors.email?.message}
          >
            <MdEmail className="w-6 h-6 text-teal" />
          </InputGroup>
          <InputGroup
            register={register}
            name="password"
            placeholder="password"
            type="password"
            error={errors.password?.message}
          >
            <MdLock className="w-6 h-6 text-teal" />
          </InputGroup>
          <button
            type="submit"
            className="bg-teal text-cream rounded-full px-5 py-2 hover:opacity-75"
          >
            log in
          </button>
          <p className="mt-3">{"haven't signed up yet?"}</p>
          <Link href="/signup" className="font-bold underline mb-10">
            sign up now
          </Link>
        </form>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
};
