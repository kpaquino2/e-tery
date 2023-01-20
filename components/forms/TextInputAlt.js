export default function TextInputAlt({
  label,
  placeholder,
  type = "text",
  error,
  register,
  name,
}) {
  return (
    <>
      <div className="flex gap-2 items-center text-light text-2xl w-full">
        <label className="whitespace-nowrap">{label}:</label>
        <input
          type={type}
          className="border-x-0 border-t-0 border-b-2 w-full border-light bg-dark focus:ring-0 text-xl p-1 focus:border-inherit"
          placeholder={placeholder}
          {...register(name)}
        />
      </div>
      {error ? (
        <div className="text-red-500 font-semibold ml-2 text-sm">{error}</div>
      ) : (
        <></>
      )}
    </>
  );
}
