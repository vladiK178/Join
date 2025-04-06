/**
 * Initializes the summary page by loading user data,
 * setting the current user, and rendering the page.
 */
function initSummaryPage() {
  renderPage();
  showGreetingOnce(); // Decide whether to show greeting overlay or not
}

/**
 * Renders the main page by rendering a desktop template,
 * summary content, and greeting message.
 */
function renderPage() {
  renderDesktopTemplate();
  renderSummaryContent();
  greetingMessage();
  updateSummaryMetrics();
}

/**
 * Renders the desktop template into the element with the ID 'templateSection'.
 */
function renderDesktopTemplate() {
  let content = document.getElementById("templateSection");
  content.innerHTML = getDesktopTemplate();
}

/**
 * Retrieves all tasks from localStorage after login
 */
function getTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || {};
  return Object.values(tasks);
}

/**
 * Counts tasks by their current status
 */
function countTasksByStatus(status) {
  return getTasksFromLocalStorage().filter(task => task.currentStatus === status).length;
}

/**
* Counts tasks by priority
*/
function countTasksByPriority(priority) {
  return getTasksFromLocalStorage().filter(task => task.priority === priority).length;
}

/**
* Returns the due date of the next urgent task
*/
function getNextUrgentDeadline() {
  const urgentTasks = getTasksFromLocalStorage()
      .filter(task => task.priority === 'Urgent')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  return urgentTasks[0]?.dueDate || '-';
}

/**
 * Updates the summary tiles with dynamic task data
 */
function updateSummaryMetrics() {
  document.getElementById("todo-count").textContent = countTasksByStatus("toDo");
  document.getElementById("done-count").textContent = countTasksByStatus("done");
  document.getElementById("urgent-count").textContent = countTasksByPriority("Urgent");
  document.getElementById("urgent-deadline").textContent = getNextUrgentDeadline();
  document.getElementById("board-count").textContent = getTasksFromLocalStorage().length;
  document.getElementById("progress-count").textContent = countTasksByStatus("inProgress");
  document.getElementById("feedback-count").textContent = countTasksByStatus("awaitFeedback");
}

/**
 * Renders the summary content by inserting the HTML returned from getSummaryContent()
 * into the element with the ID 'templateSection' (appending it to the desktop template).
 */
function renderSummaryContent() {
  let templateSection = document.getElementById("newContentSection");
  templateSection.innerHTML += getSummaryContent();
}

/**
 * Displays a time-based greeting with the user's name.
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
 * Returns a greeting string based on the current hour.
 */
function getTimeBasedGreeting(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Redirects to 'board.html'.
 */
function changeWindowToBoardSection() {
  window.location.href = "board.html";
}

/**
 * Decides whether to show the greeting overlay or not.
 * If 'wasGreeted' in localStorage is 'true', hide the overlay.
 * Otherwise, show it and set the flag.
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
 * Shows the greeting overlay (e.g., by setting display: flex or block).
 * Make sure the element with ID 'greetingMessageSection' exists in HTML.
 */
function showGreetingOverlay() {
  let greetingOverlay = document.getElementById("greetingMessageSection");
  if (greetingOverlay) {
    greetingOverlay.style.display = "flex";
  }
}

/**
 * Hides the greeting overlay (e.g., by setting display: none).
 */
function hideGreetingOverlay() {
  let greetingOverlay = document.getElementById("greetingMessageSection");
  if (greetingOverlay) {
    greetingOverlay.style.display = "none";
  }
}