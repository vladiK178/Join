/** Stores the currently logged-in user */
let currentUser;

/**
 * Initializes the Legal Notice page for unlogged users.
 * - Loads all user data from the database
 * - Retrieves the current user based on their ID in localStorage
 * - Renders the basic desktop layout
 * - Switches to the "Legal Notice" section in the UI
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

/**
 * Renders the basic desktop layout for unlogged users
 * by injecting the unlogged desktop template into the page.
 */
function renderDesktopTemplate() {
  let content = document.getElementById("templateSection");
  content.innerHTML = "";
  content.innerHTML += getDesktopTemplateUnlogged();
}

/**
 * Visually highlights the "Legal Notice" section in the navigation.
 * Also resets styles for the previously selected "Summary" section.
 */
function changeToChosenLegalNoticeSection() {
  let legalSection = document.getElementById("legalSection");
  let summarySection = document.getElementById("summary-section");
  let summaryImg = document.getElementById("log-in-img");

  summarySection.classList.remove("chosen-section");
  summaryImg.classList.remove("summary-img-chosen");
  summaryImg.classList.add("summary-img");

  legalSection.classList.add("chosen-section");
  legalSection.classList.remove("legal-section");
}

/**
 * Loads and displays the content of the Legal Notice section
 * for users who are not logged in.
 */
function renderLegalNoticeContent() {
  let content = document.getElementById("newContentSection");
  content.innerHTML += getLegalNoticeContentUnlogged();
}
