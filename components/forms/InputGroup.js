export default function InputGroup({
  children,
  placeholder,
  type,
  error,
  register,
  name,
}) {
  return (
    <>
      <div className="relative w-2/3">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          {children}
        </div>
        <input
          type={type}
          className="bg-maroon border-none text-cream placeholder-cream rounded-full w-full px-11 py-3 text-center focus:ring-teal"
          placeholder={placeholder}
          maxLength={256}
          {...register(name)}
        />
      </div>
      <div className="text-red-500 font-semibold mb-3">{error}</div>
    </>
  );
}
