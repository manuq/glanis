define(["domReady!", "paper"],
function(doc, paper) {

    var bg = {};
    var bgCanvas;

    function getPos(elem) {
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

    bg.updateSize = function () {
        paper.view.viewSize = [window.innerWidth, window.innerHeight];
    }

    bg.PullControls = function (pullButton) {
        this.pullButton = pullButton;

        this.maxPath = new paper.Path.Circle(new paper.Point(0, 0), 150);
        this.maxPath.style = {
            strokeColor: '#ff88bf',
            strokeWidth: 3,
            dashArray: [4, 3]
        };
        this.maxPath.visible = false;

        this.curPath = new paper.Path.Circle(new paper.Point(0, 0), 150);
        this.curPath.style = {
            strokeColor: '#ff88bf',
            fillColor: 'rgba(255, 255, 255, 0.3)',
            strokeWidth: 2
        };
        this.curPath.visible = false;
        window.curPath = this.curPath;
    }

    bg.PullControls.prototype.show = function () {
        var pos = getPos(this.pullButton.domElement);
        this.maxPath.position = new paper.Point(pos[0], pos[1]);
        this.curPath.position = new paper.Point(pos[0], pos[1]);
        this.maxPath.visible = true;
        this.curPath.visible = true;
        paper.view.draw();
    }

    bg.PullControls.prototype.hide = function () {
        this.maxPath.visible = false;
        this.curPath.visible = false;
        paper.view.draw();
    }

    bg.PullControls.prototype.updateCurrent = function (value) {
        this.curPath.remove();
        this.curPath = new paper.Path.Circle(new paper.Point(0, 0), 150);
        this.curPath.style = {
            strokeColor: '#ff88bf',
            fillColor: 'rgba(255, 255, 255, 0.3)',
            strokeWidth: 2
        };
        this.curPath.position = this.maxPath.position;
        this.curPath.scale(value);
        paper.view.draw();
    }

    return bg;

});
