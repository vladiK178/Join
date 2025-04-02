const DATABASEURL =
  "https://join-7dba7-default-rtdb.europe-west1.firebasedatabase.app/";

let isPolicyChecked = false;

async function registerUser() {
  const name = document.getElementById("userName").value;
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPassword").value;
  const confirmPassword = document.getElementById(
    "userPasswordConfirmed"
  ).value;
  let isFormValid = correctForm(password, confirmPassword);

  if (isFormValid == false) {
    return;
  }

  const userKey = `user_${name.replace(/\s+/g, "_").toLowerCase()}`;

  try {
    const response = await fetch(`${DATABASEURL}/users/${userKey}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    console.log("Neuer Benutzer hinzugefügt:", data);
  } catch (error) {
    console.error("Fehler:", error);
  }
}

function checkUncheckPolicy() {
  let checkId = document.getElementById("logInCheckbox").src;

  if (checkId.endsWith("checkboxChecked.svg")) {
    isPolicyChecked = true;
  } else {
    isPolicyChecked = false;
  }
}

function correctForm(password, confirmedPassword) {
  let confirmPassword = isConfirmedPasswordIdentical(
    password,
    confirmedPassword
  );
  let checkedBox = isCheckboxChecked();

  if (confirmPassword == false || checkedBox == false) {
    return false;
  }

  return true;
}

function isConfirmedPasswordIdentical(password, confirmPassword) {
  if (password !== confirmPassword) {
    console.error("Passwörter stimmen nicht überein.");
    alert("Passwörter stimmen nicht überein!");
    return false;
  }
}

function isCheckboxChecked() {
  if (isPolicyChecked == false) {
    console.error("Checkbox wurde nicht angeklickt.");
    alert("Checkbox wurde nicht angeklickt.");
    return false;
  }
}
