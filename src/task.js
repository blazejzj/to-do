import { format, parseISO, isFuture } from 'date-fns';
import { Errors } from './errors';

class Task {
    static currentId = 0;

    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = parseISO(dueDate);
        this.priority = priority || "medium"; // default
        this.completed = false;
        this.id = Task.currentId++;
    }

    changeTitle(newTitle) {
        this.title = newTitle;
    }

    getTitle() {
        return this.title;
    }
    
    getId() {
        return this.id;
    }

    changeDescription(newDescription) {
        this.description = newDescription;
    }

    changeDuedate(newDueDate) {
        let newDate = parseISO(newDueDate);
        if(isFuture(newDate)) {
            this.dueDate = newDueDate
        }
        else {
            Errors.wrongNewDate();
        }
    }

    getDueDate() {
        return this.dueDate;
    }

    changePriority(newPriority) {
        // going to be controlled by buttons
        this.priority = newPriority
    }

    toggleCompletd() {
        this.completed = !this.completed;
    }

    formattedDate() {
        return format(this.dueDate, 'MMMM d');
    }


}

export { Task };