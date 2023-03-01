import Link from "next/link";
import PasswordInput from "../../components/forms/PasswordInput";
import SelectInput from "../../components/forms/SelectInput";
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
import Layout from "../../components/layout/Layout";

const schema = yup.object({
  firstname: yup
    .string()
    .required("first name is required")
    .matches(/^[a-zA-ZñÑ\.'-]+$/, "please enter a valid first name"),
  lastname: yup
    .string()
    .required("last name is required")
    .matches(/^[a-zA-ZñÑ\.'-]+$/, "please enter a valid last name"),
  email: yup
    .string()
    .required("email is required")
    .email("please enter a valid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@g\.batstate-u\.edu\.ph$/,
      "use your school email address to register"
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
    .oneOf([yup.ref("password"), null], "passwords must match")
    .required("password confirmation is required"),
  contact_no: yup
    .string()
    .required("contact number is required")
    .matches(/^((09)|(639))[0-9]{9}/, "enter a valid phone number"),
  classification: yup.string().required("select a user classification"),
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

  const onSubmit = async (data) => {
    setLoading(true);
    const { data: signUpData, error: signUpError } =
      await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
      });

    if (!signUpError) {
      await supabaseClient.from("customers").insert([
        {
          id: signUpData.user.id,
          firstname: data.firstname,
          lastname: data.lastname,
          contact_no: data.contact_no,
          classification: data.classification,
        },
      ]);
      router.push("/");
      return;
    }
    setCreateAccError(signUpError?.message);
    setLoading(false);
  };

  return (
    <>
      <Layout title="Customer Sign Up">
        <Header />
        <Loading isLoading={loading} />
        <Link href={"/signup"}>
          <FaChevronLeft className="absolute mt-4 ml-2 h-7 w-7 text-maroon" />
        </Link>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 p-5"
        >
          <div className="col-span-2 place-self-center text-3xl font-bold ">
            Sign up
          </div>
          <div className="col-span-2 text-xl font-bold">USER DETAILS*</div>
          <TextInput
            register={register}
            error={errors.firstname?.message}
            name="firstname"
            placeholder="first name"
          />
          <TextInput
            register={register}
            error={errors.lastname?.message}
            name="lastname"
            placeholder="last name"
          />
          <div className="col-span-2 text-xl font-bold">
            LOGIN & CONTACT DETAILS*
          </div>
          <TextInput
            register={register}
            error={errors.email?.message}
            name="email"
            addtlClass="col-span-2"
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
            addtlClass="col-span-2"
            placeholder="contact number"
          />
          <div className="col-span-2 text-xl font-bold">CLASSIFICATION*</div>
          <SelectInput
            register={register}
            error={errors.classification?.message}
            addtlClass="col-span-2"
            name="classification"
          >
            <option value="student">Student</option>
            <option value="faculty/staff">Faculty/Staff</option>
          </SelectInput>
          {createAccError ? (
            <div className="col-span-2 mb-3 place-self-center font-semibold text-red-500">
              {createAccError}
            </div>
          ) : (
            <></>
          )}
          <button
            type="submit"
            className="col-span-2 w-48 place-self-center rounded-full bg-cream px-10 py-1 text-lg font-bold leading-tight hover:opacity-75"
          >
            create your account
          </button>
          <p className="col-span-2 mt-3 place-self-center">
            {"have an account? "}
            <Link href="/login" className="font-bold underline">
              log in
            </Link>
          </p>
        </form>
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
