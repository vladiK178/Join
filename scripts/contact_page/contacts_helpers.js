/**
 * Capitalizes the first letter of a string, lowercasing the rest.
 * @param {string} string - The string to format.
 * @returns {string} The formatted string.
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }


  /**
 * Validates an email using a regex pattern.
 * @param {string} email - The email to validate.
 * @param {RegExp} regex - The email pattern.
 * @param {string} alertId - The ID of the alert message span.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateEmail(email, regex, alertId) {
    if (!regex.test(email)) {
      showAlertMessage(alertId, "Please enter a valid email.");
      return false;
    }
    hideAlertMessage(alertId);
    return true;
  }


/**
 * Validates a phone number using a regex pattern.
 * @param {string} phone - The phone number to validate.
 * @param {RegExp} regex - The phone pattern.
 * @param {string} alertId - The ID of the alert message span.
 * @returns {boolean} True if valid, otherwise false.
 */
function validatePhone(phone, regex, alertId) {
    if (!regex.test(phone)) {
      showAlertMessage(alertId, "Please enter a valid phone number.");
      return false;
    }
    hideAlertMessage(alertId);
    return true;
  }


  /**
 * Validates that a contact's name has at least two parts.
 * @param {string} name - The name to validate.
 * @param {string} alertId - The ID of the alert message span.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateNameParts(name, alertId) {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length < 2) {
      showAlertMessage(alertId, "Please enter both first and last names.");
      return false;
    }
    hideAlertMessage(alertId);
    return true;
  }


  /**
 * Displays the alert message by removing the 'hide-alert-message' class.
 * @param {string} alertId - The ID of the alert message span.
 * @param {string} message - The message to display.
 */
function showAlertMessage(alertId, message) {
    const alertElem = document.getElementById(alertId);
    if (alertElem) {
      alertElem.classList.remove('hide-alert-message');
      alertElem.textContent = message;
    }
  }


  /**
 * Hides the alert message by adding the 'hide-alert-message' class.
 * @param {string} alertId - The ID of the alert message span.
 */
function hideAlertMessage(alertId) {
    const alertElem = document.getElementById(alertId);
    if (alertElem) {
      alertElem.classList.add('hide-alert-message');
    }
  }


  /**
 * Checks if an email already exists in the current user's contacts.
 * @param {string} email - Email to check.
 * @returns {boolean} True if email exists, otherwise false.
 */
function isEmailExisting(email) {
    if (!currentUser.contacts) return false;
    return Object.values(currentUser.contacts).some(
      c => c.email.toLowerCase() === email.toLowerCase()
    );
  }


  /**
 * Shows a message that the entered email already exists.
 * @param {string} alertId - The ID of the alert message span.
 */
function showEmailAlreadyExists(alertId) {
    showAlertMessage(alertId, "This email already exists.");
  }


  /**
 * Returns the first and last name parts, properly capitalized.
 * @param {string} contactName - Full name entered by user.
 * @returns {Array} An array [firstName, lastName].
 */
function formatContactName(contactName) {
    const parts = contactName.split(" ").filter(Boolean);
    const firstName = capitalizeFirstLetter(parts[0]);
    const lastName = parts.slice(1).map(capitalizeFirstLetter).join(" ");
    return [firstName, lastName];
  }


  /**
 * Ensures currentUser.contacts is an object, initializing if needed.
 */
function initializeContactsObjectIfNeeded() {
    if (!currentUser.contacts || typeof currentUser.contacts !== "object") {
      currentUser.contacts = {};
    }
  }


  /**
 * Provides a random color from a predefined palette.
 * @returns {string} The hex color code.
 */
function getRandomColorFromPalette() {
    const colors = [
      "#FF5733", "#33FF57", "#3357FF", 
      "#FF33A8", "#FFC300", "#DAF7A6", "#C70039"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  