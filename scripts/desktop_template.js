function getDesktopTemplate(userCircle) {
  return `<section class="complete-template-section">
        <section class="left-template-section">
          <div>
            <div class="join-logo"><img src="./assets/img/JoinLogoWhite.svg" alt=""></div>
            <div class="link-to-section">
    
                <div class="div-link-section">
                <a id="summary-section" href="summary.html" class="div-link chosen-section">
                <div id="summary-img" class="summary-img-chosen"></div>
                <span class="div-link-span">Summary</span>
                </a>
                </div>

                <div class="div-link-section">
                <a id="addTask-section" href="add_task.html" class="div-link">
                <div id="addTask-img" class="add-task-img"></div>
                <span class="div-link-span">Add Task</span>
                </a>
                </div>

                <div class="div-link-section">
                <a id="board-section" href="board.html" class="div-link board-sidebar-padding">
                <div id="board-img" class="board-img"></div>
                <span class="div-link-span">Board</span>
                </a>
                </div>

                <div class="div-link-section">
                <a id="contacts-section" href="contacts.html" class="div-link contacts-sidebar-padding">
                <div id="contacts-img" class="contacts-img"></div>
                <span class="div-link-span">Contacts</span>
                </a>
                </div>

              </div>
            </div>
            <div class="privacy-legal-section">
            <div id="privacySection" class="privacy-section-template">
            <div class="span-section">
            <a href="privacy_policy.html">Privacy Policy</a>
            </div>  
            </div>

            <div id="legalSection" class="legal-section-template">
            <div class="span-section">
              <a href="legal_notice.html">Legal notice</a>
            </div>
          </div>
        </section>
        <section class="right-template-section">
            <header>
                <span>Kanban Project Management Tool</span>
                <div class="join-img-mobile"></div>
                <div class="help-profile-section">
                <a href="help.html"><img src="./assets/img/help.svg" alt=""></a>

                    <div onclick="openMenu()" id="profile-circle" class="profile-circle">${userCircle}</div>
                </div>
            </header>
            <div id="menuSection" class="menu-section d-none">
                <div class="menu">
                <a href="legal_notice.html">Legal notice</a>
                <a href="privacy_policy.html">Privacy Policy</a>
                <a href="#" onclick="logout()">Log out</a>
                </div>
            </div>
            <div class="new-content-section" id="newContentSection"></div>
        </section>
    </section>
    `;
}

function openMenu() {
  let menuSection = document.getElementById("menuSection");
  menuSection.classList.toggle("d-none");
}

function updateSidebarLinksWithUserId() {
  const userId = localStorage.getItem("currentUserId");
  if (!userId) return; // Sicherheitscheck

  const boardLink = document.getElementById("board-section");
  const contactsLink = document.getElementById("contacts-section");
  const addTaskLink = document.getElementById("addTask-section");

  if (boardLink) boardLink.href = `board.html?user=${userId}`;
  if (contactsLink) contactsLink.href = `contacts.html?user=${userId}`;
  if (addTaskLink) addTaskLink.href = `add_task.html?user=${userId}`;
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
