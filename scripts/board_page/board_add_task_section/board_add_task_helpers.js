  /**
 * Validates the title element.
 * @param {HTMLElement} title - The title input element.
 * @returns {boolean} True if valid, otherwise false.
 */
  function validateTitle(title) {
    if (!title || title.value.trim().length === 0) {
      document.getElementById('alertMessageTitle').classList.remove('hide-alert-message');
      rotateMessage();
      return false;
    }
    document.getElementById('alertMessageTitle').classList.add('hide-alert-message');
    return true;
  }


    /**
 * Validates the date element.
 * @param {HTMLElement} date - The date input element.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateDate(date) {
    if (!date || date.value.trim().length === 0) {
      document.getElementById('alertMessageDate').classList.remove('hide-alert-message');
      rotateMessage();
      return false;
    }
    document.getElementById('alertMessageDate').classList.add('hide-alert-message');
    return true;
  }


    /**
 * Validates the selected category (Technical Task / User Story).
 * @param {HTMLElement} catSec - The category span element.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateCategory(catSec) {
    if (
      !catSec ||
      (!catSec.innerText.includes("Technical Task") && !catSec.innerText.includes("User Story"))
    ) {
      rotateMessage();
      return false;
    }
    return true;
  }


  /**
 * Resets input fields: title, description, date, subtask.
 */
function resetInputFields() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("date").value = "";
    document.getElementById("subtask").value = "";
  }


  /**
 * Resets the category field to its default text.
 */
function resetCategoryField() {
    const catSpan = document.getElementById("selectTaskCategorySpan");
    if (catSpan) catSpan.innerText = "Select task category";
  }


  /**
 * Resets the priority buttons to the default state (Medium chosen).
 */
function resetPriorityButtons() {
    const u = document.getElementById("prioUrgent");
    const m = document.getElementById("prioMedium");
    const l = document.getElementById("prioLow");
  
    u.classList.remove("prio-urgent-chosen");
    m.classList.remove("prio-medium-chosen");
    l.classList.remove("prio-low-chosen");
  
    u.classList.add("prio-urgent");
    m.classList.add("prio-medium-chosen");
    l.classList.add("prio-low");
  
    document.getElementById("urgent-button-icon").src = "./assets/img/urgentArrowRed.svg";
    document.getElementById("medium-button-icon").src = "./assets/img/mediumLinesWhite.svg";
    document.getElementById("low-button-icon").src = "./assets/img/lowArrowGreeen.svg";
  }



/**
 * Animates the error message container to "shake" it.
 */
function rotateMessage() {
    const err = document.getElementById("fieldRequiredSection");
    err.classList.add("mar-right");
    setTimeout(() => {
      err.classList.remove("mar-right");
      err.classList.add("mar-left");
    }, 50);
    setTimeout(() => {
      err.classList.remove("mar-left");
      err.classList.add("mar-right");
    }, 100);
    setTimeout(() => {
      err.classList.remove("mar-right");
      err.classList.add("mar-left");
    }, 150);
    setTimeout(() => {
      err.classList.remove("mar-left");
      err.classList.add("mar-right");
    }, 200);
    setTimeout(() => {
      err.classList.remove("mar-right");
      err.classList.add("mar-left");
    }, 250);
    setTimeout(() => {
      err.classList.remove("mar-left");
      err.classList.add("mar-right");
    }, 300);
    setTimeout(() => {
      err.classList.remove("mar-right");
      err.classList.add("mar-left");
    }, 350);
    setTimeout(() => {
      err.classList.remove("mar-left");
      err.classList.add("mar-right");
    }, 400);
    setTimeout(() => {
      err.classList.remove("mar-right");
    }, 450);
  }


  /**
 * Capitalizes the first letter of a given string.
 * @param {string} string - The string to capitalize.
 * @returns {string} - Capitalized string or empty if invalid.
 */
function capitalizeFirstLetter(string) {
    if (!string || string.length === 0) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
