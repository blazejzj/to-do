import { UI } from './UI';
import { Project } from './project';
import { projectManager } from './projectManager';
import { Task } from './task';
import { Errors } from './errors';
import {startOfToday, endOfToday, addDays, addMonths, parseISO, isBefore } from 'date-fns';

class DOMS {
    static init() {
        this.cacheDOMElements();
        this.bindEventListeners();
    }

    static cacheDOMElements() {
        // often used DOM elements
        this.projectsContainer = document.getElementById("projects");
        this.addProjectBtn = document.getElementById("addProjectBtn");
        this.cancelAddingProjectBtn = document.querySelector('.projectCancelBtn');
        this.newProjectForm = document.getElementById('newProjectForm');
        this.newProjectPopup = document.getElementById('newProjectPopup');
        this.menuToggle = document.querySelector('.hamburger-menu-container img');
        this.menuContainer = document.querySelector('.menu-container');
        this.mainContainer = document.querySelector('.container');
        this.taskContentContainer = document.getElementById("content");
        this.newTaskPopup = document.getElementById('newTaskPopup');
        this.newTaskForm = document.getElementById('newTaskForm');
        this.newTaskForm.addEventListener('submit', (event) => this.handleNewTaskFormSubmission(event));
        this.priorityButtons = document.querySelectorAll('.priority-btn');
        this.taskPriorityInput = document.getElementById('taskPriority');
    }

    static bindEventListeners() {
        this.menuToggle.addEventListener('click', () => {
            this.menuContainer.classList.toggle('active');
            this.mainContainer.classList.toggle('menu-active');
        });
        this.cancelAddingProjectBtn.addEventListener('click', () => UI.hideNewProjectPopup());
        this.addProjectBtn.addEventListener("click", () => UI.showNewProjectPopup());
        this.newProjectForm.addEventListener('submit', (event) => this.handleNewProjectFormSubmission(event));
        this.priorityButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                this.priorityButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to the clicked button
                button.classList.add('active');
    
                // Update the hidden input value
                this.taskPriorityInput.value = button.getAttribute('data-priority');
            });
        });

        // Default selected priority
        document.querySelector(`.priority-btn[data-priority="${this.taskPriorityInput.value}"]`).classList.add('active');

        // Show tasks category by date buttons
        document.getElementById("showAllTasks").addEventListener("click", () => this.showFilteredTaskBasedOnTime("all"));
        document.getElementById('showDueTodayTasks').addEventListener('click', () => this.showFilteredTaskBasedOnTime('today'));
        document.getElementById('showDueWeekTasks').addEventListener('click', () => this.showFilteredTaskBasedOnTime('week'));
        document.getElementById('showDueMonthTasks').addEventListener('click', () => this.showFilteredTaskBasedOnTime('month'));

    }

    static handleNewProjectFormSubmission(event) {
        event.preventDefault();
        // Get the title value from the FORMS responsible for creating projects
        const projectTitle = this.newProjectForm.querySelector('#projectTitle').value;
        // Make new project object add it to the list of all projects
        const newProject = new Project(projectTitle);
        projectManager.addProject(newProject);
        
        // After adding new project hide the UI and refresh all projects (show)
        UI.hideNewProjectPopup();
        UI.refreshAllUI();
    }

    static handleNewTaskFormSubmission(event) {
        event.preventDefault();
    
        // Form values from submitting a new task
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const priority = document.getElementById('taskPriority').value;
    
        // Validate task due date before creating a task
        const dueDate = document.getElementById('taskDueDate').value;
        const todayDate = startOfToday();
        const selectedDate = parseISO(dueDate);
        const incorrectDateMsg = document.getElementById("incorrectDateMsg");
    
        // Disallow user to set a due date before today
        if (isBefore(selectedDate, todayDate)) {
            incorrectDateMsg.style.display = "initial";
            return;
        }
    
        // If validated create new task object
        const newTask = new Task(title, description, dueDate, priority);
        incorrectDateMsg.style.display = "none";
    
        /*
        Find currently selected project (its id)
        Match the id with the project in the list of all projects
        Display all tasks from the selected project
        */ 
        const currentlySelectedBtn = document.querySelector("[data-selected='true']");
        const currentProjectId = parseInt(currentlySelectedBtn.getAttribute("data-id"));
    
        projectManager.getProjects().forEach((project) => {
            if (project.getId() == currentProjectId) {
                project.addTask(newTask);
                UI.refreshAllUI(project);
            }
        });
    
        // Reset everything -> Hide the popup and reset forms
        document.getElementById('newTaskForm').reset();
        document.querySelector('.priority-btn.active').classList.remove('active');
        document.querySelector(`.priority-btn[data-priority="medium"]`).classList.add('active');
        UI.hideNewTaskPopup();
    }

    static editTask(task) {
        // Display the new task popup
        UI.showNewTaskPopup();

        // Change the original add task header to edit task
        const taskPopupHeader = document.querySelector('.taskPopupHeader');
        taskPopupHeader.textContent = "Edit Task";
    
        // Fill the form with the task details
    
        // Prefill the title
        document.getElementById("taskTitle").value = task.getTitle();
    
        // Prefill the description
        document.getElementById("taskDescription").value = task.getDescription();
    
        // Prefill the due date
        document.getElementById("taskDueDate").value = task.getDueDate();
        
        // Prefill the priority
        document.getElementById("taskPriority").value = task.getPriority();
        // Display the priority in the task popup
        const priorityButtons = document.querySelectorAll(".priority-btn");
        priorityButtons.forEach(button => {
            button.classList.remove("active");
            if (button.getAttribute("data-priority") === task.getPriority()) {
                button.classList.add("active");
            };
        });
    
        // Change the submit btn text content to "Edit Task"
        const submitBtn = document.querySelector(".taskSubmitBtn");
        submitBtn.textContent = "Edit Task";
    
        // Modify the onclick function to update the task instead of creating a new one
        submitBtn.onclick = function(event) {
            event.preventDefault();
    
            // Get updated values from the form
            const updatedTitle = document.getElementById('taskTitle').value;
            const updatedDescription = document.getElementById('taskDescription').value;
            const updatedPriority = document.getElementById('taskPriority').value;
            const updatedDueDate = document.getElementById('taskDueDate').value;
    
            // Update the task with new values
            task.setTitle(updatedTitle);
            task.setDescription(updatedDescription);
            task.setPriority(updatedPriority);
            task.setDueDate(updatedDueDate);
    
            // Find the right project that has teh task inside of it
            const projectWithTask = projectManager.getProjects().find((project) => project.getTasks().find((t) => t.getId() === task.getId()));
    
            if (projectWithTask) {
                projectWithTask.updateTask(task); 
                UI.refreshAllUI(projectWithTask);
            }
    
            // Reset everything -> Hide the popup and reset forms
            document.getElementById('newTaskForm').reset();
            document.querySelector('.priority-btn.active').classList.remove('active');
            document.querySelector(`.priority-btn[data-priority="medium"]`).classList.add('active');
            
            // Change back the event listener to create a new task
            submitBtn.textContent = "Create Task";
            submitBtn.onclick = function(event) {
                event.preventDefault();
                DOMS.handleNewTaskFormSubmission(event);
            };

            // Reset the header
            taskPopupHeader.textContent = "Add New Task";

            UI.hideNewTaskPopup();
        };
        UI.refreshAllUI();
    };
    

    static selectButton(newlySelectedButton) {

        // Set the currently selected project id
        DOMS.currentlySelectedDataId = newlySelectedButton.getAttribute("data-id");

        // Fetch currently selected button
        let currentSelectedBtn = document.querySelector("[data-selected='true']");

        // Check if a currently selected button exists before trying to remove the attribute
        if (currentSelectedBtn) {
            currentSelectedBtn.removeAttribute("data-selected");
        }   

        newlySelectedButton.setAttribute("data-selected", "true");

        // Fetch the project id from the newly selected button and display its content
        const projectId = parseInt(newlySelectedButton.getAttribute("data-id"));
        const specificProject = projectManager.getProjects().find((project) => project.getId() == projectId);

        // First 4 are default "buttons" displaying tasks by different criterias (all, today, week, month)
        if (![1, 2, 3, 4].includes(projectId)) {
            UI.refreshAllUI(specificProject);
        } else {
            Errors.emptyArray();
        }
    };

    static showFilteredTaskBasedOnTime(dueType) {
        // Fetch all tasks from all projects
        const allAvailableTasks = [];
        projectManager.getProjects().forEach((project) => {
            project.getTasks().forEach((task) => {
                allAvailableTasks.push(task);
            });
        });

        let filteredTasks = [];
        const today = startOfToday();
        const endOfNext7Days = addDays(today, 7); 
        const endOfNextMonth = addMonths(today, 1);
        
        switch(dueType) {
            case 'all':
                // Display all tasks
                filteredTasks = allAvailableTasks;
                break;
            case 'today':
                // Display tasks due today
                filteredTasks = allAvailableTasks.filter(task => {
                    const taskDueDate = new Date(task.dueDate);
                    return taskDueDate >= startOfToday() && taskDueDate <= endOfToday();
                });
                break;
            case 'week':
                // Display tasks due this week
                filteredTasks = allAvailableTasks.filter(task => {
                    const taskDueDate = new Date(task.dueDate);
                    return taskDueDate >= today && taskDueDate <= endOfNext7Days;
                });
                break;
            case 'month':
                // Display tasks due this month
                filteredTasks = allAvailableTasks.filter(task => {
                    const taskDueDate = new Date(task.dueDate);
                    return taskDueDate >= today && taskDueDate <= endOfNextMonth;
                });
                break;
            default:
                Errors.unexpectedParam();
        }

        // Display filtered tasks
        UI.displayFilteredTasks(filteredTasks);
    }
}

DOMS.init();

export { DOMS };
