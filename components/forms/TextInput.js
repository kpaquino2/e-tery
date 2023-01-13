export default function TextInput({
  addtlClass,
  placeholder,
  type = "text",
  error,
  register,
  name,
}) {
  return (
    <div className={addtlClass}>
      <input
        type={type}
        className="w-full bg-cream border-none rounded-full text-center text-lg py-1 px-4 focus:ring-maroon "
        placeholder={placeholder}
        maxLength={256}
        {...register(name)}
      />
      {error ? (
        <div className="text-red-500 font-semibold ml-2 text-sm">{error}</div>
      ) : (
        <></>
      )}
    </div>
  );
}
