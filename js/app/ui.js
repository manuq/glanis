define(["domReady!"], function(doc) {

    var ui = {};

    ui.initUi = function (sequenceLayout, stackLayout, lightBoxLayout) {
        var uiElem = document.createElement('div');
        document.body.appendChild(uiElem);
        uiElem.id = "ui";

        var layoutButtons = [];

        var onButtonLayoutClick  = function () {
            console.log("hola");
            this.classList.add('active');
            for (var i=0; i<layoutButtons.length; i++) {
                var button = layoutButtons[i];
                button.classList.toggle('active', this == button);
            };

            switch (this.id) {
            case "sequence-layout":
                sequenceLayout(function () {});
                break;

            case "stack-layout":
                stackLayout(function () {});
                break;

            case "lightbox-layout":
                lightBoxLayout(function () {});
                break;
            }
        }

        var buttonSequenceLayout = document.createElement('button');
        uiElem.appendChild(buttonSequenceLayout);
        layoutButtons.push(buttonSequenceLayout);
        buttonSequenceLayout.id = "sequence-layout";
        buttonSequenceLayout.classList.add('active');
        buttonSequenceLayout.innerText = "1";
        buttonSequenceLayout.onclick = onButtonLayoutClick;

        var buttonStackLayout = document.createElement('button');
        uiElem.appendChild(buttonStackLayout);
        layoutButtons.push(buttonStackLayout);
        buttonStackLayout.id = "stack-layout";
        buttonStackLayout.innerText = "2";
        buttonStackLayout.onclick = onButtonLayoutClick;

        var buttonLightBoxLayout = document.createElement('button');
        uiElem.appendChild(buttonLightBoxLayout);
        layoutButtons.push(buttonLightBoxLayout);
        buttonLightBoxLayout.id = "lightbox-layout";
        buttonLightBoxLayout.innerText = "3";
        buttonLightBoxLayout.onclick = onButtonLayoutClick;
    }

    return ui;

});
