define(["app/ui"], function(ui) {

    var timer;

    var Timer = function (duration, callback) {
        this.startTime = undefined;
        this.duration = duration;
        this.callback = callback;
    }

    Timer.prototype.update = function (time) {
        if (this.startTime === undefined) {
            this.startTime = time;
            return;
        }
        if (time > this.startTime + this.duration) {
            this.callback();
        }
    }

    var Scriptor = function (tutorial) {
        this.tutorial = tutorial;
    }

    Scriptor.prototype.say = function (params) {
        var words = params[0];
        console.log(words);
        this.tutorial.next();
    };

    Scriptor.prototype.wait = function (params) {
        var that = this;
        var time = parseInt(params[0]);
        var callback = function () {
            timer = undefined;
            that.tutorial.next();
        }
        timer = new Timer(time, callback);
    };

    Scriptor.prototype.press = function (params) {
        var buttonName = params[0];
        var button = ui.getWidget(buttonName);
        if (button === undefined) {
            this.tutorial.next();
        }
        button.press();
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
        var percent = parseFloat(params[1]);
        var button = ui.getWidget(buttonName);
        if (button === undefined) {
            this.tutorial.next();
        }
        button.dragPercent(percent);
        this.tutorial.next();
    };

    var Tutorial = function (endCallback) {
        this.endCallback = endCallback;
        this.scriptor = new Scriptor(this);
        this.script = [
//            ['say', 'hola mundo?'],
            ['wait', '3000'],
            ['press', 'next-frame'],
            ['drag', 'next-frame', '0.3'],
            ['wait', '3000'],
            ['drag', 'next-frame', '0.6'],
            ['wait', '3000'],
            ['drag', 'next-frame', '0.9'],
            ['wait', '3000'],
            ['drag', 'next-frame', '1.0'],
            ['wait', '5000'],
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

    Tutorial.prototype.update = function (time) {
        if (timer !== undefined) {
            timer.update(time);
        }
    };

    return Tutorial;
});
