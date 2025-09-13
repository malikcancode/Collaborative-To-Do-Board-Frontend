import React, { useEffect } from "react";
import { useDrag } from "react-dnd";
import { FaCog, FaTrash } from "react-icons/fa";

const ItemTypes = { CARD: "card" };

function Card({ card, col, onDelete, onEdit }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id: card._id, fromCol: col },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (isDragging) {
      console.log("Dragging card:", card._id, "from column:", col);
    }
  }, [isDragging]);

  return (
    <div
      ref={drag}
      className={`bg-gray-700 px-3 py-2 rounded-md shadow-sm cursor-pointer transition ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium">{card.title}</p>
          <span className="text-xs text-gray-300">
            {card.deadline
              ? new Date(card.deadline).toLocaleDateString()
              : "No deadline"}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(card)}
            className="text-blue-400 hover:text-blue-600 text-sm"
          >
            <FaCog />
          </button>
          <button
            onClick={() => onDelete(card._id)}
            className="text-red-400 hover:text-red-600 text-sm"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
