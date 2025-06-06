function getHelpContent() {
    return `<div class="new-section">
    <section class="help-section">
        <div class="mandatory-container">
          <div class="section-heading">
            <h1>Help</h1>
            <div  onclick="goBack()" class="back-arrow-container">
            <div class="back-arrow"></div>
            </div>
          </div>
  
          <p>
            Welcome to the help page for <span class="accentuated">Join</span>
            , your guide to using our kanban project management tool. Here, we'll
            provide an overview of what
            <span class="accentuated">Join</span>
  
            is, how it can benefit you, and how to use it.
          </p>
          <h2>What is Join?</h2>
          <p>
            <span class="accentuated">Join</span>
            is a kanban-based project management tool designed and built by a
            group of dedicated students as part of their web development bootcamp
            at the Developer Akademie.
          </p>
          <br />
          <p>
            Kanban, a Japanese term meaning "billboard", is a highly effective
            method to visualize work, limit work-in-progress, and maximize
            efficiency (or flow). <span class="accentuated">Join</span>
            leverages the principles of kanban to help users manage their tasks
            and projects in an intuitive, visual interface.
          </p>
          <br />
          <p>
            It is important to note that <span class="accentuated">Join</span> is
            designed as an educational exercise and is not intended for extensive
            business usage. While we strive to ensure the best possible user
            experience, we cannot guarantee consistent availability, reliability,
            accuracy, or other aspects of quality regarding
            <span class="accentuated">Join</span>
            .
          </p>
  
          <h2>How to use it</h2>
          <p>
            Here is a step-by-step guide on how to use
            <span class="accentuated">Join</span>:
          </p>
  
          <table class="how-to-join">
            <tr>
              <td class="step-nmbr">1.</td>
              <td class="step-content">
                <h3 class="list-heading">Exploring the Board</h3>
                When you log in to <span class="accentuated">Join</span>
                , you'll find a default board. This board represents your project
                and contains four default lists: "To Do", "In Progress", “Await
                feedback” and "Done".
              </td>
            </tr>
            <tr>
              <td class="step-nmbr">2.</td>
              <td class="step-content">
                <h3 class="list-heading">Creating Contacts</h3>
                In <span class="accentuated">Join</span>
                , you can add contacts to collaborate on your projects. Go to the
                "Contacts" section, click on "New contact", and fill in the
                required information. Once added, these contacts can be assigned
                tasks and they can interact with the tasks on the board.
              </td>
            </tr>
            <tr>
              <td class="step-nmbr">3.</td>
              <td class="step-content">
                <h3 class="list-heading">Adding Cards</h3>
                Now that you've added your contacts, you can start adding cards.
                Cards represent individual tasks. Click the "+" button under the
                appropriate list to create a new card. Fill in the task details in
                the card, like task name, description, due date, assignees, etc.
              </td>
            </tr>
            <tr>
              <td class="step-nmbr">4.</td>
              <td class="step-content">
                <h3 class="list-heading">Moving Cards</h3>
                As the task moves from one stage to another, you can reflect that
                on the board by dragging and dropping the card from one list to
                another.
              </td>
            </tr>
            <tr>
              <td class="step-nmbr">5.</td>
              <td class="step-content">
                <h3 class="list-heading">Deleting Cards</h3>
                Once a task is completed, you can either move it to the "Done"
                list or delete it. Deleting a card will permanently remove it from
                the board. Please exercise caution when deleting cards, as this
                action is irreversible.
                <br />
                <br />
                Remember that using <span class="accentuated">Join</span>
                effectively requires consistent updates from you and your team to
                ensure the board reflects the current state of your project.
                <br />
                <br />
                Have more questions about <span class="accentuated">Join</span>
                ? Feel free to contact us at <a class="accentuated" href="mailto:join440mail.de">join440mail.de</a>. We're here to
                help you!
              </td>
            </tr>
          </table>
          <h2>Enjoy using Join!</h2>
        </div>
      </section>
    </div>
    <div id="rotateWarning" class="rotate-overlay hide">
    <div class="rotate-message">
      <h2>Bitte drehe dein Gerät</h2>
      <p>Um unsere Seite optimal zu nutzen, verwende bitte das Hochformat.</p>
    </div>
    </div>
    `;
}