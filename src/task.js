import { format, parseISO, isFuture } from 'date-fns';
import { Errors } from './errors';

class Task {

    // static property to keep track of the current id of each task
    static currentId = 0;

    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority || "medium"; // default
        this.completed = false;
        this.id = Task.currentId++;
    }

    getTitle() {
        return this.title;
    }
    
    getId() {
        return this.id;
    }

    getPriority() {
        return this.priority;
    }

    getCompleted() {
        return this.completed;
    }

    getDueDate() {
        return this.dueDate;
    }

    getDescription() {
        return this.description;
    }

    getFormattedDate() {
        return format(this.dueDate, 'MMMM d');
    }

    setTitle(newTitle) {
        this.title = newTitle;
    }

    setPriority(newPriority) {
        this.priority = newPriority
    }

    setDescription(newDescription) {
        this.description = newDescription;
    }

    setDueDate(newDueDate) {
        this.dueDate = newDueDate;

    }
    
    toggleCompleted() {
        this.completed = !this.completed;
    }



}

export { Task };