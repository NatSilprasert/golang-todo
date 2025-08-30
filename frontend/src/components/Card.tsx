import { useState, useRef, useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import axios from "axios";
import { backEndUrl } from "../assets/config";
import { toast } from "sonner";

export default function Card({ id, title, completed, dueDate }: Todo) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title || "Untitled");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Edit function
  const handleEdit = async () => {
    try {
      await axios.put(backEndUrl + '/api/todos/' + id, { title: editTitle });
      toast.success("Todo updated!");
      setIsEditing(false);
      setOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update");
    }
  };

  // Mark as done function
  const handleMarkAsDone = async () => {
    try {
      await axios.put(backEndUrl + '/api/todos/' + id, { done: !completed });
      toast.success("Todo status updated!");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Duplicate function
  const handleDuplicate = async () => {
    try {
      await axios.post(backEndUrl + '/api/todos', { title: title });
      toast.success("Todo duplicated!");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to duplicate");
    }
  };

  // Delete function
  const handleDelete = async () => {
    try {
      await axios.delete(backEndUrl + '/api/todos/' + id);
      toast.success("Todo deleted!");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="p-6 h-fit bg-bg2 rounded-xl flex flex-col gap-4 relative">
      <div className="flex justify-between items-center">
        {isEditing ? (
          <input
            className="bg-bg2 border rounded px-2 py-1"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            autoFocus
          />
        ) : (
          <h2>{editTitle}</h2>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="p-1 hover:bg-bg-hover/40 rounded"
          >
            <EllipsisVertical />
          </button>

          {open && (
            <div className="absolute left-0 mt-2 w-40 bg-bg2 border border-bg-hover rounded-lg shadow-lg z-50">
              {isEditing ? (
                <button
                  className="block w-full px-4 py-2 text-left hover:bg-bg-hover rounded"
                  onClick={handleEdit}
                >
                  Save
                </button>
              ) : (
                <button
                  className="block w-full px-4 py-2 text-left hover:bg-bg-hover rounded"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
              <button
                className="block w-full px-4 py-2 text-left hover:bg-bg-hover rounded"
                onClick={handleMarkAsDone}
              >
                {completed ? "Mark as Undone" : "Mark as Done"}
              </button>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-bg-hover rounded"
                onClick={handleDuplicate}
              >
                Duplicate
              </button>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-bg-hover text-red-500 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-400">Due Date: {dueDate}</p>
      <label className="flex items-center space-x-2 cursor-pointer">
        <Checkbox checked={completed} onCheckedChange={handleMarkAsDone} />
        <span>Done?</span>
      </label>
    </div>
  );
}