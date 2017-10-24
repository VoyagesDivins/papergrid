function draw(e: MouseEvent): void {    
    var X = e.pageX - this.offsetLeft 
    var Y = e.pageY - this.offsetTop

    if(mouseDown){
        //drawPixel(X, Y, 0, 0, 255, 255);
        if(lastX)
        {
            drawLine(lastX, lastY, X, Y);
            lastX = X;
            lastY = Y;
        } else {            
            drawLine(X, Y, X, Y);
            lastX = X;
            lastY = Y;
        }
        //updateCanvas();
    }
}

let mouseDown = 0;
let lastX;
let lastY;

document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}

document.onmouseup = function() {
    lastX = null;
}

let drawingArea = <HTMLCanvasElement> document.getElementById('drawing-area');
let grid = <HTMLDivElement> document.getElementById('grid');
//let gridArea = <HTMLCanvasElement> document.getElementById('grid');
let drawingAreaWidth = drawingArea.width;
let drawingAreaHeight = drawingArea.height;
let ctx = drawingArea.getContext("2d");
//let ctxGrid = gridArea.getContext("2d");
let canvasData = ctx.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);


drawingArea.addEventListener("mousemove", draw);
/*
function updateCanvas() {
    ctx.putImageData(canvasData, 0, 0);
}

function drawPixel (x, y, r, g, b, a) {
    var index = (x + y * drawingAreaWidth) * 4;

    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}
*/

function drawLine(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

let saveButton = <HTMLButtonElement> document.getElementById('save');

saveButton.addEventListener("click", saveCurrent);

/*
on commence en haut à gauche du caneva
puis on garde ou était la dernière version sauvegardé 

todo :
- trait continu
- scale down
- mettre à la suite
*/

function saveCurrent(e: MouseEvent): void {
    let gridArea = document.createElement("canvas");
    gridArea.classList.add('drawing-area');
    gridArea.classList.add('grid-element');
    let ctxGrid = gridArea.getContext("2d");
    grid.appendChild(gridArea);
    
    ctxGrid.scale(1, 0.5);
    ctxGrid.drawImage(drawingArea, 0, 0);

    ctx.clearRect(0, 0, canvasData.width, canvasData.height);
    ctx.beginPath();
    canvasData = ctx.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
}
