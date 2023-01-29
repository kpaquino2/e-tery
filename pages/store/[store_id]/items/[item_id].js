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
import { FaCheck } from "react-icons/fa";
import useCart from "../../../../lib/cart";
import { useRouter } from "next/router";

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

export default function StoreItemPage({ store, item }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCart((state) => state.addToCart);
  const router = useRouter();

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
      data.radio_variants
        .map(
          (variant, index) =>
            item.item_variants[index].item_options[variant.selected_option]
              .addtl_price
        )
        .reduce((a, b) => a + b) +
      +data.checkbox_variants
        .map((variant, index) =>
          variant.options
            .map((option, idx) =>
              option
                ? item.item_variants[index].item_options[idx].addtl_price
                : 0
            )
            .reduce((a, b) => a + b)
        )
        .reduce((a, b) => a + b);
    const order_item = {
      item_id: item.id,
      item_name: item.name,
      quantity: quantity,
      price: final_price * quantity,
      options: data.checkbox_variants
        .map((variant, index) =>
          variant.options.map(
            (option, idx) =>
              option && item.item_variants[index].item_options[idx]
          )
        )
        .flat(1)
        .concat(
          data.radio_variants
            .map(
              (variant, index) =>
                item.item_variants[index].item_options[variant.selected_option]
            )
            .flat(1)
        ),
    };
    console.log(order_item);
    addToCart({ ...store, order_item });
    router.back();
  };

  const onChange = () => {
    trigger();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={onChange}>
      <Layout title={item.name}>
        <Banner url={`items/${store.id}/${item.id}`} />
        <div className="grid grid-cols-2 mx-6 gap-2 pb-20">
          <div className="font-bold text-4xl mt-4">{item.name}</div>
          <div className="font-semibold text-xl justify-self-end self-end mt-4">
            ₱ {item.base_price.toFixed(2)}
          </div>
          <div className="col-span-2">{item.description}</div>
          <div className="bg-cream h-1 col-span-2 rounded-full" />
          {item.item_variants.map((variant, index) => (
            <>
              <div key={index} className="text-xl font-semibold leading-none">
                {variant.name}
              </div>
              <div className="justify-self-end">
                {!variant.optional &&
                  ((variant.select > 1 &&
                    !errors.checkbox_variants?.[index]?.message && (
                      <FaCheck className="text-teal" />
                    )) ||
                    (variant.select == 1 && !errors.radio_variants?.[index] && (
                      <FaCheck className="text-teal" />
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
                    <>
                      <label
                        htmlFor={option.id}
                        key={idx}
                        className="text-lg flex items-center gap-2"
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
                      <div className="font-semibold place-self-end">
                        +{option.addtl_price.toFixed(2)}
                      </div>
                    </>
                  );
                return (
                  <>
                    <label
                      htmlFor={option.id}
                      key={idx}
                      className="text-lg flex items-center gap-2"
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
                    <div className="font-semibold place-self-end">
                      +{option.addtl_price.toFixed(2)}
                    </div>
                  </>
                );
              })}
            </>
          ))}
        </div>
      </Layout>
      <Footer>
        <div className="grid grid-cols-2 gap-3 h-full mx-4">
          <div className="flex items-center justify-around">
            <button
              type="button"
              onClick={subtract}
              className="bg-light rounded-full p-1"
            >
              <TiMinus className="text-maroon text-2xl font-semibold" />
            </button>
            <span className="text-cream font-bold text-2xl">{quantity}</span>
            <button
              type="button"
              onClick={add}
              className="bg-light rounded-full p-1"
            >
              <TiPlus className="text-maroon text-2xl font-semibold" />
            </button>
          </div>
          <button
            className="bg-teal my-2 rounded-full text-xl font-bold text-light disabled:grayscale"
            disabled={Object.keys(errors).length}
          >
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

  if (!itemData) return { notFound: true };
  return { props: { store: storeData, item: itemData } };
};
