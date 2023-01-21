import { useFieldArray } from "react-hook-form";
import TextInputAlt from "../forms/TextInputAlt";

export default function OptionsFields({ index, control, register, errors }) {
  const { fields, remove, append } = useFieldArray({
    name: `variants.${index}.options`,
    control,
  });

  const addOption = () => {
    append({
      name: "",
      addtl_price: "",
    });
  };

  return (
    <div className="flex flex-col mx-4">
      {fields.map((field, idx) => (
        <div className="flex flex-col items-center" key={field.id}>
          <TextInputAlt
            label={`Option ${idx + 1}`}
            register={register}
            error={errors.variants?.[index]?.options?.[idx]?.name?.message}
            name={`variants.${index}.options.${idx}.name`}
          />
          <TextInputAlt
            label="Price"
            register={register}
            error={
              errors.variants?.[index]?.options?.[idx]?.addtl_price?.message
            }
            name={`variants.${index}.options.${idx}.addtl_price`}
          />
          <button
            type="button"
            onClick={() => remove(idx)}
            className="underline text-xl self-end"
          >
            -remove option
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addOption}
        className="underline text-xl self-start"
      >
        + add option
      </button>
    </div>
  );
}
