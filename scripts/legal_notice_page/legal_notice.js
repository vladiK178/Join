/** Stores the currently logged-in user's data */
let currentUser;

/**
 * Initializes the Legal Notice page for a logged-in user.
 * - Fetches user data from the backend
 * - Sets the current user based on localStorage ID
 * - Renders the desktop layout including the user's initials
 * - Highlights the Legal Notice section in the UI
 * - Displays the legal notice content
 */
async function initLegalNoticePage() {
  await getUsersData();
  currentSubTask = {};

  let currentUserId = localStorage.getItem("currentUserId");
  currentUser = users[currentUserId];
  renderDesktopTemplate();
  changeToChosenLegalNoticeSection();
  renderLegalNoticeContent();
}

/** Stores the rendered initials of the current user */
let userCircle;

/**
 * Renders a circle with the user's initials (first letter of first and last name).
 * These initials are typically used for avatars or profile icons in the UI.
 *
 * @returns {string} The uppercase initials of the current user
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
 * Injects the user-initial-based template into the page.
 */
function renderDesktopTemplate() {
  let content = document.getElementById("templateSection");
  content.innerHTML = "";
  content.innerHTML += getDesktopTemplate(renderCurrentUserCircle());
}

/**
 * Visually highlights the "Legal Notice" section in the navigation bar.
 * Also resets the styles of the previously selected "Summary" section.
 */
function changeToChosenLegalNoticeSection() {
  let legalSection = document.getElementById("legalSection");
  let summarySection = document.getElementById("summary-section");
  let summaryImg = document.getElementById("summary-img");

  summarySection.classList.remove("chosen-section");
  summaryImg.classList.remove("summary-img-chosen");
  summaryImg.classList.add("summary-img");

  legalSection.classList.add("chosen-section");
  legalSection.classList.remove("legal-section");
}

/**
 * Renders the full Legal Notice content for logged-in users
 * into the main content section of the page.
 */
function renderLegalNoticeContent() {
  let content = document.getElementById("newContentSection");
  content.innerHTML += getLegalNoticeContent();
}
