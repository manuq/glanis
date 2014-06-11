define(["domReady!"], function(doc) {

    var RadioButton = function (name, options) {
        this.buttons = {};
        this.actions = {};
        this.callbacks = {};
        this.domElement = document.createElement('div');
        this.domElement.className = "widget";
        var that = this;

        var activeSet = false;
        options.forEach(function (opt, i) {
            var name = opt['name'];
            var text = opt['text'];
            var action = opt['action'];

            var button = document.createElement('button');
            that.domElement.appendChild(button);
            that.buttons[name] = button;
            that.actions[name] = action;
            button.id = name + "-" + i;
            button.innerText = text;
            button.style.backgroundImage = "url('images/icons/" + name + ".svg')";
            button.style.color = "transparent";

            var onClick = that.onClick.bind(that, name);
            that.callbacks[name] = onClick;

            if (!(activeSet) && 'active' in opt) {
                button.classList.add('active');
                activeSet = true
            }
        });

        if (!(activeSet)) {
            this.domElement.children[0].classList.add('active');
        }

        this.enable();
    }

    RadioButton.prototype.onClick = function (butName) {
        this.press(butName);
    }

    RadioButton.prototype.press = function (butName) {
        var button = this.buttons[butName];
        var action = this.actions[butName];

        action(function () {});
        for (var butName2 in this.buttons) {
            var button2 = this.buttons[butName2];
            button2.classList.toggle('active', button2 == button);
        }

    }

    RadioButton.prototype.enable = function () {
        var that = this;
        for (var butName in this.buttons) {
            var button = this.buttons[butName];
            var onClick = this.callbacks[butName];
            button.addEventListener("click", onClick);
        }
    }

    RadioButton.prototype.disable = function () {
        var that = this;
        for (var butName in this.buttons) {
            var button = this.buttons[butName];
            var onClick = this.callbacks[butName];
            button.removeEventListener("click", onClick);
        }
    }

    return RadioButton;

});
