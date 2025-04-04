const default_contacts = {
  contact_1: {
    email: "john.doe@email.com",
    firstNameContact: "John",
    lastNameContact: "Doe",
    phone: "+1234567890",
  },
  contact_2: {
    email: "jane.smith@email.com",
    firstNameContact: "Jane",
    lastNameContact: "Smith",
    phone: "+9876543210",
  },
  contact_3: {
    email: "alex.dev@email.com",
    firstNameContact: "Alex",
    lastNameContact: "Developer",
    phone: "+1122334455",
  },
  contact_4: {
    email: "lisa.uiux@email.com",
    firstNameContact: "Lisa",
    lastNameContact: "UI/UX",
    phone: "+5544332211",
  },
  contact_5: {
    email: "mike.frontend@email.com",
    firstNameContact: "Mike",
    lastNameContact: "Frontend",
    phone: "+6677889900",
  },
  contact_6: {
    email: "sarah.code@email.com",
    firstNameContact: "Sarah",
    lastNameContact: "CodeMaster",
    phone: "+4455667788",
  },
  contact_7: {
    email: "tom.react@email.com",
    firstNameContact: "Tom",
    lastNameContact: "ReactPro",
    phone: "+7788990011",
  },
  contact_8: {
    email: "emma.angular@email.com",
    firstNameContact: "Emma",
    lastNameContact: "AngularGuru",
    phone: "+9900112233",
  },
  contact_9: {
    email: "chris.vue@email.com",
    firstNameContact: "Chris",
    lastNameContact: "VueWizard",
    phone: "+3344556677",
  },
  contact_10: {
    email: "olivia.js@email.com",
    firstNameContact: "Olivia",
    lastNameContact: "JSQueen",
    phone: "+2211334455",
  },
};

const default_tasks = {
  task_1: {
    assignedTo: {
      contact_1: { firstName: "John", lastName: "Doe" },
      contact_4: { firstName: "Lisa", lastName: "UI/UX" },
    },
    category: "User Story",
    currentStatus: "inProgress",
    dueDate: "2025-03-01",
    id: "task_1",
    priority: "Urgent",
    taskDescription:
      "Design a responsive navigation menu using CSS Grid and Flexbox.",
    title: "Responsive Navigation Menu",
  },
  task_2: {
    assignedTo: {
      contact_2: { firstName: "Jane", lastName: "Smith" },
    },
    category: "Technical Task",
    currentStatus: "inProgress",
    dueDate: "2025-03-05",
    id: "task_2",
    priority: "Medium",
    taskDescription: "Create a light/dark mode toggle using JavaScript.",
    title: "Dark Mode Toggle",
  },
  task_3: {
    assignedTo: {
      contact_1: { firstName: "John", lastName: "Doe" },
      contact_3: { firstName: "Alex", lastName: "Developer" },
    },
    category: "User Story",
    currentStatus: "inProgress",
    dueDate: "2025-03-07",
    id: "task_3",
    priority: "Low",
    taskDescription:
      "Build an animated modal using JavaScript and CSS transitions.",
    title: "Animated Modal Window",
  },
  task_4: {
    assignedTo: {
      contact_2: { firstName: "Jane", lastName: "Smith" },
    },
    category: "Technical Task",
    currentStatus: "toDo",
    dueDate: "2025-03-10",
    id: "task_4",
    priority: "Low",
    taskDescription: "Implement a filter and search function for a task list.",
    title: "Task Filter & Search",
  },
  task_5: {
    assignedTo: {
      contact_4: { firstName: "Lisa", lastName: "UI/UX" },
    },
    category: "User Story",
    currentStatus: "done",
    dueDate: "2025-02-20",
    id: "task_5",
    priority: "Low",
    taskDescription: "Add hover effects for buttons using CSS.",
    title: "Button Hover Effects",
  },
  task_6: {
    assignedTo: {
      contact_3: { firstName: "Alex", lastName: "Developer" },
    },
    category: "Technical Task",
    currentStatus: "awaitFeedback",
    dueDate: "2025-03-12",
    id: "task_6",
    priority: "Urgent",
    taskDescription:
      "Optimize performance by implementing lazy loading for images.",
    title: "Lazy Loading for Images",
  },
  task_7: {
    assignedTo: {
      contact_1: { firstName: "John", lastName: "Doe" },
      contact_2: { firstName: "Jane", lastName: "Smith" },
    },
    category: "User Story",
    currentStatus: "toDo",
    dueDate: "2025-03-15",
    id: "task_7",
    priority: "Medium",
    taskDescription: "Build a drag-and-drop functionality for a to-do list.",
    title: "Drag & Drop Task Management",
  },
  task_8: {
    assignedTo: {
      contact_3: { firstName: "Alex", lastName: "Developer" },
      contact_4: { firstName: "Lisa", lastName: "UI/UX" },
    },
    category: "Technical Task",
    currentStatus: "awaitFeedback",
    dueDate: "2025-03-18",
    id: "task_8",
    priority: "High",
    taskDescription:
      "Use Intersection Observer to implement scroll animations.",
    title: "Scroll Animations with Intersection Observer",
  },
};
