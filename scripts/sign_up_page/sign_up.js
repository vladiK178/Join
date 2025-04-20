/**
 * Renders the sign-up content into the element with id 'content'.
 */
function renderSignUpContent() {
    document.getElementById('content').innerHTML = getSignUpContent();
}

/**
 * Toggles the checkbox image (checked/unchecked).
 */
function toggleCheckbox() {
    let checkbox = document.getElementById("logInCheckbox");
    checkbox.src = checkbox.src.includes("checkboxEmpty.svg") ? "./assets/img/checkboxChecked.svg" : "./assets/img/checkboxEmpty.svg";
}

/**
 * Displays a success message overlay and redirects to index.html after a delay.
 */
function showSuccessMessage() {
    document.getElementById("successSignUpOverlay").classList.remove("d-none");
    setTimeout(() => window.location.href = "index.html", 2250);
}

/**
 * Updates the eye (visibility) icon based on whether the input field has a value.
 * If there is a value, shows the 'visibility_off' icon and attaches the toggle click event.
 * Otherwise, shows the lock icon.
 * @param {string} inputId - The ID of the password input field.
 * @param {string} imgId - The ID of the image element representing the visibility icon.
 */
function showClosedEyeImg(inputId, imgId) {
    let input = document.getElementById(inputId);
    let img = document.getElementById(imgId);
    img.src = input.value ? "./assets/img/visibility_off.svg" : "./assets/img/lock.svg";
    img.onclick = input.value ? () => togglePasswordVisibility(inputId, imgId) : null;
}

/**
 * Toggles the visibility of the password input and updates the icon accordingly.
 * @param {string} inputId - The ID of the password input field.
 * @param {string} imgId - The ID of the icon element.
 */
function togglePasswordVisibility(inputId, imgId) {
    let input = document.getElementById(inputId);
    let img = document.getElementById(imgId);
    let isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    img.src = isPassword ? "./assets/img/visibility.svg" : "./assets/img/visibility_off.svg";
}