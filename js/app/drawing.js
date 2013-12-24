define([], function() {

    var Drawing = function (canvas, object, camera, projector) {
        this.canvas = canvas;
        this.object = object;
        this.camera = camera;
        this.projector = projector;
        this.ctx = this.canvas.getContext("2d");
        this.changed = false;
        this.prevX = 0;
        this.currX = 0;
        this.prevY = 0;
        this.currY = 0;
        this.brushColor = "black";
        this.brushSize = 8;
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

    Drawing.prototype.setColor = function (colorName) {
        this.brushColor = colorName;

        if (this.brushColor == "white") {
            this.brushSize = 15;
        } else {
            this.brushSize = 8;
        };

    }

    Drawing.prototype.load = function (imageSrc) {
        var image = new Image();
        image.src = imageSrc;
        var that = this;
        image.onload = function(){
            that.ctx.drawImage(image, 0, 0);
        };
    }

    Drawing.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.moveTo(this.prevX, this.prevY);
        this.ctx.lineTo(this.currX, this.currY);
        this.ctx.strokeStyle = this.brushColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    Drawing.prototype.erase = function () {
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
        return this.camera.position.clone().add(dir.multiplyScalar(distance));
    }

    Drawing.prototype.onMouseAction =  function (action, event) {
        var pos = this.getTransformedPosition(event.clientX, event.clientY)
        pos.x = pos.x - this.object.position.x + this.canvas.width / 2;
        pos.y = -pos.y + this.object.position.y + this.canvas.height / 2;

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

    return Drawing;

});
