import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// Helper: Get token from localStorage
export const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // token saved at login
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------------- AUTH ----------------

// Register API
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Login API
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, credentials);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    if (
      response.data.user &&
      (response.data.user._id || response.data.user.id)
    ) {
      localStorage.setItem(
        "userId",
        response.data.user._id || response.data.user.id
      );
    } else if (response.data.token && !localStorage.getItem("userId")) {
      try {
        const payload = JSON.parse(atob(response.data.token.split(".")[1]));
        const id = payload.id || payload.sub || payload.userId || payload.uid;
        if (id) localStorage.setItem("userId", id);
      } catch (e) {
        console.log(e);
      }
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// ---------------- BOARDS ----------------

// Create Board
export const createBoard = async (boardData) => {
  try {
    const response = await axios.post(`${API_BASE}/boards`, boardData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Board creation failed" };
  }
};

// Get All Boards
export const getBoards = async () => {
  try {
    const response = await axios.get(`${API_BASE}/boards`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching boards failed" };
  }
};

// Get Single Board
export const getBoard = async (boardId) => {
  try {
    const response = await axios.get(`${API_BASE}/boards/${boardId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching board failed" };
  }
};

// Delete Board
export const deleteBoard = async (boardId) => {
  try {
    const response = await axios.delete(`${API_BASE}/boards/${boardId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Board deletion failed" };
  }
};

// ---------------- TASKS ----------------

// Get Tasks of a Board
export const getTasks = async (boardId) => {
  try {
    const response = await axios.get(`${API_BASE}/boards/${boardId}/tasks`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching tasks failed" };
  }
};

// Get Single Task
export const getTask = async (boardId, taskId) => {
  try {
    const response = await axios.get(
      `${API_BASE}/boards/${boardId}/tasks/${taskId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching task failed" };
  }
};

// Create Task
export const createTask = async (boardId, taskData) => {
  try {
    const response = await axios.post(
      `${API_BASE}/boards/${boardId}/tasks`,
      taskData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Task creation failed" };
  }
};

// Update Task
export const updateTask = async (boardId, taskId, updates) => {
  try {
    const response = await axios.put(
      `${API_BASE}/boards/${boardId}/tasks/${taskId}`,
      updates,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Task update failed" };
  }
};

// Delete Task
export const deleteTask = async (boardId, taskId) => {
  try {
    const response = await axios.delete(
      `${API_BASE}/boards/${boardId}/tasks/${taskId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Task deletion failed" };
  }
};

export const addList = async (boardId, name) => {
  const response = await axios.post(
    `${API_BASE}/boards/${boardId}/lists`,
    { name },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const updateListsOrder = async (boardId, lists) => {
  const response = await axios.put(
    `${API_BASE}/boards/${boardId}/lists/order`,
    { lists },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const deleteList = async (boardId, listId) => {
  const response = await axios.delete(
    `${API_BASE}/boards/${boardId}/lists/${listId}`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const inviteUser = async (boardId, email) => {
  try {
    const response = await axios.post(
      `${API_BASE}/boards/${boardId}/invite`,
      { email },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "User invitation failed" };
  }
};

export const removeUser = async (boardId, userId) => {
  const response = await axios.delete(`${API_BASE}/boards/${boardId}/remove`, {
    data: { userId }, // send in request body
    headers: getAuthHeader(),
  });
  return response.data;
};

export const exitBoard = async (boardId) => {
  const response = await axios.delete(`${API_BASE}/boards/${boardId}/exit`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
