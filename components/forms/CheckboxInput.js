export default function CheckboxInput({ id, value, size, register, name }) {
  return (
    <>
      <input
        id={id}
        type="checkbox"
        value={value}
        className={
          "w-" +
          size +
          " h-" +
          size +
          " mt-1.5 rounded-full text-teal bg-gray-100 border-maroon focus:ring-teal"
        }
        {...register(name)}
      />
    </>
  );
}
