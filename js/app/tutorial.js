define(["app/ui", "tween"], function(ui, TWEEN) {

    var Scriptor = function (tutorial) {
        this.tutorial = tutorial;
    }

    Scriptor.prototype.say = function (params) {
        var words = params[0];
        console.log(words);
        this.tutorial.next();
    };

    Scriptor.prototype.wait = function (params) {
        var duration = params[0];

        var x = 0;
        var tween = new TWEEN.Tween(x).to(0, duration);

        var that = this;
        tween.start().onComplete(function () {
            that.tutorial.next();
        });
    };

    Scriptor.prototype.press = function (params) {
        var buttonName = params[0];
        var button = ui.getWidget(buttonName);
        button.press();
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

            var tween = new TWEEN.Tween({p: percent}).to({p: percentEnd}, duration);

            var that = this;
            tween.onUpdate(function () {
                button.dragPercent(this.p);
            });

            tween.start().onComplete(function () {
                that.tutorial.next();
            });
        }
    };

    var Tutorial = function (endCallback) {
        this.endCallback = endCallback;
        this.scriptor = new Scriptor(this);
        this.script = [
//            ['say', 'hola mundo?'],
            ['wait', 3000],
            ['press', 'next-frame'],
            ['drag', 'next-frame', 0.3],
            ['wait', 3000],
            ['release', 'next-frame'],
            ['wait', 800],
            ['press', 'prev-frame'],
            ['drag', 'prev-frame', 0.3],
            ['wait', 3000],
            ['release', 'prev-frame'],
            ['wait', 800],
            ['press', 'next-frame'],
            ['drag', 'next-frame', 0.3],
            ['wait', 3000],
            ['drag', 'next-frame', 0.3, 0.6, 5000],
            ['wait', 3000],
            ['drag', 'next-frame', 0.6, 0.9, 5000],
            ['wait', 3000],
            ['drag', 'next-frame', 0.9, 1.0, 2000],
            ['wait', 5000],
            ['drag', 'next-frame', 1.0, 0.3, 5000],
            ['release', 'next-frame'],
            ['wait', 3000],
            ['pressRadio', 'radio-layout', 'zoetrope'],
            ['wait', 3000],
            ['press', 'next-frame'],
            ['drag', 'next-frame', 0.1, 1.0, 10000],
            ['wait', 5000],
            ['drag', 'next-frame', 1.0, 0.1, 2000],
            ['release', 'next-frame'],
        ];
    };

    Tutorial.prototype.start = function () {
        this.next();
    };

    Tutorial.prototype.next = function () {
        var params = this.script.shift();
        if (params === undefined) {
            this.endCallback();
            return;
        }

        var method = params.shift();
        this.scriptor[method](params);
    };

    return Tutorial;
});
