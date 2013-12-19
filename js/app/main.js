define(["domReady!", "three", "tween", "THREEx.KeyboardState",
        "app/drawing", "app/ui",
        "CSS3DRenderer"],
function(doc, THREE, TWEEN, THREEx,
         Drawing, ui) {

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 350;

var projector = new THREE.Projector();

var renderer = new THREE.CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var keyboard = new THREEx.KeyboardState();

var frames;
var frameWidth = 312; // 300px width + 2*6px border
var frameHeight = 402; // 390px width + 2*6px border
var shadow;
var space = 60;
var currentLayout;
var currentTweens = [];
var changingFrames = false;
var changingLayout = false;
var changingOpacities = false;
var frameTransitionDuration = 300;

function createFrame(frameName) {
    var frameElem = document.createElement('canvas');
    frameElem.width = 300;
    frameElem.height = 390;
    frameElem.classList.add('frame');
    frameElem.classList.add(frameName);

    var frame = new THREE.CSS3DObject(frameElem);
    scene.add(frame);

    var drawing = new Drawing(frameElem, frame, camera, projector);

    return frame;
}

function createShadow() {
    var shadowElem = document.createElement('div');
    shadowElem.classList.add('shadow');

    var shadow = new THREE.CSS3DObject(shadowElem);
    shadow.rotation.x = Math.PI / 2;
    shadow.position.y -= frameHeight / 2;
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

    for (var i=0; i<amount; i++) {
        var frameName = "frame-" + zeroFill(i+1, 2);
        var frame = createFrame(frameName);
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

function zoetropeLayout(callback) {
    if (currentLayout == arguments.callee || changingFrames) {
        return;
    }

    changingLayout = true;
    stopCurrentTweens();
    currentLayout = arguments.callee;

    var radius = 500;
    var angle = Math.PI * 2 / frames.length;
    var curAngle = 0;
    frames.forEach(function (frame, i) {

        var targetPosition = {x: Math.sin(curAngle) * radius, y: 0, z: Math.cos(curAngle) * radius};
        var tweenPosition = new TWEEN.Tween(frame.position).to(targetPosition, 500);
        currentTweens.push(tweenPosition);
        tweenPosition.easing(TWEEN.Easing.Quadratic.InOut);
        tweenPosition.start();

        tweenPosition.onComplete(function () {
            var v = new THREE.Object3D();
            v.x = 0;
            v.y = 0;
            v.z = 0;
            frame.lookAt(v);
        });

        // var targetRotation = {x: 0, y: Math.tan(curAngle - Math.PI) * radius, z: 0};
        // var tweenRotation = new TWEEN.Tween(frame.rotation).to(targetRotation, 500);
        // currentTweens.push(tweenRotation);
        // tweenRotation.easing(TWEEN.Easing.Quadratic.InOut);
        // tweenRotation.start();

        var targetStyle = {opacity: 1.0};
        var tweenOpacity = new TWEEN.Tween(frame.element.style).to(targetStyle, 2000);
        currentTweens.push(tweenOpacity);
        tweenOpacity.easing(TWEEN.Easing.Quadratic.InOut);
        tweenOpacity.start();

        curAngle += angle;
    });

    shadowTween = createShadowTween({width: 3200, height: 300, opacity: 0.1});
    currentTweens.push(shadowTween);
    shadowTween.start();

    var targetCameraPosition = {x: 0, y: 1000, z: 1500};
    var tweenCameraPosition = new TWEEN.Tween(camera.position).to(targetCameraPosition, 2500);
    currentTweens.push(tweenCameraPosition);
    tweenCameraPosition.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraPosition.start();

    var targetCameraRotation = {x: -0.5, y: 0.0, z: 0};
    var tweenCameraRotation = new TWEEN.Tween(camera.rotation).to(targetCameraRotation, 2500);
    currentTweens.push(tweenCameraRotation);
    tweenCameraRotation.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraRotation.start().onComplete(function () {
        changingLayout = false;
        callback();
    });
}

function sequenceLayout(callback) {
    if (currentLayout == arguments.callee || changingFrames) {
        return;
    }

    changingLayout = true;
    stopCurrentTweens();
    currentLayout = arguments.callee;

    var curX = ((frameWidth * (frames.length - 1)) + (space * (frames.length - 1)))  / -2;
    for (var i=0; i<frames.length; i++) {
        var frame = frames[i];

        var targetPosition = {x: curX, y: 0, z: 0};
        var tweenPosition = new TWEEN.Tween(frame.position).to(targetPosition, 500);
        currentTweens.push(tweenPosition);
        tweenPosition.easing(TWEEN.Easing.Quadratic.InOut);
        tweenPosition.start();

        var targetRotation = {x: 0, y: 0, z: 0};
        var tweenRotation = new TWEEN.Tween(frame.rotation).to(targetRotation, 500);
        currentTweens.push(tweenRotation);
        tweenRotation.easing(TWEEN.Easing.Quadratic.InOut);
        tweenRotation.start();

        var targetStyle = {opacity: 1.0};
        var tweenOpacity = new TWEEN.Tween(frame.element.style).to(targetStyle, 2000);
        currentTweens.push(tweenOpacity);
        tweenOpacity.easing(TWEEN.Easing.Quadratic.InOut);
        tweenOpacity.start();

        curX += frameWidth + space;
    };

    shadowTween = createShadowTween({width: 3200, height: 300, opacity: 0.1});
    currentTweens.push(shadowTween);
    shadowTween.start();

    var targetCameraPosition = {x: 0, y: 0, z: 1000};
    var tweenCameraPosition = new TWEEN.Tween(camera.position).to(targetCameraPosition, 2500);
    currentTweens.push(tweenCameraPosition);
    tweenCameraPosition.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraPosition.start();

    var targetCameraRotation = {x: 0, y: 0, z: 0};
    var tweenCameraRotation = new TWEEN.Tween(camera.rotation).to(targetCameraRotation, 2500);
    currentTweens.push(tweenCameraRotation);
    tweenCameraRotation.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraRotation.start().onComplete(function () {
        changingLayout = false;
        callback();
    });
}

function stackLayout(callback) {
    if (currentLayout == arguments.callee || changingFrames) {
        return;
    }

    changingLayout = true;
    stopCurrentTweens();
    currentLayout = arguments.callee;

    var curZ = (space * (frames.length - 1)) / -2;
    for (var i=0; i<frames.length; i++) {
        var frame = frames[i];

        var targetPosition = {x: 0, y: 0, z: curZ};
        var tweenPosition = new TWEEN.Tween(frame.position).to(targetPosition, 500);
        currentTweens.push(tweenPosition);
        tweenPosition.easing(TWEEN.Easing.Quadratic.InOut);
        tweenPosition.start();

        var targetRotation = {x: 0, y: 0, z: 0};
        var tweenRotation = new TWEEN.Tween(frame.rotation).to(targetRotation, 500);
        currentTweens.push(tweenRotation);
        tweenRotation.easing(TWEEN.Easing.Quadratic.InOut);
        tweenRotation.start();

        var targetStyle = {opacity: 0.9};
        var tweenOpacity = new TWEEN.Tween(frame.element.style).to(targetStyle, 2000);
        currentTweens.push(tweenOpacity);
        tweenOpacity.easing(TWEEN.Easing.Quadratic.InOut);
        tweenOpacity.start();

        curZ += space;
    };

    shadowTween = createShadowTween({width: 550, height: 800, opacity: 0.15});
    currentTweens.push(shadowTween);
    shadowTween.start();

    var targetCameraPosition = {x: 400, y: 250, z: 700};
    var tweenCameraPosition = new TWEEN.Tween(camera.position).to(targetCameraPosition, 2500);
    currentTweens.push(tweenCameraPosition);
    tweenCameraPosition.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraPosition.start().onComplete(function () {
        changingLayout = false;
        callback();
    });

    var targetCameraRotation = {x: -0.1, y: 0.5, z: 0};
    var tweenCameraRotation = new TWEEN.Tween(camera.rotation).to(targetCameraRotation, 2500);
    currentTweens.push(tweenCameraRotation);
    tweenCameraRotation.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraRotation.start();
}

function lightBoxLayout(callback) {
    if (currentLayout == arguments.callee || changingFrames) {
        return;
    }

    changingLayout = true;
    stopCurrentTweens();
    currentLayout = arguments.callee;

    var curZ = (space / 10 * (frames.length - 1)) / -2;
    for (var i=0; i<frames.length; i++) {
        var frame = frames[i];

        var targetPosition = {x: 0, y: 0, z: curZ};
        var tweenPosition = new TWEEN.Tween(frame.position).to(targetPosition, 500);
        currentTweens.push(tweenPosition);
        tweenPosition.easing(TWEEN.Easing.Quadratic.InOut);
        tweenPosition.start();

        var targetRotation = {x: 0, y: 0, z: 0};
        var tweenRotation = new TWEEN.Tween(frame.rotation).to(targetRotation, 500);
        currentTweens.push(tweenRotation);
        tweenRotation.easing(TWEEN.Easing.Quadratic.InOut);
        tweenRotation.start();

        var targetStyle = {opacity: 0.6};
        var tweenOpacity = new TWEEN.Tween(frame.element.style).to(targetStyle, 2000);
        currentTweens.push(tweenOpacity);
        tweenOpacity.easing(TWEEN.Easing.Quadratic.InOut);
        tweenOpacity.start();

        curZ += space / 10;
    };

    shadowTween = createShadowTween({width: 500, height: 300, opacity: 0.15});
    currentTweens.push(shadowTween);
    shadowTween.start();

    var targetCameraPosition = {x: 0, y: 0, z: 300};
    var tweenCameraPosition = new TWEEN.Tween(camera.position).to(targetCameraPosition, 2500);
    currentTweens.push(tweenCameraPosition);
    tweenCameraPosition.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraPosition.start();

    var targetCameraRotation = {x: 0, y: 0, z: 0};
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

    var currentPositions = [];
    for (var i=0; i<frames.length; i++) {
        currentPositions.push(frames[i].position.clone());
    };

    for (var i=1; i<frames.length; i++) {
        frames[i].position = currentPositions[i-1];
    };

    frames[0].position = currentPositions[frames.length-1];

    var t = 0;
    var tweenNextFrame = new TWEEN.Tween(t).to(0, 40); // 40 miliseconds for 25 FPS

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

    var currentPositions = [];
    for (var i=0; i<frames.length; i++) {
        currentPositions.push(frames[i].position.clone());
    };

    for (var i=1; i<frames.length; i++) {
        var frame = frames[i];
        var targetPosition = currentPositions[i-1];

        var tweenPosition = new TWEEN.Tween(frame.position).to(targetPosition,
                                                               frameTransitionDuration / 2);
        tweenPosition.easing(TWEEN.Easing.Quadratic.InOut);
        tweenPosition.start();
    };

    var frame = frames[0];
    var targetPosition = currentPositions[frames.length-1];

    if (currentLayout != zoetropeLayout) {
        var targetYAxisMiddle = {y: frame.position.y + ((targetPosition.y - frame.position.y) / 2) + (frameHeight*2)};
        var targetYAxisEnd = {y: targetPosition.y};

        var tweenYAxisA = new TWEEN.Tween(frame.position).to(targetYAxisMiddle,
                                                             frameTransitionDuration / 2);
        tweenYAxisA.easing(TWEEN.Easing.Circular.Out);

        var tweenYAxisB = new TWEEN.Tween(frame.position).to(targetYAxisEnd,
                                                             frameTransitionDuration / 2);
        tweenYAxisB.easing(TWEEN.Easing.Circular.In);

        tweenYAxisA.chain(tweenYAxisB);
        tweenYAxisA.start();
    }

    var targetOtherAxis = {x: targetPosition.x, z: targetPosition.z};
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

function lessVelocity() {
    frameTransitionDuration += 5;
    console.log(frameTransitionDuration);
}

function moreVelocity() {
    if (frameTransitionDuration - 5 > 40) {
        frameTransitionDuration -= 5;
    } else {
        frameTransitionDuration = 40;
    }
    console.log(frameTransitionDuration);
}

function render() {
    requestAnimationFrame(render);

    checkEvents();
    TWEEN.update();
    renderer.render(scene, camera);
}

function checkEvents() {
    if (keyboard.pressed("1")) {
        zoetropeLayout(function () {});
        ui.setRadioActive("radio-layout", "zoetrope");
    };
    if (keyboard.pressed("2")) {
        sequenceLayout(function () {});
        ui.setRadioActive("radio-layout", "sequence");
    };
    if (keyboard.pressed("3")) {
        stackLayout(function () {});
        ui.setRadioActive("radio-layout", "stack");
    };
    if (keyboard.pressed("4")) {
        lightBoxLayout(function () {});
        ui.setRadioActive("radio-layout", "lightbox");
    };
    if (ui.pressed("next-frame") || keyboard.pressed("s")) {
        nextFrame();
    };
    if (ui.pressed("next-frame-instant") || keyboard.pressed("w")) {
        nextFrameInstant();
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
}

function createUi() {
    ui.init();

    var optionsLayout = [
        {"name": "zoetrope", 'text': "1", 'action': zoetropeLayout},
        {"name": "sequence", 'text': "2", 'action': sequenceLayout, 'active': true},
        {"name": "stack", 'text': "3", 'action': stackLayout},
        {"name": "lightbox", 'text': "4", 'action': lightBoxLayout},
    ];
    ui.addRadioButtons("radio-layout", optionsLayout);

    ui.addButton("next-frame", "s");
    ui.addButton("next-frame-instant", "w");
}

function main() {
    createUi();
    frames = createFramesList(7);
    shadow = createShadow();
    sequenceLayout(function () {});
    render();
}

main();

});
