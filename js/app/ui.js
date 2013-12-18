define(["domReady!"], function(doc) {

    var ui = {};

    var domElement;

    ui.init = function () {
        domElement = document.createElement('div');
        document.body.appendChild(domElement);
        domElement.id = "ui";
    }

    ui.add = function (elem) {
        domElement.appendChild(elem);
    }

    return ui;

});
