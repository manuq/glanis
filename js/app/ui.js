define(["domReady!",
        "app/ui/bg", "app/ui/pullbutton", "app/ui/radiobutton"],
function(doc,
         bg, PullButton, RadioButton) {

    var ui = {};
    var domElement;
    var widgets = {};
    var curRow = 0;

    var setContainerClasses = function (elem) {
        if (curRow == 0) {
            elem.classList.add('first');
        }
        if (curRow % 2 !== 0) {
            elem.classList.add('odd');
        }
        curRow += 1;
    }

    ui.init = function () {
        domElement = document.createElement('div');
        document.body.appendChild(domElement);
        domElement.id = "ui";

        var bgCanvas = bg.init();
        domElement.appendChild(bgCanvas);
    }

    ui.updateSize = function () {
        bg.updateSize();
    }

    ui.createButton = function (options) {
        name = options['name'];

        var button = document.createElement('button');
        widgets[name] = button;

        button.innerText = options['text'];

        button.style.backgroundImage = "url('images/icons/" + options.name + ".svg')";
        button.style.color = "transparent";
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

        var widget = {domElement: button};
        return widget;
    }

    ui.addButton = function (options) {
        var button = ui.createButton(options);
        ui.addRow([button]);
    }

    ui.createPullButton = function (options) {
        var pull = new PullButton(options);
        name = options['name'];
        widgets[name] = pull;
        return pull;
    }

    ui.addPullButton = function (options) {
        var pull = ui.createPullButton(options);
        ui.addRow([pull]);
    }

    ui.createRadioButtons = function (name, options) {
        var radio = new RadioButton(name, options);
        widgets[name] = radio;
        return radio;
    }

    ui.addRow = function (widgets_list) {
        rowElement = document.createElement('div');
        rowElement.className = "ui-container";
        domElement.appendChild(rowElement);
        setContainerClasses(rowElement);

        widgets_list.forEach(function (w) {
            rowElement.appendChild(w.domElement);
        });
    }

    ui.addRadioButtons = function (name, options) {
        var radio = ui.createRadioButtons(name, options);
        ui.addRow([radio]);
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
