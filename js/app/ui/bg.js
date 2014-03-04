define(["domReady!", "paper"],
function(doc, paper) {

    var bg = {};
    var bgCanvas;

    const BIG_RADIUS = 150;
    const SMALL_RADIUS = 50;

    const STROKE_COLOR = '#ff88bf';
    const FILL_COLOR = 'rgba(255, 255, 255, 0.3)';
    const HIT_COLOR = 'rgba(252, 200, 252, 0.8)';


    function getPos(elem) {
        return [elem.offsetLeft + elem.parentElement.offsetLeft + 28,
                elem.offsetTop + elem.parentElement.offsetTop + 28];
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

        this.maxPath = new paper.Path.Circle(new paper.Point(0, 0), BIG_RADIUS);
        this.maxPath.style = {
            strokeColor: STROKE_COLOR,
            strokeWidth: 3,
            dashArray: [4, 3]
        };
        this.maxPath.visible = false;

        this.curPath = new paper.Path.Circle(new paper.Point(0, 0), BIG_RADIUS);
        this.curPath.style = {
            strokeColor: STROKE_COLOR,
            fillColor: FILL_COLOR,
            strokeWidth: 2
        };
        this.curPath.visible = false;
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
        this.curPath = new paper.Path.Circle(new paper.Point(0, 0), BIG_RADIUS);
        var fillColor;
        if (value == 1) {
            fillColor = HIT_COLOR;
        } else {
            fillColor = FILL_COLOR;
        }
        this.curPath.style = {
            strokeColor: STROKE_COLOR,
            fillColor: fillColor,
            strokeWidth: 2
        };
        this.curPath.position = this.maxPath.position;
        this.curPath.scale(value);
        paper.view.draw();
    }

    bg.ConfirmControls = function (confirmButton) {
        this.confirmButton = confirmButton;

        this.maxPath = new paper.Path.Circle(new paper.Point(0, 0), BIG_RADIUS);
        this.maxPath.style = {
            strokeColor: STROKE_COLOR,
            strokeWidth: 3,
            dashArray: [4, 3]
        };
        this.maxPath.visible = false;

        this.confirmPath = new paper.Path.Circle(new paper.Point(0, 0), SMALL_RADIUS);
        this.confirmPath.style = {
            strokeColor: STROKE_COLOR,
            fillColor: FILL_COLOR,
            strokeWidth: 2
        };
        this.confirmPath.visible = false;
    }

    bg.ConfirmControls.prototype.show = function () {
        var pos = getPos(this.confirmButton.domElement);
        this.maxPath.position = new paper.Point(pos[0], pos[1]);
        this.confirmPath.position = new paper.Point(pos[0] + BIG_RADIUS, pos[1]);
        this.maxPath.visible = true;
        this.confirmPath.visible = true;
        paper.view.draw();
    }

    bg.ConfirmControls.prototype.hide = function () {
        this.maxPath.visible = false;
        this.confirmPath.visible = false;
        paper.view.draw();
    }

    bg.ConfirmControls.prototype.update = function (pointerX, pointerY) {
        var x = pointerX - this.maxPath.position.x - BIG_RADIUS;
        var y = pointerY - this.maxPath.position.y;

        var squared_dist = Math.pow(x, 2) + Math.pow(y, 2);
        var hit = squared_dist <= Math.pow(SMALL_RADIUS, 2);

        var fillColor;
        if (hit) {
            fillColor = HIT_COLOR;
        } else {
            fillColor = FILL_COLOR;
        }

        this.confirmPath.style = {
            strokeColor: STROKE_COLOR,
            fillColor: fillColor,
            strokeWidth: 2
        };

        paper.view.draw();

        return hit;
    }

    return bg;

});
