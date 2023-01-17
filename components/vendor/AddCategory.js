import Drawer from "../layout/Drawer";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";

export default function AddCategory() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="bg-cream rounded-xl h-28 p-2 m-4 flex flex-row items-center justify-center gap-2 hover:scale-110 transition"
        onClick={() => setIsOpen(true)}
      >
        <FaPlus className="text-4xl text-teal" />
        <p className="text-maroon font-bold text-2xl">add food category</p>
      </button>
      <Drawer title="New Category" isOpen={isOpen} setIsOpen={setIsOpen}>
        etits
      </Drawer>
    </>
  );
}
