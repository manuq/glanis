define([], function() {

    var ALIAS = {
        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,
        'space': 32,
        'pageup': 33,
        'pagedown': 34,
        'tab': 9,
        'escape': 27,
        '?': 191,
    };

    var Keyboard = function () {
        this.keyCodes = {};
        this.keyCodesConsumed = {};
        document.addEventListener("keydown", this.onKeyDown.bind(this), false);
        document.addEventListener("keyup", this.onKeyUp.bind(this), false);
    };

    Keyboard.prototype.getKeyCode = function (key) {
        if (Object.keys(ALIAS).indexOf(key) != -1) {
            return ALIAS[key];
        } else {
            return key.toUpperCase().charCodeAt(0);
        }
        return undefined;
    }

    Keyboard.prototype.pressed = function (key) {
        var keyCode = this.getKeyCode(key);
        if (keyCode === undefined) {
            return false;
        }

        if (this.keyCodes[keyCode] == true && !this.keyCodesConsumed[keyCode]) {
            this.keyCodesConsumed[keyCode] = true;
            return true;
        }
        return false;
    }

    Keyboard.prototype.released = function (key) {
        var keyCode = this.getKeyCode(key);
        if (keyCode === undefined) {
            return false;
        }

        if (this.keyCodes[keyCode] == false) {
            delete this.keyCodes[keyCode];
            return true;
        }
        return false;
    }

    Keyboard.prototype.onKeyChange = function (event, pressed) {
        if (this.keyCodes[event.keyCode] == pressed) {
            return;
        }
        this.keyCodes[event.keyCode] = pressed;
        this.keyCodesConsumed[event.keyCode] = false;
    }

    Keyboard.prototype.onKeyDown = function (event) {
        this.onKeyChange(event, true);
    }

    Keyboard.prototype.onKeyUp = function (event) {
        this.onKeyChange(event, false);
    }

    return Keyboard;
});
