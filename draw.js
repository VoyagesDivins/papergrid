/* Handling mouse position */
var lastX;
var lastY;
document.onmouseup = function () {
    lastX = null;
};
/* Handling mouse button position */
var mouseDown = 0;
document.body.onmousedown = function () {
    ++mouseDown;
};
document.body.onmouseup = function () {
    --mouseDown;
};
/* Handling selected drawing for background */
var lastSelection;
/* Drawing Area is a canvas where user can draw */
var drawingArea = document.getElementById('drawing-area');
var drawingAreaWidth = drawingArea.width;
var drawingAreaHeight = drawingArea.height;
var drawingAreaCtx = drawingArea.getContext("2d");
var drawingAreaImageData = drawingAreaCtx.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
drawingArea.addEventListener("mousemove", draw);
/* Drawing Area background is where previous drawing can be displayed as guide */
var drawingAreaBg = document.getElementById('drawing-area-bg');
/* Grid is where we display saved drawings */
var grid = document.getElementById('grid');
/* Merge Area is where we display the result of merged drawings */
var mergeArea = document.getElementById('merge-area');
/* Save button stores current drawing from drawingArea to grid, and flush drawing area */
var saveButton = document.getElementById('save');
saveButton.addEventListener("click", saveCurrent);
/* Merge button takes two random existing drawing, merge them into one and display it on mergeArea */
var mergeButton = document.getElementById('merge');
mergeButton.addEventListener("click", mergeRandom);
/* Clear Background button clears background */
var clearBgButton = document.getElementById('clear-bg');
clearBgButton.addEventListener("click", clearBackground);
var drawingId = 0;
/**
 * Function that stores current drawin in grid and flush drawing area
 * @param {MouseEvent} e - click
 */
function saveCurrent(e) {
    var drawing = document.createElement("canvas");
    drawing.height = 300;
    drawing.width = 300;
    drawing.id = "drawing" + drawingId++;
    drawing.classList.add('grid-element');
    var drawingCtx = drawing.getContext("2d");
    grid.appendChild(drawing);
    //drawingCtx.scale(0.5, 0.5);
    drawingCtx.drawImage(drawingArea, 0, 0);
    drawingAreaCtx.clearRect(0, 0, drawingAreaImageData.width, drawingAreaImageData.height);
    drawingAreaCtx.beginPath();
    drawingAreaImageData = drawingAreaCtx.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
    drawing.addEventListener("click", setBackground);
}
/**
 * Function that clears the background
 * @param {MouseEvent} e - click
 */
function clearBackground(e) {
    var drawingAreaBgCtx = drawingAreaBg.getContext("2d");
    drawingAreaBgCtx.clearRect(0, 0, 300, 300);
    lastSelection = null;
}
/**
 * Display drawing as background for drawing area
 * @param {MouseEvent} e - click
 */
function setBackground(e) {
    if (lastSelection) {
        lastSelection.classList.remove("selected");
    }
    this.classList.add("selected");
    lastSelection = this;
    var selectedDrawingContext = this.getContext("2d");
    var drawingAreaBgCtx = drawingAreaBg.getContext("2d");
    drawingAreaBgCtx.clearRect(0, 0, 300, 300);
    drawingAreaBgCtx.drawImage(this, 0, 0, 300, 300);
    drawingAreaBgCtx.globalAlpha = 0.5;
}
/**
 * Randomly takes two drawing in grid
 * Merge them to a new image
 * Display new image in merge area
 * @param {MouseEvent} e
 */
function mergeRandom(e) {
    var n = grid.children.length;
    if (n < 2)
        return;
    for (var i = 0; i < 100; i++) {
        var a = getRandomInt(0, n);
        var b = getRandomInt(0, n);
        while (a === b) {
            b = getRandomInt(0, n);
        }
        var canvas1 = grid.children[a];
        var canvas2 = grid.children[b];
        var canvas1Ctx = canvas1.getContext("2d");
        var canvas2Ctx = canvas2.getContext("2d");
        var canvas1ImgData = canvas1Ctx.getImageData(0, 0, 300, 300);
        var data1 = canvas1ImgData.data;
        var canvas2ImgData = canvas2Ctx.getImageData(0, 0, 300, 300);
        var data2 = canvas2ImgData.data;
        var newImageData = new ImageData(300, 300);
        for (var i_1 = 0; i_1 < canvas1ImgData.data.length; i_1++) {
            newImageData.data[i_1] = data1[i_1] + data2[i_1];
        }
        var mergeRes = document.createElement("canvas");
        mergeRes.height = 300;
        mergeRes.width = 300;
        mergeRes.classList.add("grid-element");
        mergeArea.appendChild(mergeRes);
        var mergeResCtx = mergeRes.getContext("2d");
        mergeResCtx.putImageData(newImageData, 0, 0);
    }
}
/**
 * Draw a line between current and last mouse position
 * @param {MouseEvent} e
 */
function draw(e) {
    var X = e.pageX - this.offsetLeft;
    var Y = e.pageY - this.offsetTop;
    if (mouseDown) {
        if (lastX) {
            drawLine(lastX, lastY, X, Y);
        }
        else {
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
function drawLine(startX, startY, endX, endY) {
    drawingAreaCtx.beginPath();
    drawingAreaCtx.lineWidth = +strokeControl.value;
    drawingAreaCtx.strokeStyle = colorControl.value;
    drawingAreaCtx.lineCap = 'round';
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
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
/* Get controls */
var strokeControl = document.getElementById('stroke');
var colorControl = document.getElementById('base');
