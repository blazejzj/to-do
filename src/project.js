
class Project {

    static projectId = 0 + 5; // starting at five because of static buttons in index page

    constructor(title) {
        this.title = title;
        this.projectId = Project.projectId++;
        this.tasks = [];
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id != taskId);
    }

    addTask(newTask) {
        this.tasks.push(newTask);
    }

    getAmountOfTasks() {
        return this.tasks.length;
    }

    getId() {
        return this.projectId;
    }

    getTitle() {
        return this.title;
    }

    getTasks() {
        return this.tasks;
    }

}

export { Project };