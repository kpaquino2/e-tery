import { useForm } from "react-hook-form";
import RadioInput from "../../components/forms/RadioInput";
import Header from "../../components/layout/Header";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";

const schema = yup.object({
  account_type: yup.number().typeError("please select either one"),
});

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const router = useRouter();

  const onSubmit = (data) => {
    if (data.account_type === 0) router.push("/signup/customer");
    if (data.account_type === 1) router.push("/signup/vendor");
  };

  return (
    <>
      <Header />
      <Link href={"/login"}>
        <FaChevronLeft className="absolute w-7 h-7 text-maroon mt-4 ml-2" />
      </Link>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full items-center mt-48"
      >
        <div className="text-xl font-bold">CREATE ACCOUNT AS</div>
        <div className="flex items-center w-32">
          <RadioInput
            register={register}
            name="account_type"
            id="customer"
            value={0}
            size="5"
          />
          <label htmlFor="customer" className="ml-2 mb-[7px] text-2xl">
            customer
          </label>
        </div>
        <div className="flex items-center w-32">
          <RadioInput
            register={register}
            name="account_type"
            id="vendor"
            value={1}
            size="5"
          />
          <label htmlFor="vendor" className="ml-5 mb-[7px] text-2xl">
            vendor
          </label>
        </div>
        {errors.account_type ? (
          <p className="mb-5 text-red-500 font-semibold">
            {errors.account_type?.message}
          </p>
        ) : (
          <></>
        )}
        <button
          type="submit"
          className="col-span-2 w-auto px-10 py-1 font-bold leading-tight place-self-center bg-cream rounded-full text-lg hover:opacity-75"
        >
          next
        </button>
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
