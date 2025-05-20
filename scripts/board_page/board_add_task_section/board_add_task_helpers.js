/**
 * Checks if the title is valid.
 * @param {HTMLElement} title - The title input element.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateTitle(title) {
  // If no title or empty, show error message
  if (!title || title.value.trim() === '') {
    let alertMsg = document.getElementById('alertMessageTitle');
    alertMsg.classList.remove('hide-alert-message');
    showShakeAnimation(); // Show error animation
    return false;
  }
  
  // All good, hide error message
  document.getElementById('alertMessageTitle').classList.add('hide-alert-message');
  return true;
}

/**
 * Checks the date input field.
 * @param {HTMLElement} date - The date input element.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateDate(date) {
  // Check if date exists and is not empty
  if (!date || date.value.trim() === '') {
    // Show error message and start animation
    document.getElementById('alertMessageDate').classList.remove('hide-alert-message');
    showShakeAnimation();
    return false;
  }
  
  // Date is ok, hide error message
  document.getElementById('alertMessageDate').classList.add('hide-alert-message');
  return true;
}

/**
 * Validates the selected category (Technical Task or User Story).
 * @param {HTMLElement} catSpan - The category span element.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateCategory(catSpan) {
  // Check if catSpan exists and contains User Story or Technical Task
  if (!catSpan || 
      (!catSpan.innerText.includes("Technical Task") && 
       !catSpan.innerText.includes("User Story"))) {
    // Only show animation if no category selected
    showShakeAnimation();
    return false;
  }
  
  // Category is valid
  return true;
}

/**
 * Resets all input fields: title, description, date, subtask.
 */
function resetInputFields() {
  // Clear all fields
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("date").value = "";
  document.getElementById("subtask").value = "";
}

/**
 * Resets the category field to its default text.
 */
function resetCategoryField() {
  // Find category element and reset text
  let categorySpan = document.getElementById("selectTaskCategorySpan");
  if (categorySpan) {
    categorySpan.innerText = "Select task category";
  }
}

/**
 * Resets the priority buttons to the default state (Medium selected).
 */
function resetPriorityButtons() {
  // Get references to buttons
  let urgentBtn = document.getElementById("prioUrgent");
  let mediumBtn = document.getElementById("prioMedium");
  let lowBtn = document.getElementById("prioLow");
  
  // Remove classes
  urgentBtn.classList.remove("prio-urgent-chosen");
  mediumBtn.classList.remove("prio-medium-chosen");
  lowBtn.classList.remove("prio-low-chosen");
  
  // Add default classes (Medium as default)
  urgentBtn.classList.add("prio-urgent");
  mediumBtn.classList.add("prio-medium-chosen");
  lowBtn.classList.add("prio-low");
  
  // Reset icons
  document.getElementById("urgent-button-icon").src = "./assets/img/urgentArrowRed.svg";
  document.getElementById("medium-button-icon").src = "./assets/img/mediumLinesWhite.svg";
  document.getElementById("low-button-icon").src = "./assets/img/lowArrowGreeen.svg";
}

/**
 * Fügt die angegebene Klasse hinzu und entfernt die andere.
 * @param {HTMLElement} element - Das Ziel-Element
 * @param {string} addClass - Die Klasse, die hinzugefügt wird
 * @param {string} removeClass - Die Klasse, die entfernt wird
 */
function toggleClass(element, addClass, removeClass) {
  element.classList.add(addClass);
  element.classList.remove(removeClass);
}

/**
 * Führt einen einzelnen Animationsschritt aus, indem zwischen "mar-right" und "mar-left" gewechselt wird.
 * @param {HTMLElement} element - Das Ziel-Element
 * @param {boolean} toggleRight - Ob "mar-right" gesetzt werden soll
 */
function animationStep(element, toggleRight) {
  if (toggleRight) {
    toggleClass(element, "mar-right", "mar-left");
  } else {
    toggleClass(element, "mar-left", "mar-right");
  }
}

/**
 * Entfernt die Animation-Klassen vom Element.
 * @param {HTMLElement} element - Das Ziel-Element
 */
function clearAnimationClasses(element) {
  element.classList.remove("mar-right", "mar-left");
}

/**
 * Startet die Shake-Animation.
 */
function showShakeAnimation() {
  const errorMsg = document.getElementById("fieldRequiredSection");
  if (!errorMsg) return;

  const interval = 50;
  const repetitions = 8;

  for (let i = 0; i < repetitions; i++) {
    setTimeout(() => {
      animationStep(errorMsg, i % 2 === 0);
    }, i * interval);
  }

  setTimeout(() => {
    clearAnimationClasses(errorMsg);
  }, repetitions * interval);
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The string to capitalize.
 * @returns {string} Capitalized string or empty if invalid.
 */
function capitalizeFirstLetter(string) {
  // Check if string exists and is not empty
  if (!string || string.length === 0) {
    return "";
  }
  
  // Make first letter uppercase and append rest
  return string.charAt(0).toUpperCase() + string.slice(1);
}