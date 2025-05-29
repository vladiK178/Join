/**
 * Generates the HTML for the main board content.
 * @returns {string} HTML string for the board content.
 */
function getBoardContent() {
    return `                
        <div class="new-section">
            <div class="complete-board-section">
                <div class="board-headline-search-add-task-section">
                    <div class="hl-and-add-button-section">
                        <span class="board-hl">Board</span>
                        <div onclick="handleAddTaskButtonClick()" class="add-button-mobile">
                            <img src="./assets/img/addCrossWhite.svg" alt="">
                        </div>
                    </div>
                    <div class="search-add-task-section">
                        <div class="search-bar">
                            <input type="text" name="task-search" placeholder="Find Task" oninput="filterTasks(event)">
                            <div class="search-separator-icon">
                                <div class="search-separator"></div>
                                <div class="search-icon-container">
                                    <img src="./assets/img/search.svg" alt="">
                                </div>
                            </div>
                        </div>
                        <div onclick="handleAddTaskButtonClick()" class="add-task-button-board">
                            <span>Add Task</span>
                            <img src="./assets/img/addCrossWhite.svg" alt="">
                        </div>
                    </div>
                </div>
                <div class="column-section">
                    <!-- To Do Column -->
                    <div class="to-do-section">
                        <div class="to-do-hl-and-add-section">
                            <span>To do</span>
                            <div onclick="handleAddTaskButtonClick()" class="add-container"><span>+</span></div>
                        </div>
                        <div ondrop="moveTo('toDo')" ondragover="allowDrop(event)" id="toDoNotes" class="to-do-notes"></div>
                    </div>
                    
                    <!-- In Progress Column -->
                    <div class="in-progress-section">
                        <div class="to-do-hl-and-add-section">
                            <span>In progress</span>
                            <div onclick="handleAddTaskButtonClick()" class="add-container"><span>+</span></div>
                        </div>
                        <div ondrop="moveTo('inProgress')" ondragover="allowDrop(event)" id="inProgressNotes" class="to-do-notes"></div>
                    </div>
                    
                    <!-- Await Feedback Column -->
                    <div class="await-feedback-section">
                        <div class="to-do-hl-and-add-section">
                            <span>Await feedback</span>
                            <div onclick="handleAddTaskButtonClick()" class="add-container"><span>+</span></div>
                        </div>
                        <div ondrop="moveTo('awaitFeedback')" ondragover="allowDrop(event)" id="awaitFeedbackNotes" class="to-do-notes"></div>
                    </div>
                    
                    <!-- Done Column -->
                    <div class="done-section">
                        <div class="to-do-hl-and-add-section">
                            <span>Done</span>
                        </div>
                        <div ondrop="moveTo('done')" ondragover="allowDrop(event)" id="doneNotes" class="to-do-notes"></div>
                    </div>
                </div>
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
  
  /**
   * Generates HTML for a task card with draggable functionality.
   * @param {Object} task - The task object containing task details.
   * @param {string} status - The column status (toDo, inProgress, etc).
   * @returns {string} HTML string for the task card.
   */
  function getColumnContent(task, status) {
    return `
            <div draggable="true"
                 ondragstart="startDragging('${task.id}', event)"
                 ondragend="endDragging('${task.id}')"
                 class="note"
                 data-task-id="${task.id}"
                 onclick="handleTaskClick('${task.id}')">
      
                <div id="taskCategory${status}${task.id}"></div>
      
                <div class="note-hl">
                    <span>${task.title || "Untitled Task"}</span>
                </div>
      
                <div class="note-description">
                    <span>${
                      task.taskDescription || "No description provided."
                    }</span>
                </div>
      
                <div id="subtaskBarAndSubtaskSpan${status}${task.id}" 
                     class="subtask-bar-and-subtask-span">
                </div>
      
                <div class="assigned-profile-priority-section">
                    <div class="name-circle-section" 
                         id="nameCircleSection${status}${task.id}">
                    </div>
                    <img id="prioImg${status}${task.id}" 
                         src="./assets/img/Prio media (1).svg" 
                         alt="">
                </div>
      
                <!-- Mobile Menu Icon -->
                <div class="change-column-menu-mobile">
                    <img id="noteMenuMobile${task.id}"
                         data-task-id="${task.id}"
                         onclick="toggleMenuMobile(event)"
                         class="closed-menu-mobile"
                         src="./assets/img/more_vert.svg"
                         alt="More">
                </div>
      
                <!-- Mobile Dropdown Menu -->
                <div id="menuSectionMobile${task.id}" 
                     class="menu-section-mobile d-none">
                    <div class="menu-mobile">
                        <a href="#"
                           class="menu-option"
                           onclick="event.stopPropagation(); moveTaskToNewColumn('${
                             task.id
                           }', 'toDo'); return false;">
                           To Do
                        </a>
                        <a href="#"
                           class="menu-option"
                           onclick="event.stopPropagation(); moveTaskToNewColumn('${
                             task.id
                           }', 'inProgress'); return false;">
                           In Progress
                        </a>
                        <a href="#"
                           class="menu-option"
                           onclick="event.stopPropagation(); moveTaskToNewColumn('${
                             task.id
                           }', 'awaitFeedback'); return false;">
                           Await Feedback
                        </a>
                        <a href="#"
                           class="menu-option"
                           onclick="event.stopPropagation(); moveTaskToNewColumn('${
                             task.id
                           }', 'done'); return false;">
                           Done
                        </a>
                    </div>
                </div>
            </div>
        `;
  }
  
  /**
   * Generates the HTML for the task edit form in zoom view.
   * @param {Object} task - The task object containing task details.
   * @param {string} taskKey - The key identifier for the task.
   * @returns {string} HTML string for the edit task form.
   */
  function getEditZoomSection(task, taskKey) {
    return `
        <div class="task-card-edit">
            <div onclick="closeTaskZoomEditSectionZoom()" class="close-section">
                <span><img src="assets/img/close.svg" alt=""></span>
            </div>
            <div class="edit-card-content-up">
                <!-- Title Field -->
                <form class="input-order title-section-edit" action="">
                    <label for="title">Title</label>
                    <input value="${task.title}" 
                           type="text" 
                           id="titleEdit" 
                           required 
                           placeholder="Enter a title">
                    <span id="alertMessageTitleEdit" 
                          class="alert-message hide-alert-message">
                        This field is required
                    </span>
                </form>
    
                <!-- Description Field -->
                <form class="input-order description-section-edit" action="">
                    <label for="description">Description</label>
                    <textarea class="description-input" 
                              id="descriptionEdit" 
                              placeholder="Enter a Description">${
                                task.taskDescription
                              }</textarea>
                </form>
    
                <!-- Due Date Field -->
                <form class="input-order date-section-edit" action="">
                    <label for="date">Due Date</label>
                    <input value="${task.dueDate}" 
                           type="date" 
                           id="dateEdit" 
                           required 
                           placeholder="Enter a due date">
                    <span id="alertMessageDateEdit" 
                          class="alert-message hide-alert-message">
                        This field is required
                    </span>
                </form>
    
                <!-- Priority Selector -->
                <div class="prio-section">
                    <span>Prio</span>
                    <div class="prio-levels">
                        <div onclick="pressUrgentButtonEditZoom()" 
                             id="prioUrgentEdit" 
                             class="${
                               task.priority === "Urgent"
                                 ? "prio-urgent-chosen"
                                 : "prio-urgent"
                             }">
                            <span>Urgent</span>
                            <img id="urgent-button-icon-edit" 
                                 src="${
                                   task.priority === "Urgent"
                                     ? "./assets/img/urgentArrowWhite.svg"
                                     : "./assets/img/urgentArrowRed.svg"
                                 }">
                        </div>
                        <div onclick="pressMediumButtonEditZoom()" 
                             id="prioMediumEdit" 
                             class="${
                               task.priority === "Medium"
                                 ? "prio-medium-chosen"
                                 : "prio-medium"
                             }">
                            <span>Medium</span>
                            <img id="medium-button-icon-edit" 
                                 src="${
                                   task.priority === "Medium"
                                     ? "./assets/img/mediumLinesWhite.svg"
                                     : "./assets/img/mediumLinesOrange.svg"
                                 }" alt="">
                        </div>
                        <div onclick="pressLowButtonEditZoom()" 
                             id="prioLowEdit" 
                             class="${
                               task.priority === "Low"
                                 ? "prio-low-chosen"
                                 : "prio-low"
                             }">
                            <span>Low</span>
                            <img id="low-button-icon-edit" 
                                 src="${
                                   task.priority === "Low"
                                     ? "./assets/img/lowArrowGreenWhite.svg"
                                     : "./assets/img/lowArrowGreeen.svg"
                                 }" alt="">
                        </div>
                    </div>
                </div>
    
                <!-- Assigned To Field -->
                <form class="input-order assigned-to-section-edit" action="">
                    <label for="assigned-to">Assigned to</label>
                    <div onclick="openAndCloseAssignedToSectionEditZoom()" 
                         id="assignedToSectionEdit" 
                         class="assigned-to-section">
                        <input type="text" 
                               id="assignedToInputEdit" 
                               placeholder="Select contacts to assign">
                        <div class="dropDown-img">
                            <img id="dropDownImgEdit" 
                                 src="./assets/img/dropDownArrowDown.svg" 
                                 alt="">
                        </div>
                    </div>
                    <div id="dropDownSectionEdit" 
                         class="drop-down-section d-none"></div>
                    <div id="choosenNamesSectionEdit" 
                         class="choosen-names"></div>
                </form>
    
                <!-- Subtasks Field -->
                <form class="input-order subtask-section-edit" action="">
                    <label for="subtask">Subtasks</label>
                    <div class="subtask-section">
                        <input onfocus="showInputSubtaskSectionEditZoom('${taskKey}')" 
                               type="text" 
                               id="subtaskEdit" 
                               placeholder="Add new subtask">
                        <div onclick="showInputSubtaskSectionEditZoom('${taskKey}')" 
                             id="subtaskIconSectionEdit" 
                             class="add-subtask-img">
                            <img src="./assets/img/addCross.svg" alt="">
                        </div>
                    </div>
                    <div id="subtaskSectionEdit" 
                         class="created-subtask"></div>
                </form>
            </div>
    
            <!-- Save Button -->
            <div class="edit-card-content-down">
                <div class="Log-In-and-Guest-Log-In">
                    <button class="Log-In-Button" 
                            onclick="saveTaskChangesZoom('${taskKey}')">
                        <span>OK</span>
                        <img src="./assets/img/check.svg" alt="">
                    </button>
                </div>
            </div>
        </div>
        `;
  }
  
  /**
   * Generates the HTML for the task details view in zoom mode.
   * @param {Object} task - The task object containing task details.
   * @param {string} taskId - The unique identifier for the task.
   * @returns {string} HTML string for the task details view.
   */
  function getZoomTaskSection(task, taskId) {
    return `
        <div class="task-card" id="task-card-element">
            <!-- Dynamic Category Section -->
            <div id="taskCategoryAndCloseSection" class="task-category-and-close-section"></div>
    
            <!-- Title Section -->
            <div class="subtask-zoom-title">
                <span>${task.title}</span>
            </div>
    
            <!-- Description Section -->
            <div class="task-description-zoom-section">
                <span>${task.taskDescription}</span>
            </div>
    
            <!-- Due Date Section -->
            <div class="due-date-section">
                <span class="due-date-title">Due date:</span>
                <span class="due-date-date">${task.dueDate}</span>
            </div>
    
            <!-- Priority Section -->
            <div class="priority-section">
                <span class="priority-title">Priority:</span>
                <div class="priority-name-and-icon">
                    <span class="due-date-date">${task.priority}</span>
                    <img id="prioIconZoomImg" src="./assets/img/mediumIconZoom.svg" alt="">
                </div>
            </div>
    
            <!-- Assigned Contacts Section -->
            <div class="assigned-to-section-zoom">
                <span class="assigned-to-section-title">Assigned to:</span>
                <div id="circleAndNameSection" class="circle-and-name-section"></div>
            </div>
    
            <!-- Subtasks Section -->
            <div class="subtasks-section">
                <span class="subtask-title">Subtasks</span>
                <div id="subtaskZoomSection" class="subtask-zoom-section"></div>
            </div>
    
            <!-- Action Buttons Section -->
            <div class="delete-and-edit-section">
                <div onclick="deleteTask('${taskId}')" class="delete-section">
                    <img src="./assets/img/trashImg.svg" alt="">
                    <span>Delete</span>
                </div>
                <div class="separator"></div>
                <div onclick="openEditSectionZoom('${taskId}')" class="edit-section">
                    <img src="./assets/img/subtaskPen.svg" alt="">
                    <span>Edit</span>
                </div>
            </div>
        </div>
        `;
  }
  
  /**
   * Generates simplified HTML for a task card in column view.
   * @param {Object} task - The task object containing task details.
   * @param {string} status - The column status (toDo, inProgress, etc).
   * @returns {string} HTML string for the task card.
   */
  function getColumnTaskHtml(task, status) {
    return `
          <div draggable="true" 
               ondragstart="startDragging('${task.id}')" 
               class="note" 
               onclick="handleTaskClick('${task.id}')">
            <div id="taskCategory${status}${task.id}"></div>
            <div class="note-hl">
                <span>${task.title || "Untitled Task"}</span>
            </div>
            <div class="note-description">
                <span>${task.taskDescription || "No description provided."}</span>
            </div>
            <div id="subtaskBarAndSubtaskSpan${status}${task.id}" 
                 class="subtask-bar-and-subtask-span"></div>
            <div class="assigned-profile-priority-section">
                <div class="name-circle-section" 
                     id="nameCircleSection${status}${task.id}">
                </div>
                <img id="prioImg${status}${task.id}" 
                     src="./assets/img/Prio media (1).svg" alt="">
            </div>
          </div>`;
  }
  
  /**
   * Generates the HTML for the add task overlay.
   * @returns {string} HTML string for the add task form overlay.
   */
  function getAddTaskSectionContent() {
    return `<div class="add-task-card">
        <div class="headline-and-close-section">
           <span class="add-task-headline">Add Task</span>
           <div onclick="closeAddTaskBoard()" class="close-add-task-section">
            <img src="./assets/img/close.svg" alt="">
           </div>
        </div>
        <div class="task-detail-section">
            <div class="task-details-left">
                <!-- Title Input -->
                <form class="input-order" action="">
                    <label for="title">Title<span class="red-star">*</span></label>
                    <input type="text" id="title" required placeholder="Enter a title">
                    <span id="alertMessageTitle" class="alert-message hide-alert-message">This field is required</span>
                </form>
                
                <!-- Description Input -->
                <form class="input-order" action="">
                    <label for="description">Description</label>
                    <textarea class="description-input" id="description" placeholder="Enter a Description"></textarea>
                </form>
                
                <!-- Assigned To -->
                <form class="input-order" action="">
                    <label for="assigned-to">Assigned to<span class="red-star">*</span></label>
                    <div onclick="openAndCloseAssignedToSection()" id="assignedToSection" class="assigned-to-section">
                        <input type="text" id="assigned-to" placeholder="Select contacts to assign">
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
                <!-- Due Date -->
                <form class="input-order" action="">
                    <label for="date">Due Date<span class="red-star">*</span></label>
                    <input type="date" id="date" required placeholder="Enter a title">
                    <span id="alertMessageDate" class="alert-message hide-alert-message">This field is required</span>
                </form>
                
                <!-- Priority Selector -->
                <div class="prio-section">
                    <span>Prio</span>
                    <div class="prio-levels">
                        <div onclick="pressPriorityButton('urgent')" id="prioUrgent" class="prio-urgent">
                            <span>Urgent</span>
                            <img id="urgent-button-icon" src="./assets/img/urgentArrowRed.svg" alt="">
                        </div>
                        <div onclick="pressPriorityButton('medium')" id="prioMedium" class="prio-medium-chosen">
                            <span>Medium</span>
                            <img id="medium-button-icon" src="./assets/img/mediumLinesWhite.svg" alt="">
                        </div>
                        <div onclick="pressPriorityButton('low')" id="prioLow" class="prio-low">
                            <span>Low</span>
                            <img id="low-button-icon" src="./assets/img/lowArrowGreeen.svg" alt="">
                        </div>
                    </div>
                </div>
                
                <!-- Category Selector -->
                <div class="input-order">
                    <div class="hl-and-red-star">
                        <span>Category</span><span class="red-star">*</span>
                    </div>
                    <div id="categorySection" onclick="openAndCloseCategorySection()" class="category-section">
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
                
                <!-- Subtasks -->
                <form class="input-order" action="">
                    <label for="subtask">Subtasks</label>
                    <div id="subtaskSectionInput" class="subtask-section">
                        <input onfocus="showInputSubtaskSection()" type="text" id="subtask" placeholder="Add new subtask">
                        <div onclick="showInputSubtaskSection()" id="subtaskIconSection" class="add-subtask-img">
                            <img src="./assets/img/addCross.svg" alt="">
                        </div>
                    </div>
                    <div id="subtaskSection" class="created-subtask"></div>
                </form>
            </div>
        </div>
        
        <!-- Form Buttons -->
        <div class="field-required-clear-create-button-section">
            <span id="fieldRequiredSection"><span class="red-star">*</span>This field is required</span>
            <div class="add-task-button">
                <div onclick="resetForm()" class="clear-button">
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
    </div>`;
  }
