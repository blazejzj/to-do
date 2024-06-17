import { Project } from './project';
import { projectManager } from './projectManager';
import { Errors } from './errors';
import { add } from 'date-fns';
import { Task } from './task';

class DOMS {
    static init() {
        this.cacheDOMElements();
        this.bindEventListeners();
    }

    static cacheDOMElements() {
        // Get all necessary queries once
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
        // Event listeners
        // Hamburger menu on mobile
        this.menuToggle.addEventListener('click', () => {
            this.menuContainer.classList.toggle('active');
            this.container.classList.toggle('menu-active');
        });
        // Cancel button on add project
        this.cancelAddingProjectBtn.addEventListener('click', () => this.hideNewProjectPopup());
        this.addProjectBtn.addEventListener("click", () => this.showNewProjectPopup());
        this.newProjectForm.addEventListener('submit', (event) => this.handleNewProjectFormSubmission(event));
    }

    static handleNewProjectFormSubmission(event) {
        event.preventDefault();
        // Get title of the newly added project and make an object -> add to existing projects
        const projectTitle = this.newProjectForm.querySelector('#projectTitle').value;
        const newProject = new Project(projectTitle);
        projectManager.addProject(newProject);
        console.log('Creating new project with title:', projectTitle, "projectId: " + newProject.getId()); // DEBUG

        // Hide adding new projects and refresh projects DOM
        this.hideNewProjectPopup();
        this.displayAllProjectsDOMS();
    }

    static handleNewTaskFormSubmission(event) {
        event.preventDefault();
        // Gather inputs from the form
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const priority = document.getElementById('taskPriority').value;
        
        // Assume you have a way to add tasks to the current project
        const newTask = new Task(title, description, dueDate, priority);
        // Add to current project or task manager
        console.log('Task added:', newTask);
    
        // Clear form and hide popup
        this.newTaskForm.reset();
        this.hideNewTaskPopup();
    }

    static selectButton(newlySelectedButton) {
        // Logic handling currently pressed button and assigning the selected data attribute
        let currentSelectedBtn = document.querySelector("[data-selected='true']");
        if (currentSelectedBtn) {
            currentSelectedBtn.removeAttribute("data-selected");
            newlySelectedButton.setAttribute("data-selected", "true");

            // Upon the event of a button selection we want to display all its tasks -> create DOMS for tasks -> Display
            const projectId = parseInt(newlySelectedButton.getAttribute("data-id")); // This id we want to find within our ArrayList of Projects
            const specificProject = projectManager.getAllProjects().find((project) => project.getId() == projectId);

            if(![1, 2, 3, 4].includes(projectId)) {
                this.displayCurrentSelectedProjectContent(specificProject);
            }
            else {
                Errors.emptyArray();
            }
        }
    }

    static createNewProjectDOM(project) {
        const container = document.createElement("div");
        container.classList.add("project");

        const projectTitleBtn = document.createElement("button");
        projectTitleBtn.setAttribute("data-id", project.getId());
        projectTitleBtn.classList.add("buttonHover");
        projectTitleBtn.textContent = project.getTitle();

        const projectTaskCounter = document.createElement("span");
        projectTaskCounter.classList.add("task-counter");
        projectTaskCounter.textContent = project.getAmountOfTasks();

        container.append(projectTitleBtn, projectTaskCounter);

        return container;
    }

    static createNewTaskDOM(task) {
        // Logic creating a task DOM from a task object
    }

    static addProjectDomToContainer(projectDOM) {
        this.projectsContainer.appendChild(projectDOM);
    }

    static showNewProjectPopup() {
        this.newProjectPopup.style.display = 'flex';
    }

    static hideNewProjectPopup() {
        this.newProjectPopup.style.display = 'none';
    }

    static showNewTaskPopup() {
        this.newTaskPopup.style.display = "flex";
    }

    static hideNewTaskPopup() {
        this.newTaskPopup.style.display = "none";
    }

    static displayAllProjectsDOMS() {
        this.projectsContainer.innerHTML = "";
        projectManager.getAllProjects().forEach(project => {
            this.addProjectDomToContainer(this.createNewProjectDOM(project));
        });
    }

    static displayCurrentSelectedProjectContent(project) {
        // clear insides of content
        this.taskContentContainer.innerHTML = "";
        console.log("Content container cleared");

        if(project.getAmountOfTasks() > 0) {
            // Fill contentContainer with newly selected button's content
            project.getTasks().forEach((task) => {
                // Create a task DOM (currently storing objects)
                let newTaskDom = this.createNewTaskDOM(task);

                console.log("Created new task DOM added to container");
                // Add this new DOM element inside content
                this.taskContentContainer.appendChild(newTaskDom);
            });
        }


        // Append a button to add more tasks within the project

        const addTaskBtn = document.createElement("button");
        addTaskBtn.textContent = "+ New Task";
        addTaskBtn.classList.add("add-new-task-btn");

        addTaskBtn.addEventListener("click", () => {
            DOMS.showNewTaskPopup();
        });
        
        this.taskContentContainer.appendChild(addTaskBtn);
    }

}

DOMS.init();

export { DOMS };
