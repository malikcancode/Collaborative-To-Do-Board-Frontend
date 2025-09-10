import { useEffect, useState } from "react";

function TaskModal({ isOpen, onClose, onSave, task }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title || "");
        setDescription(task.description || "");
        setDeadline(task.deadline ? task.deadline.split("T")[0] : "");
      } else {
        setTitle("");
        setDescription("");
        setDeadline("");
      }
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave({
      title,
      description,
      deadline,
    });
  };

  return (
    <>
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-black opacity-60 z-40"></div>

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative bg-white p-6 rounded-md w-[40%] shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            {task ? "Update Task" : "Add Task"}
          </h2>

          {/* Rest of your modal content remains the same */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-4 py-2 rounded-md text-sm text-white ${
                task
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {task ? "Update Task" : "Add Task"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskModal;
