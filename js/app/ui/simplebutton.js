define(["domReady!", "app/ui/bg"], function(doc, bg) {

    var SimpleButton = function (options) {
        this.button = document.createElement('button');
        this.button.innerText = options['text'];
        this.button.style.backgroundImage = "url('images/icons/" + options.name + ".svg')";
        this.button.style.color = "transparent";

        this.domElement = this.button;
        this.action = options['action'];
        this.controls = new bg.SimpleControls(this.button);

        this.onClick = this.onClick.bind(this);
        this.enable();
    }

    SimpleButton.prototype.press = function () {
        this.action();
        this.controls.play();
    }

    SimpleButton.prototype.onClick = function () {
        this.press();
    }

    SimpleButton.prototype.enable = function () {
        this.button.addEventListener("mousedown", this.onClick);
        this.button.addEventListener("touchstart", this.onClick);
    }

    SimpleButton.prototype.disable = function () {
        this.button.removeEventListener("mousedown", this.onClick);
        this.button.removeEventListener("touchstart", this.onClick);
    }

    return SimpleButton;

});
