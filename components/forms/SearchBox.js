import { MdSearch } from "react-icons/md";

export default function SearchBox({ isMenuOpen }) {
  return (
    <>
      <div
        className={
          "fixed right-12 left-12 top-16 z-20 transform transition duration-300 ease-in-out " +
          (isMenuOpen ? "scale-0" : "")
        }
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-2">
          <MdSearch className="w-7 h-7" />
        </div>
        <input
          type="text"
          className="border-none placeholder-black text-xl rounded-full w-full px-10 py-0.5 text-center focus:ring-0"
          placeholder="search"
          maxLength={256}
        />
      </div>
    </>
  );
}
