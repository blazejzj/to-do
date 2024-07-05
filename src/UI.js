import { projectManager } from './projectManager';
import { DOMS } from './dom';
import { Task } from './task';
import {startOfToday, endOfToday, addDays, addMonths } from 'date-fns';

class UI {

    // Create a new project DOM
    static createNewProjectDOM(project) {
        const container = document.createElement("div");
        container.classList.add("project");
        container.setAttribute("project-id", project.getId());

        const projectTitleBtn = document.createElement("button");
        projectTitleBtn.setAttribute("data-id", project.getId());
        projectTitleBtn.classList.add("buttonHover");
        projectTitleBtn.textContent = project.getTitle();

        const projectTaskCounter = document.createElement("span");
        projectTaskCounter.classList.add("task-counter");
        projectTaskCounter.textContent = 0;

        container.append(projectTitleBtn, projectTaskCounter);

        return container;
    };

    // Create a new task DOM
    static createNewTaskDOM(task) {

        const taskContainer = document.createElement("div");
        taskContainer.classList.add("task-container");
        
        const taskContainerMain = document.createElement("div");
        taskContainerMain.classList.add("task-container-main");

        const checkBoxTaskCompleted = document.createElement("input");
        checkBoxTaskCompleted.setAttribute("type", "checkbox");
        checkBoxTaskCompleted.setAttribute("class", `task-completed-${task.getId()}`);
        checkBoxTaskCompleted.setAttribute("name", `task-completed-${task.getId()}`);

        // Upon checking the checkbox, apply styling and update the task counters
        checkBoxTaskCompleted.addEventListener("change", () => {
            const taskContainer = checkBoxTaskCompleted.closest('.task-container');
            if (checkBoxTaskCompleted.checked) {
                taskContainer.classList.add('completed');
                task.toggleCompleted();
                UI.updateTaskCounters();
            } else {
                taskContainer.classList.remove('completed');
                task.toggleCompleted();
                UI.updateTaskCounters();
            }
        });

        const taskTitle = document.createElement("h4");
        taskTitle.textContent = task.title;

        const taskInProjectName = document.createElement("span");
        taskInProjectName.classList.add("projectNameForTask");

        // Find the appropriate project name based on where the task is located
        projectManager.getProjects().forEach((project) => {
            // Iterate through each projects tasks
            project.getTasks().forEach((taskIteration) => {
                if(taskIteration.getId() === task.getId()) {
                    taskInProjectName.textContent = project.getTitle();
                };
            });            
        });


        taskContainerMain.append(checkBoxTaskCompleted, taskTitle, taskInProjectName);
        taskContainer.appendChild(taskContainerMain);

        const taskContainerSecond = document.createElement("div");
        taskContainerSecond.classList.add("task-container-second");

        const showDetailsBtn = document.createElement("button");
        showDetailsBtn.classList.add("taskShowDetailsBtn");
        showDetailsBtn.textContent = "Details";

        const displayDueDate = document.createElement("span");
        displayDueDate.textContent = task.getFormattedDate();

        const editTaskBtn = document.createElement("button");
        editTaskBtn.classList.add("editTaskBtn");
        // Allow editing a task (pop up)
        editTaskBtn.addEventListener("click", function() {
            // Create popup, allow changing task values
        });

        // Give edit button an icon
        const editTaskImg = document.createElement("img");
        editTaskImg.src = "/asset/editBtn.svg";
        editTaskImg.alt = "Edit button";
        editTaskImg.classList.add("taskButtonImages");
        editTaskBtn.appendChild(editTaskImg);
        
        const deleteTaskBtn = document.createElement("button");
        deleteTaskBtn.classList.add("deleteTaskBtn");
        // Delete that particular task upon clicking the button
        deleteTaskBtn.addEventListener("click", function() {
            // Find the currently pressed project and its id (Thats where the task would be)
            const currentlySelectedBtn = document.querySelector("[data-selected='true']");
            const currentProjectId = parseInt(currentlySelectedBtn.getAttribute("data-id"));

            // Find the project in projectmanager by matching the IDs
            const project = projectManager.getProjects().find((project) => project.getId() === currentProjectId); 

            // Remove task & refresh
            project.removeTask(task.getId());
            UI.displayCurrentSelectedProjectContent(project);
            UI.updateTaskCounters();
        });

        // Give delete button an icon
        const deleteTaskImg = document.createElement("img");
        deleteTaskImg.src = "/asset/deleteBtn.svg";
        deleteTaskImg.alt = "Delete Button";
        deleteTaskImg.classList.add("taskButtonImages");
        deleteTaskBtn.appendChild(deleteTaskImg);
        taskContainerSecond.append(showDetailsBtn, displayDueDate, editTaskBtn, deleteTaskBtn);
        taskContainer.appendChild(taskContainerSecond);


        // before returning the task container, check if the task is completed
        // if completed, add (completed style & checked checkbox)
        // We do it because sometimes we're "refreshing" the DOMS by deleting previous ones and creating new ones
        if (task.getCompleted()) {
            UI.addTaskCompletedStyle(taskContainer);
            checkBoxTaskCompleted.checked = true; // Check the checkbox if the task is completed (prevents visual task completed bugs)
        }

        else {
            UI.removeTaskCompletedStyle(taskContainer);
        };

        return taskContainer;
        
    };

    static addProjectDomToProjectsContainer(projectDOM) {
        const projectsContainer = document.getElementById("projects");
        projectsContainer.appendChild(projectDOM);
    };

    static showNewProjectPopup() {
        const newProjectPopup = document.getElementById('newProjectPopup');
        newProjectPopup.style.display = 'flex';
    };

    static hideNewProjectPopup() {
        const newProjectPopup = document.getElementById('newProjectPopup');
        newProjectPopup.style.display = 'none';
    };

    static showNewTaskPopup() {
        const newTaskPopup = document.getElementById('newTaskPopup');
        newTaskPopup.style.display = "flex";
    };

    static hideNewTaskPopup() {
        const newTaskPopup = document.getElementById('newTaskPopup');
        newTaskPopup.style.display = "none";
    };

    static addTaskCompletedStyle(taskContainer) {
        taskContainer.classList.add("completed");
    };

    static removeTaskCompletedStyle(taskContainer) {
        taskContainer.classList.remove("completed");
    };

    static displayAllProjectsDOMS() {
        const projectsContainer = document.getElementById("projects");
        // Clear the container before adding new projects
        projectsContainer.innerHTML = "";

        // Display content of the currently selected project
        projectManager.getProjects().forEach(project => {
            const projectDOM = UI.createNewProjectDOM(project);
            if (project.getId() == DOMS.currentlySelectedDataId) {
                projectDOM.querySelector('button').setAttribute("data-selected", "true");
            };

            UI.addProjectDomToProjectsContainer(projectDOM);
        });
    };

    static displayCurrentSelectedProjectContent(project) {
        const taskContentContainer = document.getElementById("content");
        taskContentContainer.innerHTML = "";
    
        // Make sure project has atleast 1 task
        if (project.getAmountOfTasks() > 0) {
            project.getTasks().forEach(task => {

                // Create the task DOM
                let newTaskDom = UI.createNewTaskDOM(task);

                // Give appropriate border to the task based on its priority
                UI.applyCorrectBorderStyling(newTaskDom, task);

                // Append the task to the task container
                taskContentContainer.appendChild(newTaskDom);
            });
        };
    
        // Add a button to add a new task (for all projects)
        const addTaskBtn = document.createElement("button");
        addTaskBtn.textContent = "+ New Task";
        addTaskBtn.classList.add("add-new-task-btn");
        addTaskBtn.onclick = () => UI.showNewTaskPopup();
        taskContentContainer.appendChild(addTaskBtn);
    };

    static applyCorrectBorderStyling(taskContainer, task) {
        // Control the border based on the tasks priority
        switch (task.getPriority()) {
            case "high":
                taskContainer.classList.add("task-priority-high");
                break;
            case "medium":
                taskContainer.classList.add("task-priority-medium");
                break;
            case "low":
                taskContainer.classList.add("task-priority-low");
                break;
            default:
                taskContainer.classList.add("task-priority-medium");
        }
    };

    static displayFilteredTasks(tasks) {
        // Before displaying tasks based on the due date, clear the content
        const taskContentContainer = document.getElementById("content");
        taskContentContainer.innerHTML = "";

        // Display the tasks (already sorted by due date)
        tasks.forEach(task => {
            const taskDOM = UI.createNewTaskDOM(task);
            // Apply correct border styling based on the task priority
            UI.applyCorrectBorderStyling(taskDOM, task);
            taskContentContainer.appendChild(taskDOM);
        });
    };

    static updateTaskCounters() {

        const allTasksView = document.getElementById("allTasksView");
        const allTasksCounter = allTasksView.querySelector("span");

        const todayTasksView = document.getElementById("todayTasksView");
        const todayTasksCounter = todayTasksView.querySelector("span"); 

        const weekTasksView = document.getElementById("weekTasksView");
        const weekTasksCounter = weekTasksView.querySelector("span"); 

        const monthTasksView = document.getElementById("monthTasksView");
        const monthTasksCounter = monthTasksView.querySelector("span"); 

        const projectsDOMS = document.querySelectorAll("[project-id]");

        let allTasksCount = 0;
        let todayTasksCount = 0;
        let weekTasksCount = 0;
        let monthTasksCount = 0;

        const today = startOfToday();
        const endOfNext7Days = addDays(today, 7); 
        const endOfNextMonth = addMonths(today, 1);

        // Iterate through each project DOM
        projectsDOMS.forEach(projectDOM => {
            const projectID = projectDOM.getAttribute("project-id");

            // Find the corresponding projetc from the projectManager
            const project = projectManager.getProjects().find(project => {
                return project.getId().toString().trim() === projectID;
            });

            // Update project task coutner
            const projectTaskCounter = projectDOM.querySelector("span");
            let projectTaskAmount = 0;

            
            // Get all tasks within a project
            const tasks = project.getTasks();
            tasks.forEach(task => {
                const taskDueDate = new Date(task.getDueDate());
                const taskCompleted = task.getCompleted();

                if(taskCompleted) {
                    return;
                }

                allTasksCount++;
                projectTaskAmount++;
                
                // Incremenet values based on the due date
                if(taskDueDate >= startOfToday() && taskDueDate <= endOfToday()) {
                    todayTasksCount++;
                };

                if(taskDueDate >= today && taskDueDate <= endOfNext7Days) {
                    weekTasksCount++;
                };

                if(taskDueDate >= today && taskDueDate <= endOfNextMonth) {
                    monthTasksCount++;
                };
            });

            // Update the specific project task counter
            projectTaskCounter.textContent = projectTaskAmount;
        });

        // Update the counters in the DOM
        allTasksCounter.textContent = allTasksCount;
        todayTasksCounter.textContent = todayTasksCount;
        weekTasksCounter.textContent = weekTasksCount;
        monthTasksCounter.textContent = monthTasksCount;
    };
}

export { UI };
