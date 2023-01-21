export default function CheckboxInputAlt({ size, register, name }) {
  return (
    <>
      <input
        type="checkbox"
        className={`w-${size} h-${size} mt-1.5 text-teal bg-dark border-cream focus:ring-teal`}
        {...register(name)}
      />
    </>
  );
}
