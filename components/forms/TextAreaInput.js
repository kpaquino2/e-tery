export default function TextAreaInput({
  rows,
  placeholder,
  error,
  register,
  name,
}) {
  return (
    <>
      <textarea
        rows={rows}
        className="rounded-xl border-none bg-cream py-1 px-2 text-lg focus:ring-maroon"
        placeholder={placeholder}
        {...register(name)}
      />
      {error && (
        <div className="ml-2 text-center text-sm font-semibold text-red-500">
          {error}
        </div>
      )}
    </>
  );
}
