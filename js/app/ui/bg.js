define(["domReady!", "paper"],
function(doc, paper) {

    var bg = {};
    var bgCanvas;

    function getPos(elem) {
        window.elem = elem;
        return [elem.offsetLeft + 28, elem.offsetTop + 28];
    }

    bg.init = function () {
        bgCanvas = document.createElement('canvas');
        bgCanvas.id = "bg-ui";
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        paper.setup(bgCanvas);
        paper.view.viewSize = [window.innerWidth, window.innerHeight];

        return bgCanvas;
    }

    bg.PullControls = function (pullButton) {
        this.pullButton = pullButton;
        this.path = new paper.Path.Circle(new paper.Point(0, 0), 150);
        this.path.style = {
            strokeColor: '#0ff',
            strokeWidth: 3,
            dashArray: [4, 3]
        };
        this.path.visible = false;
        paper.view.draw();
    }

    bg.PullControls.prototype.show = function () {
        var pos = getPos(this.pullButton.domElement);
        console.log(pos);
        this.path.position = new paper.Point(pos[0], pos[1]);
        this.path.visible = true;
        paper.view.draw();
    }

    bg.PullControls.prototype.hide = function () {
        this.path.visible = false;
        paper.view.draw();
    }

    return bg;

});
