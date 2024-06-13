import './style.css';

// placeholder for hamburgermenu later
document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector('.hamburger-menu-container');
    const menu = document.querySelector('.menu-container');

    hamburger.addEventListener('click', function() {
        menu.classList.toggle('active');
    });
});