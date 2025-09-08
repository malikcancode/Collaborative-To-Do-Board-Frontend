import React, { useEffect, useState } from "react";

function TaskModal({ isOpen, onClose, onSave, defaultStatus, task }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [deadline, setDeadline] = useState(task?.deadline?.split("T")[0] || "");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDeadline(task.deadline ? task.deadline.split("T")[0] : "");
    } else {
      setTitle("");
      setDescription("");
      setDeadline("");
    }
  }, [task, isOpen]); // Runs whenever 'task' or 'isOpen' changes

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      title,
      description,
      deadline,
      status: task ? task.status : defaultStatus,
    });
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-lg font-bold mb-4">Add Task</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-2 py-1 mb-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-2 py-1 mb-2 rounded"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full border px-2 py-1 mb-2 rounded"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
