export default function RadioInput({ id, value, size, register, name }) {
  return (
    <>
      <input
        id={id}
        type="radio"
        value={value}
        className={`w-${size} h-${size} text-teal bg-gray-100 border-maroon focus:ring-teal`}
        {...register(name)}
      />
    </>
  );
}
