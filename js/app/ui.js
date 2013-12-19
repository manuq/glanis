define(["domReady!",
        "app/ui/radiobutton"],
function(doc, RadioButton) {

    var ui = {};
    var domElement;
    var widgets = {};

    ui.init = function () {
        domElement = document.createElement('div');
        document.body.appendChild(domElement);
        domElement.id = "ui";
    }

    ui.addButton = function (name, text) {
        elem = document.createElement('div');
        domElement.appendChild(elem);
        var button = document.createElement('button');
        elem.appendChild(button);
        widgets[name] = button;
        button.innerText = text;
        button.addEventListener("mousedown", function (event) {
            this.pressed = true;
            this.classList.toggle('active');
        });
        button.addEventListener("mouseup", function (event) {
            this.pressed = false;
            this.classList.toggle('active');
        });
    }

    ui.addRadioButtons = function (name, options) {
        var radio = new RadioButton(name, options);
        widgets[name] = radio;
        domElement.appendChild(radio.domElement);
    }

    ui.setRadioActive = function (radioName, butName) {
        if (radioName in widgets) {
            widgets[radioName].setActive(butName);
        }
    }

    ui.pressed = function (name) {
        if (name in widgets) {
            return widgets[name].pressed;
        }
    }

    return ui;

});
