import Link from "next/link";
import { HiUpload } from "react-icons/hi";
import PasswordInput from "../../components/forms/PasswordInput";
import TextInput from "../../components/forms/TextInput";
import Header from "../../components/layout/Header";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import Loading from "../../components/Loading";
import { FaChevronLeft } from "react-icons/fa";
import Upload from "../../components/upload/Upload";

const schema = yup.object({
  name: yup.string().required("store name is required"),
  address: yup.string().required("address is required"),
  email: yup
    .string()
    .required("email is required")
    .email("please enter a valid email address"),
  password: yup
    .string()
    .required("password is required")
    .min(6, "password must be at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{1,}$/,
      "password must contain an uppercase letter, a lowercase letter, and a number"
    ),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null])
    .required("password confirmation is required"),
  contact_no: yup
    .string()
    .required("contact number is required")
    .matches(/^((09)|(639))[0-9]{9}/, "enter a valid phone number"),
  bir_no: yup.string().required("BIR number is required"),
  owner: yup.string().required("owner name is required"),
});

export default function Customer() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [createAccError, setCreateAccError] = useState();
  const [banner, setBanner] = useState("");
  const onSubmit = async (data) => {
    if (!banner) {
      setCreateAccError("store banner is required");
      return;
    }
    setLoading(true);
    const { data: signUpData, error: signUpError } =
      await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
      });

    if (!signUpError) {
      await supabaseClient.from("vendors").insert([
        {
          id: signUpData.user.id,
          name: data.name,
          address: data.address,
          phone: data.contact_no,
          bir_no: data.bir_no,
          owner: data.owner,
        },
      ]);
      await supabaseClient.storage
        .from("banners")
        .upload(signUpData.user.id, banner);
      router.push("/");
      return;
    }
    setCreateAccError(signUpError?.message);
    setLoading(false);
  };

  return (
    <>
      <Header />
      <Link href={"/signup"}>
        <FaChevronLeft className="absolute w-7 h-7 text-maroon mt-4 ml-2" />
      </Link>
      <Loading isLoading={loading} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-5"
      >
        <div className="text-3xl font-bold place-self-center ">ACTIVATION</div>
        <div className="text-xl font-bold">STORE DETAILS*</div>
        <TextInput
          register={register}
          error={errors.name?.message}
          name="name"
          placeholder="store name"
        />
        <TextInput
          register={register}
          error={errors.address?.message}
          name="address"
          placeholder="address"
        />

        <div className="text-xl font-bold">LOGIN & CONTACT DETAILS*</div>
        <TextInput
          register={register}
          error={errors.email?.message}
          name="email"
          placeholder="email"
        />
        <PasswordInput
          register={register}
          error={errors.password?.message}
          name="password"
          placeholder="password"
        />
        <PasswordInput
          register={register}
          error={errors.confirm_password?.message}
          name="confirm_password"
          placeholder="confirm password"
        />
        <TextInput
          register={register}
          error={errors.contact_no?.message}
          name="contact_no"
          placeholder="contact number"
        />
        <div className="text-xl font-bold">ADDITIONAL INFO*</div>
        <TextInput
          register={register}
          error={errors.bir_no?.message}
          name="bir_no"
          placeholder="BIR number"
        />
        <TextInput
          register={register}
          error={errors.owner?.message}
          name="owner"
          placeholder="owner"
        />
        <div className="text-xl font-bold">STORE BANNER*</div>
        <Upload
          finalImage={banner}
          setFinalImage={setBanner}
          aspect={2}
          height={300}
          width={600}
          register={register}
          name="banner"
          error={errors.banner?.message}
        >
          <div className="bg-cream rounded-2xl w-full p-4">
            <HiUpload className="m-auto text-5xl text-teal" />
          </div>
        </Upload>
        {createAccError ? (
          <div className="place-self-center text-red-500 font-semibold mb-3">
            {createAccError}
          </div>
        ) : (
          <></>
        )}
        <button
          type="submit"
          className="w-48 px-10 py-1 font-bold leading-tight place-self-center bg-cream rounded-full text-lg hover:opacity-75"
        >
          create your account
        </button>
        <p className="place-self-center mt-3">
          {"have an account? "}
          <Link href="/login" className="font-bold underline">
            log in
          </Link>
        </p>
      </form>
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
