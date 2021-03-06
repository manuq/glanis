define(["three", "app/config"],
function(THREE, config) {

    var layouts = {};

    // zoetrope

    var ZoetropeLayout = function () {
        this.framesGroupTarget = new THREE.Object3D();

        this.frameTargets = [];
        this.frameStyleTarget = {
            opacity: 1.0,
            borderR: 0
        };

        this.shadowTarget = new THREE.Object3D();
        this.shadowTarget.rotation.x = Math.PI / 2;
        this.shadowTarget.position.y -= config.frameHeight / 2;
        this.shadowStyleTarget = {};

        this.cameraTarget = new THREE.Object3D();
        this.cameraTarget.rotation.x = -0.5;
    };

    layouts.zoetrope = new ZoetropeLayout();

    ZoetropeLayout.prototype.calculate = function (frames) {
        this.shadowStyleTarget = {width: frames.length * 200, height: frames.length * 200, opacity: 0.1};

        this.cameraTarget.position.y = 300 + frames.length * 57;
        this.cameraTarget.position.z = 300 + frames.length * 107; //frames.length * 150;

        this.frameTargets = [];
        var that = this;

        var center = new THREE.Vector3();
        center.x = 0;
        center.y = 0;
        center.z = 0;

        var radius = frames.length * 70;
        var angle = Math.PI * 2 / frames.length;
        var curAngle = angle;

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
        this.framesGroupTarget = new THREE.Object3D();

        this.frameTargets = [];
        this.frameStyleTarget = {
            opacity: 1.0,
            borderR: 0
        };

        this.shadowTarget = new THREE.Object3D();
        this.shadowTarget.rotation.x = Math.PI / 2;
        this.shadowTarget.position.y -= config.frameHeight / 2;
        this.shadowStyleTarget = {};

        this.cameraTarget = new THREE.Object3D();
        this.cameraTarget.position.z = 1000;
    };

    layouts.sequence = new SequenceLayout();

    SequenceLayout.prototype.calculate = function (frames) {
        this.shadowStyleTarget = {width: frames.length * 457, height: 300, opacity: 0.1};

        this.frameTargets = [];
        var that = this;

        var middleX = ((config.frameWidth * (frames.length - 1)) +
            (config.space * (frames.length - 1))) / 2;

        var curX = -1 * middleX;

        frames.forEach(function (frame, i) {
            var atLeft = i < Math.floor(frames.length / 2);
            target = new THREE.Object3D();
            if (atLeft) {
                target.position.x = curX + middleX + (config.frameWidth + config.space);
            } else {
                target.position.x = curX - middleX;
            }
            that.frameTargets.push(target);

            curX += config.frameWidth + config.space;
        });
    };

    // stack

    var StackLayout = function () {
        this.framesGroupTarget = new THREE.Object3D();
        this.framesGroupTarget.rotation.y = -0.5;

        this.frameTargets = [];
        this.frameStyleTarget = {
            opacity: 0.9,
            borderR: 0
        };

        this.shadowTarget = new THREE.Object3D();
        this.shadowTarget.rotation.x = Math.PI / 2;
        this.shadowTarget.rotation.z = 0.5;
        this.shadowTarget.position.y -= config.frameHeight / 2;
        this.shadowStyleTarget = {};

        this.cameraTarget = new THREE.Object3D();
        this.cameraTarget.position.y = 250;
        this.cameraTarget.position.z = 700;
        this.cameraTarget.rotation.x = -0.1;
    };

    layouts.stack = new StackLayout();

    StackLayout.prototype.calculate = function (frames) {
        var initialZ = (config.space * (frames.length - 1)) / -2;
        this.framesGroupTarget.position.z = initialZ;
        this.shadowTarget.position.z = initialZ;
        this.shadowStyleTarget = {width: 550, height: frames.length * 114, opacity: 0.15};

        this.frameTargets = [];
        var that = this;

        var curZ = initialZ;

        frames.forEach(function (frame) {
            target = new THREE.Object3D();
            target.position.z = curZ;
            that.frameTargets.push(target);

            curZ += config.space;
        });
    };

    // lightbox

    var LightboxLayout = function () {
        this.framesGroupTarget = new THREE.Object3D();

        this.frameTargets = [];
        this.frameStyleTarget = {
            opacity: 0.9,
            borderR: 0
        };

        this.shadowTarget = new THREE.Object3D();
        this.shadowTarget.rotation.x = Math.PI / 2;
        this.shadowTarget.position.y -= config.frameHeight / 2;
        this.shadowStyleTarget = {};

        this.cameraTarget = new THREE.Object3D();
        this.cameraTarget.position.z = 300;
    };

    layouts.lightbox = new LightboxLayout();

    LightboxLayout.prototype.calculate = function (frames) {
        var initialZ = (config.space / 10 * (frames.length - 1)) / -2;
        this.framesGroupTarget.position.z = initialZ;
        this.shadowTarget.position.z = initialZ;
        this.shadowStyleTarget = {width: 500, height: frames.length * 35, opacity: 0.15};

        this.frameTargets = [];
        var that = this;

        var curZ = initialZ;

        frames.forEach(function (frame) {
            target = new THREE.Object3D();
            target.position.z = curZ;
            that.frameTargets.push(target);

            curZ += config.space / 10;
        });
    };

    // thaumatrope

    var Thaumatrope = function () {
        this.framesGroupTarget = new THREE.Object3D();
        this.framesGroupTarget.position.y = 200;

        this.frameTargets = [];
        this.frameStyleTarget = {
            opacity: 1.0,
            borderR: 150
        };

        this.shadowTarget = new THREE.Object3D();
        this.shadowTarget.rotation.x = Math.PI / 2;
        this.shadowTarget.position.y -= config.frameHeight / 2;
        this.shadowStyleTarget = {width: 500, height: 150, opacity: 0.15};

        this.cameraTarget = new THREE.Object3D();
        this.cameraTarget.position.z = 500;
        this.cameraTarget.position.y = 200;
    };

    layouts.thaumatrope = new Thaumatrope();

    Thaumatrope.prototype.calculate = function (frames) {
        this.frameTargets = [];
        var that = this;

        frames.forEach(function (frame, i) {
            target = new THREE.Object3D();

            var last = frames.length-1;
            var first = 0;

            if (i == last) {
                target.position.z = 0.1;
            }
            if (i == first) {
                target.position.z = -0.1;
                target.rotation.x = Math.PI;
            }
            if (i !== last && i !== first) {
                target.position.x = window.innerWidth * 3;
            }

            that.frameTargets.push(target);
        });
    };

    layouts.update = function (frames) {
        layouts.zoetrope.calculate(frames);
        layouts.sequence.calculate(frames);
        layouts.stack.calculate(frames);
        layouts.lightbox.calculate(frames);
        layouts.thaumatrope.calculate(frames);
    };

    return layouts;

});
