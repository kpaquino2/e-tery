export default function CheckboxInput({ size, register, name }) {
  return (
    <>
      <input
        type="checkbox"
        className={`w-${size} h-${size} mt-1.5 rounded-full text-teal bg-gray-100 border-maroon focus:ring-teal`}
        {...register(name)}
      />
    </>
  );
}
