function openAndCloseCategorySection() {
  swapArrowImage("dropDownImgCategory");
  openCloseDropDown("categoryDropDownSection");
}

function openAndCloseAssignedToSection() {
  swapArrowImage("dropDownImg");
  openCloseDropDown("dropDownSection");
}

function swapArrowImage(arrowImgId) {
  let arrowId = document.getElementById(arrowImgId);

  if (arrowId.src.endsWith("dropDownArrowDown.svg")) {
    arrowId.src = "./assets/img/dropDownArrowUp.svg";
  } else {
    arrowId.src = "./assets/img/dropDownArrowDown.svg";
  }
}

function openCloseDropDown(idDropDownField) {
  let dropDownId = document.getElementById(idDropDownField);
  dropDownId.classList.toggle("d-none");
}
