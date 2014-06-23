define(["app/ui", "app/tutorialScript", "tween"], function(ui, tutorialScript, TWEEN) {

    var Scriptor = function (tutorial) {
        this.tutorial = tutorial;
        this.buttonPressed = undefined;
        this.tween = undefined;
    };

    Scriptor.prototype.cancel = function () {
        if (this.buttonPressed) {
            this.buttonPressed.release();
        }
        if (this.tween) {
            this.tween.stop();
        }
    }

    Scriptor.prototype.say = function (params) {
        var words = params[0];
        console.log(words);
        this.tutorial.next();
    };

    Scriptor.prototype.wait = function (params) {
        var duration = params[0];

        var x = 0;
        this.tween = new TWEEN.Tween(x).to(0, duration);

        var that = this;
        this.tween.start().onComplete(function () {
            that.tutorial.next();
            that.tween = undefined;
        });
    };

    Scriptor.prototype.press = function (params) {
        var buttonName = params[0];
        var button = ui.getWidget(buttonName);
        button.press();
        this.buttonPressed = button;
        this.tutorial.next();
    };

    Scriptor.prototype.pressRadio = function (params) {
        var radioName = params[0];
        var buttonName = params[1];
        var radio = ui.getWidget(radioName);
        radio.press(buttonName);
        this.tutorial.next();
    };

    Scriptor.prototype.release = function (params) {
        var buttonName = params[0];
        var button = ui.getWidget(buttonName);
        if (button === undefined) {
            this.tutorial.next();
        }
        button.release();
        this.buttonPressed = undefined;
        this.tutorial.next();
    };

    Scriptor.prototype.drag = function (params) {
        var buttonName = params[0];
        var percent = params[1];

        var button = ui.getWidget(buttonName);

        if (params[2] === undefined) {
            button.dragPercent(percent);
            this.tutorial.next();
        } else {
            var percentEnd = params[2];
            var duration = params[3];

            this.tween = new TWEEN.Tween({p: percent}).to({p: percentEnd}, duration);

            var that = this;
            this.tween.onUpdate(function () {
                button.dragPercent(this.p);
            });

            this.tween.start().onComplete(function () {
                that.tutorial.next();
                that.tween = undefined;
            });
        }
    };

    var Tutorial = function () {
        this.endCallback = undefined;
        this.script = undefined;
        this.scriptor = undefined;
    };

    Tutorial.prototype.start = function (endCallback) {
        this.endCallback = endCallback;
        this.script = tutorialScript.slice(0);
        this.scriptor = new Scriptor(this);
        this.next();
    };

    Tutorial.prototype.cancel = function () {
        this.scriptor.cancel();
        this.script = [];
        this.endCallback();
    };

    Tutorial.prototype.next = function () {
        var params = this.script.shift();
        if (params === undefined) {
            this.endCallback();
            return;
        }

        params = params.slice(0);
        var method = params.shift();
        this.scriptor[method](params);
    };

    return Tutorial;
});
