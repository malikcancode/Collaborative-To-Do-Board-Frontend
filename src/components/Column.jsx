import React from "react";
import { useDrop } from "react-dnd";
import { FaPlus, FaTrash } from "react-icons/fa";
import Card from "./Card";

const ItemTypes = { CARD: "card" };

function Column({
  title,
  cards,
  moveCard,
  col,
  onAddCard,
  onDeleteTask,
  onEditTask,
  onDeleteList,
}) {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item) => {
      if (item.fromCol !== col) {
        moveCard(item.id, item.fromCol, col);
        item.fromCol = col;
      }
    },
  }));

  return (
    <div
      ref={drop}
      className="w-72 bg-black/80 rounded-md shadow text-white flex flex-col"
    >
      {/* Header  title and delete button */}
      <div className="flex justify-between items-center px-3 py-2">
        <h2 className="font-semibold">{title}</h2>
        <button
          onClick={() => onDeleteList(col)}
          className="text-red-400 hover:text-red-600"
          title="Delete List"
        >
          <FaTrash />
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 px-3 pb-2 space-y-2 overflow-y-auto">
        {cards.length > 0 ? (
          cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              col={col}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))
        ) : (
          <p className="text-xs text-gray-400 italic">No tasks</p>
        )}
      </div>

      <div className="px-3 pb-2">
        <button
          onClick={() => onAddCard(col)}
          className="flex items-center gap-2 w-full px-2 py-1 text-sm rounded hover:bg-gray-700"
        >
          <FaPlus /> Add a card
        </button>
      </div>
    </div>
  );
}

export default Column;
