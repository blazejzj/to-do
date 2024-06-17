import { UI } from './UI';
import { Project } from './project';
import { projectManager } from './projectManager';
import { Task } from './task';
import { Errors } from './errors';
import {startOfToday, endOfToday, addDays, startOfMonth, endOfMonth, addMonths } from 'date-fns';

class DOMS {
    static init() {
        this.cacheDOMElements();
        this.bindEventListeners();
    }

    static cacheDOMElements() {
        // often used DOM elements
        this.projectsContainer = document.getElementById("projects");
        this.addProjectBtn = document.getElementById("addProjectBtn");
        this.cancelAddingProjectBtn = document.querySelector('.cancel-btn');
        this.newProjectForm = document.getElementById('newProjectForm');
        this.newProjectPopup = document.getElementById('newProjectPopup');
        this.menuToggle = document.querySelector('.hamburger-menu-container img');
        this.menuContainer = document.querySelector('.menu-container');
        this.container = document.querySelector('.container');
        this.taskContentContainer = document.getElementById("content");
        this.newTaskPopup = document.getElementById('newTaskPopup');
        this.newTaskForm = document.getElementById('newTaskForm');
        this.newTaskForm.addEventListener('submit', (event) => this.handleNewTaskFormSubmission(event));
    }

    static bindEventListeners() {
        this.menuToggle.addEventListener('click', () => {
            this.menuContainer.classList.toggle('active');
            this.container.classList.toggle('menu-active');
        });
        this.cancelAddingProjectBtn.addEventListener('click', () => UI.hideNewProjectPopup());
        this.addProjectBtn.addEventListener("click", () => UI.showNewProjectPopup());
        this.newProjectForm.addEventListener('submit', (event) => this.handleNewProjectFormSubmission(event));

        // Show tasks category by date buttons
        document.getElementById("showAllTasks").addEventListener("click", () => this.filterTasks("all"));
        document.getElementById('showDueTodayTasks').addEventListener('click', () => this.filterTasks('today'));
        document.getElementById('showDueWeekTasks').addEventListener('click', () => this.filterTasks('week'));
        document.getElementById('showDueMonthTasks').addEventListener('click', () => this.filterTasks('month'));
    }

    static handleNewProjectFormSubmission(event) {
        event.preventDefault();
        // Get the title value from the FORMS responsible for creating projects
        const projectTitle = this.newProjectForm.querySelector('#projectTitle').value;
        // Make new project object
        const newProject = new Project(projectTitle);
        projectManager.addProject(newProject);
        // DEBUG
        console.log('Creating new project with title:', projectTitle, "projectId: " + newProject.getId());

        // After adding new project hide the UI and refresh all projects
        UI.hideNewProjectPopup();
        UI.displayAllProjectsDOMS();
    }

    static handleNewTaskFormSubmission(event) {
        event.preventDefault();
    
        // Get FORM values of creating tasks
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const priority = document.getElementById('taskPriority').value;
        // Create new task object
        const newTask = new Task(title, description, dueDate, priority);
    
        // Get currently selected button and see if its a project
        const currentlySelectedBtn = document.querySelector("[data-selected='true']");
        const currentProjectId = parseInt(currentlySelectedBtn.getAttribute("data-id"));
        console.log('Task created:', newTask);
    
        projectManager.getAllProjects().forEach((project) => {
            if (project.getId() == currentProjectId) {
                project.addTask(newTask);
                console.log(newTask);
                console.log(project.getAmountOfTasks());
            }
        });
    
        this.newTaskForm.reset();
        UI.hideNewTaskPopup();
    }
    

    static selectButton(newlySelectedButton) {
        this.currentlySelectedDataId = newlySelectedButton.getAttribute("data-id");
        // Fetch current button with the data selected
        let currentSelectedBtn = document.querySelector("[data-selected='true']");
        if (currentSelectedBtn) {
            // Remove the selected and apply it instead on newly pressed button
            currentSelectedBtn.removeAttribute("data-selected");
        }
        newlySelectedButton.setAttribute("data-selected", "true");

        // Now match the selected buttons ID, check if basically its a project -> display the appropriate tasks.
        const projectId = parseInt(newlySelectedButton.getAttribute("data-id"));
        const specificProject = projectManager.getAllProjects().find((project) => project.getId() == projectId);

        if (![1, 2, 3, 4].includes(projectId)) {
            UI.displayCurrentSelectedProjectContent(specificProject);
        } else {
            Errors.emptyArray();
        }
    }

    static filterTasks(dueType) {
        // Fetch all tasks from all projects
        const allAvailableTasks = [];
        projectManager.getAllProjects().forEach((project) => {
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
