define(["domReady!", "three", "tween", "THREEx.KeyboardState",
        "app/drawing", "app/config", "app/ui", "app/layouts",
        "CSS3DRenderer"],
function(doc, THREE, TWEEN, THREEx,
         Drawing, config, ui, layouts) {

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 350;

var projector = new THREE.Projector();

var renderer = new THREE.CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var keyboard = new THREEx.KeyboardState();

var frames = [];
var framesGroup;
var shadow;
var currentLayout;
var currentTweens = [];
var changingFrames = false;
var changingLayout = false;
var changingOpacities = false;
var frameTransitionDuration = 300;
var drawings = [];

function createFrame(frameName) {
    var frameElem = document.createElement('canvas');
    frameElem.width = 300;
    frameElem.height = 390;
    frameElem.classList.add('frame');

    var frame = new THREE.CSS3DObject(frameElem);

    var drawing = new Drawing(frameElem, frame, camera, projector);
    drawings.push(drawing);
    drawing.load('images/test/' + frameName + '.png')

    return frame;
}

function createShadow() {
    var shadowElem = document.createElement('div');
    shadowElem.classList.add('shadow');

    var shadow = new THREE.CSS3DObject(shadowElem);
    shadow.rotation.x = Math.PI / 2;
    shadow.position.y -= config.frameHeight / 2;
    scene.add(shadow);

    return shadow;
}

function zeroFill(number, width) {
    width -= number.toString().length;

    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    };

    return number + ""; // always return a string
}

function pxToInt(cssString) {
    return parseInt(
        cssString.substring(0, cssString.length - 2)); // 2 is the length of 'px'
}

function createFramesList(amount) {
    var frames = [];
    framesGroup = new THREE.Object3D();
    scene.add(framesGroup);

    for (var i=0; i<amount; i++) {
        var frameName = "frame-" + zeroFill(i+1, 2);
        var frame = createFrame(frameName);
        framesGroup.add(frame);
        frames.push(frame);
    };

    return frames;
}

function stopCurrentTweens() {
    for (var i=0; i<currentTweens.length; i++) {
        currentTweens[i].stop();
    };
    currentTweens = [];
}

function createShadowTween(targetShadow) {
    var shadowAni = {elem: shadow.element,
                     width: pxToInt(shadow.element.style.width),
                     height: pxToInt(shadow.element.style.height),
                     opacity: shadow.element.style.opacity};

    var shadowTween = new TWEEN.Tween(shadowAni).to(targetShadow, 500);
    shadowTween.onUpdate(function () {
        this.elem.style.width = this.width + 'px';
        this.elem.style.height = this.height + 'px';
        this.elem.style.opacity = this.opacity;
    });

    shadowTween.easing(TWEEN.Easing.Quadratic.InOut);
    return shadowTween;
}

function changeLayout(layout, callback) {
    if (currentLayout == layout || changingFrames) {
        return;
    }

    currentLayout = layout;
    changingLayout = true;
    stopCurrentTweens();

    frames.forEach(function (frame, i) {
        var target = layout.frameTargets[i];

        var tweenPosition = new TWEEN.Tween(frame.position).to(target.position, 500);
        currentTweens.push(tweenPosition);
        tweenPosition.easing(TWEEN.Easing.Quadratic.InOut);
        tweenPosition.start();

        var targetRotation = {
            x: target.rotation.x,
            y: target.rotation.y,
            z: target.rotation.z
        };
        var tweenRotation = new TWEEN.Tween(frame.rotation).to(targetRotation, 500);
        currentTweens.push(tweenRotation);
        tweenRotation.easing(TWEEN.Easing.Quadratic.InOut);
        tweenRotation.start();

        var tweenOpacity = new TWEEN.Tween(frame.element.style).to(layout.frameStyleTarget, 2000);
        currentTweens.push(tweenOpacity);
        tweenOpacity.easing(TWEEN.Easing.Quadratic.InOut);
        tweenOpacity.start();
    });

    shadowTween = createShadowTween(layout.shadowStyleTarget);
    currentTweens.push(shadowTween);
    shadowTween.start();

    var tweenCameraPosition = new TWEEN.Tween(camera.position).to(layout.cameraTarget.position, 2500);
    currentTweens.push(tweenCameraPosition);
    tweenCameraPosition.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraPosition.start();

    var targetCameraRotation = {
        x: layout.cameraTarget.rotation.x,
        y: layout.cameraTarget.rotation.y,
        z: layout.cameraTarget.rotation.z
    };
    var tweenCameraRotation = new TWEEN.Tween(camera.rotation).to(targetCameraRotation, 2500);
    currentTweens.push(tweenCameraRotation);
    tweenCameraRotation.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraRotation.start().onComplete(function () {
        changingLayout = false;
        callback();
    });
}

function nextFrameInstant() {
    if (changingLayout || changingFrames) {
        return;
    }

    changingFrames = true;

    var lastFrame = frames[frames.length-1];
    lastPosition = lastFrame.position.clone();
    lastRotation = lastFrame.rotation.clone();

    var targets = [];
    for (var i=1; i<frames.length; i++) {
        var frame = frames[i-1];
        var target = new THREE.Object3D();
        target.position = frame.position.clone();
        target.rotation = frame.rotation.clone();
        targets.push(target);
    };

    for (var i=1; i<frames.length; i++) {
        var frame = frames[i];
        target = targets[i-1];
        frame.position = target.position.clone();
        frame.rotation = target.rotation.clone();
        targets.push(target);
    };

    frames[0].position = lastPosition.clone();
    frames[0].rotation = lastRotation.clone();

    var t = 0;
    var tweenNextFrame = new TWEEN.Tween(t).to(0, frameTransitionDuration);

    tweenNextFrame.start().onComplete(function () {
        var firstFrame = frames.shift();
        frames.push(firstFrame);

        changingFrames = false;
    });
}

function nextFrame() {
    if (changingLayout || changingFrames) {
        return;
    }

    changingFrames = true;

    if (currentLayout == layouts.zoetrope) {
        var angle = 2 * Math.PI / frames.length;

        var targetRotation = {
            x: framesGroup.rotation.x,
            y: framesGroup.rotation.y + angle,
            z: framesGroup.rotation.z
        };

        var tweenRotation = new TWEEN.Tween(framesGroup.rotation).to(targetRotation, frameTransitionDuration);
        tweenRotation.start().onComplete(function () {
            framesGroup.rotation.y -= angle;

            var firstFrame = frames.shift();
            frames.push(firstFrame);

            var firstFrame = frames[0];
            firstPosition = firstFrame.position.clone();
            firstRotation = firstFrame.rotation.clone();

            var targets = [];
            for (var i=0; i<frames.length-1; i++) {
                var frame = frames[i+1];
                var target = new THREE.Object3D();
                target.position = frame.position.clone();
                target.rotation = frame.rotation.clone();
                targets.push(target);
            };

            for (var i=0; i<frames.length-1; i++) {
                var frame = frames[i];
                target = targets[i];
                frame.position = target.position.clone();
                frame.rotation = target.rotation.clone();
                targets.push(target);
            };

            var lastFrame = frames[frames.length-1];
            lastFrame.position = firstPosition.clone();
            lastFrame.rotation = firstRotation.clone();

            changingFrames = false;
        });

        return;
    }

    for (var i=1; i<frames.length; i++) {
        var frame = frames[i];
        var nextFrame = frames[i-1];
        var target = new THREE.Object3D();
        target.position = nextFrame.position.clone();
        target.rotation = nextFrame.rotation.clone();

        var tweenPosition = new TWEEN.Tween(frame.position).to(target.position,
                                                               frameTransitionDuration / 2);
        tweenPosition.easing(TWEEN.Easing.Quadratic.InOut);
        tweenPosition.start();

        var targetRotation = {
            x: target.rotation.x,
            y: target.rotation.y,
            z: target.rotation.z
        };

        var tweenRotation = new TWEEN.Tween(frame.rotation).to(targetRotation, frameTransitionDuration / 2);
        tweenRotation.easing(TWEEN.Easing.Quadratic.InOut);
        tweenRotation.start();
    };

    var frame = frames[0];
    var lastFrame = frames[frames.length-1];
    var target = new THREE.Object3D();
    target.position = lastFrame.position.clone();
    target.rotation = lastFrame.rotation.clone();

    var targetYAxisMiddle = {y: frame.position.y + ((target.position.y - frame.position.y) / 2) + (config.frameHeight*2)};
    var targetYAxisEnd = {y: target.position.y};

    var tweenYAxisA = new TWEEN.Tween(frame.position).to(targetYAxisMiddle,
                                                         frameTransitionDuration / 2);
    tweenYAxisA.easing(TWEEN.Easing.Circular.Out);

    var tweenYAxisB = new TWEEN.Tween(frame.position).to(targetYAxisEnd,
                                                         frameTransitionDuration / 2);
    tweenYAxisB.easing(TWEEN.Easing.Circular.In);

    tweenYAxisA.chain(tweenYAxisB);
    tweenYAxisA.start();

    var targetRotation = {
        x: target.rotation.x,
        y: target.rotation.y,
        z: target.rotation.z
    };

    var tweenRotation = new TWEEN.Tween(frame.rotation).to(targetRotation, frameTransitionDuration / 2);
    tweenRotation.easing(TWEEN.Easing.Quadratic.InOut);
    tweenRotation.start();

    var targetOtherAxis = {x: target.position.x, z: target.position.z};
    var tweenOtherAxis = new TWEEN.Tween(frame.position).to(targetOtherAxis,
                                                            frameTransitionDuration);

    tweenOtherAxis.start().onComplete(function () {
        if (tweenYAxisB != null) {
            tweenYAxisB.stop();
            frame.position.y = targetYAxisEnd.y;
        }

        var firstFrame = frames.shift();
        frames.push(firstFrame);

        changingFrames = false;
    });
}

function addOpacity(sum) {
    changingOpacities = true;

    var opacity = parseFloat(frames[0].element.style.opacity) + sum;
    if ((sum < 0 && opacity >= 0.1) || (sum > 0 && opacity < 1)) {
        frames.forEach(function (frame) {
            frame.element.style.opacity = opacity;
        });
    }
    changingOpacities = false;
}

function lessOpacity() {
    if (changingLayout || changingFrames || changingOpacities) {
        return;
    }

    addOpacity(-0.01);
}

function moreOpacity() {
    if (changingLayout || changingFrames || changingOpacities) {
        return;
    }

    addOpacity(0.01);
}

function setOpacityProportional(value) {
    var opacity = 0.1 + value * 0.9;

    frames.forEach(function (frame) {
        frame.element.style.opacity = opacity;
    });
}

function lessVelocity() {
    frameTransitionDuration += 5;
}

function moreVelocity() {
    if (frameTransitionDuration - 5 > 40) {  // 40 miliseconds for 25 FPS
        frameTransitionDuration -= 5;
    } else {
        frameTransitionDuration = 40;
    }
}

function setVelocityProportional(value) {
    duration = 300 - ((300 - 40) * value);
    if (duration < 40) {
        duration = 40;
    }

    frameTransitionDuration = duration;
}

function setPencil() {
    drawings.forEach(function (drawing) {
        drawing.setColor("black");
    });
}

function setEraser() {
    drawings.forEach(function (drawing) {
        drawing.setColor("white");
    });
}

function render() {
    requestAnimationFrame(render);

    checkEvents();
    TWEEN.update();
    renderer.render(scene, camera);
}

function checkEvents() {
    if (keyboard.pressed("1")) {
        changeLayout(layouts.zoetrope, function () {});
        ui.setRadioActive("radio-layout", "zoetrope");
    };
    if (keyboard.pressed("2")) {
        changeLayout(layouts.sequence, function () {});
        ui.setRadioActive("radio-layout", "sequence");
    };
    if (keyboard.pressed("3")) {
        changeLayout(layouts.stack, function () {});
        ui.setRadioActive("radio-layout", "stack");
    };
    if (keyboard.pressed("4")) {
        changeLayout(layouts.lightbox, function () {});
        ui.setRadioActive("radio-layout", "lightbox");
    };
    if (ui.pressed("next-frame") || keyboard.pressed("s")) {
        setVelocityProportional(ui.pullValue("next-frame"));
        nextFrame();
    };
    if (ui.pressed("next-frame-instant") || keyboard.pressed("w")) {
        setVelocityProportional(ui.pullValue("next-frame-instant"));
        nextFrameInstant();
    };
    if (ui.pressed("opacity")) {
        setOpacityProportional(ui.pullValue("opacity"));
    };
    if (keyboard.pressed("z")) {
        lessOpacity();
    };
    if (keyboard.pressed("x")) {
        moreOpacity();
    };
    if (keyboard.pressed("c")) {
        lessVelocity();
    };
    if (keyboard.pressed("v")) {
        moreVelocity();
    };
    if (keyboard.pressed("b")) {
        setPencil();
        ui.setRadioActive("radio-draw", "pencil");
    };
    if (keyboard.pressed("n")) {
        setEraser();
        ui.setRadioActive("radio-draw", "eraser");
    };
}

function createUi() {
    ui.init();

    var optionsLayout = [
        {"name": "zoetrope", 'text': "1", 'action': function () { changeLayout(layouts.zoetrope, function () {}) }},
        {"name": "sequence", 'text': "2", 'action': function () { changeLayout(layouts.sequence, function () {}) }, 'active': true},
        {"name": "stack", 'text': "3", 'action': function () { changeLayout(layouts.stack, function () {}) }},
        {"name": "lightbox", 'text': "4", 'action': function () { changeLayout(layouts.lightbox, function () {}) }}
    ];
    ui.addRadioButtons("radio-layout", optionsLayout);

    var optionsDraw = [
        {"name": "pencil", 'text': "b", 'action': setPencil},
        {"name": "eraser", 'text': "n", 'action': setEraser}
    ];
    ui.addRadioButtons("radio-draw", optionsDraw);

    ui.addPullButton({"name": "next-frame", "text": "s"});
    ui.addPullButton({"name": "next-frame-instant", "text": "w"});
    ui.addPullButton({"name": "opacity", "text": "o"});
}

function main() {
    createUi();
    frames = createFramesList(7);
    layouts.update(frames);
    shadow = createShadow();
    changeLayout(layouts.sequence, function () {});
    render();
}

main();

});
