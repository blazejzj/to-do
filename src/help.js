const gridContainer = document.createElement('div');
gridContainer.classList.add("gridContainer"); 

const body = document.querySelector('body');
const button = document.createElement('button');

button.innerText = "Create new grid";
body.appendChild(button);
body.appendChild(gridContainer);

function createGrid(gridSize = 16) {
    
    gridContainer.innerHTML = ""; // Clear any existing grid

    let flexFactor = 100 / gridSize;

    for (let i = 0; i < gridSize * gridSize; i++) {
        let div = document.createElement('div');
        div.classList.add("square");
        div.style.flex = `1 0 ${flexFactor}%`;
        gridContainer.appendChild(div);
        div.addEventListener("mouseover", hoverEffect);

        function hoverEffect() {
            div.style.backgroundColor = "blue";
        }
    }
}

function removeAndCreateNewGrid() {
    let gridSize = prompt("Enter the number of sides you want each side of the grid to have (note: the number entered should not be greater than 100)");

    // Ensure the grid size is valid
    while (gridSize > 100) {
        gridSize = prompt("Enter a number not greater than 100");
    }

    createGrid(gridSize);
}

button.addEventListener("click", removeAndCreateNewGrid);

createGrid();