/** Stores the currently logged-in user's data. */
let currentUser;

/**
 * Initializes the privacy notice page.
 * - Loads user data.
 * - Retrieves the current user from local storage.
 * - Renders the unlogged desktop layout.
 * - Highlights the privacy policy section.
 * - Renders privacy policy content for unlogged users.
 */
async function initPrivacyNoticePage() {
  await getUsersData();
  currentSubTask = {};

  let currentUserId = localStorage.getItem("currentUserId");
  currentUser = users[currentUserId];
  renderDesktopTemplate();
  changeToChosenPrivacyPoliceSection();
  renderPrivacyPolicyContentUnlogged();
}

/**
 * Renders the unlogged desktop template into the page.
 */
function renderDesktopTemplate() {
  let content = document.getElementById("templateSection");
  content.innerHTML = "";
  content.innerHTML += getDesktopTemplateUnlogged();
}

/**
 * Highlights the "Privacy Policy" section and deactivates the "Summary" section.
 * - Adjusts CSS classes for the appropriate section and image elements.
 */
function changeToChosenPrivacyPoliceSection() {
  let legalSection = document.getElementById("privacySection");
  let summarySection = document.getElementById("summary-section");
  let summaryImg = document.getElementById("log-in-img");

  summarySection.classList.remove("chosen-section");
  summaryImg.classList.remove("summary-img-chosen");
  summaryImg.classList.add("summary-img");

  legalSection.classList.add("chosen-section");
  legalSection.classList.remove("privacy-section");
}

/**
 * Renders the privacy policy content specifically for users who are not logged in.
 */
function renderPrivacyPolicyContentUnlogged() {
  let content = document.getElementById("newContentSection");
  content.innerHTML += getPrivacyPolicyContentUnlogged();
}
