import './style.css';
import { Project } from './project'
import { DOMS } from './dom'
import { Errors } from './errors';
import { Task } from './task';
import { projectManager } from './projectManager';


document.body.addEventListener('click', (event) => {
    // Check if the clicked element is a button with a 'data-id'
    if (event.target.tagName === 'BUTTON' && event.target.hasAttribute('data-id')) {
        DOMS.selectButton(event.target);
        console.log('Data-ID:', event.target.getAttribute('data-id'), 'Value:', event.target.textContent.trim());
    }
});
