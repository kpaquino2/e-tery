import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import Footer from "../../../../components/layout/Footer";
import Layout from "../../../../components/layout/Layout";
import Banner from "../../../../components/vendor/Banner";
import { TiMinus, TiPlus } from "react-icons/ti";
import RadioInput from "../../../../components/forms/RadioInput";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckboxInput from "../../../../components/forms/CheckboxInput";
import { useEffect } from "react";
import { FaCheck, FaChevronLeft, FaHeart, FaRegHeart } from "react-icons/fa";
import useCart from "../../../../lib/cart";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Fragment } from "react";
import { ImSpinner5 } from "react-icons/im";

const schema = yup.object({
  radio_variants: yup.array(
    yup.object({
      selected_option: yup.number(),
    })
  ),
  checkbox_variants: yup.array(
    yup
      .object({
        select: yup.number(),
        optional: yup.boolean(),
        options: yup.array(yup.boolean()),
      })
      .test("count-checked", (value) =>
        value?.optional
          ? value?.select >=
            value?.options.map((v) => Number(v)).reduce((a, b) => a + b)
          : value?.select ===
            value?.options.map((v) => Number(v)).reduce((a, b) => a + b)
      )
  ),
});

export default function StoreItemPage({ customer_id, store, item, favorite }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [quantity, setQuantity] = useState(1);
  const [fav, setFav] = useState(Boolean(favorite));
  const addToCart = useCart((state) => state.addToCart);
  const router = useRouter();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    for (let i = 0; i < item.item_variants.length; i++) {
      if (!item.item_variants[i].optional && item.item_variants[i].select === 1)
        continue;
      register(`checkbox_variants.${i}.optional`);
      setValue(
        `checkbox_variants.${i}.optional`,
        item.item_variants[i].optional
      );
      register(`checkbox_variants.${i}.select`);
      setValue(`checkbox_variants.${i}.select`, item.item_variants[i].select);
    }
    trigger();
  }, [trigger, item, register, setValue]);

  const subtract = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const add = () => {
    setQuantity(quantity + 1);
  };

  const onSubmit = (data) => {
    const final_price =
      item.base_price +
      (data.radio_variants
        ?.map(
          (variant, index) =>
            item.item_variants[index].item_options[variant.selected_option]
              .addtl_price
        )
        .reduce((a, b) => a + b) ?? 0) +
      +(
        data.checkbox_variants
          ?.map((variant, index) =>
            variant.options
              .map((option, idx) =>
                option
                  ? item.item_variants[index].item_options[idx].addtl_price
                  : 0
              )
              .reduce((a, b) => a + b)
          )
          .reduce((a, b) => a + b) ?? 0
      );

    const order_item = {
      item_id: item.id,
      item_name: item.name,
      quantity: quantity,
      price: final_price * quantity,
      options: (
        data.checkbox_variants
          ?.map((variant, index) =>
            variant.options
              .filter((option) => option)
              .map((option, idx) => item.item_variants[index].item_options[idx])
          )
          .flat(1) ?? []
      ).concat(
        data.radio_variants
          ?.map(
            (variant, index) =>
              item.item_variants[index].item_options[variant.selected_option]
          )
          .flat(1) ?? []
      ),
    };
    addToCart({ ...store, order_item });
    router.back();
  };

  const onChange = () => {
    trigger();
  };

  const clickHeart = async () => {
    if (!fav) {
      const { error } = await supabaseClient
        .from("favorites")
        .insert({ item_id: item.id, customer_id: customer_id });
      if (error) console.error(error.message);
      setFav(true);
      return;
    }
    const { error } = await supabaseClient
      .from("favorites")
      .delete()
      .eq("item_id", item.id);
    if (error) console.error(error.message);
    setFav(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={onChange}>
      <Layout title={item.name}>
        <button
          type="button"
          className="absolute top-32 left-4 z-20 rounded-full bg-cream py-2 pl-1.5 pr-2.5"
          onClick={() => router.back()}
          disabled={isSubmitting || isSubmitSuccessful}
        >
          <FaChevronLeft className="text-3xl text-maroon drop-shadow-lg" />
        </button>
        <button
          type="button"
          className="absolute top-32 right-4 z-20 rounded-full bg-cream px-2 pt-2.5 pb-1.5"
          onClick={clickHeart}
        >
          {fav ? (
            <FaHeart className="text-3xl text-maroon drop-shadow-lg" />
          ) : (
            <FaRegHeart className="text-3xl text-maroon drop-shadow-lg" />
          )}
        </button>
        <Banner url={`items/${store.id}/${item.id}`} />
        <div className="grid-cols-auto mx-6 grid gap-2 pb-20">
          <div className="mt-4 text-4xl font-bold">{item.name}</div>
          <div className="mt-4 self-end justify-self-end text-xl font-semibold">
            ₱ {item.base_price.toFixed(2)}
          </div>
          <div className="col-span-2">{item.description}</div>
          <div className="col-span-2 h-1 rounded-full bg-cream" />
          {!store.open && (
            <div className="col-span-2 text-center text-lg font-semibold text-maroon">
              The store is closed.
            </div>
          )}
          {item.item_variants.map((variant, index) => (
            <Fragment key={index}>
              <div className="text-xl font-semibold leading-none">
                {variant.name}
              </div>
              <div className="justify-self-end">
                {!variant.optional &&
                  ((variant.select > 1 &&
                    !errors.checkbox_variants?.[index]?.message && (
                      <FaCheck className="mt-0.5 text-teal" />
                    )) ||
                    (variant.select == 1 && !errors.radio_variants?.[index] && (
                      <FaCheck className="mt-0.5 text-teal" />
                    )))}
              </div>
              <span className="col-span-2 text-sm leading-tight">
                {variant.optional
                  ? " Optional, max " + variant.select
                  : " Pick " + variant.select}
              </span>
              {variant.item_options.map((option, idx) => {
                if (!variant.optional && variant.select === 1)
                  return (
                    <Fragment key={idx}>
                      <label
                        htmlFor={option.id}
                        className="flex items-center gap-2 text-lg"
                      >
                        <RadioInput
                          id={option.id}
                          size={5}
                          value={idx}
                          register={register}
                          name={`radio_variants.${index}.selected_option`}
                        />
                        <div className="">{option.name}</div>
                      </label>
                      <div className="place-self-end font-semibold">
                        +{option.addtl_price.toFixed(2)}
                      </div>
                    </Fragment>
                  );
                return (
                  <Fragment key={idx}>
                    <label
                      htmlFor={option.id}
                      className="flex items-center gap-2 text-lg"
                    >
                      <CheckboxInput
                        id={option.id}
                        size={5}
                        value={true}
                        register={register}
                        name={`checkbox_variants.${index}.options.${idx}`}
                      />
                      <div className="">{option.name}</div>
                    </label>
                    <div className="place-self-end font-semibold">
                      +{option.addtl_price.toFixed(2)}
                    </div>
                  </Fragment>
                );
              })}
            </Fragment>
          ))}
        </div>
      </Layout>
      <Footer>
        <div className="mx-4 grid h-full grid-cols-2 gap-3">
          <div className="flex items-center justify-around">
            <button
              type="button"
              onClick={subtract}
              className="rounded-full bg-light p-1"
            >
              <TiMinus className="text-2xl font-semibold text-maroon" />
            </button>
            <span className="text-2xl font-bold text-cream">{quantity}</span>
            <button
              type="button"
              onClick={add}
              className="rounded-full bg-light p-1"
            >
              <TiPlus className="text-2xl font-semibold text-maroon" />
            </button>
          </div>
          <button
            className="my-2 flex items-center justify-center gap-2 rounded-full bg-teal text-xl font-bold text-light disabled:brightness-75"
            disabled={
              Object.keys(errors).length ||
              !store.open ||
              isSubmitting ||
              isSubmitSuccessful
            }
          >
            {(isSubmitting || isSubmitSuccessful) && (
              <ImSpinner5 className="animate-spin" />
            )}
            ADD TO CART
          </button>
        </div>
      </Footer>
    </form>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const { data: storeData } = await supabase
    .from("vendors")
    .select("id, name, open, address")
    .eq("id", ctx.params.store_id)
    .single();

  const { data: itemData } = await supabase
    .from("items")
    .select(
      "id, name, base_price, description, item_variants(id, name, select, optional, item_options(id, name, addtl_price))"
    )
    .eq("id", ctx.params.item_id)
    .single();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!itemData) return { notFound: true };

  const { data: favoriteData } = await supabase
    .from("favorites")
    .select("customer_id, item_id")
    .eq("item_id", itemData.id)
    .single();

  return {
    props: {
      customer_id: session?.user.id,
      store: storeData,
      item: itemData,
      favorite: favoriteData,
    },
  };
};
