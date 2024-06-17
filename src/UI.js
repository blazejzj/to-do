import { projectManager } from './projectManager';
import { DOMS } from './dom';
import { Task } from './task';

class UI {
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
        const taskContainer = document.createElement("div");
        taskContainer.classList.add("task-container");

        const taskContainerMain = document.createElement("div");
        taskContainerMain.classList.add("task-container-main");

        const checkBoxTaskCompleted = document.createElement("input");
        checkBoxTaskCompleted.setAttribute("type", "checkbox");
        checkBoxTaskCompleted.setAttribute("id", `task-completed-${task.getId()}`);
        checkBoxTaskCompleted.setAttribute("name", `task-completed-${task.getId()}`);

        const taskTitle = document.createElement("h4");
        taskTitle.textContent = task.title;

        taskContainerMain.append(checkBoxTaskCompleted, taskTitle);
        taskContainer.appendChild(taskContainerMain);

        const taskContainerSecond = document.createElement("div");
        taskContainerSecond.classList.add("task-container-second");

        const displayDueDate = document.createElement("span");
        displayDueDate.textContent = task.formattedDate();

        const editTaskBtn = document.createElement("button");
        editTaskBtn.textContent = "EDIT";
        editTaskBtn.classList.add("editTaskBtn");

        const deleteTaskBtn = document.createElement("button");
        deleteTaskBtn.textContent = "DELETE";
        deleteTaskBtn.classList.add("deleteTaskBtn");

        taskContainerSecond.append(displayDueDate, editTaskBtn, deleteTaskBtn);
        taskContainer.appendChild(taskContainerSecond);

        return taskContainer;
    }

    static addProjectDomToContainer(projectDOM) {
        const projectsContainer = document.getElementById("projects");
        projectsContainer.appendChild(projectDOM);
    }

    static showNewProjectPopup() {
        const newProjectPopup = document.getElementById('newProjectPopup');
        newProjectPopup.style.display = 'flex';
    }

    static hideNewProjectPopup() {
        const newProjectPopup = document.getElementById('newProjectPopup');
        newProjectPopup.style.display = 'none';
    }

    static showNewTaskPopup() {
        const newTaskPopup = document.getElementById('newTaskPopup');
        newTaskPopup.style.display = "flex";
    }

    static hideNewTaskPopup() {
        const newTaskPopup = document.getElementById('newTaskPopup');
        newTaskPopup.style.display = "none";
    }

    static displayAllProjectsDOMS() {
        const projectsContainer = document.getElementById("projects");
        projectsContainer.innerHTML = "";
        projectManager.getAllProjects().forEach(project => {
            const projectDOM = UI.createNewProjectDOM(project);
            if (project.getId() == DOMS.currentlySelectedDataId) {
                projectDOM.querySelector('button').setAttribute("data-selected", "true");
            }
            UI.addProjectDomToContainer(projectDOM);
        });
    }

    static displayCurrentSelectedProjectContent(project) {
        const taskContentContainer = document.getElementById("content");
        taskContentContainer.innerHTML = "";
    
        if (project.getAmountOfTasks() > 0) {
            project.getTasks().forEach(task => {
                let newTaskDom = UI.createNewTaskDOM(task);
                taskContentContainer.appendChild(newTaskDom);
            });
        }
    
        const addTaskBtn = document.createElement("button");
        addTaskBtn.textContent = "+ New Task";
        addTaskBtn.classList.add("add-new-task-btn");
        addTaskBtn.onclick = () => UI.showNewTaskPopup();
        taskContentContainer.appendChild(addTaskBtn);
    }

    static displayFilteredTasks(tasks) {
        const taskContentContainer = document.getElementById("content");
        taskContentContainer.innerHTML = "";
        tasks.forEach(task => {
            const taskDOM = UI.createNewTaskDOM(task);
            taskContentContainer.appendChild(taskDOM);
        });
    }
}

export { UI };
