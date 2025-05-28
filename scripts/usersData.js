/* ----------------------------------
   Firebase Database - Clean Code Version (JOIN Portfolio)
---------------------------------- */

let users = {};
const BASE_URL = "https://join-portfolio-9245f-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Fetches all user data from the Firebase base URL and stores it in the global 'users' object.
 * @async
 * @function getUsersData
 * @returns {Promise<void>} A promise that resolves once the data is fetched and stored.
 */
async function getUsersData() {
  const response = await fetch(`${BASE_URL}/users.json`);
  const responseAsJson = await response.json();
  users = responseAsJson;

  console.log("Daten geladen:", users); // ✅ Kontrollausgabe!
}


/**
 * Posts a new task to the database for a specific user.
 * @async
 * @function postTaskToDatabase
 * @param {string} userId - The ID of the current user.
 * @param {Object} taskData - The task data to be saved.
 * @returns {Promise<Object>} The response object from Firebase with the new task ID.
 * @throws {Error} If the request fails or the response is not OK.
 */
async function postTaskToDatabase(userId, taskData) {
  try {
    const url = `${BASE_URL}/tasks/${userId}.json`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error("Failed to post the task.");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error posting task to database:", error);
  }
}

/**
 * Updates the subtasks of a given task in the database.
 * @async
 * @function updateSubtasksInDatabase
 * @param {string} userId - The ID of the current user.
 * @param {string} taskKey - The unique key of the task to update.
 * @param {Object} subtasks - The updated subtasks object.
 * @returns {Promise<void>}
 * @throws {Error} If the request fails or the response is not OK.
 */
async function updateSubtasksInDatabase(userId, taskKey, subtasks) {
  const taskUrl = `${BASE_URL}/tasks/${userId}/${taskKey}/subtasks.json`;
  try {
    const response = await fetch(taskUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subtasks),
    });
    if (!response.ok) throw new Error("Failed to update subtasks in Firebase.");
  } catch (error) {
    console.error("Error updating subtasks:", error);
  }
}

/**
 * Updates the current status (column) of a given task in the database.
 * @async
 * @function updateTaskColumnInDatabase
 * @param {string} userId - The ID of the current user.
 * @param {string} taskKey - The unique key of the task to update.
 * @param {string} newColumn - The new column/status (e.g., 'toDo', 'inProgress', 'done').
 * @returns {Promise<void>}
 * @throws {Error} If the request fails or the response is not OK.
 */
async function updateTaskColumnInDatabase(userId, taskKey, newColumn) {
  const taskUrl = `${BASE_URL}/tasks/${userId}/${taskKey}/currentStatus.json`;
  try {
    const response = await fetch(taskUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newColumn),
    });
    if (!response.ok)
      throw new Error("Error updating task column in Firebase.");
  } catch (error) {
    console.error("Error updating the task column:", error);
  }
}
