import { FaChevronLeft } from "react-icons/fa";

export default function Drawer({ children, isOpen, setIsOpen, title }) {
  return (
    <div
      className={
        "fixed overflow-auto top-20 right-0 bottom-0 left-0 bg-dark z-30 transform ease-in-out transition duration-300 " +
        (isOpen ? "translate-x-0" : "translate-x-full")
      }
    >
      <button
        className="absolute top-6 left-4 rounded-full p-1"
        onClick={() => setIsOpen(false)}
      >
        <FaChevronLeft className="text-3xl text-cream" />
      </button>
      <div className="flex flex-col items-center mt-6">
        <p className="text-5xl font-bold text-light">{title}</p>
        {children}
      </div>
    </div>
  );
}
