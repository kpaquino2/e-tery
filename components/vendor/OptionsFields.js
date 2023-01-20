import { useFieldArray } from "react-hook-form";
import TextInputAlt from "../forms/TextInputAlt";

export default function OptionsFields({ index, control, register, errors }) {
  const { fields, remove, append } = useFieldArray({
    name: `variations.${index}.options`,
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
        <div key={field.id}>
          <TextInputAlt
            label={`Option ${index + 1}`}
            register={register}
            error={errors.variations?.[index]?.options?.[idx]?.name?.message}
            name={`variations.${index}.options.${idx}.name`}
          />
          <TextInputAlt
            label="Price"
            register={register}
            error={
              errors.variations?.[index]?.options?.[idx]?.addtl_price?.message
            }
            name={`variations.${index}.options.${idx}.addtl_price`}
          />
        </div>
      ))}
      <button type="button" onClick={addOption} className="underline text-xl">
        + add option
      </button>
    </div>
  );
}