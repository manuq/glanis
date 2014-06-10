define(["domReady!", "app/ui/bg"], function(doc, bg) {

    var ConfirmButton = function (options) {

        var button = document.createElement('button');
        this.domElement = button;
        button.innerText = options['text'];

        this.action = options['action'];

        this.controls = new bg.ConfirmControls(this);

        var that = this;

        button.style.backgroundImage = "url('images/icons/" + options.name + ".svg')";
        button.style.color = "transparent";
        button.addEventListener("mousedown", function (event) {
            that.pressed = true;
            this.classList.toggle('active');
            that.controls.show();
        });

        document.documentElement.addEventListener('mousemove', function (event) {
            if (that.pressed) {
                that.controls.update(event.x, event.y);
            }
        });

        button.addEventListener("mouseup", function (event) {
            if (!(that.pressed)) {
                return;
            }
            that.pressed = false;
            this.classList.toggle('active');
            that.controls.hide();
        });

        document.documentElement.addEventListener('mouseup', function (event) {
            if (that.pressed) {
                var hit = that.controls.update(event.x, event.y);
                if (hit) {
                    that.action();
                }

                that.pressed = false;
                that.domElement.classList.toggle('active');
                that.controls.hide();
            }
        });
    }

    ConfirmButton.prototype.enable = function () {
    }

    ConfirmButton.prototype.disable = function () {
    }

    return ConfirmButton;

});
