define(["app/ui", "app/tutorialScript", "tween"], function(ui, tutorialScript, TWEEN) {

    var helpText = document.getElementById('help-text');
    var lang;

    function setLang() {
        var language = window.navigator.userLanguage || window.navigator.language;

        if (language.indexOf('es') == 0) {
            lang = 'es-AR';
        } else {
            lang = 'en-US';
        }

        helpText.lang = lang;
    }
    setLang();

    var Scriptor = function (tutorial) {
        this.tutorial = tutorial;
        this.buttonPressed = undefined;
        this.tweens = [];
    };

    Scriptor.prototype.cancel = function () {
        this.shutUp();

        if (this.buttonPressed) {
            this.buttonPressed.release();
        }

        for (var i=0; i<this.tweens.length; i++) {
            this.tweens[i].stop();
        };

        this.tweens = [];
    }

    Scriptor.prototype.say = function (params) {
        if (lang == 'es-AR') {
            helpText.innerText = params[0];
        } else {
            helpText.innerText = params[1];
        }
        helpText.classList.remove('disabled');

        var duration = params[2];

        var x = 0;
        var tween = new TWEEN.Tween(x).to(0, duration);
        this.tweens.push(tween);

        var that = this;
        tween.start().onComplete(function () {
            that.shutUp();
        });

        this.tutorial.next();
    };

    Scriptor.prototype.shutUp = function () {
        helpText.classList.add('disabled');
    };

    Scriptor.prototype.wait = function (params) {
        var duration = params[0];

        var x = 0;
        var tween = new TWEEN.Tween(x).to(0, duration);
        this.tweens.push(tween);

        var that = this;
        tween.start().onComplete(function () {
            that.tutorial.next();
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

            var tween = new TWEEN.Tween({p: percent}).to({p: percentEnd}, duration);
            this.tweens.push(tween);

            var that = this;
            tween.onUpdate(function () {
                button.dragPercent(this.p);
            });

            tween.start().onComplete(function () {
                that.tutorial.next();
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
