define(["domReady!",
        "app/ui/bg", "app/ui/simplebutton", "app/ui/pullbutton", "app/ui/colorbutton", "app/ui/confirmbutton", "app/ui/radiobutton"],
function(doc,
         bg, SimpleButton, PullButton, ColorButton, ConfirmButton, RadioButton) {

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
        var but = new SimpleButton(options);
        var name = options['name'];
        widgets[name] = but;
        return but;
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

    ui.createColorButton = function (options) {
        var color = new ColorButton(options);
        var name = options['name'];
        widgets[name] = color;
        return color;
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

    ui.createSpace = function () {
        var spaceElement = document.createElement('div');
        spaceElement.className = "space";
        return spaceElement;
    }

    ui.addRowSpace = function (spaces) {
        spaces = spaces || 1;
        for (var i = 0; i < spaces; i++) {
            var rowSpaceElement = document.createElement('div');
            rowSpaceElement.className = "ui-container-space";
            domElement.appendChild(rowSpaceElement);
        }
    }

    ui.addRow = function (widgets_list, margin) {
        var rowElement = document.createElement('div');
        rowElement.className = "ui-container";
        domElement.appendChild(rowElement);
        setContainerClasses(rowElement);

        for (var i = 0; i < margin; i++) {
            var spaceElement = ui.createSpace();
            rowElement.appendChild(spaceElement);
        }

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
