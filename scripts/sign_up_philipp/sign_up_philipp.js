const DATABASEURL =
  "https://join-7dba7-default-rtdb.europe-west1.firebasedatabase.app/";

let isPolicyChecked = false;

function validateForm(password, confirmPassword) {
  return correctForm(password, confirmPassword);
}

async function createUserData(name, email, password) {
  const userKey = `user_${name.replace(/\s+/g, "_").toLowerCase()}`;
  const userData = {
    personal_data: { name, email, password },
    contacts: "",
    tasks: "",
  };

  return { userKey, userData };
}

async function sendToFirebase(userKey, userData) {
  try {
    const response = await fetch(`${DATABASEURL}/${userKey}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    console.log("Neuer Benutzer hinzugefügt");
    return response.json();
  } catch (error) {
    console.error("Fehler:", error);
  }
}

async function registerUser() {
  const name = document.getElementById("userName");
  const email = document.getElementById("userEmail");
  const password = document.getElementById("userPassword");
  const confirmPassword = document.getElementById("userPasswordConfirmed");

  if (!validateForm(password.value, confirmPassword.value)) {
    return;
  }

  const { userKey, userData } = await createUserData(
    name.value,
    email.value,
    password.value
  );

  await sendToFirebase(userKey, userData);
  resetForm(name, email, password, confirmPassword);
  document.getElementById("logInCheckbox").src =
    "./assets/img/checkboxEmpty.svg";
  isPolicyChecked = false;
  showSuccessMessage();
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

function resetForm(name, email, password, confirmPassword) {
  name.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
}
