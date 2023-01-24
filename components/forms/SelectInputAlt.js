export default function SelectInputAlt({ register, name, children, error }) {
  return (
    <>
      <select
        className="appearance-none font-semibold border-none bg-teal p-0 focus:ring-0"
        {...register(name)}
      >
        {children}
      </select>
    </>
  );
}
