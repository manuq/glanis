define(["domReady!", "app/ui/bg"], function(doc, bg) {

    var pullRadius = 150;

    // FIXME dup of ui bg getPos
    function getPos(elem) {
        return [elem.offsetLeft + elem.parentElement.offsetLeft + 28,
                elem.offsetTop + elem.parentElement.offsetTop + 28];
    }

    var PullButton = function (options) {
        this.domElement = document.createElement('div');
        this.domElement.className = "widget";
        this.button = document.createElement('button');
        this.button.innerText = options['text'];
        this.button.style.backgroundImage = "url('images/icons/" + options.name + ".svg')";
        this.button.style.color = "transparent";
        this.domElement.appendChild(this.button);

        this.pressed = false;
        this.initialCoords;
        this.curCoords;

        this.pullValue = 0;

        this.onRelease = null;
        if ("onRelease" in options) {
            this.onRelease = options["onRelease"];
        };

        this.controls = new bg.PullControls(this);

        if ("initial" in options) {
            this.setPullValue(options["initial"], false);
        };

        this.onButtonMouseDown = this.onButtonMouseDown.bind(this);
        this.onButtonMouseUp = this.onButtonMouseUp.bind(this);
        this.onDocMouseMove = this.onDocMouseMove.bind(this);
        this.onDocMouseUp = this.onDocMouseUp.bind(this);

        this.enable();
    }

    PullButton.prototype.setPullValue = function (value, visible) {
        if (visible === undefined) {
            visible = true;
        }

        this.pullValue = value;
        this.controls.updateCurrent(this.pullValue);
        if (!visible) {
            this.controls.hide();
        }
    }

    PullButton.prototype.updatePullValue = function (value) {
        if (value === undefined) {
            var dx = this.curCoords[0] - this.initialCoords[0];
            var dy = this.curCoords[1] - this.initialCoords[1];
            var magnitude = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

            if (magnitude < 25) {
                return;
            }

            value = magnitude / pullRadius;
        }

        if (value >= 1) {
            value = 1;
        }

        this.setPullValue(value);
    }

    PullButton.prototype.press = function () {
        this.initialCoords = getPos(this.domElement);
        this.curCoords = this.initialCoords.slice(0);

        this.pressed = true;
        this.button.classList.toggle('active');
        this.controls.show();
    }

    PullButton.prototype.drag = function (x, y) {
        if (this.pressed) {
            this.curCoords = [x, y];
            this.updatePullValue();
        }
    }

    PullButton.prototype.dragPercent = function (percent) {
        if (this.pressed) {
            this.updatePullValue(percent);
        }
    }

    PullButton.prototype.release = function () {
        if (!(this.pressed)) {
            return;
        }
        this.pressed = false;
        this.button.classList.toggle('active');
        this.controls.hide();
        if (this.onRelease) {
            this.onRelease();
        }
    }

    PullButton.prototype.onButtonMouseDown = function (event) {
        this.press();
    }

    PullButton.prototype.onButtonMouseUp = function (event) {
        this.release();
    }

    PullButton.prototype.onDocMouseMove = function (event) {
        this.drag(event.x, event.y);
    }

    PullButton.prototype.onDocMouseUp = function (event) {
        this.release();
    }

    PullButton.prototype.enable = function () {
        this.button.addEventListener("mousedown", this.onButtonMouseDown);
        this.button.addEventListener("mouseup", this.onButtonMouseUp);
        document.documentElement.addEventListener("mousemove", this.onDocMouseMove);
        document.documentElement.addEventListener("mouseup", this.onDocMouseUp);
    }

    PullButton.prototype.disable = function () {
        this.button.removeEventListener("mousedown", this.onButtonMouseDown);
        this.button.removeEventListener("mouseup", this.onButtonMouseUp);
        document.documentElement.removeEventListener("mousemove", this.onDocMouseMove);
        document.documentElement.removeEventListener("mouseup", this.onDocMouseUp);
    }

    return PullButton;

});
