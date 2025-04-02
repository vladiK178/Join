function getSignUpContent() {
  return `
        <img class="join-logo" src="./assets/img/JoinLogo.svg" alt="Join Logo">
        
        <section class="Log-In-Section">
            <div class="Log-In-Field">
                <span class="Log-In-Headline">Sign up</span>
                <div class="underline-headline"></div>
                
                <div class="Log-In-Form">
                    <!-- Name Input -->
                    <div class="email-password-alert-section">
                        <div class="email-password-fields">
                            <input id="userName" class="input-email-password" type="text" placeholder="Name">
                            <img src="./assets/img/person.svg" alt="Name Icon">
                        </div>
                        <span id="alertMessageName" class="alert-message">
                            Please enter first- and surname.
                        </span>
                    </div>

                    <!-- Email Input -->
                    <div class="email-password-alert-section">
                        <div class="email-password-fields">
                            <input id="userEmail" class="input-email-password" type="email" placeholder="Email">
                            <img src="./assets/img/mail.svg" alt="Mail Icon">
                        </div>
                        <div class="email-alert-messages">
                            <span id="alertMessageEmail" class="alert-message">
                                Please enter a valid email address
                            </span>
                            <span id="alertMessageEmailExists" class="alert-message">
                                This email address already exists
                            </span>
                        </div>
                    </div>

                    <!-- Password Input -->
                    <div class="email-password-alert-section">
                        <div class="email-password-fields">
                            <input id="userPassword" class="input-email-password" minlength="6" type="password" 
                                   placeholder="Password" oninput="showClosedEyeImg('userPassword', 'passwordLockImg')">
                            <img id="passwordLockImg" src="./assets/img/lock.svg" alt="Password Icon">
                        </div>
                        <span id="alertMessageLength" class="alert-message">
                            Type in at least 6 characters.
                        </span>
                    </div>

                    <!-- Confirm Password Input -->
                    <div class="email-password-alert-section">
                        <div class="email-password-fields">
                            <input id="userPasswordConfirmed" class="input-email-password" minlength="6" type="password" 
                                   placeholder="Confirm Password" oninput="showClosedEyeImg('userPasswordConfirmed', 'confirmPasswordLockImg')">
                            <img id="confirmPasswordLockImg" src="./assets/img/lock.svg" alt="Confirm Password Icon">
                        </div>
                        <span id="alertMessagePassword" class="alert-message">
                        Your passwords don't match.
                        </span>
                    </div>

                    <!-- Terms and Conditions -->
                    <div class="remember-me-section-parent">
                        <div id="rememberMeSection" class="remember-me-section">
                            <img class="accept-checkbox-img" onclick="toggleCheckbox(), checkUncheckPolicy()" id="logInCheckbox" src="./assets/img/checkboxEmpty.svg" alt="">
                            <span class="light-grey">I accept the <span class="accept-privacy-policy-span">Privacy policy</span></span>
                        </div>
                    </div>

                    <!-- Sign Up Button -->
                    <div class="Log-In-and-Guest-Log-In">
                        <button onclick="registerUser()" class="Log-In-Button">Sign up</button>
                    </div>
                </div>

                <!-- Link to Login Page -->
                <div class="link-to-log-in">
                    <a href="login.html">
                        <img class="back-arrow" src="./assets/img/arrow-left-line.svg" alt="Back to login">
                    </a>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer>
            <div class="privacy-span">
                <a href="privacy_policy_unlogged.html"><span>Privacy Policy</span></a>
            </div>
            <div class="legal-span">
                <a href="legal_notice_unlogged.html"><span>Legal notice</span></a>
            </div>
        </footer>

        <!-- Success Message -->
        <div id="successSignUpOverlay" class="success-sign-up-overlay d-none">
            <span class="success-icon">You Signed Up successfully</span>
        </div>

        <div id="rotateWarning" class="rotate-overlay hide">
        <div class="rotate-message">
          <h2>Bitte drehe dein Gerät</h2>
          <p>Um unsere Seite optimal zu nutzen, verwende bitte das Hochformat.</p>
        </div>
        </div>
    `;
}
