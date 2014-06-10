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
        button.pullValue = 0.5;
        button.drag(242, 183);
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

    var Tutorial = function (endCallback) {
        this.endCallback = endCallback;
        this.scriptor = new Scriptor(this);
        this.script = [
//            ['say', 'hola mundo?'],
            ['press', 'next-frame'],
            ['wait', '100'],
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
