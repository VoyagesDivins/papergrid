/* Handling mouse position */
let lastX;
let lastY;
document.onmouseup = function() {
    lastX = null;
}

/* Handling mouse button position */
let mouseDown = 0;

document.body.onmousedown = function() { 
  ++mouseDown;
}

document.body.onmouseup = function() {
  --mouseDown;
}

/* Drawing Area is a canvas where user can draw */
let drawingArea = <HTMLCanvasElement> document.getElementById('drawing-area');
let drawingAreaWidth = drawingArea.width;
let drawingAreaHeight = drawingArea.height;
let drawingAreaCtx = drawingArea.getContext("2d");
let drawingAreaImageData = drawingAreaCtx.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
drawingArea.addEventListener("mousemove", draw);

/* Grid is where we display saved drawings */
let grid = <HTMLDivElement> document.getElementById('grid');

/* Merge Area is where we display the result of merged drawings */
let mergeArea = <HTMLDivElement> document.getElementById('merge-area');

/* Save button stores current drawing from drawingArea to grid, and flush drawing area */
let saveButton = <HTMLButtonElement> document.getElementById('save');
saveButton.addEventListener("click", saveCurrent);

/* Merge button takes two random existing drawing, merge them into one and display it on mergeArea */
let mergeButton = <HTMLButtonElement> document.getElementById('merge');
mergeButton.addEventListener("click", mergeRandom);

/**
 * Function that stores current drawin in grid and flush drawing area
 * @param e {MouseEvent} click
 */
function saveCurrent(e: MouseEvent): void {
    let drawing = document.createElement("canvas");
    drawing.height = 150;
    drawing.width = 150;
    drawing.classList.add('drawing-area');
    drawing.classList.add('grid-element');
    let drawingCtx = drawing.getContext("2d");
    grid.appendChild(drawing);
    
    drawingCtx.scale(0.5, 0.5);
    drawingCtx.drawImage(drawingArea, 0, 0);

    drawingAreaCtx.clearRect(0, 0, drawingAreaImageData.width, drawingAreaImageData.height);
    drawingAreaCtx.beginPath();
    drawingAreaImageData = drawingAreaCtx.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
}

/** 
 * Randomly takes two drawing in grid
 * Merge them to a new image
 * Display new image in merge area
 * @param {MouseEvent} e
 */
function mergeRandom(e: MouseEvent): void {
    let n = grid.children.length;

    let a = getRandomInt(0, n);
    
    let b = getRandomInt(0, n);
    
    while(a === b)
    {
        b = getRandomInt(0, n);
    }


    let canvas1 = <HTMLCanvasElement>  grid.children[a];
    let canvas2 = <HTMLCanvasElement>  grid.children[b];
    let canvas1Ctx = canvas1.getContext("2d");
    let canvas2Ctx = canvas2.getContext("2d");
    
    let canvas1ImgData = canvas1Ctx.getImageData(0,0, 150,150);
    let data1 = canvas1ImgData.data;
    let canvas2ImgData = canvas2Ctx.getImageData(0,0, 150,150);
    let data2 = canvas2ImgData.data;

    let newImageData = new ImageData(150, 150);

    for(let i = 0; i < canvas1ImgData.data.length; i++ )
    {
        newImageData.data[i] = data1[i] + data2[i];
    }

    let mergeRes = document.createElement("canvas");    
    mergeRes.height = 150;
    mergeRes.width = 150;
    mergeArea.appendChild(mergeRes);
    let mergeResCtx = mergeRes.getContext("2d");

    mergeResCtx.putImageData(newImageData, 0, 0);
}

/**
 * Draw a line between current and last mouse position
 * @param {MouseEvent} e
 */
function draw(e: MouseEvent): void {    
    var X = e.pageX - this.offsetLeft 
    var Y = e.pageY - this.offsetTop

    if (mouseDown) {
        
        if (lastX)
        {
            drawLine(lastX, lastY, X, Y);
        } else {            
            drawLine(X, Y, X, Y);
        }

        lastX = X;
        lastY = Y;
    }
}

/**
 * Draw a line on canvas drawingArea
 * @param {number} startX - x coordinates of the starting point
 * @param {number} startY - y coordinates of the starting point
 * @param {number} endX - x coordinates of the ending point
 * @param {number} endY - y coordinates of the ending point
 */
function drawLine(startX: number, startY: number, endX: number, endY: number) {
    drawingAreaCtx.beginPath();
    drawingAreaCtx.moveTo(startX, startY);
    drawingAreaCtx.lineTo(endX, endY);
    drawingAreaCtx.stroke();
}

/**
 * From MDN get a random integer between min and max
 * The maximum is exclusive and the minimum is inclusive
 * @param {int} min - lower bound
 * @param {int} max - upper bound
 */
function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; 
}