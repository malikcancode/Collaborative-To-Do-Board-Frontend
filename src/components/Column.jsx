import React, { useRef } from "react";
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
  const dropRef = useRef(null);

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item, monitor) => {
      console.log("Dropped card:", item.id, "from:", item.fromCol, "to:", col);

      let toIndex = cards.length; // default append at end

      const clientOffset = monitor.getClientOffset();
      const dropContainer = dropRef.current;

      if (clientOffset && dropContainer) {
        const containerTop = dropContainer.getBoundingClientRect().top;

        // y position of cursor relative to column
        const dropY = clientOffset.y - containerTop;

        for (let i = 0; i < cards.length; i++) {
          const cardElement = document.getElementById(`card-${cards[i]._id}`);
          if (cardElement) {
            const { top, height } = cardElement.getBoundingClientRect();
            const relativeY = top - containerTop;

            if (dropY < relativeY + height / 2) {
              toIndex = i;
              break;
            }
          }
        }
      }

      if (item.fromCol !== col) {
        moveCard(item.id, item.fromCol, col, toIndex);
        item.fromCol = col;
      } else {
        moveCard(item.id, col, col, toIndex);
      }
    },
  }));

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className="w-72 bg-black/80 rounded-md shadow text-white flex flex-col"
    >
      {/* Header */}
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
              id={`card-${card._id}`} // 👈 needed for measuring
            />
          ))
        ) : (
          <p className="text-xs text-gray-400 italic">No tasks</p>
        )}
      </div>

      {/* Add card */}
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
