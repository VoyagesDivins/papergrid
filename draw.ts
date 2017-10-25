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
let mergeArea = <HTMLDivElement> document.getElementById('mergeArea');
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

let mergeButton = <HTMLButtonElement> document.getElementById('merge');
mergeButton.addEventListener("click", mergeRandom);

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
    gridArea.height = 150;
    gridArea.width = 150;
    gridArea.classList.add('drawing-area');
    gridArea.classList.add('grid-element');
    let ctxGrid = gridArea.getContext("2d");
    grid.appendChild(gridArea);
    
    ctxGrid.scale(0.5, 0.5);
    ctxGrid.drawImage(drawingArea, 0, 0);

    ctx.clearRect(0, 0, canvasData.width, canvasData.height);
    ctx.beginPath();
    canvasData = ctx.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
}

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
    let mergeCtx = mergeRes.getContext("2d");

    mergeCtx.putImageData(newImageData, 0, 0);

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }