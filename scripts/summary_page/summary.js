/**
 * Initializes the summary page with content and greeting.
 */
function initSummaryPage() {
  renderPage();
  showGreetingOnce();
}

/**
 * Renders the main components of the summary page.
 * Includes template, content, greeting, and metrics update.
 */
function renderPage() {
  const userId = localStorage.getItem("currentUserId");
  if (!userId) {
    window.location.href = "index.html";
  }

  renderDesktopTemplate();
  renderSummaryContent();
  greetingMessage();
  updateSummaryMetricsFromDB(userId);
}

let userCircle;

function renderCurrentUserCircle() {
  const currentUserFirstName = localStorage.getItem("firstName");
  const currentUserLastName = localStorage.getItem("lastName");
  const userCircle =
    currentUserFirstName[0].toUpperCase() +
    currentUserLastName[0].toUpperCase();
  return userCircle;
}

/**
 * Injects the desktop HTML template into the page.
 */
function renderDesktopTemplate() {
  let content = document.getElementById("templateSection");
  content.innerHTML = getDesktopTemplate(renderCurrentUserCircle());
}

/**
 * Loads the summary content and adds it to the DOM.
 */
function renderSummaryContent() {
  const summaryContainer = document.getElementById("newContentSection");
  summaryContainer.innerHTML = getSummaryContent();
  updateSidebarLinksWithUserId()
}

/**
 * Fetches task data from Firebase for a specific user.
 * @param {string} userId - The ID of the current user.
 * @returns {Promise<Array>} - A list of task objects.
 */
async function getTasksFromFirebase(userId) {
  const response = await fetch(
    `https://join-portfolio-9245f-default-rtdb.europe-west1.firebasedatabase.app/${userId}/tasks.json`
  );
  const data = await response.json();
  return Object.values(data || {});
}

/**
 * Counts how many tasks have a specific status.
 * @param {Array} tasks - List of task objects.
 * @param {string} status - The status to filter by.
 * @returns {number} - The number of matching tasks.
 */
function countTasksByStatus(tasks, status) {
  return tasks.filter((task) => task.currentStatus === status).length;
}

/**
 * Counts how many tasks have a specific priority.
 * @param {Array} tasks - List of task objects.
 * @param {string} priority - The priority to filter by.
 * @returns {number} - The number of matching tasks.
 */
function countTasksByPriority(tasks, priority) {
  return tasks.filter((task) => task.priority === priority).length;
}

/**
 * Gets the closest due date for urgent tasks.
 * @param {Array} tasks - List of task objects.
 * @returns {string} - The date of the next urgent task or "-" if none found.
 */
function getNextUrgentDeadline(tasks) {
  const urgentTasks = tasks
    .filter((task) => task.priority === "Urgent")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  return urgentTasks[0]?.dueDate || "-";
}

/**
 * Updates task counters and deadlines in the summary UI.
 * @param {string} userId - The ID of the current user.
 */
async function updateSummaryMetricsFromDB(userId) {
  const tasks = await getTasksFromFirebase(userId);

  document.getElementById("todo-count").textContent = countTasksByStatus(tasks, "toDo");
  document.getElementById("done-count").textContent = countTasksByStatus(tasks, "done");
  document.getElementById("urgent-count").textContent = countTasksByPriority(tasks, "Urgent");
  document.getElementById("urgent-deadline").textContent = getNextUrgentDeadline(tasks);
  document.getElementById("board-count").textContent = tasks.length;
  document.getElementById("progress-count").textContent = countTasksByStatus(tasks, "inProgress");
  document.getElementById("feedback-count").textContent = countTasksByStatus(tasks, "awaitFeedback");
}

/**
 * Displays a greeting message based on time and user name.
 */
function greetingMessage() {
  let greetingSection = document.getElementById("greetingSpot");
  let currentHour = new Date().getHours();
  let greeting = getTimeBasedGreeting(currentHour);
  let userName = localStorage.getItem("userName") || "Guest";
  greetingSection.innerHTML = `
        <span class="greeting-time">${greeting},</span>
        <span class="greeting-name">${userName}</span>
    `;
}

/**
 * Returns a time-based greeting string.
 * @param {number} hour - The current hour.
 * @returns {string} - A greeting message.
 */
function getTimeBasedGreeting(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Redirects to the board section of the app.
 */
function changeWindowToBoardSection() {
  window.location.href = "board.html";
}

/**
 * Shows the greeting overlay once per mobile session.
 */
function showGreetingOnce() {
  const isMobile = window.innerWidth <= 1200;
  const wasGreeted = localStorage.getItem("wasGreeted");
  if (isMobile) {
    if (wasGreeted === "true") {
      hideGreetingOverlay();
    } else {
      showGreetingOverlay();
      localStorage.setItem("wasGreeted", "true");
    }
  } else {
    showGreetingOverlay();
  }
}

/**
 * Displays the greeting overlay element.
 */
function showGreetingOverlay() {
  let greetingOverlay = document.getElementById("greetingMessageSection");
  if (greetingOverlay) {
    greetingOverlay.style.display = "flex";
  }
}

/**
 * Hides the greeting overlay element.
 */
function hideGreetingOverlay() {
  let greetingOverlay = document.getElementById("greetingMessageSection");
  if (greetingOverlay) {
    greetingOverlay.style.display = "none";
  }
}