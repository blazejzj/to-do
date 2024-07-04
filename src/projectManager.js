

class ProjectManager {
    constructor() {
        this.projects = []; // initialize empty arraylist for storage of projects
    }

    addProject(project) {
        this.projects.push(project);
    }

    removeProject(projectId) {
       this.projects = this.projects.filter(project => project.getId() !== projectId);
    }

    getProjects() {
        return this.projects;
    }
}

export const projectManager = new ProjectManager();