import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Drawer from "../layout/Drawer";

export default function AddItem() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="flex flex-col items-center justify-center rounded-3xl bg-teal"
        onClick={() => setIsOpen(true)}
      >
        <FaPlus className="text-maroon text-4xl" />
        <div className="text-2xl font-bold text-cream">add item</div>
      </button>
      <Drawer title="New Item" isOpen={isOpen} setIsOpen={setIsOpen}></Drawer>
    </>
  );
}
