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

function getWhiteIcon(priority) {
  const icons = {
    Urgent: "./assets/img/urgentArrowWhite.svg",
    Medium: "./assets/img/mediumLinesWhite.svg",
    Low: "./assets/img/lowArrowGreenWhite.svg",
  };
  return icons[priority];
}

function getColoredIcon(priority) {
  const icons = {
    Urgent: "./assets/img/urgentArrowRed.svg",
    Medium: "./assets/img/mediumLinesOrange.svg",
    Low: "./assets/img/lowArrowGreeen.svg",
  };
  return icons[priority];
}
