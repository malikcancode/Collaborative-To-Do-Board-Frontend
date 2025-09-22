import React, { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { FaPlus, FaTrash, FaCheck } from "react-icons/fa";
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
  onAssignTask, // new
  onCompleteTask, // new
  members = [], // optional: list of board members for assignment
}) {
  const dropRef = useRef(null);
  const [assigningTaskId, setAssigningTaskId] = useState(null);

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item, monitor) => {
      let toIndex = cards.length;
      const clientOffset = monitor.getClientOffset();
      const dropContainer = dropRef.current;

      if (clientOffset && dropContainer) {
        const containerTop = dropContainer.getBoundingClientRect().top;
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

  // --- Task Assignment Dropdown ---
  const handleAssignChange = (taskId, e) => {
    const userId = e.target.value;
    if (userId) onAssignTask(taskId, userId);
    setAssigningTaskId(null);
  };

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
            <div key={card._id} className="relative">
              <Card
                card={card}
                col={col}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
                onComplete={onCompleteTask} // pass the handler here
                id={`card-${card._id}`}
              />

              {/* Assign Dropdown */}
              {onAssignTask && members.length > 0 && (
                <select
                  className="absolute bottom-1 left-1 text-black text-xs"
                  value={card.assignedTo || ""}
                  onChange={(e) => handleAssignChange(card._id, e)}
                >
                  <option value="">Assign...</option>
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.user?.username || m.username || "Unknown"}
                    </option>
                  ))}
                </select>
              )}
            </div>
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
