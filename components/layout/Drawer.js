import { useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";

export default function Drawer({
  children,
  isOpen,
  setIsOpen,
  title,
  loading = false,
  top = "top-20",
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
        `fixed overflow-y-auto overflow-x-hidden ${top} h-screen left-1/2 max-w-[450px] w-screen pb-12 bg-dark z-50 transform ease-in-out transition duration-300 ` +
        (isOpen ? "-translate-x-1/2" : "translate-x-[100vw]")
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
