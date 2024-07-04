import { format, parseISO, isFuture } from 'date-fns';
import { Errors } from './errors';

class Task {

    // static property to keep track of the current id of each task
    static currentId = 0;

    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = parseISO(dueDate);
        this.priority = priority || "medium"; // default
        this.completed = false;
        this.id = Task.currentId++;
    }

    setTitle(newTitle) {
        this.title = newTitle;
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
    
    getFormattedDate() {
        return format(this.dueDate, 'MMMM d');
    }

    setPriority(newPriority) {
        this.priority = newPriority
    }

    setDescription(newDescription) {
        this.description = newDescription;
    }

    setDueDate(newDueDate) {
        let newDate = parseISO(newDueDate);
        if(isFuture(newDate)) {
            this.dueDate = newDueDate
        }
        else {
            Errors.wrongNewDate();
        }
    }
    
    toggleCompleted() {
        this.completed = !this.completed;
    }



}

export { Task };