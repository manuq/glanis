define(["domReady!", "paper", "tween"], function(doc, paper, TWEEN) {
    var bg = {};
    var bgCanvas;

    const BIG_RADIUS = 150;
    const SMALL_RADIUS = 27;

    const STROKE_COLOR = '#07eaff';
    const FILL_COLOR = 'rgba(7, 234, 255, 0.3)';
    const HIT_FILL_COLOR = 'rgba(7, 234, 255, 0.8)';
    const HIT_STROKE_COLOR = '#fff';


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

    bg.RadioControls = function (radioButton) {
        this.radioButton = radioButton;
        this.playing = false;
        this.tween = undefined;
        this.path = undefined;
    }

    bg.RadioControls.prototype.play = function (radioButton) {
        if (this.playing) {
            return;
        }
        this.playing = true;

        var pos = getPos(this.radioButton.activeButton);

        this.tween = new TWEEN.Tween({p: 1}).to({p: 0}, 500);
        var that = this;
        this.tween.onUpdate(function () {
            if (that.path) {
                that.path.remove();
            }
            that.path = new paper.Path.Circle(new paper.Point(0, 0), BIG_RADIUS / 2);
            that.path.position = new paper.Point(pos[0], pos[1]);
            that.path.visible = true;
            that.path.style = {
                fillColor: FILL_COLOR,
            };

            that.path.scale(this.p);
            paper.view.draw();
        });

        this.tween.start().onComplete(function () {
            that.playing = false;
        });

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
            fillColor = HIT_FILL_COLOR;
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

        maxPath = new paper.Path.Circle(new paper.Point(0, 0), BIG_RADIUS);
        maxPath.style = {
            strokeColor: STROKE_COLOR,
            strokeWidth: 3,
            dashArray: [4, 3]
        };

        this.confirmPath = new paper.Path.Circle(new paper.Point(BIG_RADIUS, 0), SMALL_RADIUS);
        this.confirmPath.style = {
            strokeColor: STROKE_COLOR,
            fillColor: FILL_COLOR,
            strokeWidth: 2
        };

        var confirmLine = new paper.Path.Line(
            new paper.Point(SMALL_RADIUS + 20, 0),
            new paper.Point(BIG_RADIUS - SMALL_RADIUS - 10, 0))
        confirmLine.style = {
            strokeColor: STROKE_COLOR,
            strokeWidth: 3,
            dashArray: [4, 3]
        };

        confirmTick = new paper.Path([
            new paper.Point(BIG_RADIUS - 10, SMALL_RADIUS - 28),
            new paper.Point(BIG_RADIUS - 5, SMALL_RADIUS - 18),
            new paper.Point(BIG_RADIUS + 10, SMALL_RADIUS - 35)
        ]);
        confirmTick.style = {
            strokeColor: HIT_STROKE_COLOR,
            strokeWidth: 4
        };

        this.group = new paper.Group([maxPath, this.confirmPath, confirmLine,
                                      confirmTick])
        this.group.visible = false;
    }

    bg.ConfirmControls.prototype.show = function () {
        var pos = getPos(this.confirmButton.domElement);
        this.group.position = new paper.Point(pos[0], pos[1]);
        this.group.visible = true;
        paper.view.draw();
    }

    bg.ConfirmControls.prototype.hide = function () {
        this.group.visible = false;
        paper.view.draw();
    }

    bg.ConfirmControls.prototype.update = function (pointerX, pointerY) {
        var x = pointerX - this.group.position.x - BIG_RADIUS + 12;
        var y = pointerY - this.group.position.y;

        var squared_dist = Math.pow(x, 2) + Math.pow(y, 2);
        var hit = squared_dist <= Math.pow(SMALL_RADIUS, 2);

        var fillColor;
        if (hit) {
            fillColor = HIT_FILL_COLOR;
        } else {
            fillColor = FILL_COLOR;
        }

        this.confirmPath.style = {
            fillColor: fillColor,
        };

        paper.view.draw();

        return hit;
    }

    return bg;

});
