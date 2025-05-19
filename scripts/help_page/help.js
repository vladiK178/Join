/** Stores the currently logged-in user's data */
let currentUser;

/**
 * Initializes the Help page for a logged-in user.
 * - Fetches user data from the backend
 * - Sets the current user based on localStorage ID
 * - Renders the desktop layout with the user's initials
 * - Clears any selected section highlight
 * - Displays the Help content
 */
async function initHelpPage() {
  await getUsersData();
  currentSubTask = {};

  let currentUserId = localStorage.getItem("currentUserId");
  currentUser = users[currentUserId];
  renderDesktopTemplate();
  changeToNoChosenSection();
  renderHelpContent();
}

/** Stores the initials of the current user (used in UI display) */
let userCircle;

/**
 * Generates the current user's initials based on localStorage values.
 *
 * @returns {string} The initials (first letters of first and last name in uppercase)
 */
function renderCurrentUserCircle() {
  const currentUserFirstName = localStorage.getItem("firstName");
  const currentUserLastName = localStorage.getItem("lastName");
  const userCircle =
    currentUserFirstName[0].toUpperCase() +
    currentUserLastName[0].toUpperCase();
  return userCircle;
}

/**
 * Renders the desktop layout for logged-in users.
 * Includes the user's initials in the template.
 */
function renderDesktopTemplate() {
  let content = document.getElementById("templateSection");
  content.innerHTML = "";
  content.innerHTML += getDesktopTemplate(renderCurrentUserCircle());
}

/**
 * Clears section selection styles (used when no navigation item should appear selected).
 * Mainly removes visual highlights from the summary section.
 */
function changeToNoChosenSection() {
  let summarySection = document.getElementById("summary-section");
  let summaryImg = document.getElementById("summary-img");

  summarySection.classList.remove("chosen-section");
  summaryImg.classList.remove("summary-img-chosen");
  summaryImg.classList.add("summary-img");
}

/**
 * Navigates the user back to the previous page using browser history.
 */
function goBack() {
  window.history.back();
}

/**
 * Injects the Help content into the main content section of the page.
 */
function renderHelpContent() {
  let content = document.getElementById("newContentSection");
  content.innerHTML += getHelpContent();
}
