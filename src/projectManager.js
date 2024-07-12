import { storageLocal } from './storageLocal.js';

class ProjectManager {
    constructor() {
        this.projects = []; // initialize empty arraylist for storage of projects
        this.storage = new storageLocal();
        this.storage.loadProjects();
    }

    addProject(project) {
        this.projects.push(project);
        this.saveProjects(); 
    }

    removeProject(projectId) {
        this.projects = this.projects.filter(project => project.getId() !== projectId);
        this.saveProjects();
    }

    getProjects() {
        return this.projects;
    }

    saveProjects() {
        const serializedProjects = this.projects.map(project => ({
            title: project.getTitle(),
            projectId: project.getId(),
            tasks: project.getTasks().map(task => ({
                title: task.getTitle(),
                description: task.getDescription(),
                dueDate: task.getDueDate(),
                priority: task.getPriority(),
                completed: task.getCompleted(),
                id: task.getId(),
            })),
        }));
        this.storage.saveProjects(serializedProjects);
    }

    loadProjects() {
        const loadedProjects = this.storage.loadProjects();
        this.projects = loadedProjects.map(projectData => {
            const project = new Project(projectData.title);
            project.projectId = projectData.projectId;
            projectData.tasks.forEach(taskData => {
                const task = new Task(
                    taskData.title,
                    taskData.description,
                    taskData.dueDate,
                    taskData.priority
                );
                task.completed = taskData.completed;
                project.addTask(task);
            });
            return project;
        });
    }


}

export const projectManager = new ProjectManager();