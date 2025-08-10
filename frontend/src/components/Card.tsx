import { useState, useRef, useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

export default function Card() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-6 h-fit bg-bg2 rounded-xl flex flex-col gap-4 relative">
      <div className="flex justify-between items-center">
        <h2>Do Homework</h2>

        {/* ปุ่ม Ellipsis */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="p-1 hover:bg-bg-hover/40 rounded"
          >
            <EllipsisVertical />
          </button>

          {/* เมนู Dropdown */}
          {open && (
            <div className="absolute left-0 mt-2 w-40 bg-bg2 border border-bg-hover rounded-lg shadow-lg z-50">
              <button className="block w-full px-4 py-2 text-left hover:bg-bg-hover rounded">
                Edit
              </button>
              <button className="block w-full px-4 py-2 text-left hover:bg-bg-hover rounded">
                Mark as Done
              </button>
              <button className="block w-full px-4 py-2 text-left hover:bg-bg-hover rounded">
                Duplicate
              </button>
              <button className="block w-full px-4 py-2 text-left hover:bg-bg-hover text-red-500 rounded">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-400">Create on: 12-12-25</p>
      <label className="flex items-center space-x-2 cursor-pointer">
        <Checkbox />
        <span>Done?</span>
      </label>
    </div>
  );
}