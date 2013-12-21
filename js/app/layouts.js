define(["three", "app/config"],
function(THREE, config) {

    var layouts = {};

    // zoetrope

    var ZoetropeLayout = function () {
        this.frameTargets = [];
        this.frameStyleTarget = {opacity: 1.0};
        this.shadowStyleTarget = {width: 1800, height: 1800, opacity: 0.1};

        this.cameraTarget = new THREE.Object3D();
        this.cameraTarget.position.y = 1000;
        this.cameraTarget.position.z = 1500;
        this.cameraTarget.rotation.x = -0.5;
    };

    layouts.zoetrope = new ZoetropeLayout();

    ZoetropeLayout.prototype.calculate = function (frames) {
        this.frameTargets = [];
        var that = this;

        var center = new THREE.Vector3();
        center.x = 0;
        center.y = 0;
        center.z = 0;

        var radius = 500;
        var angle = Math.PI * 2 / frames.length;
        var curAngle = 0;

        frames.forEach(function (frame) {
            target = new THREE.Object3D();
            target.position.x = Math.sin(curAngle) * radius;
            target.position.z = Math.cos(curAngle) * radius;
            target.lookAt(center);
            that.frameTargets.push(target);

            curAngle += angle;
        });
    };

    // sequence

    var SequenceLayout = function () {
        this.frameTargets = [];
        this.frameStyleTarget = {opacity: 1.0};
        this.shadowStyleTarget = {width: 3200, height: 300, opacity: 0.1};

        this.cameraTarget = new THREE.Object3D();
        this.cameraTarget.position.z = 1000;
    };

    layouts.sequence = new SequenceLayout();

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

    layouts.update = function (frames) {
        layouts.zoetrope.calculate(frames);
        layouts.sequence.calculate(frames);
    };

    return layouts;

});
