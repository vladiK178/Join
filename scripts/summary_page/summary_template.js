function getSummaryContent() {
    return `
    <div class="new">
        <div class="join-title">
            <span class="join-title-span">JOIN 360</span>
            <div class="seperator"></div>
            <span class="subheadline-span">Key Metrics at a Glance</span>
        </div>
        <div class="main-summary-section">
            <div class="complete-quarter-section">
                <div onclick="summaryToBoard()" class="to-do-and-done-section">
                    <div onclick="changeWindowToBoardSection()" class="to-do-quarter">
                        <div class="circle-dark-blue"><img src="./assets/img/pencil.svg" alt=""></div>
                        <div class="to-do-quarter-details">
                            <span id="todo-count" class="number">0</span>
                            <span class="quarter-description">To-do</span>
                        </div>
                    </div>
                    <div onclick="changeWindowToBoardSection()" class="to-do-quarter">
                        <div class="circle-dark-blue"><img src="./assets/img/Vector (1).svg" alt=""></div>
                        <div class="to-do-quarter-details">
                            <span id="done-count" class="number">0</span>
                            <span class="quarter-description">Done</span>
                        </div>
                    </div>
                </div>
                <div onclick="changeWindowToBoardSection()" class="urgent-deadline-section-container">
                    <div class="urgent-deadline-secction">
                        <div class="urgent-deadline-quarter">
                            <div class="circle-red"><img src="./assets/img/arrowUp.svg" alt=""></div>
                            <div class="to-do-quarter-details">
                                <span id="urgent-count" class="number">0</span>
                                <span class="quarter-description">Urgent</span>
                            </div>
                        </div>
                        <div class="seperator-grey"></div>
                        <div class="date-section">
                            <span id="urgent-deadline" class="date-span">-</span>
                            <span class="date-message-span">Upcoming Deadline</span>
                        </div>
                    </div>
                </div>
                <div class="task-feedback-section">
                    <div onclick="changeWindowToBoardSection()" class="tasks-board-container-section">
                        <div class="tasks-board-container">
                            <div class="number-and-description">
                                <span id="board-count" class="number">0</span>
                                <span class="task-section-span">Tasks in Board</span>
                            </div>
                        </div>
                    </div>
                    <div onclick="changeWindowToBoardSection()" class="tasks-progress-container-section">
                        <div class="task-progress-container">
                            <span id="progress-count" class="number">0</span>
                            <span class="task-section-span">Tasks in Progress</span>
                        </div>
                    </div> 
                    <div onclick="changeWindowToBoardSection()" class="feedback-section-container">
                        <div class="feedback-section">
                            <span id="feedback-count" class="number">0</span>
                            <span class="task-section-span">Awaiting Feedback</span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="greetingMessageSection" class="greeting-meesage-section">
                <div id="greetingSpot" class="greeting-spot">
                </div>
            </div>
        </div>
    </div>
    <div id="rotateWarning" class="rotate-overlay hide">
    <div class="rotate-message">
      <h2>Bitte drehe dein Gerät</h2>
      <p>Um unsere Seite optimal zu nutzen, verwende bitte das Hochformat.</p>
    </div>
    </div>`;
}