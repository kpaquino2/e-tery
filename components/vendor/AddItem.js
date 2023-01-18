import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Drawer from "../layout/Drawer";

export default function AddItem({ empty }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={
          (empty ? "flex-row py-4  gap-2" : "flex-col") +
          " flex items-center justify-center rounded-2xl bg-teal"
        }
        onClick={() => setIsOpen(true)}
      >
        <FaPlus
          className={(empty ? "text-2xl" : "text-4xl") + " text-maroon"}
        />
        <div className="text-xl font-bold text-cream">add item</div>
      </button>
      <Drawer title="New Item" isOpen={isOpen} setIsOpen={setIsOpen}></Drawer>
    </>
  );
}
