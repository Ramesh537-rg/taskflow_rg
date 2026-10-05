// ================================================
// TASKFLOW PRO
// JavaScript
// ================================================


// ================================================
// GET HTML ELEMENTS
// ================================================

const taskInput =
    document.getElementById("taskInput");

const priorityInput =
    document.getElementById("priorityInput");

const dateInput =
    document.getElementById("dateInput");

const searchInput =
    document.getElementById("searchInput");

const taskList =
    document.getElementById("taskList");

const emptyMessage =
    document.getElementById("emptyMessage");

const totalTasks =
    document.getElementById("totalTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const completedTasks =
    document.getElementById("completedTasks");

const progressPercent =
    document.getElementById("progressPercent");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");

const editModal =
    document.getElementById("editModal");

const editInput =
    document.getElementById("editInput");


// ================================================
// VARIABLES
// ================================================

let tasks =
    JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "all";

let editingTaskId = null;


// ================================================
// ADD TASK
// ================================================

function addTask() {

    const text =
        taskInput.value.trim();

    const priority =
        priorityInput.value;

    const date =
        dateInput.value;


    // Validation

    if (text === "") {

        alert("Please enter a task!");

        taskInput.focus();

        return;

    }


    // Create task object

    const newTask = {

        id: Date.now(),

        title: text,

        priority: priority,

        date: date,

        completed: false

    };


    // Add to array

    tasks.push(newTask);


    // Save

    saveTasks();


    // Clear inputs

    taskInput.value = "";

    dateInput.value = "";

    priorityInput.value = "medium";


    // Display

    displayTasks();

}


// ================================================
// DISPLAY TASKS
// ================================================

function displayTasks() {

    taskList.innerHTML = "";


    let filteredTasks = [];


    // ==============================
    // FILTER
    // ==============================

    if (currentFilter === "all") {

        filteredTasks = tasks;

    }

    else if (currentFilter === "pending") {

        filteredTasks =
            tasks.filter(function(task) {

                return task.completed === false;

            });

    }

    else if (currentFilter === "completed") {

        filteredTasks =
            tasks.filter(function(task) {

                return task.completed === true;

            });

    }


    // ==============================
    // SEARCH
    // ==============================

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    if (search !== "") {

        filteredTasks =
            filteredTasks.filter(function(task) {

                return task.title
                    .toLowerCase()
                    .includes(search);

            });

    }


    // ==============================
    // LOOP THROUGH TASKS
    // ==============================

    for (let i = 0;
         i < filteredTasks.length;
         i++) {

        const task =
            filteredTasks[i];


        createTaskElement(task);

    }


    // ==============================
    // EMPTY MESSAGE
    // ==============================

    if (filteredTasks.length === 0) {

        emptyMessage.style.display =
            "block";

    }

    else {

        emptyMessage.style.display =
            "none";

    }


    updateDashboard();

}


// ================================================
// CREATE TASK ELEMENT
// ================================================

function createTaskElement(task) {

    const taskDiv =
        document.createElement("div");


    taskDiv.className = "task";


    if (task.completed) {

        taskDiv.classList.add("completed");

    }


    // ==============================
    // CHECKBOX
    // ==============================

    const checkbox =
        document.createElement("input");


    checkbox.type = "checkbox";

    checkbox.className =
        "task-checkbox";

    checkbox.checked =
        task.completed;


    checkbox.onclick = function() {

        toggleTask(task.id);

    };


    // ==============================
    // CONTENT
    // ==============================

    const content =
        document.createElement("div");


    content.className =
        "task-content";


    // Task title

    const title =
        document.createElement("div");


    title.className =
        "task-title";


    title.textContent =
        task.title;


    // Task information

    const info =
        document.createElement("div");


    info.className =
        "task-info";


    // Priority

    const priority =
        document.createElement("span");


    priority.className =
        "priority " + task.priority;


    priority.textContent =
        task.priority.toUpperCase();


    info.appendChild(priority);


    // Date

    if (task.date !== "") {

        const date =
            document.createElement("span");


        date.className =
            "date";


        date.textContent =
            "📅 " + task.date;


        info.appendChild(date);

    }


    content.appendChild(title);

    content.appendChild(info);


    // ==============================
    // ACTION BUTTONS
    // ==============================

    const actions =
        document.createElement("div");


    actions.className =
        "actions";


    // Edit

    const editButton =
        document.createElement("button");


    editButton.className =
        "edit";


    editButton.textContent =
        "✏️";


    editButton.title =
        "Edit Task";


    editButton.onclick =
        function() {

            openEditModal(task.id);

        };


    // Delete

    const deleteButton =
        document.createElement("button");


    deleteButton.className =
        "delete";


    deleteButton.textContent =
        "🗑️";


    deleteButton.title =
        "Delete Task";


    deleteButton.onclick =
        function() {

            deleteTask(task.id);

        };


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    // ==============================
    // FINAL ELEMENT
    // ==============================

    taskDiv.appendChild(checkbox);

    taskDiv.appendChild(content);

    taskDiv.appendChild(actions);


    taskList.appendChild(taskDiv);

}


// ================================================
// COMPLETE TASK
// ================================================

function toggleTask(id) {

    for (let i = 0;
         i < tasks.length;
         i++) {

        if (tasks[i].id === id) {

            tasks[i].completed =
                !tasks[i].completed;

            break;

        }

    }


    saveTasks();

    displayTasks();

}


// ================================================
// DELETE TASK
// ================================================

function deleteTask(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmation) {

        return;

    }


    tasks =
        tasks.filter(function(task) {

            return task.id !== id;

        });


    saveTasks();

    displayTasks();

}


// ================================================
// OPEN EDIT MODAL
// ================================================

function openEditModal(id) {

    const task =
        tasks.find(function(item) {

            return item.id === id;

        });


    if (!task) {

        return;

    }


    editingTaskId = id;


    editInput.value =
        task.title;


    editModal.classList.add("show");


    editInput.focus();

}


// ================================================
// SAVE EDIT
// ================================================

function saveEdit() {

    const newText =
        editInput.value.trim();


    if (newText === "") {

        alert("Task cannot be empty!");

        return;

    }


    for (let i = 0;
         i < tasks.length;
         i++) {

        if (tasks[i].id === editingTaskId) {

            tasks[i].title =
                newText;

            break;

        }

    }


    saveTasks();

    displayTasks();

    closeModal();

}


// ================================================
// CLOSE MODAL
// ================================================

function closeModal() {

    editModal.classList.remove("show");

    editingTaskId = null;

}


// ================================================
// FILTER TASKS
// ================================================

function filterTasks(filter, button) {

    currentFilter = filter;


    // Get all filter buttons

    const buttons =
        document.querySelectorAll(".filter");


    // LOOP

    for (let i = 0;
         i < buttons.length;
         i++) {

        buttons[i]
            .classList
            .remove("active");

    }


    button.classList.add("active");


    displayTasks();

}


// ================================================
// SEARCH
// ================================================

searchInput.addEventListener(
    "input",
    function() {

        displayTasks();

    }
);


// ================================================
// UPDATE DASHBOARD
// ================================================

function updateDashboard() {

    const total =
        tasks.length;


    let completed = 0;


    // LOOP

    for (let i = 0;
         i < tasks.length;
         i++) {

        if (tasks[i].completed) {

            completed++;

        }

    }


    const pending =
        total - completed;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    // Update HTML

    totalTasks.textContent =
        total;

    pendingTasks.textContent =
        pending;

    completedTasks.textContent =
        completed;

    progressPercent.textContent =
        percentage + "%";

    progressFill.style.width =
        percentage + "%";

    progressText.textContent =
        completed +
        " / " +
        total +
        " tasks";

}


// ================================================
// CLEAR COMPLETED
// ================================================

function clearCompleted() {

    const completedExists =
        tasks.some(function(task) {

            return task.completed;

        });


    if (!completedExists) {

        alert("There are no completed tasks.");

        return;

    }


    const confirmation =
        confirm(
            "Delete all completed tasks?"
        );


    if (!confirmation) {

        return;

    }


    tasks =
        tasks.filter(function(task) {

            return task.completed === false;

        });


    saveTasks();

    displayTasks();

}


// ================================================
// SAVE TASKS
// ================================================

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


// ================================================
// DARK MODE
// ================================================

function toggleTheme() {

    document.body.classList.toggle("dark");


    const darkMode =
        document.body.classList.contains("dark");


    localStorage.setItem(
        "taskflowDark",
        darkMode
    );


    const button =
        document.getElementById("themeBtn");


    if (darkMode) {

        button.textContent =
            "☀️ Light Mode";

    }

    else {

        button.textContent =
            "🌙 Dark Mode";

    }

}


// ================================================
// LOAD DARK MODE
// ================================================

function loadTheme() {

    const darkMode =
        localStorage.getItem("taskflowDark");


    if (darkMode === "true") {

        document.body.classList.add("dark");

        document.getElementById(
            "themeBtn"
        ).textContent =
            "☀️ Light Mode";

    }

}


// ================================================
// ENTER KEY
// ================================================

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ================================================

editModal.addEventListener(
    "click",
    function(event) {

        if (event.target === editModal) {

            closeModal();

        }

    }
);


// ================================================
// INITIALIZE APPLICATION
// ================================================

loadTheme();

displayTasks();