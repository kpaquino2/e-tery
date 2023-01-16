import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export default function PasswordInput({ placeholder, error, register, name }) {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="col-span-2">
      <div className="relative">
        <input
          type={showPw ? "text" : "password"}
          className="bg-cream border-none w-full rounded-full text-center text-lg py-1 px-11 focus:ring-maroon"
          placeholder={placeholder}
          maxLength={256}
          {...register(name)}
        />
        <button
          className="absolute rounded-full inset-y-0 right-0 flex items-center px-4"
          type="button"
          onClick={() => setShowPw(!showPw)}
        >
          {showPw ? (
            <IoMdEyeOff className="w-6 h-6 text-dark" />
          ) : (
            <IoMdEye className="w-6 h-6 text-dark" />
          )}
        </button>
      </div>
      {error ? (
        <div className="text-red-500 font-semibold ml-2 text-sm">{error}</div>
      ) : (
        <></>
      )}
    </div>
  );
}
