
class Project {

    static projectId = 5; // Starting at 5 because we have some static ids that show tasks based on due date

    constructor(title) {
        this.title = title;
        this.projectId = Project.projectId++;
        this.tasks = [];
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

    setAmountOfTasks(amount) {
        this.tasks.length = amount;
    }

    updateTask(updatedTask) {
        const taskIndex = this.tasks.findIndex(task => task.getId() === updatedTask.getId());
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = updatedTask;
        }
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(task => task.getId() != taskId);
    }

    addTask(newTask) {
        this.tasks.push(newTask);
    }

}

export { Project };