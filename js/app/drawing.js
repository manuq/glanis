define(["app/config"], function(config) {

    var Drawing = function (canvas, object, groupObject, camera, projector) {
        this.canvas = canvas;
        this.object = object;
        this.groupObject = groupObject;
        this.camera = camera;
        this.projector = projector;
        this.ctx = this.canvas.getContext("2d");
        this.isDrawing = false;
        this.brushColor = "black";
        this.brushSize = config.brushSize;

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);

        this.enable();
    }

    Drawing.prototype.setColor = function (colorName) {
        this.brushColor = colorName;

        if (this.brushColor == "white") {
            this.brushSize = config.eraserSize;
        } else {
            this.brushSize = config.brushSize;
        };

    }

    Drawing.prototype.load = function (imageSrc) {
        var image = new Image();
        image.src = imageSrc;
        var that = this;
        image.addEventListener("load", function () {
            that.ctx.drawImage(image, 0, 0)});
        image.addEventListener("error", function () {});
    }

    Drawing.prototype.erase = function () {
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    Drawing.prototype.getTransformedPosition = function (x, y) {
        var vector = new THREE.Vector3(
            (x / window.innerWidth) * 2 - 1,
                - (y / window.innerHeight) * 2 + 1,
            0.5 );

        this.projector.unprojectVector(vector, this.camera);

//    var planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
//    var raycaster = projector.pickingRay(vector, camera);
//    return raycaster.ray.intersectPlane(planeZ);

        var dir = vector.sub(this.camera.position).normalize();
        var distance = - this.camera.position.z / dir.z;
        var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        pos.x = pos.x - this.object.position.x + this.canvas.width / 2;
        pos.y = -pos.y + this.object.position.y + this.groupObject.position.y + this.canvas.height / 2;
        return pos;

    }

    Drawing.prototype.onMouseDown = function (event) {
        this.isDrawing = true;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = this.brushColor;
        this.ctx.shadowBlur = this.brushSize;
        this.ctx.shadowColor = this.brushColor;

        var pos = this.getTransformedPosition(event.clientX, event.clientY);
        this.ctx.moveTo(pos.x, pos.y);
    }

    Drawing.prototype.onMouseMove = function (event) {
        if (this.isDrawing) {
            var pos = this.getTransformedPosition(event.clientX, event.clientY);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();
        }
    }

    Drawing.prototype.onMouseUp = function (event) {
        this.isDrawing = false;
    }

    Drawing.prototype.onMouseOver = function (event) {
        var pos = this.getTransformedPosition(event.clientX, event.clientY);
        this.ctx.moveTo(pos.x, pos.y);
    }

    Drawing.prototype.enable = function () {
        this.canvas.addEventListener("mousemove", this.onMouseMove);
        this.canvas.addEventListener("mousedown", this.onMouseDown);
        this.canvas.addEventListener("mouseup", this.onMouseUp);
        this.canvas.addEventListener("mouseover", this.onMouseOver);
    }

    Drawing.prototype.disable = function () {
        this.canvas.removeEventListener("mousemove", this.onMouseMove);
        this.canvas.removeEventListener("mousedown", this.onMouseDown);
        this.canvas.removeEventListener("mouseup", this.onMouseUp);
        this.canvas.removeEventListener("mouseover", this.onMouseOver);
    }

    return Drawing;

});
