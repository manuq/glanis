define(["domReady!", "app/ui/bg"], function(doc, bg) {

    var ConfirmButton = function (options) {
        this.button = document.createElement('button');
        this.button.innerText = options['text'];
        this.button.style.backgroundImage = "url('images/icons/" + options.name + ".svg')";
        this.button.style.color = "transparent";

        this.domElement = this.button;
        this.action = options['action'];
        this.controls = new bg.ConfirmControls(this);

        this.onButtonDown = this.onButtonDown.bind(this);
        this.onButtonUp = this.onButtonUp.bind(this);
        this.onDocMouseMove = this.onDocMouseMove.bind(this);
        this.onDocTouchMove = this.onDocTouchMove.bind(this);
        this.onDocMouseUp = this.onDocMouseUp.bind(this);
        this.onDocTouchUp = this.onDocTouchUp.bind(this);

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

    ConfirmButton.prototype.checkPressConfirm = function (x, y) {
        if (!(this.pressed)) {
            return;
        }

        var hit = this.controls.update(x, y);
        if (hit) {
            this.pressConfirm();
        }

        this.pressed = false;
        this.button.classList.toggle('active');
        this.controls.hide();
    }

    ConfirmButton.prototype.onButtonDown = function (event) {
        this.press();
    }

    ConfirmButton.prototype.onButtonUp = function (event) {
        this.release();
    }

    ConfirmButton.prototype.onDocMouseMove = function (event) {
        this.drag(event.x, event.y);
    }

    ConfirmButton.prototype.onDocTouchMove = function (event) {
        this.drag(event.touches[0].clientX, event.touches[0].clientY);
    }

    ConfirmButton.prototype.onDocMouseUp = function (event) {
        this.checkPressConfirm(event.x, event.y);
    }

    ConfirmButton.prototype.onDocTouchUp = function (event) {
        this.checkPressConfirm(event.changedTouches[0].clientX,
                               event.changedTouches[0].clientY);
    }

    ConfirmButton.prototype.enable = function () {
        this.button.addEventListener("mousedown", this.onButtonDown);
        this.button.addEventListener("touchstart", this.onButtonDown);
        this.button.addEventListener("mouseup", this.onButtonUp);
        document.documentElement.addEventListener("mousemove", this.onDocMouseMove);
        document.documentElement.addEventListener("touchmove", this.onDocTouchMove);
        document.documentElement.addEventListener("mouseup", this.onDocMouseUp);
        document.documentElement.addEventListener("touchend", this.onDocTouchUp);
    }

    ConfirmButton.prototype.disable = function () {
        this.button.removeEventListener("mousedown", this.onButtonDown);
        this.button.removeEventListener("touchstart", this.onButtonDown);
        this.button.removeEventListener("mouseup", this.onButtonUp);
        document.documentElement.removeEventListener("mousemove", this.onDocMouseMove);
        document.documentElement.removeEventListener("touchmove", this.onDocTouchMove);
        document.documentElement.removeEventListener("mouseup", this.onDocMouseUp);
        document.documentElement.removeEventListener("touchend", this.onDocTouchUp);
    }

    return ConfirmButton;

});
