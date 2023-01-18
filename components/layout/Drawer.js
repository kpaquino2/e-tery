import { useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";

export default function Drawer({
  children,
  isOpen,
  setIsOpen,
  title,
  loading = false,
}) {
  useEffect(() => {
    if (isOpen) {
      if (typeof window != "undefined" && window.document) {
        document.body.style.overflow = "hidden";
      }
      return;
    }

    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <div
      className={
        "fixed overflow-auto top-20 right-0 bottom-0 left-0 bg-dark z-30 transform ease-in-out transition duration-300 " +
        (isOpen ? "translate-x-0" : "translate-x-full")
      }
    >
      <div
        className="absolute top-6 left-4 rounded-full p-1"
        onClick={() => setIsOpen(false)}
        disabled={loading}
      >
        <FaChevronLeft className="text-3xl text-cream" />
      </div>
      <div className="flex flex-col items-center mt-6">
        <p className="text-5xl font-bold text-light text-center mx-12">
          {title}
        </p>
        {children}
      </div>
    </div>
  );
}
