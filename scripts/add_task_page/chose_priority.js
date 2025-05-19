/**
 * Sets the selected priority visually by updating styles and icons.
 * Highlights the chosen priority and resets the others.
 *
 * @param {string} priority - The selected priority ("Urgent", "Medium", or "Low").
 */
function setPriority(priority) {
  const priorities = ["Urgent", "Medium", "Low"];

  priorities.forEach((prio) => {
    const element = document.getElementById(`prio${prio}`);
    const icon = document.getElementById(`${prio.toLowerCase()}-button-icon`);

    if (prio === priority) {
      element.className = `prio-${prio.toLowerCase()}-chosen`;
      icon.src = getWhiteIcon(prio);
    } else {
      element.className = `prio-${prio.toLowerCase()}`;
      icon.src = getColoredIcon(prio);
    }
  });
}

/**
 * Returns the path to the white icon for a given priority.
 *
 * @param {string} priority - The priority level.
 * @returns {string} Path to the corresponding white icon.
 */
function getWhiteIcon(priority) {
  const icons = {
    Urgent: "./assets/img/urgentArrowWhite.svg",
    Medium: "./assets/img/mediumLinesWhite.svg",
    Low: "./assets/img/lowArrowGreenWhite.svg",
  };
  return icons[priority];
}

/**
 * Returns the path to the colored icon for a given priority.
 *
 * @param {string} priority - The priority level.
 * @returns {string} Path to the corresponding colored icon.
 */
function getColoredIcon(priority) {
  const icons = {
    Urgent: "./assets/img/urgentArrowRed.svg",
    Medium: "./assets/img/mediumLinesOrange.svg",
    Low: "./assets/img/lowArrowGreeen.svg"
  };
  return icons[priority];
}
