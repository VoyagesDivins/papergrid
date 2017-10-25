function draw(e) {
    var X = e.pageX - this.offsetLeft;
    var Y = e.pageY - this.offsetTop;
    if (mouseDown) {
        //drawPixel(X, Y, 0, 0, 255, 255);
        if (lastX) {
            drawLine(lastX, lastY, X, Y);
            lastX = X;
            lastY = Y;
        }
        else {
            drawLine(X, Y, X, Y);
            lastX = X;
            lastY = Y;
        }
        //updateCanvas();
    }
}
var mouseDown = 0;
var lastX;
var lastY;
document.body.onmousedown = function () {
    ++mouseDown;
};
document.body.onmouseup = function () {
    --mouseDown;
};
document.onmouseup = function () {
    lastX = null;
};
var drawingArea = document.getElementById('drawing-area');
var grid = document.getElementById('grid');
var mergeArea = document.getElementById('mergeArea');
//let gridArea = <HTMLCanvasElement> document.getElementById('grid');
var drawingAreaWidth = drawingArea.width;
var drawingAreaHeight = drawingArea.height;
var ctx = drawingArea.getContext("2d");
//let ctxGrid = gridArea.getContext("2d");
var canvasData = ctx.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
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
var saveButton = document.getElementById('save');
saveButton.addEventListener("click", saveCurrent);
var mergeButton = document.getElementById('merge');
mergeButton.addEventListener("click", mergeRandom);
/*
on commence en haut à gauche du caneva
puis on garde ou était la dernière version sauvegardé

todo :
- trait continu
- scale down
- mettre à la suite
*/
function saveCurrent(e) {
    var gridArea = document.createElement("canvas");
    gridArea.height = 150;
    gridArea.width = 150;
    gridArea.classList.add('drawing-area');
    gridArea.classList.add('grid-element');
    var ctxGrid = gridArea.getContext("2d");
    grid.appendChild(gridArea);
    ctxGrid.scale(0.5, 0.5);
    ctxGrid.drawImage(drawingArea, 0, 0);
    ctx.clearRect(0, 0, canvasData.width, canvasData.height);
    ctx.beginPath();
    canvasData = ctx.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
}
function mergeRandom(e) {
    var n = grid.children.length;
    var a = getRandomInt(0, n);
    var b = getRandomInt(0, n);
    while (a === b) {
        b = getRandomInt(0, n);
    }
    var canvas1 = grid.children[a];
    var canvas2 = grid.children[b];
    var canvas1Ctx = canvas1.getContext("2d");
    var canvas2Ctx = canvas2.getContext("2d");
    var canvas1ImgData = canvas1Ctx.getImageData(0, 0, 150, 150);
    var data1 = canvas1ImgData.data;
    var canvas2ImgData = canvas2Ctx.getImageData(0, 0, 150, 150);
    var data2 = canvas2ImgData.data;
    var newImageData = new ImageData(150, 150);
    for (var i = 0; i < canvas1ImgData.data.length; i++) {
        newImageData.data[i] = data1[i] + data2[i];
    }
    var mergeRes = document.createElement("canvas");
    mergeRes.height = 150;
    mergeRes.width = 150;
    mergeArea.appendChild(mergeRes);
    var mergeCtx = mergeRes.getContext("2d");
    mergeCtx.putImageData(newImageData, 0, 0);
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
