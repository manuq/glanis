define(["domReady!"], function(doc) {

    var RadioButton = function (name, options) {
        this.buttons = [];
        this.domElement = document.createElement('div');
        var that = this;

        options.forEach(function (opt, i) {
            var text = opt['text'];
            var action = opt['action'];

            var button = document.createElement('button');
            that.domElement.appendChild(button);
            that.buttons.push(button);
            button.id = name + "-" + i;
            button.innerText = text;
            button.addEventListener('click',
                                    function () { that.onButtonPress(button, action) });

            if (i == 0) {
                button.classList.add('active');
            }

        });
    }

    RadioButton.prototype.onButtonPress = function (button, action) {
        action(function () {});
        this.buttons.forEach(function (but) {
            but.classList.toggle('active', but == button);
        });
    }

    return RadioButton;

});
