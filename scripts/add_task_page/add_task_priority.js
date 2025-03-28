/** Sets the priority to "Urgent". */
function pressUrgentButton() {
    resetPriorityButtons();
    document.getElementById('prioUrgent').classList.add('prio-urgent-chosen');
    document.getElementById('prioUrgent').classList.remove('prio-urgent');
    document.getElementById('urgent-button-icon').src = './assets/img/urgentArrowWhite.svg';
  }
  
  /** Sets the priority to "Medium". */
  function pressMediumButton() {
    resetPriorityButtons();
    document.getElementById('prioMedium').classList.add('prio-medium-chosen');
    document.getElementById('prioMedium').classList.remove('prio-medium');
    document.getElementById('medium-button-icon').src = './assets/img/mediumLinesWhite.svg';
  }
  
  /** Sets the priority to "Low". */
  function pressLowButton() {
    resetPriorityButtons();
    document.getElementById('prioLow').classList.add('prio-low-chosen');
    document.getElementById('prioLow').classList.remove('prio-low');
    document.getElementById('low-button-icon').src = './assets/img/lowArrowGreenWhite.svg';
  }
  
  /** Resets all priority button styles to default. */
  function resetPriorityButtons() {
    document.getElementById('prioUrgent').classList.remove('prio-urgent-chosen');
    document.getElementById('prioUrgent').classList.add('prio-urgent');
    document.getElementById('urgent-button-icon').src = './assets/img/urgentArrowRed.svg';
  
    document.getElementById('prioMedium').classList.remove('prio-medium-chosen');
    document.getElementById('prioMedium').classList.add('prio-medium');
    document.getElementById('medium-button-icon').src = './assets/img/mediumLinesOrange.svg';
  
    document.getElementById('prioLow').classList.remove('prio-low-chosen');
    document.getElementById('prioLow').classList.add('prio-low');
    document.getElementById('low-button-icon').src = './assets/img/lowArrowGreeen.svg';
  }