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

const schema = yup.object({
  variants: yup.array(
    yup
      .object({
        optional: yup.boolean(),
        select: yup.number(),
        options: yup.array(
          yup.object({
            addtl_price: yup.number(),
            checked: yup.boolean(),
          })
        ),
      })
      .test("count-checked", (value) =>
        value.optional
          ? value.select >=
            value.options.map((v) => Number(v.checked)).reduce((a, b) => a + b)
          : value.select ===
            value.options.map((v) => Number(v.checked)).reduce((a, b) => a + b)
      )
  ),
});

export default function StoreItemPage({ store_id, item }) {
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

  useEffect(() => {
    for (let i = 0; i < item.item_variants.length; i++) {
      register(`variants.${i}.optional`);
      setValue(`variants.${i}.optional`, item.item_variants[i].optional);
      register(`variants.${i}.select`);
      setValue(`variants.${i}.select`, item.item_variants[i].select);
      for (let j = 0; j < item.item_variants[i].length; j++) {
        register(`variants.${i}.options.${j}.addtl_price`);
        setValue(
          `variants.${i}.options.${j}.addtl_price`,
          item.item_variants[i].options[j].addtl_price
        );
      }
    }
    trigger();
  }, [register, setValue, trigger, item]);

  const subtract = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const add = () => {
    setQuantity(quantity + 1);
  };

  const onSubmit = (data) => {
    // console.log(data);
  };

  const onBlur = () => {
    trigger();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={onBlur}>
      <Layout title={item.name}>
        <Banner url={`items/${store_id}/${item.id}`} />
        <div className="grid grid-cols-2 mx-6 gap-2 pb-20">
          <div className="font-bold text-4xl mt-4">{item.name}</div>
          <div className="font-semibold text-xl justify-self-end self-end mt-4">
            Php {item.base_price.toFixed(2)}
          </div>
          <div className="col-span-2">{item.description}</div>
          <div className="bg-cream h-1 col-span-2 rounded-full" />
          {item.item_variants.map((variant, index) => (
            <>
              <div key={index} className="text-xl font-semibold leading-none">
                {variant.name}
              </div>
              <div className="justify-self-end">
                {Object.keys(errors).length || variant.optional ? (
                  <></>
                ) : (
                  <FaCheck className="text-teal mt-1" />
                )}
              </div>
              <span className="col-span-2 text-sm leading-tight">
                {variant.optional
                  ? " Optional, max " + variant.select
                  : " Pick " + variant.select}
              </span>
              {variant.item_options.map((option, idx) => {
                if (variant.optional && variant.select === 1)
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
                          value={true}
                          register={register}
                          name={`variants.${index}.options.${idx}.checked`}
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
                        name={`variants.${index}.options.${idx}.checked`}
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
              type="submit"
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
  const { data } = await supabase
    .from("items")
    .select(
      "id, name, base_price, description, item_variants(id, name, select, optional, item_options(id, name, addtl_price))"
    )
    .eq("id", ctx.params.item_id)
    .single();

  if (!data) return { notFound: true };
  return { props: { store_id: ctx.params.store_id, item: data } };
};
