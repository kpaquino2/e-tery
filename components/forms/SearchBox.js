import { MdSearch } from "react-icons/md";

export default function SearchBox({ isMenuOpen }) {
  return (
    <>
      <div
        className={
          "absolute left-1/2 -translate-x-1/2 top-[4.25rem] w-4/5 z-20 transform transition duration-300 ease-in-out " +
          (isMenuOpen ? "scale-0" : "")
        }
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-2">
          <MdSearch className="text-xl" />
        </div>
        <input
          type="text"
          className="border-none placeholder-black text-lg rounded-full w-full px-10 py-0 text-center focus:ring-0"
          placeholder="search"
          maxLength={256}
        />
      </div>
    </>
  );
}
