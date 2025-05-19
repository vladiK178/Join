/** Stores the current user's data */
let currentUser;

/**
 * Initializes the privacy notice page for logged-in users.
 * - Fetches user data from the database
 * - Loads the current user from localStorage
 * - Renders the user-specific desktop template
 * - Switches to the Privacy Policy section
 * - Displays Privacy Policy content
 */
async function initPrivacyNoticePage() {
  await getUsersData();
  currentSubTask = {};

  let currentUserId = localStorage.getItem("currentUserId");
  currentUser = users[currentUserId];
  renderDesktopTemplate();
  changeToChosenPrivacyPoliceSection();
  renderPrivacyPolicyContent();
}

/** Stores the initials of the current user for display in the user circle */
let userCircle;

/**
 * Generates the user circle initials using the first letter of first and last name.
 * @returns {string} The user's initials in uppercase format
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
 * Renders the desktop template including the user's initials.
 */
function renderDesktopTemplate() {
  let content = document.getElementById("templateSection");
  content.innerHTML = "";
  content.innerHTML += getDesktopTemplate(renderCurrentUserCircle());
}

/**
 * Highlights the "Privacy Policy" section in the navigation bar,
 * and resets styles for the "Summary" section.
 */
function changeToChosenPrivacyPoliceSection() {
  let legalSection = document.getElementById("privacySection");
  let summarySection = document.getElementById("summary-section");
  let summaryImg = document.getElementById("summary-img");

  summarySection.classList.remove("chosen-section");
  summaryImg.classList.remove("summary-img-chosen");
  summaryImg.classList.add("summary-img");

  legalSection.classList.add("chosen-section");
  legalSection.classList.remove("privacy-section");
}

/**
 * Inserts the privacy policy content for logged-in users into the content area.
 */
function renderPrivacyPolicyContent() {
  let content = document.getElementById("newContentSection");
  content.innerHTML += getPrivacyPolicyContent();
}
