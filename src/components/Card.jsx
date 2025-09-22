import React from "react";
import { useDrag } from "react-dnd";
import { FaCog, FaTrash, FaCheck } from "react-icons/fa";

const ItemTypes = { CARD: "card" };

function Card({ card, col, onDelete, onEdit, onComplete }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id: card._id, fromCol: col },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`px-3 py-2 rounded-md shadow-sm cursor-pointer transition border-l-4
        ${isDragging ? "opacity-50" : ""}
        ${
          card.completed
            ? "bg-green-800 border-green-500 line-through"
            : "bg-gray-700 border-gray-500"
        }
      `}
    >
      <div className="flex justify-between items-start">
        {/* Task Info */}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">{card.title}</p>
          <span className="text-xs text-gray-300">
            {card.deadline
              ? new Date(card.deadline).toLocaleDateString()
              : "No deadline"}
          </span>
          {card.assignedTo && (
            <span className="text-xs text-yellow-300">
              Assigned to: {card.assignedTo.username || "Unknown"}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!card.completed && onComplete && (
            <button
              onClick={() => onComplete(card._id)}
              className="text-green-400 hover:text-green-600 text-sm"
              title="Mark Complete"
            >
              <FaCheck />
            </button>
          )}
          <button
            onClick={() => onEdit(card)}
            className="text-blue-400 hover:text-blue-600 text-sm"
            title="Edit Task"
          >
            <FaCog />
          </button>
          <button
            onClick={() => onDelete(card._id)}
            className="text-red-400 hover:text-red-600 text-sm"
            title="Delete Task"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
