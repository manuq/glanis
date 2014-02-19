define(["domReady!", "app/ui/bg"], function(doc, bg) {

    var pullRadius = 150;

    var PullButton = function (options) {
        text = options['text'];

        this.domElement = document.createElement('div');
        this.domElement.className = "widget";
        this.button = document.createElement('button');
        this.button.innerText = text;
        this.button.style.backgroundImage = "url('images/icons/" + options.name + ".svg')";
        this.button.style.color = "transparent";
        this.domElement.appendChild(this.button);

        this.pressed = false;
        this.initialCoords;
        this.curCoords;
        this.initialValue;

        this.pullValue = 0;
        if ("initial" in options) {
            this.pullValue = options["initial"];
        };

        this.onRelease = null;
        if ("onRelease" in options) {
            this.onRelease = options["onRelease"];
        };

        this.controls = new bg.PullControls(this);

        var that = this;

        this.button.addEventListener("mousedown", function (event) {
            that.initialValue = that.pullValue;
            that.initialCoords = [event.screenX, event.screenY];
            that.curCoords = that.initialCoords.slice(0);

            that.pressed = true;
            that.button.classList.toggle('active');
            that.controls.show();
        });

        document.documentElement.addEventListener('mousemove', function (event) {
            if (that.pressed) {
                that.curCoords = [event.screenX, event.screenY];
                that.updatePullValue();
            }
        });

        this.button.addEventListener("mouseup", function (event) {
            if (!(that.pressed)) {
                return;
            }
            that.pressed = false;
            that.button.classList.toggle('active');
            that.controls.hide();
            if (that.onRelease) {
                that.onRelease();
            }
        });

        document.documentElement.addEventListener('mouseup', function (event) {
            if (that.pressed) {
                that.pressed = false;
                that.button.classList.toggle('active');
                that.controls.hide();
                if (that.onRelease) {
                    that.onRelease();
                }
            }
        });
    }

    PullButton.prototype.updatePullValue = function () {
        var dx = this.curCoords[0] - this.initialCoords[0];
        var dy = this.curCoords[1] - this.initialCoords[1];
        var magnitude = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        value = this.initialValue + magnitude / pullRadius;

        if (this.initialValue > 0) {
            if (value > 1 && value < 2) {
                value = this.initialValue - 1 + magnitude / pullRadius;
            } else {
                if (value >= 2) {
                    value = 1;
                }
            }
        } else {
            if (value >= 1) {
                value = 1;
            }
        }

        this.pullValue = value;
        this.controls.updateCurrent(this.pullValue);
    }

    return PullButton;

});
