define(["domReady!"], function(doc) {

    var RadioButton = function (name, options) {
        this.buttons = [];
        this.domElement = document.createElement('div');

        for (var i=0; i<options.length; i++) {
            var text = options[i]['text'];
            var action = options[i]['action'];

            var button = document.createElement('button');
            this.domElement.appendChild(button);
            this.buttons.push(button);
            button.id = name + "-" + i;
            button.innerText = text;
            button.onclick = action;

            if (i == 0) {
                button.classList.add('active');
            }

        };
    }

    return RadioButton;

});
