CanvasDrawing = function (canvas, camera, projector) {
    this.canvas = canvas;
    this.camera = camera;
    this.projector = projector;
    this.ctx = this.canvas.getContext("2d");
    this.changed = false;
    this.prevX = 0;
    this.currX = 0;
    this.prevY = 0;
    this.currY = 0;
    this.brushColor = "black";
    this.brushSize = 3;
    var that = this;

    this.canvas.addEventListener("mousemove", function (event) {
        that.onMouseAction('move', event);
    });
    canvas.addEventListener("mousedown", function (event) {
        that.onMouseAction('down', event);
    });
    canvas.addEventListener("mouseup", function (event) {
        that.onMouseAction('up', event);
    });
    canvas.addEventListener("mouseout", function (event) {
        that.onMouseAction('out', event);
    });
}

CanvasDrawing.prototype.setColor = function (colorName) {
    this.brushColor = colorName;

    if (this.brushColor == "white") {
        this.brushSize = 15;
    } else {
        this.brushSize = 3;
    };

}

CanvasDrawing.prototype.draw = function () {
    this.ctx.beginPath();
    this.ctx.moveTo(this.prevX, this.prevY);
    this.ctx.lineTo(this.currX, this.currY);
    this.ctx.strokeStyle = this.brushColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.stroke();
    this.ctx.closePath();
}

CanvasDrawing.prototype.erase = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

CanvasDrawing.prototype.getTransformedPosition = function (x, y) {
    var vector = new THREE.Vector3(
        (x / window.innerWidth) * 2 - 1,
            - (y / window.innerHeight) * 2 + 1,
        0.5 );

    this.projector.unprojectVector(vector, this.camera);

    var dir = vector.sub(this.camera.position).normalize();
    var distance = - this.camera.position.z / dir.z;
    return this.camera.position.clone().add(dir.multiplyScalar(distance));
}

CanvasDrawing.prototype.onMouseAction =  function (action, event) {
    var pos = this.getTransformedPosition(event.clientX, event.clientY)

    if (action == 'down') {
        this.changed = true;

        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = pos.x; // - this.canvas.offsetLeft;
        this.currY = pos.y; // - this.canvas.offsetTop;
    }

    if (action == 'up' || action == "out") {
        this.changed = false;
    }

    if (action == 'move') {
        if (this.changed) {
            this.prevX = this.currX;
            this.prevY = this.currY;
            this.currX = pos.x; // - this.canvas.offsetLeft;
            this.currY = pos.y; // - this.canvas.offsetTop;
            this.draw();
        }
    }
}
