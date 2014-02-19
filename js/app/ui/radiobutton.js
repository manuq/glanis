define(["domReady!"], function(doc) {

    var RadioButton = function (name, options) {
        this.buttons = {};
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
            button.id = name + "-" + i;
            button.innerText = text;
            button.style.backgroundImage = "url('images/icons/" + name + ".svg')";
            button.style.color = "transparent";
            button.addEventListener('click',
                                    function () { that.onButtonPress(button, action) });

            if (!(activeSet) && 'active' in opt) {
                button.classList.add('active');
                activeSet = true
            }
        });

        if (!(activeSet)) {
            this.domElement.children[0].classList.add('active');
        }
    }

    RadioButton.prototype.onButtonPress = function (button, action) {
        action(function () {});
        for (var butName in this.buttons) {
            but = this.buttons[butName];
            but.classList.toggle('active', but == button);
        }
    }

    RadioButton.prototype.setActive = function (butName) {
        if (!(butName in this.buttons)) {
            return
        }

        button = this.buttons[butName];

        for (var butName2 in this.buttons) {
            but = this.buttons[butName2];
            but.classList.toggle('active', but == button);
        }
    }

    return RadioButton;

});
