import { projectManager } from './projectManager';
import { DOMS } from './dom';
import { Task } from './task';
import {startOfToday, endOfToday, addDays, addMonths } from 'date-fns';

class UI {
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
        checkBoxTaskCompleted.setAttribute("class", `task-completed-${task.getId()}`);
        checkBoxTaskCompleted.setAttribute("name", `task-completed-${task.getId()}`);
        checkBoxTaskCompleted.addEventListener("change", () => {
            const taskContainer = checkBoxTaskCompleted.closest('.task-container');
            if (checkBoxTaskCompleted.checked) {
                taskContainer.classList.add('completed');
            } else {
                taskContainer.classList.remove('completed');
            }
        });

        const taskTitle = document.createElement("h4");
        taskTitle.textContent = task.title;

        const taskInProjectName = document.createElement("span");
        taskInProjectName.classList.add("projectNameForTask");

        // Find the appropriate project name based on where the task is located
        projectManager.getAllProjects().forEach((project) => {
            // Iterate through each projects tasks
            project.getTasks().forEach((taskIteration) => {
                if(taskIteration.getId() === task.getId()) {
                    taskInProjectName.textContent = project.getTitle();
                };
                // No need for fallback -> Task always has a project
            });            
        });


        taskContainerMain.append(checkBoxTaskCompleted, taskTitle, taskInProjectName);
        taskContainer.appendChild(taskContainerMain);

        const taskContainerSecond = document.createElement("div");
        taskContainerSecond.classList.add("task-container-second");

        const displayDueDate = document.createElement("span");
        displayDueDate.textContent = task.formattedDate();

        const editTaskBtn = document.createElement("button");
        const editTaskImg = document.createElement("img");
        editTaskImg.src = "/asset/edit2.svg";
        editTaskImg.alt = "Edit button";
        editTaskImg.classList.add("taskButtonImages");
        editTaskBtn.appendChild(editTaskImg);
        
        const deleteTaskBtn = document.createElement("button");
        const deleteTaskImg = document.createElement("img");
        deleteTaskImg.src = "/asset/delete.svg";
        deleteTaskImg.alt = "Delete Button";
        deleteTaskImg.classList.add("taskButtonImages");
        deleteTaskBtn.appendChild(deleteTaskImg);
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
            }project
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
            const project = projectManager.getAllProjects().find(project => {
                return project.getId().toString().trim() === projectID;
            });


            if (project) {
                // Update project task coutner
                const projectTaskCounter = projectDOM.querySelector("span");
                projectTaskCounter.textContent = project.getAmountOfTasks();
            }

            // Get all tasks within a project
            const tasks = project.getTasks();
            tasks.forEach(task => {
                allTasksCount++;
                const taskDueDate = new Date(task.getDueDate());

                // Assign appropriate values based on the due date
                if(taskDueDate >= startOfToday() && taskDueDate <= endOfToday()) {
                    todayTasksCount++;
                    console.log("added today")
                };

                if(taskDueDate >= today && taskDueDate <= endOfNext7Days) {
                    weekTasksCount++;
                    console.log("added week")
                };

                if(taskDueDate >= today && taskDueDate <= endOfNextMonth) {
                    monthTasksCount++;
                    console.log("added month")
                };
            })
        });

        // Update the counters in the DOM
        allTasksCounter.textContent = allTasksCount;
        todayTasksCounter.textContent = todayTasksCount;
        weekTasksCounter.textContent = weekTasksCount;
        monthTasksCounter.textContent = monthTasksCount;
    };

    static handleCheckBoxChange(checkbox) {

    }
}

export { UI };
