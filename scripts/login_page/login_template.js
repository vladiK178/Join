function getLoginContent() {
  return `
        <header>
            <img src="./assets/img/JoinLogo.svg" alt="">
            <div class="sign-up-section">
                <span>Not a Join user?</span>
                <div class="sign-up-button">
                    <a href="sign_up.html">Sign up</a>
                </div>
            </div>
        </header>

        <section class="Log-In-Section">
            <div class="Log-In-Field">
                <span class="Log-In-Headline">Log in</span>
                <div class="underline-headline"></div>
                
                <form class="Log-In-Form" onsubmit="loginUser(event); return false">
                    <div class="inputs-section">
                        <!-- Email Input -->
                        <div id="emailInputField" class="email-password-fields">
                            <input class="input-email-password" type="text" id="email" placeholder="Email">
                            <img src="./assets/img/mail.svg" alt="">
                        </div>

                        <!-- Password Input -->
                        <div class="email-password-alert-section">
                            <div id="passwordInputField" class="email-password-fields">
                                <input class="input-email-password" oninput="showClosedEyeImg()" type="password" id="password" 
                                       minlength="6" placeholder="Password">
                                <div id="passwordInputSection" class="password-input-section">
                                    <img id="passwordLockImg" src="./assets/img/lock.svg" alt="">
                                </div>
                            </div>
                            <span id="alertMessageEmail" class="alert-message">
                                Check your email and password
                            </span>
                        </div>
                    </div>

                    <!-- Login Buttons -->
                    <div class="Log-In-and-Guest-Log-In">
                        <button type="submit" class="Log-In-Button">Log in</button>
                        <button type="button" onclick="guestLogin()" class="Guest-Log-In-Button">Guest Log in</button>
                    </div>
                </form>
            </div>
        </section>

        <div class="sign-up-section-hidden">
            <div class="sign-up-section-inner-div">
                <span>Not a Join user?</span>
                <div class="sign-up-button">
                    <a href="sign_up.html">Sign up</a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer>
            <div class="privacy-span">
                <a href="privacy_policy_unlogged.html"><span>Privacy Policy</span></a>
            </div>
            <div class="legal-span">
                <a href="legal_notice_unlogged.html"><span>Legal notice</span></a>
            </div>
        </footer>

        <div id="rotateWarning" class="rotate-overlay hide">
        <div class="rotate-message">
          <h2>Bitte drehe dein Gerät</h2>
          <p>Um unsere Seite optimal zu nutzen, verwende bitte das Hochformat.</p>
        </div>
        </div>
    `;
}
