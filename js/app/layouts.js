define(["three", "app/config"],
function(THREE, config) {

    var layouts = {};

    var SequenceLayout = function () {
        this.frameTargets = [];
        this.frameStyleTarget = {opacity: 1.0};
        this.shadowStyleTarget = {width: 3200, height: 300, opacity: 0.1};

        this.cameraTarget = new THREE.Object3D();
        this.cameraTarget.position.z = 1000;
    };

    SequenceLayout.prototype.calculate = function (frames) {
        this.frameTargets = [];
        var that = this;

        var curX = ((config.frameWidth * (frames.length - 1)) +
                    (config.space * (frames.length - 1)))  / -2;

        frames.forEach(function (frame) {
            target = new THREE.Object3D();
            target.position.x = curX;
            that.frameTargets.push(target);

            curX += config.frameWidth + config.space;
        });
    };

    layouts.sequence = new SequenceLayout();

    layouts.update = function (frames) {
        layouts.sequence.calculate(frames);
    };

    return layouts;

});
