import { ImSpinner5 } from "react-icons/im";

export default function Loading({ isLoading }) {
  return (
    <div
      className={
        "bg-white/50 fixed top-0 left-0 right-0 bottom-0 z-50 grid place-content-center cursor-wait " +
        (isLoading ? "visible" : "invisible")
      }
    >
      <ImSpinner5 className="w-12 h-12 text-maroon animate-spin" />
    </div>
  );
}
