import { Project } from './project'

class DOMS {

    static createNewTask(task) {
        // Create new task DOM element and return it
    };

    static createNewProject(project) {
        // Create the container
        const container = document.createElement("div");
        container.classList.add("buttonContainer", "project-id-" + project.getId());
        
        // Create the button responsible for storing the projects later
        const projectBtn = document.createElement("button");
        projectBtn.textContent = project.getTitle();

        // Create the span counting amount of projects inside
        const spanCounter = document.createElement("span");
        spanCounter.classList.add("task-counter");
        spanCounter.textContent = project.getAmountOfTasks();

        // Add everything to the container & return
        container.appendChild(projectBtn);
        container.appendChild(spanCounter);

        return container;
    }

}

export { DOMS };