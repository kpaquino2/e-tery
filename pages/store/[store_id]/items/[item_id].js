import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import Footer from "../../../../components/layout/Footer";
import Layout from "../../../../components/layout/Layout";
import Banner from "../../../../components/vendor/Banner";
import { TiMinus, TiPlus } from "react-icons/ti";
import RadioInput from "../../../../components/forms/RadioInput";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckboxInput from "../../../../components/forms/CheckboxInput";

const schema = yup.object({
  options: yup.array(
    yup.object({
      addtl_price: yup
        .number()
        .typeError("please put a valid price")
        .required("please put a valid price"),
    })
  ),
});

export default function StoreItemPage({ store_id, item }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({ resolver: yupResolver(schema) });
  const [quantity, setQuantity] = useState(1);
  var optionsCount = -1;

  const subtract = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const add = () => {
    setQuantity(quantity + 1);
  };

  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Layout title={item.name}>
        <Banner url={`items/${store_id}/${item.id}`} />
        <div className="grid grid-cols-2 mx-6 gap-2 pb-20">
          <div className="font-bold text-4xl mt-4">{item.name}</div>
          <div className="font-semibold text-xl row-span-2 justify-self-end self-center">
            Php {item.base_price.toFixed(2)}
          </div>
          <div className="text-2xl">{item.description}</div>
          <div className="bg-cream h-1 col-span-2 rounded-full" />
          {item.item_variants.map((variant, index) => (
            <>
              <div key={index} className="col-span-2 text-xl font-semibold">
                {variant.name}
                <span className="text-base font-normal">
                  {variant.optional
                    ? " Optional, max " + variant.select
                    : " Pick " + variant.select}
                </span>
              </div>
              {variant.item_options.map((option, idx) => {
                optionsCount += 1;
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
                          value={option.addtl_price}
                          register={register}
                          name={`options[${optionsCount}].addtl_price`}
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
                        value={option.addtl_price}
                        register={register}
                        name={`options[${optionsCount}].addtl_price`}
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
          <button className="bg-light my-2 rounded-full text-xl font-bold text-dark">
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
