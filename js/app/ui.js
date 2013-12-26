define(["domReady!", "paper",
        "app/ui/pullbutton", "app/ui/radiobutton"],
function(doc, paper,
         PullButton, RadioButton) {

    var ui = {};
    var domElement;
    var bgCanvas;
    var widgets = {};

    ui.init = function () {
        domElement = document.createElement('div');
        document.body.appendChild(domElement);
        domElement.id = "ui";

        bgCanvas = document.createElement('canvas');
        domElement.appendChild(bgCanvas);
        bgCanvas.id = "bg-ui";
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        paper.setup(bgCanvas);
        paper.view.viewSize = [window.innerWidth, window.innerHeight];

        var path = new paper.Path.Circle(new paper.Point(120, 150), 30);
        path.strokeColor = '#0ff';
        path.strokeWidth = 3;
        path.dashArray = [4, 3];
        paper.view.draw();
    }

    ui.addButton = function (options) {
        name = options['name'];
        text = options['text'];
        elem = document.createElement('div');
        elem.className = "ui-container";
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
        button.addEventListener("mouseout", function (event) {
            this.pressed = false;
            this.classList.remove('active');
        });
    }

    ui.addPullButton = function (options) {
        var pull = new PullButton(options);
        name = options['name'];
        widgets[name] = pull;
        domElement.appendChild(pull.domElement);
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

    ui.pullValue = function (name) {
        if (name in widgets) {
            return widgets[name].pullValue;
        }
    }

    ui.setPullValue = function (name, value) {
        if (name in widgets) {
            widgets[name].pullValue = value;
        }
    }

    return ui;

});
