import './style.css';
import { DOMS } from './dom';
import { projectManager } from './projectManager';
import { UI } from './UI'; // Ensure this import is correct

// Load projects from local storage
document.addEventListener('DOMContentLoaded', () => {
    // Initialize example data if there are no projects in local storage
    projectManager.loadProjects(); 
    UI.refreshAllUI(); 
});

document.body.addEventListener('click', (event) => {
    // Check if the clicked element is a button with a 'data-id'
    if (event.target.tagName === 'BUTTON' && event.target.hasAttribute('data-id')) {
        DOMS.selectButton(event.target);
    };
});
