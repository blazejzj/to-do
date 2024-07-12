class storageLocal {

    constructor() {
        this.storage = window.localStorage;
    }

    saveProjects(projects) {
        this.storage.setItem('projects', JSON.stringify(projects));
    }

    loadProjects() {
        const projects = this.storage.getItem('projects');
        if (projects) {
            try {
                return JSON.parse(projects);
            } catch (error) {
                return []; 
            }
        }
        return []; 
    }
}

export { storageLocal };
