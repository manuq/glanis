define(["domReady!",
        "app/ui/bg", "app/ui/pullbutton", "app/ui/confirmbutton", "app/ui/radiobutton"],
function(doc,
         bg, PullButton, ConfirmButton, RadioButton) {

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

    ui.enable = function () {
        for (var widgetName in widgets) {
            widgets[widgetName].enable();
        }
    }

    ui.disable = function () {
        for (var widgetName in widgets) {
            widgets[widgetName].disable();
        }
    }

    ui.createButton = function (options) {
        var name = options['name'];

        var button = document.createElement('button');
        button.enable = function () {};
        button.disable = function () {};
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

    ui.createConfirmButton = function (options) {
        var confirm = new ConfirmButton(options);
        var name = options['name'];
        widgets[name] = confirm;
        return confirm;
    }

    ui.createPullButton = function (options) {
        var pull = new PullButton(options);
        var name = options['name'];
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

    ui.addRowSpace = function (spaces) {
        spaces = spaces || 1;
        for (var i = 0; i < spaces; i++) {
            var rowSpaceElement = document.createElement('div');
            rowSpaceElement.className = "ui-container-space";
            domElement.appendChild(rowSpaceElement);
        }
    }

    ui.addSpaces = function (elem, spaces) {
        for (var i = 0; i < spaces; i++) {
            var spaceElement = document.createElement('div');
            spaceElement.className = "space";
            elem.appendChild(spaceElement);
        }
    }

    ui.addRow = function (widgets_list, margin) {
        var rowElement = document.createElement('div');
        rowElement.className = "ui-container";
        domElement.appendChild(rowElement);
        setContainerClasses(rowElement);
        ui.addSpaces(rowElement, margin);

        widgets_list.forEach(function (w) {
            rowElement.appendChild(w.domElement);
        });
    }

    ui.addRadioButtons = function (name, options) {
        var radio = ui.createRadioButtons(name, options);
        ui.addRow([radio]);
    }

    ui.getWidget = function (name) {
        return widgets[name];
    }

    return ui;

});
