import { MdEmail, MdLock } from "react-icons/md";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import InputGroup from "../components/forms/InputGroup";
import { useRouter } from "next/router";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Loading from "../components/Loading";
import { useState } from "react";
import Head from "next/head";

const schema = yup.object({
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
  const [loginError, setLoginError] = useState();

  const onSubmit = async (data) => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (!error) {
      router.push("/");
      return;
    }
    setLoading(false);
    setLoginError(error?.message);
  };

  return (
    <>
      <Head>
        <title>Log in | E-TERY</title>
        <meta name="description" content="delivery web app" />
        <link
          rel="icon"
          href="/logo.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/logo-light.png"
          media="(prefers-color-scheme: dark)"
        />
      </Head>
      <Loading isLoading={loading} />
      <div className="m-auto flex h-screen max-w-[450px] flex-col items-center bg-light shadow-lg">
        <Image
          src="graphics/logo.png"
          alt=""
          width={350}
          height={350}
          priority
        />
        <p className="mb-6 text-3xl font-bold">Log in</p>
        <div className="mb-3 font-semibold text-red-500">{loginError}</div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center"
        >
          <InputGroup
            register={register}
            name="email"
            placeholder="email"
            type="text"
            error={errors.email?.message}
          >
            <MdEmail className="h-6 w-6 text-teal" />
          </InputGroup>
          <InputGroup
            register={register}
            name="password"
            placeholder="password"
            type="password"
            error={errors.password?.message}
          >
            <MdLock className="h-6 w-6 text-teal" />
          </InputGroup>
          <button
            type="submit"
            className="rounded-full bg-teal px-5 py-2 text-cream hover:opacity-75"
          >
            log in
          </button>
          <p className="mt-3">{"haven't signed up yet?"}</p>
          <Link href="/signup" className="mb-10 font-bold underline">
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
