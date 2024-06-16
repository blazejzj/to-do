import { Project } from './project';
import { projectManager } from './projectManager';

class DOMS {
    static init() {
        this.cacheDOMElements();
        this.bindEventListeners();
    }

    static cacheDOMElements() {
        this.projectsContainer = document.getElementById("projects");
        this.addStuffBtn = document.getElementById("addTaskBtn");
        this.cancelBtn = document.querySelector('.cancel-btn');
        this.newProjectForm = document.getElementById('newProjectForm');
        this.newProjectPopup = document.getElementById('newProjectPopup');
        this.menuToggle = document.querySelector('.hamburger-menu-container img');
        this.menuContainer = document.querySelector('.menu-container');
        this.container = document.querySelector('.container');
    }

    static bindEventListeners() {
        this.menuToggle.addEventListener('click', () => {
            this.menuContainer.classList.toggle('active');
            this.container.classList.toggle('menu-active');
        });
        this.cancelBtn.addEventListener('click', () => this.hideNewProjectPopup());
        this.addStuffBtn.addEventListener("click", () => this.addProjectOrTask());
        this.newProjectForm.addEventListener('submit', (event) => this.handleNewProjectFormSubmission(event));
    }

    static handleNewProjectFormSubmission(event) {
        event.preventDefault();
        const projectTitle = this.newProjectForm.querySelector('#projectTitle').value;
        const newProject = new Project(projectTitle);
        projectManager.addProject(newProject);
        console.log('Creating new project with title:', projectTitle, "projectId: " + newProject.getId());
        this.hideNewProjectPopup();
        this.displayAllProjectsDOMS();
    }

    static addProjectOrTask() {
        const selectedButton = document.querySelector("[data-selected='true']");
        if (selectedButton) {
            const selectedId = parseInt(selectedButton.getAttribute('data-id'));
            console.log("Button pressed, adding...");
            if ([1, 2, 3, 4].includes(selectedId)) {
                this.showNewProjectPopup();
            } else {
                console.log("Adding a new task to project: " + selectedId);
            }
        }
    }

    static selectButton(newlySelectedButton) {
        let currentSelectedBtn = document.querySelector("[data-selected='true']");
        if (currentSelectedBtn) {
            currentSelectedBtn.removeAttribute("data-selected");
            newlySelectedButton.setAttribute("data-selected", "true");
        }
    }

    static createNewProjectDOM(project) {
        const container = document.createElement("div");
        container.classList.add("buttonContainer", "project");
        const projectBtn = document.createElement("button");
        projectBtn.setAttribute("data-id", project.getId());
        projectBtn.textContent = project.getTitle();
        const spanCounter = document.createElement("span");
        spanCounter.classList.add("task-counter");
        spanCounter.textContent = project.getAmountOfTasks();
        container.append(projectBtn, spanCounter);
        return container;
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

    static displayAllProjectsDOMS() {
        this.projectsContainer.innerHTML = "";
        projectManager.getAllProjects().forEach(project => {
            this.addProjectDomToContainer(this.createNewProjectDOM(project));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => DOMS.init());

export { DOMS };
