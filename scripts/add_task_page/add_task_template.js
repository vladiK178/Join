function getAddTaskContent() {
  return `<div class="new-section">
    <div class="add-task-section">
        <span class="add-task-headline">Add Task</span>
        <div class="task-detail-section">
            <div class="task-details-left">
                <form class="input-order" action="">
                    <label for="title">Title<span class="red-star">*</span></label>
                    <input type="text" id="title" required placeholder="Enter a title">
                    <span id="alertMessageTitle" class="alert-message hide-alert-message">This field is required</span>
                </form>
                <form class="input-order" action="">
                    <label for="description">Description</label>
                    <textarea class="description-input" id="description" placeholder="Enter a Description"></textarea>
                </form>
                <form class="input-order" action="">
                    <label for="assigned-to">Assigned to<span class="red-star">*</span></label>
                    <div onclick="toggleAssignedToSection()" id="assignedToSection" class="assigned-to-section">
                        <input type="text" placeholder="Select contacts to assign">
                        <div class="dropDown-img">
                            <img id="dropDownImg" src="./assets/img/dropDownArrowDown.svg" alt="">
                        </div>
                    </div>
                    <div id="dropDownSection" class="drop-down-section d-none"></div>
                    <div id="choosenNamesSection" class="choosen-names"></div>
                </form>
            </div>
            <div class="task-seperator"></div>
            <div class="task-details-right">
                <form class="input-order" action="">
                    <label for="date">Due Date<span class="red-star">*</span></label>
                    <input type="date" id="date" required placeholder="Enter a title">
                    <span id="alertMessageDate" class="alert-message hide-alert-message">This field is required</span>
                </form>
                <div class="prio-section">
                    <span>Prio</span>
                    <div class="prio-levels">
                        <div onclick="setPriority('Urgent');" id="prioUrgent" class="prio-urgent">
                            <span>Urgent</span>
                            <img id="urgent-button-icon" src="./assets/img/urgentArrowRed.svg" alt="">
                        </div>
                        <div onclick="setPriority('Medium');" id="prioMedium" class="prio-medium-chosen">
                            <span>Medium</span>
                            <img id="medium-button-icon" src="./assets/img/mediumLinesWhite.svg" alt="">
                        </div>
                        <div onclick="setPriority('Low');" id="prioLow" class="prio-low">
                            <span>Low</span>
                            <img id="low-button-icon" src="./assets/img/lowArrowGreeen.svg" alt="">
                        </div>
                    </div>
                </div>
                <div class="input-order">
                    <div class="hl-and-red-star">
                        <span>Category</span><span class="red-star">*</span>
                    </div>
                    <div id="categorySection" onclick="toggleCategorySection()" class="category-section">
                        <div><span id="selectTaskCategorySpan">Select task category</span></div>
                        <div class="dropDown-img">
                            <img id="dropDownImgCategory" src="./assets/img/dropDownArrowDown.svg" alt="">
                        </div>
                    </div>
                    <div id="categoryDropDownSection" class="category-drop-down-section d-none">
                        <div onclick="choseTechnicalTask()" class="category-name">
                            <span>Technical Task</span>
                        </div>
                        <div onclick="choseUserStory()" class="category-name">
                            <span>User Story</span>
                        </div>
                    </div>
                </div>
                <form class="input-order" action="">
                    <label for="subtask">Subtasks</label>
                    <div id="subtaskSectionInput" class="subtask-section">
                        <input onfocus="showInputSubtaskSection(event)" type="text" id="subtask" placeholder="Add new subtask">
                        <div onclick="showInputSubtaskSection(event)" id="subtaskIconSection" class="add-subtask-img">
                            <img src="./assets/img/addCross.svg" alt="">
                        </div>
                    </div>
                    <div id="subtaskSection" class="created-subtask"></div>
                </form>
            </div>
        </div>
    </div>
    <div class="field-required-clear-create-button-section">
        <span class="fieldRequiredSection" id="fieldRequiredSection"><span class="red-star">*</span>This field is required</span>
        <div class="add-task-button">
            <div onclick="initAddTaskPage()" class="clear-button">
                <span>Clear</span>
                <span class="cancel-span">x</span>
            </div>
            <div onclick="saveNewTask()" class="create-button">
                <span>Create task</span>
                <img src="./assets/img/check.svg" alt="">
            </div>
        </div>
    </div>
</div>
<!-- Success Message -->
<div id="successAddTaskOverlay" class="success-sign-up-overlay d-none">
    <div class="success-icon-section">
    <span>Task added to board</span>
    <img src="./assets/img/boardWhite.svg" alt="">
    </div>
</div>
<div id="rotateWarning" class="rotate-overlay hide">
<div class="rotate-message">
  <h2>Bitte drehe dein Gerät</h2>
  <p>Um unsere Seite optimal zu nutzen, verwende bitte das Hochformat.</p>
</div>
</div>
`;
}
