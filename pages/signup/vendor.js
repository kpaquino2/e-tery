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
import Layout from "../../components/layout/Layout";
import TokenInput from "../../components/forms/TokenInput";

const schema = yup.object({
  name: yup.string().required("store name is required"),
  address: yup.string().required("address is required"),
  email: yup
    .string()
    .required("email is required")
    .email("please enter a valid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+((?!@g\.batstate-u\.edu\.ph).)*$/,
      "do not use your school email address as a vendor"
    ),
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
  owner: yup
    .string()
    .required("owner name is required")
    .matches(/^[a-zA-ZñÑ\.'-]+$/, "please enter a valid name"),
  banner: yup.mixed().required("store banner is required"),
});

export default function Customer() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const supabaseClient = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [createAccError, setCreateAccError] = useState();
  const [initialImage, setInitialImage] = useState("");
  const [banner, setBanner] = useState("");
  const [data, setData] = useState({});

  const onSubmit = async (data) => {
    setLoading(true);
    const { error: signUpError } = await supabaseClient.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (!signUpError) {
      setData(data);
      setLoading(false);
      return;
    }
    setCreateAccError(signUpError?.message);
  };

  return (
    <>
      <Layout title="Vendor Sign Up">
        <Link href={"/signup"}>
          <FaChevronLeft className="absolute mt-4 ml-2 h-7 w-7 text-maroon" />
        </Link>
        <Loading isLoading={loading} />
        {Object.keys(data).length ? (
          <TokenInput
            acct_type="vendors"
            data={data}
            setLoading={setLoading}
            banner={banner}
          />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-5"
          >
            <div className="place-self-center text-3xl font-bold ">
              ACTIVATION
            </div>
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
              initialImage={initialImage}
              setInitialImage={setInitialImage}
              setFinalImage={setBanner}
              height={300}
              width={600}
              register={register}
              name="banner"
            >
              <div className="w-full rounded-2xl bg-cream p-4">
                <HiUpload className="m-auto text-5xl text-teal" />
              </div>
            </Upload>
            <div className="ml-2 text-sm font-semibold text-red-500">
              {errors.banner?.message}
            </div>
            {createAccError ? (
              <div className="mb-3 place-self-center font-semibold text-red-500">
                {createAccError}
              </div>
            ) : (
              <></>
            )}
            <button
              type="submit"
              className="w-48 place-self-center rounded-full bg-cream px-10 py-1 text-lg font-bold leading-tight hover:opacity-75"
            >
              create your account
            </button>
            <p className="mt-3 place-self-center">
              {"have an account? "}
              <Link href="/login" className="font-bold underline">
                log in
              </Link>
            </p>
          </form>
        )}
      </Layout>
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
