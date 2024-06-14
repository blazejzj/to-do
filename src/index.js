import './style.css';
import { Project } from './project'
import { DOMS } from './dom'
import { Errors } from './errors';
import { Task } from './task';



// Placeholder for menu for now (mobile)
const menuToggle = document.querySelector('.hamburger-menu-container img');
const menuContainer = document.querySelector('.menu-container');
const container = document.querySelector('.container');

menuToggle.addEventListener('click', function() {
    menuContainer.classList.toggle('active');
    container.classList.toggle('menu-active');
});

