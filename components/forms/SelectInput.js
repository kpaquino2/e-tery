export default function SelectInput({
  register,
  addtlClass,
  name,
  children,
  error,
}) {
  return (
    <div className={addtlClass}>
      <select
        className="bg-cream w-full border-none rounded-full text-center text-lg py-1 focus:ring-maroon "
        defaultValue=""
        {...register(name)}
      >
        <option value="" disabled>
          choose {name}
        </option>
        {children}
      </select>
      <div className="text-red-500 font-semibold ml-2 text-sm">{error}</div>
    </div>
  );
}
