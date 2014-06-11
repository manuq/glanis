define(["domReady!", "app/ui/bg"], function(doc, bg) {

    var ConfirmButton = function (options) {
        this.button = document.createElement('button');
        this.button.innerText = options['text'];
        this.button.style.backgroundImage = "url('images/icons/" + options.name + ".svg')";
        this.button.style.color = "transparent";

        this.domElement = this.button;
        this.action = options['action'];
        this.controls = new bg.ConfirmControls(this);

        this.onButtonMouseDown = this.onButtonMouseDown.bind(this);
        this.onButtonMouseUp = this.onButtonMouseUp.bind(this);
        this.onDocMouseMove = this.onDocMouseMove.bind(this);
        this.onDocMouseUp = this.onDocMouseUp.bind(this);

        this.enable();
    }

    ConfirmButton.prototype.press = function () {
        this.pressed = true;
        this.button.classList.toggle('active');
        this.controls.show();
    }

    ConfirmButton.prototype.drag = function (x, y) {
        if (this.pressed) {
            this.controls.update(x, y);
        }
    }

    ConfirmButton.prototype.release = function () {
        if (!(this.pressed)) {
            return;
        }
        this.pressed = false;
        this.button.classList.toggle('active');
        this.controls.hide();
    }

    ConfirmButton.prototype.pressConfirm = function () {
        this.action();
    }

    ConfirmButton.prototype.checkPressConfirm = function () {
        if (!(this.pressed)) {
            return;
        }

        var hit = this.controls.update(event.x, event.y);
        if (hit) {
            this.pressConfirm();
        }

        this.pressed = false;
        this.button.classList.toggle('active');
        this.controls.hide();
    }

    ConfirmButton.prototype.onButtonMouseDown = function (event) {
        this.press();
    }

    ConfirmButton.prototype.onButtonMouseUp = function (event) {
        this.release();
    }

    ConfirmButton.prototype.onDocMouseMove = function (event) {
        this.drag(event.x, event.y);
    }

    ConfirmButton.prototype.onDocMouseUp = function (event) {
        this.checkPressConfirm();
    }

    ConfirmButton.prototype.enable = function () {
        this.button.addEventListener("mousedown", this.onButtonMouseDown);
        this.button.addEventListener("mouseup", this.onButtonMouseUp);
        document.documentElement.addEventListener("mousemove", this.onDocMouseMove);
        document.documentElement.addEventListener("mouseup", this.onDocMouseUp);
    }

    ConfirmButton.prototype.disable = function () {
        this.button.removeEventListener("mousedown", this.onButtonMouseDown);
        this.button.removeEventListener("mouseup", this.onButtonMouseUp);
        document.documentElement.removeEventListener("mousemove", this.onDocMouseMove);
        document.documentElement.removeEventListener("mouseup", this.onDocMouseUp);
    }

    return ConfirmButton;

});
