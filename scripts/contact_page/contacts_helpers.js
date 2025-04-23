/**
 * Makes first letter uppercase, rest lowercase
 * @param {string} string - Input string
 * @returns {string} Formatted string
 */
function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * Checks if email is valid using regex
 * @param {string} email - Email to validate
 * @param {RegExp} regex - Email pattern
 * @param {string} alertId - Alert element ID
 * @returns {boolean} True if valid
 */
function validateEmail(email, regex, alertId) {
  const trimmedEmail = email.trim();

  if (trimmedEmail === "") {
    hideAlertMessage(alertId); // Kein Fehlertext bei leer
    return false;
  }

  if (!regex.test(trimmedEmail)) {
    showAlertMessage(alertId, "Please enter a valid email.");
    return false;
  }

  hideAlertMessage(alertId);
  return true;
}

/**
 * Validates phone number format
 * @param {string} phone - Phone to check
 * @param {RegExp} regex - Phone pattern
 * @param {string} alertId - Alert element ID
 * @returns {boolean} True if valid
 */
function validatePhone(phone, regex, alertId) {
  const trimmedPhone = phone.trim();

  if (trimmedPhone === "") {
    hideAlertMessage(alertId); // Kein Text wenn leer
    return false;
  }

  if (!regex.test(trimmedPhone)) {
    showAlertMessage(alertId, "Please enter a valid phone number.");
    return false;
  }

  hideAlertMessage(alertId);
  return true;
}

/**
 * Checks if name has first and last name
 * @param {string} name - Name to validate
 * @param {string} alertId - Alert element ID
 * @returns {boolean} True if valid
 */
function validateNameParts(name, alertId) {
  const trimmedName = name.trim();
  const parts = trimmedName.split(" ").filter(Boolean);

  if (trimmedName === "") {
    hideAlertMessage(alertId); // Keine Meldung bei leerem Feld
    return false;
  }

  if (parts.length < 2) {
    showAlertMessage(alertId, "Please enter both first and last names.");
    return false;
  }

  hideAlertMessage(alertId);
  return true;
}

/**
 * Shows error message by unhiding alert element
 * @param {string} alertId - Alert element ID
 * @param {string} message - Error message
 */
function showAlertMessage(alertId, message) {
  const alertElem = document.getElementById(alertId);
  if (alertElem) {
    alertElem.classList.remove("hide-alert-message");
    alertElem.textContent = message;
  }
}

/**
 * Hides alert message
 * @param {string} alertId - Alert element ID
 */
function hideAlertMessage(alertId) {
  const alertElem = document.getElementById(alertId);
  if (alertElem) {
    alertElem.classList.add("hide-alert-message");
  }
}

/**
 * Checks if email already exists in user contacts
 * @param {string} email - Email to check
 * @returns {boolean} True if found
 */
function isEmailExisting(email) {
  if (!currentUser.contacts) return false;

  const emailLower = email.toLowerCase();
  return Object.values(currentUser.contacts).some(
    (contact) => contact.email.toLowerCase() === emailLower
  );
}

/**
 * Shows "email exists" error
 * @param {string} alertId - Alert element ID
 */
function showEmailAlreadyExists(alertId) {
  showAlertMessage(alertId, "This email already exists.");
}

/**
 * Splits and formats name into first and last parts
 * @param {string} contactName - Full name
 * @returns {Array} [firstName, lastName]
 */
function formatContactName(contactName) {
  const nameParts = contactName.split(" ").filter(Boolean);
  const firstName = capitalizeFirstLetter(nameParts[0]);

  let lastName = "";
  if (nameParts.length > 1) {
    lastName = nameParts.slice(1).map(capitalizeFirstLetter).join(" ");
  }

  return [firstName, lastName];
}

/**
 * Creates contacts object if it doesn't exist
 */
function initializeContactsObjectIfNeeded() {
  if (!currentUser.contacts || typeof currentUser.contacts !== "object") {
    currentUser.contacts = {};
  }
}

/**
 * Gets random color for contact avatar
 * @returns {string} Hex color code
 */
function getRandomColorFromPalette() {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A8",
    "#FFC300",
    "#DAF7A6",
    "#C70039",
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
