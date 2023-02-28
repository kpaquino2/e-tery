import {
  FaChevronLeft,
  FaRegFrown,
  FaRegGrin,
  FaRegMeh,
  FaRegSadTear,
  FaRegSmile,
} from "react-icons/fa";
import TextAreaInput from "../components/forms/TextAreaInput";
import Layout from "../components/layout/Layout";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ImSpinner5 } from "react-icons/im";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import * as moment from "moment";
import { useRouter } from "next/router";

const schema = yup.object({
  experience: yup.number().typeError("please choose your experience"),
  suggestion: yup.string().max(1000),
});

export default function SuggestionsPage({ user_id, last }) {
  const hoursSinceLast = moment().diff(moment(last), "hours");

  const supabaseClient = useSupabaseClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();

  const onSubmit = async (data) => {
    const { error } = await supabaseClient.from("suggestions").insert({
      experience: data.experience,
      suggestion: data.suggestion,
      user_id: user_id,
    });
    if (!error) router.replace(router.asPath);
  };

  return (
    <>
      <Layout title="suggestions">
        <button
          type="button"
          className="absolute top-24 left-4 z-20 rounded-full py-2 pl-1.5 pr-2.5"
          onClick={() => router.back()}
        >
          <FaChevronLeft className="text-3xl text-maroon drop-shadow-lg" />
        </button>
        <p className="my-3 mx-auto mt-2 w-3/4 text-center text-4xl font-bold text-dark">
          Feedback and Suggestions
        </p>
        <form
          className="flex flex-col gap-2 px-2.5"
          onSubmit={handleSubmit(onSubmit)}
        >
          {!last || hoursSinceLast >= 24 ? (
            <>
              <p className="text-center text-lg font-bold text-dark">
                How is your overall experience with our app?
              </p>
              <div className="mb-2 flex gap-1.5">
                <label className="flex-1" htmlFor="terrible">
                  <input
                    id="terrible"
                    type="radio"
                    {...register("experience")}
                    value="1"
                    className="peer hidden"
                  />
                  <div className="flex h-16 w-full select-none flex-col items-center justify-center rounded-xl bg-cream p-1 text-teal transition-all duration-300 peer-checked:bg-teal peer-checked:text-cream">
                    <FaRegSadTear className="my-auto text-3xl" />
                    <span className="text-xs font-bold">Terrible</span>
                  </div>
                </label>
                <label className="flex-1" htmlFor="bad">
                  <input
                    id="bad"
                    type="radio"
                    value="2"
                    {...register("experience")}
                    className="peer hidden"
                  />
                  <div className="flex h-16 w-full select-none flex-col items-center justify-center rounded-xl bg-cream p-1 text-teal transition-all duration-300 peer-checked:bg-teal peer-checked:text-cream">
                    <FaRegFrown className="my-auto text-3xl" />
                    <span className="text-xs font-bold">Bad</span>
                  </div>
                </label>
                <label className="flex-1" htmlFor="okay">
                  <input
                    id="okay"
                    type="radio"
                    value="3"
                    {...register("experience")}
                    className="peer hidden"
                  />
                  <div className="flex h-16 w-full select-none flex-col items-center justify-center rounded-xl bg-cream p-1 text-teal transition-all duration-300 peer-checked:bg-teal peer-checked:text-cream">
                    <FaRegMeh className="my-auto text-3xl" />
                    <span className="text-xs font-bold">Okay</span>
                  </div>
                </label>
                <label className="flex-1" htmlFor="good">
                  <input
                    id="good"
                    type="radio"
                    value="4"
                    {...register("experience")}
                    className="peer hidden"
                  />
                  <div className="flex h-16 w-full select-none flex-col items-center justify-center rounded-xl bg-cream p-1 text-teal transition-all duration-300 peer-checked:bg-teal peer-checked:text-cream">
                    <FaRegSmile className="my-auto text-3xl" />
                    <span className="text-xs font-bold">Good</span>
                  </div>
                </label>
                <label className="flex-1" htmlFor="excellent">
                  <input
                    id="excellent"
                    type="radio"
                    value="5"
                    {...register("experience")}
                    className="peer hidden"
                  />
                  <div className="flex h-16 w-full select-none flex-col items-center justify-center rounded-xl bg-cream p-1 text-teal transition-all duration-300 peer-checked:bg-teal peer-checked:text-cream">
                    <FaRegGrin className="my-auto text-3xl" />
                    <span className="text-xs font-bold">Excellent</span>
                  </div>
                </label>
              </div>
              {errors.experience && (
                <div className="ml-2 text-center text-sm font-semibold text-red-500">
                  {errors.experience.message}
                </div>
              )}
              <p className="text-center text-lg font-bold text-dark">
                Do you have any suggestions to improve our app?
              </p>
              <TextAreaInput
                rows={5}
                placeholder="Write suggestions here..."
                register={register}
                name="suggestion"
                error={errors.suggestion?.message}
              />
              <button
                type="submit"
                className="mt-2 mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-maroon text-lg font-bold text-cream disabled:brightness-75"
                disabled={isSubmitting || isSubmitSuccessful}
              >
                {isSubmitting && <ImSpinner5 className="animate-spin" />}
                SUBMIT
              </button>
            </>
          ) : (
            <div className="py-8 text-center text-burgundy">
              <div className="text-xl font-bold">
                Thank you for the suggestion!
              </div>
              <div className="font-semibold">
                Come back {moment(last).add(1, "d").fromNow()} to give another.
              </div>
            </div>
          )}
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

  const { data: last_sug } = await supabase
    .from("suggestions")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return {
    props: { user_id: session?.user.id, last: last_sug?.created_at || null },
  };
};
