import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaUserCircle,
  FaStar,
  FaShareAlt,
  FaBell,
  FaCog,
  FaEllipsisV,
  FaTrash,
} from "react-icons/fa";
import { useDrag, useDrop } from "react-dnd";
import {
  getBoards,
  createBoard,
  getTasks,
  createTask,
  updateTask,
  deleteBoard, // ✅ new
  deleteTask,
  addList, // ✅ new
} from "../../api/api";
import TaskModal from "../../components/TaskModal";

const ItemTypes = {
  CARD: "card",
};

// --- CARD ---
function Card({ card, col, onDelete, onEdit }) {
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

// --- COLUMN ---
function Column({
  title,
  cards,
  moveCard,
  col,
  onAddCard,
  onDeleteTask,
  onEditTask,
}) {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item) => {
      // Only move if dropped into a different column
      if (item.fromCol !== col) {
        moveCard(item.id, item.fromCol, col); // Pass col as new column
        item.fromCol = col; // Update the dragged item's column for future drags
      }
    },
  }));

  return (
    <div
      ref={drop}
      className="w-72 bg-black/80 rounded-md shadow text-white flex flex-col"
    >
      <div className="flex justify-between items-center px-3 py-2">
        <h2 className="font-semibold">{title}</h2>
        <div className="flex gap-2 text-gray-400">
          <FaStar className="cursor-pointer hover:text-yellow-400" />
          <FaShareAlt className="cursor-pointer hover:text-blue-400" />
        </div>
      </div>

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

// --- DASHBOARD ---
function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCol, setModalCol] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasksByList, setTasksByList] = useState({});
  const [newListName, setNewListName] = useState("");
  const [modalList, setModalList] = useState(null); // NEW

  useEffect(() => {
    if (activeBoard) {
      setLists(activeBoard.lists || []);
      fetchTasks(activeBoard._id);
    }
  }, [activeBoard]);

  function getStatusForList(listId) {
    const list = lists.find((l) => l._id === listId);
    if (!list) return undefined;
    // Map list name to status
    if (list.name.toLowerCase().includes("progress")) return "In Progress";
    if (list.name.toLowerCase().includes("done")) return "Done";
    return "To Do";
  }

  const [columns, setColumns] = useState({
    todo: [],
    progress: [],
    done: [],
  });

  useEffect(() => {
    fetchBoards();
  }, []);

  // fetch boards
  const fetchBoards = async () => {
    try {
      const data = await getBoards();
      setBoards(data);
      if (data.length > 0) setActiveBoard(data[0]);
    } catch (err) {
      console.error("Error fetching boards:", err);
    }
  };

  // fetch tasks
  const fetchTasks = async (boardId) => {
    try {
      const data = await getTasks(boardId);
      setTasksByList(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleAddList = async () => {
    if (!newListName.trim() || !activeBoard) return;
    const newList = await addList(activeBoard._id, newListName);
    setLists([...lists, newList]);
    setNewListName("");
  };

  // create new board
  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      const newBoard = await createBoard({ name: newBoardName });
      setBoards([...boards, newBoard]);
      setActiveBoard(newBoard);
      setNewBoardName("");
    } catch (err) {
      console.error("Error creating board:", err);
    }
  };

  // delete board
  const handleDeleteBoard = async (boardId) => {
    try {
      await deleteBoard(boardId);
      setBoards(boards.filter((b) => b._id !== boardId));
      if (activeBoard && activeBoard._id === boardId) {
        setActiveBoard(null);
      }
      setDropdownOpen(false);
    } catch (err) {
      console.error("Error deleting board:", err);
    }
  };

  // move card
  const moveCard = async (cardId, fromCol, toCol) => {
    if (!activeBoard) return;
    try {
      if (fromCol !== toCol) {
        const newStatus = getStatusForList(toCol);
        await updateTask(activeBoard._id, cardId, {
          listId: toCol,
          status: newStatus,
        });
        await fetchTasks(activeBoard._id);
      }
    } catch (error) {
      console.error("Error moving card:", error);
    }
  };

  // delete task
  const handleDeleteTask = async (taskId) => {
    if (!activeBoard) return;
    try {
      await deleteTask(activeBoard._id, taskId);
      await fetchTasks(activeBoard._id);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const openTaskModal = (listId) => {
    // Find the list object by id
    const listObj = lists.find((l) => l._id === listId);
    setModalList(listObj || null);
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalCol(
      task.status === "To Do"
        ? "todo"
        : task.status === "In Progress"
        ? "progress"
        : "done"
    );
    setModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    if (!activeBoard) return;
    try {
      const payload = {
        ...taskData,
        listId: editingTask ? editingTask.listId : modalList._id, // use correct listId
      };
      if (editingTask) {
        await updateTask(activeBoard._id, editingTask._id, payload);
      } else {
        await createTask(activeBoard._id, payload);
      }
      await fetchTasks(activeBoard._id);
      setModalOpen(false);
      setEditingTask(null);
      setModalList(null); // reset
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-3 bg-gray-900 text-white shadow">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-wide">MyTrello</span>
        </div>

        <div className="flex-1 max-w-2xl mx-6 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800 rounded px-3 py-2 w-full">
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Board name"
              className="bg-transparent outline-none text-sm text-white placeholder-gray-400 w-full"
            />
          </div>
          <button
            onClick={handleCreateBoard}
            className="flex whitespace-nowrap cursor-pointer items-center gap-2 bg-blue-600 px-4 py-2 rounded-md text-xs font-medium hover:bg-blue-700 transition"
          >
            <FaPlus /> Create Board
          </button>
        </div>

        <div className="flex items-center gap-5">
          <FaBell className="text-xl cursor-pointer hover:text-yellow-400" />
          <FaCog className="text-xl cursor-pointer hover:text-blue-400" />
          <FaUserCircle className="text-2xl cursor-pointer" />
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 p-4 bg-cover bg-center bg-blue-900 overflow-x-auto relative">
        {activeBoard ? (
          <div className="flex flex-col gap-6">
            {/* Dropdown */}
            <div className="relative inline-block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-white text-2xl"
              >
                <FaEllipsisV />
              </button>

              {dropdownOpen && (
                <div className="absolute mt-2 w-48 bg-white shadow-lg py-2 z-10">
                  <p className="px-4 py-2 text-gray-700 uppercase font-semibold border-b">
                    {activeBoard.name}
                  </p>
                  <button
                    onClick={() => handleDeleteBoard(activeBoard._id)}
                    className="w-full text-left cursor-pointer px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Delete Board
                  </button>
                </div>
              )}
            </div>

            {/* Columns */}
            <div className="flex items-start gap-4 w-max">
              {lists.map((list) => (
                <Column
                  key={list._id}
                  title={list.name}
                  cards={tasksByList[list._id] || []}
                  moveCard={moveCard}
                  onAddCard={openTaskModal}
                  col={list._id}
                  onDeleteTask={handleDeleteTask}
                  onEditTask={openEditModal}
                />
              ))}
              {/* 
              <Column
                title="In Progress"
                cards={columns.progress}
                moveCard={moveCard}
                onAddCard={openTaskModal}
                col="progress"
                onDeleteTask={handleDeleteTask}
              />
              <Column
                title="Done"
                cards={columns.done}
                moveCard={moveCard}
                onAddCard={openTaskModal}
                col="done"
                onDeleteTask={handleDeleteTask}
              /> */}

              <div className="w-72 bg-gray-200 rounded-md shadow flex flex-col items-center justify-center p-4">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name"
                  className="mb-2 px-2 py-1 rounded border w-full"
                />
                <button
                  onClick={handleAddList}
                  className="bg-blue-600 text-white px-3 py-1 rounded w-full"
                >
                  + Add another list
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white text-center h-[80vh] flex items-center justify-center">
            No boards found. Create one above.
          </p>
        )}
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        defaultStatus="To Do"
        task={editingTask}
      />
    </div>
  );
}

export default Dashboard;
