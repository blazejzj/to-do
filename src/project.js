
class Project {

    static projectId = 0;

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

}

export { Project };