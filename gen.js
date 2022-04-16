//setting up constants
const canvas = document.getElementById("forestCanvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//setting up variables and lists
var cellsArray = [];
var boundariesArray = [];
var boundariesArray2 = [];
var generation = 1;
var totalFitness = 0;
var averageFitness = 0;
var boundaryLocation = NaN;
var boundaryLocation2 = NaN;

var tempList = [];
var temptempList = [];

NUM_CELLS = 100;
NUM_BOUNDARIES = 1;
MUTATION_RATE = 0.2;
var cellCount = 0;

var cellGenes = canvas.height;
var cellGenesFloor = 0


//resizing the window and adjusting the rest of other things on the screen
window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    controlCells();
    controlBoundaries();
    controlBoundaries2();
})

//Classes related to the fitness boundaries
class Boundaries {
    constructor() {
        this.x = canvas.width - 50;
        this.y = boundaryLocation;
    }
    update() {
        this.x = this.x;
        this.y = boundaryLocation;
    }
    draw() {
        c.fillStyle = 'green';
        c.fillRect(this.x, this.y, 100, 15);
    }
}

class Boundaries2 {
    constructor() {
        this.x = canvas.width - 51;
        this.y = boundaryLocation2;
    }
    update() {
        this.x = this.x;
        this.y = boundaryLocation2;
    }
    draw() {
        c.fillStyle = 'green';
        c.fillRect(this.x, this.y, 100, 15);
    }
}

//Class related to the cells on the screen
class Cell {
    constructor() {
        this.x = Math.floor(Math.random() * (-10 - (-30) + 1)) + -30;
        this.y = Math.floor(Math.random() * (cellGenes - (cellGenesFloor) + 1)) + cellGenesFloor;
        this.size = 3;
        this.speedX = Math.floor(Math.random() * (10 - (5) + 1)) + 5;   
        this.speedY = Math.random() * 3 - 1.5; 
        this.fitness = 0;
    }
    update() {
        this.x += this.speedX;
        //this.y += this.speedY;
    }
    draw() {
        c.save();
        c.shadowColor = "#9FC131";
        c.shadowBlur = 30;
        c.fillStyle = "#9FC131";
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);  //x, y, radius, start angle, ending angle
        c.fill();
        c.restore();
    }
    calcFitness() {
        let xDistance = this.x - canvas.width - 50;
        let yDistance = this.y - ((canvas.height / 2) - 30);
      
        this.fitness =  Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }
}

//Functions that are used to create and control
function createBoundaries() {
    for (let i = 0; i < NUM_BOUNDARIES; i++) {
        boundariesArray.push(new Boundaries);
    }
}

function createBoundaries2() {
    for (let i = 0; i < NUM_BOUNDARIES; i++) {
        boundariesArray2.push(new Boundaries2);
    }
}

function controlBoundaries() {
    for (let i = 0; i < boundariesArray.length; i++) {
        boundariesArray[i].update();
        boundariesArray[i].draw();
    }
}

function controlBoundaries2() {
    for (let i = 0; i < boundariesArray2.length; i++) {
        boundariesArray2[i].update();
        boundariesArray2[i].draw();
    }
}


function createCells() {
    for (let i = 0; i < NUM_CELLS; i++) {
        cellsArray.push(new Cell);
    }
}

function controlCells() {
    if (cellsArray.length == 0) {
        createCells();
        createBoundaries();
        createBoundaries2();
    }
    for (let i = 0; i < cellsArray.length; i++) {
        cellsArray[i].update();
        cellsArray[i].draw();
        if (cellsArray[i].x > canvas.width + 10) {  //if the cells go beyond the screen
            var c = cellsArray[i];
            c.calcFitness();
            //console.log(c.fitness);
            tempList.push(c.fitness);
            totalFitness += c.fitness;
            //console.log("total",totalFitness)
            cellsArray.splice(i,1);
            i--;
            //console.log(cellsArray.length);
            if (cellsArray.length == 0) {   //once all the cells have passed the screen
                averageFitness = totalFitness / NUM_CELLS;
                boundaryLocation = ((canvas.height / 2) - 30) - averageFitness;
                boundaryLocation2 = ((canvas.height / 2) - 30) + averageFitness + 24;
                //console.log("average temp", averageFitness);

                for (let i = 0; i < tempList.length; i++) {
                    if (tempList[i] < averageFitness) {
                        temptempList.push(tempList[i]);
                    }
                }

                var newGeneration = 0;

                for (let i = 0; i < temptempList.length; i++) {
                    newGeneration += temptempList[i];
                }

                newGeneration = newGeneration/temptempList.length;

                newGeneration = newGeneration * MUTATION_RATE;
                
                if(cellGenes > (canvas.height / 2) - 30 && cellGenesFloor < (canvas.height / 2) - 30) {
                    cellGenes -= newGeneration;
                    cellGenesFloor += newGeneration;
                }

                //resetting the simulation
                generation ++;
                totalFitness = 0;
                boundariesArray = [];
                boundariesArray2 = [];
            }
        }
    }
}


//Main animation function
function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'rgb(173, 216, 230)';
    c.fillRect(canvas.width - 50, (canvas.height / 2) - 30, 40, 40);
    controlCells();
    controlBoundaries();
    controlBoundaries2();
    c.font = "20px Arial";
    c.fillStyle = "white";
    c.fillText("Generation: " + generation.toString(), 15, 45);
    c.fillText("Average Fitness Offset: " + averageFitness.toFixed(2).toString(), 15, 90);
    requestAnimationFrame(animate);
}

animate();
