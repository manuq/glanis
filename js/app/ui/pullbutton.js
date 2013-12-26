define(["domReady!"], function(doc) {

    var pullRadius = 150;

    var PullButton = function (options) {
        text = options['text'];

        this.domElement = document.createElement('div');
        this.domElement.className = "ui-container";
        this.button = document.createElement('button');
        this.button.innerText = text;
        this.domElement.appendChild(this.button);

        this.pressed = false;
        this.initialCoords;
        this.curCoords;
        this.initialValue;

        this.pullValue = 0;
        if ("initial" in options) {
            this.pullValue = options["initial"];
        };

        var that = this;

        this.button.addEventListener("mousedown", function (event) {
            that.initialValue = that.pullValue;
            that.initialCoords = [event.screenX, event.screenY];
            that.curCoords = that.initialCoords.slice(0);

            that.pressed = true;
            that.button.classList.toggle('active');
        });

        document.documentElement.addEventListener('mousemove', function (event) {
            if (that.pressed) {
                that.curCoords = [event.screenX, event.screenY];
                that.updatePullValue();
            }
        });

        this.button.addEventListener("mouseup", function (event) {
            that.pressed = false;
            that.button.classList.toggle('active');
        });

        document.documentElement.addEventListener('mouseup', function (event) {
            if (that.pressed) {
                that.pressed = false;
                that.button.classList.toggle('active');
            }
        });
    }

    PullButton.prototype.updatePullValue = function () {
        var dx = this.curCoords[0] - this.initialCoords[0];
        var dy = this.curCoords[1] - this.initialCoords[1];
        var magnitude = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        value = this.initialValue + magnitude / pullRadius;

        if (value > 1 && value < this.initialValue + 1) {
            value = this.initialValue - 1 + magnitude / pullRadius;
        } else {
            if (value > this.initialValue + 1) {
                if (this.initialValue == 0) {
                    value = 1;
                } else {
                    value = this.initialValue;
                }
            }
        }

        this.pullValue = value;
    }

    return PullButton;

});
