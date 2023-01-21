export default function CheckboxInput({ id, value, size, register, name }) {
  return (
    <>
      <input
        id={id}
        value={value}
        type="checkbox"
        className={`w-${size} h-${size} rounded text-teal bg-gray-100 border-maroon focus:ring-teal`}
        {...register(name)}
      />
    </>
  );
}
