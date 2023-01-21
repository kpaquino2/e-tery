export default function CheckboxInputAlt({ id, value, size, register, name }) {
  return (
    <>
      <input
        id={id}
        value={value}
        type="checkbox"
        className={`w-${size} h-${size} text-teal bg-dark border-cream focus:ring-teal`}
        {...register(name)}
      />
    </>
  );
}
