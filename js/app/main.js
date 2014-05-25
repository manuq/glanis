define(["domReady!", "three", "tween", "THREEx.KeyboardState",
        "app/drawing", "app/config", "app/ui", "app/layouts",
        "CSS3DRenderer", "TrackballControls"],
function(doc, THREE, TWEEN, THREEx,
         Drawing, config, ui, layouts) {

var scene;
var camera;
var projector;
var controls;
var renderer;
var keyboard;

var allFrames = [];
var frames = [];
var framesGroup;
var shadow;
var currentLayout;
var currentTweens = [];
var changingFrames = false;
var changingLayout = false;
var changingOpacities = false;
var frameTransitionDuration = config.maxDuration;
var drawings = [];
var soundEnabled = true;

var lastCalledTime;
var frameRate;
var inSync = false;

function createFrame(frameName, groupObject) {
    var frameElem = document.createElement('canvas');
    frameElem.width = 300;
    frameElem.height = 300;
    frameElem.classList.add('frame');

    var frame = new THREE.CSS3DObject(frameElem);

    var drawing = new Drawing(frameElem, frame, groupObject, camera, projector);
    drawings.push(drawing);

    if (frameName != null) {
        drawing.load('images/test/' + frameName + '.png');
    }

    return frame;
}

function createShadow() {
    var shadowElem = document.createElement('div');
    shadowElem.classList.add('shadow');

    shadow = new THREE.CSS3DObject(shadowElem);
    shadow.rotation.x = Math.PI / 2;
    shadow.position.y -= config.frameHeight / 2;
    scene.add(shadow);
}

function zeroFill(number, width) {
    width -= number.toString().length;

    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    };

    return number + ""; // always return a string
}

function createFramesList(amount) {
    framesGroup = new THREE.Object3D();
    scene.add(framesGroup);

    for (var i=0; i<amount; i++) {
        var frameName = "frame-" + zeroFill(i+1, 2);
        var frame = createFrame(frameName, framesGroup);
        framesGroup.add(frame);
        allFrames.push(frame);
    };
}

function addFrame() {
    var frame = createFrame();
    framesGroup.add(frame);
    frames.push(frame);
    layouts.update(frames);
    updateLayout(function () {});
}

function stopCurrentTweens() {
    for (var i=0; i<currentTweens.length; i++) {
        currentTweens[i].stop();
    };
    currentTweens = [];
}

function createShadowTween(targetShadow) {
    var shadowAni = {elem: shadow.element,
                     width: parseInt(shadow.element.style.width),
                     height: parseInt(shadow.element.style.height),
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

function createTargetTweens(object, target, posDuration, rotDuration, posEasing, rotEasing) {
    tweens = {};
    var tweenPosition = new TWEEN.Tween(object.position).to(target.position, posDuration);
    tweenPosition.easing(posEasing);
    tweens['pos'] = tweenPosition;

    var targetRotation = {
        x: target.rotation.x,
        y: target.rotation.y,
        z: target.rotation.z
    };
    var tweenRotation = new TWEEN.Tween(object.rotation).to(targetRotation, rotDuration);
    tweenRotation.easing(rotEasing);
    tweens['rot'] = tweenRotation;

    return tweens;
}

function animateLayout(callback) {
    changingLayout = true;
    stopCurrentTweens();

    if (soundEnabled) {
        var audio = new Audio('sounds/paper.wav');
        audio.play();
    }

    var groupTweens = createTargetTweens(framesGroup, currentLayout.framesGroupTarget,
                                         2000, 2000,
                                         TWEEN.Easing.Quadratic.InOut,
                                         TWEEN.Easing.Quadratic.InOut);

    groupTweens['pos'].start();
    groupTweens['rot'].start();

    frames.forEach(function (frame, i) {
        var target = currentLayout.frameTargets[i];

        var duration = 250 + 750 * (i / frames.length);
        var frameTweens = createTargetTweens(frame, target,
                                             duration, duration,
                                             TWEEN.Easing.Quadratic.InOut,
                                             TWEEN.Easing.Quadratic.InOut);

        currentTweens.push(frameTweens['pos']);
        currentTweens.push(frameTweens['rot']);
        frameTweens['pos'].start();
        frameTweens['rot'].start();

        var tweenOpacity = new TWEEN.Tween(frame.element.style).to(currentLayout.frameStyleTarget, 2000);
        currentTweens.push(tweenOpacity);
        tweenOpacity.easing(TWEEN.Easing.Quadratic.InOut);
        tweenOpacity.start();
        tweenOpacity.onUpdate(function () {
            frame.element.style.borderRadius = this.borderR + 'px';
        });
        tweenOpacity.onComplete(function () {
            var value = (frame.element.style.opacity - 0.1) / 0.9;
            ui.setPullValue('opacity', value);
        });
    });

    var shadowTweens = createTargetTweens(shadow, currentLayout.shadowTarget,
                                         1000, 1000,
                                         TWEEN.Easing.Quadratic.InOut,
                                         TWEEN.Easing.Quadratic.InOut);

    shadowTweens['pos'].start();
    shadowTweens['rot'].start();

    shadowStyleTween = createShadowTween(currentLayout.shadowStyleTarget);
    currentTweens.push(shadowStyleTween);
    shadowStyleTween.start();

    var cameraTweens = createTargetTweens(camera, currentLayout.cameraTarget,
                                          1500, 1500,
                                          TWEEN.Easing.Quadratic.InOut,
                                          TWEEN.Easing.Quadratic.InOut);

    currentTweens.push(cameraTweens['pos']);
    currentTweens.push(cameraTweens['rot']);
    cameraTweens['pos'].start();
    cameraTweens['rot'].start().onComplete(function () {
        changingLayout = false;
        callback();
    });
}

function updateLayout(callback) {
    if (changingFrames) {
        return;
    }

    animateLayout(callback);
}

function changeLayout(layout, callback) {
    if (currentLayout == layout || changingFrames) {
        return;
    }

    currentLayout = layout;
    animateLayout(callback);
}

function changeFrameInstant(direction) {
    if (changingLayout || changingFrames) {
        return;
    }

    changingFrames = true;

    relocateFrames(direction * -1);

    var t = 0;
    var tweenNextFrame = new TWEEN.Tween(t).to(0, frameTransitionDuration);

    tweenNextFrame.start().onComplete(function () {
        shiftFrames(direction);

        changingFrames = false;
    });
}

function nextFrameInstant() {
    changeFrameInstant(1);
}

function prevFrameInstant() {
    changeFrameInstant(-1);
}

function shiftFrames(direction) {
    if (direction == 1) {
        var firstFrame = frames.shift();
        frames.push(firstFrame);

    } else {
        var lastFrame = frames.pop();
        frames.unshift(lastFrame);
    }
}

function relocateFrames(direction) {

    var auxFrames;

    if (direction == 1) {
        auxFrames = frames;

    } else {
        auxFrames = frames.slice(0).reverse();
    }

    var firstFrame = auxFrames[0];
    firstPosition = firstFrame.position.clone();
    firstRotation = firstFrame.rotation.clone();

    var targets = [];
    for (var i=0; i<auxFrames.length-1; i++) {
        var frame = auxFrames[i+1];
        var target = new THREE.Object3D();
        target.position = frame.position.clone();
        target.rotation = frame.rotation.clone();
        targets.push(target);
    };

    for (var i=0; i<auxFrames.length-1; i++) {
        var frame = auxFrames[i];
        target = targets[i];
        frame.position = target.position.clone();
        frame.rotation = target.rotation.clone();
        targets.push(target);
    };

    var lastFrame = auxFrames[auxFrames.length-1];
    lastFrame.position = firstPosition.clone();
    lastFrame.rotation = firstRotation.clone();
}

function moveOtherFrames(frames, direction) {

    var auxFrames;

    if (direction == 1) {
        auxFrames = frames.slice(0);

    } else {
        auxFrames = frames.slice(0).reverse();
    }

    auxFrames.forEach(function (frame, i) {
        if (i == 0) {
            return;
        }
        var prevFrame = auxFrames[i - 1];
        var target = new THREE.Object3D();
        target.position = prevFrame.position.clone();
        target.rotation = prevFrame.rotation.clone();

        var frameTweens = createTargetTweens(frame, target,
                                             frameTransitionDuration / 2,
                                             frameTransitionDuration / 2,
                                             TWEEN.Easing.Quadratic.InOut,
                                             TWEEN.Easing.Quadratic.InOut);

        frameTweens['pos'].start();
        frameTweens['rot'].start();
    });

}

function moveFirstFrameFast(frames, direction, callback) {
    var frame;
    var targetFrame;
    if (direction == 1) {
        frame = frames[0];
        targetFrame = frames[frames.length-1];
    } else {
        frame = frames[frames.length-1];
        targetFrame = frames[0];
    }

    var target = new THREE.Object3D();
    target.position = targetFrame.position.clone();
    target.rotation = targetFrame.rotation.clone();

    var outLength = 800;
    var outPosition = {x: frame.position.x - outLength * direction};
    var inPosition = {x: target.position.x + outLength * direction};

    var tweenA = new TWEEN.Tween(frame.position).to(outPosition,
                                                    frameTransitionDuration / 2);

    var tweenB = new TWEEN.Tween(frame.position).to(target.position,
                                                    frameTransitionDuration / 2);
    tweenB.easing(TWEEN.Easing.Quadratic.Out);

    tweenA.onComplete(function () {
        frame.position.x = inPosition.x;
        tweenB.start();
    });
    tweenA.easing(TWEEN.Easing.Quadratic.In);

    tweenA.start();

    var t = 0;
    var tweenNextFrame = new TWEEN.Tween(t).to(0, frameTransitionDuration);
    tweenNextFrame.start().onComplete(function () {
        if (tweenB != null) {
            tweenB.stop();
            frame.position.x = target.position.x;
        }

        shiftFrames(direction);
        callback();
    });
}

function moveFirstFrameJump(frames, direction, callback) {
    var frame;
    var targetFrame;
    if (direction == 1) {
        frame = frames[0];
        targetFrame = frames[frames.length-1];
    } else {
        frame = frames[frames.length-1];
        targetFrame = frames[0];
    }

    var target = new THREE.Object3D();
    target.position = targetFrame.position.clone();
    target.rotation = targetFrame.rotation.clone();

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
    tweenRotation.easing(TWEEN.Easing.Quadratic.In);
    tweenRotation.start();

    var targetOtherAxis = {x: target.position.x, z: target.position.z};
    var tweenOtherAxis = new TWEEN.Tween(frame.position).to(targetOtherAxis,
                                                            frameTransitionDuration);

    tweenOtherAxis.start().onComplete(function () {
        if (tweenYAxisB != null) {
            tweenYAxisB.stop();
            frame.position.y = targetYAxisEnd.y;
        }

        shiftFrames(direction);
        callback();
    });
}

function moveFirstFrameRotating(frames, direction, callback) {
    var bottomFrame = frames[0];
    var topFrame = frames[frames.length-1];
    var originalOpacity = parseFloat(frames[0].element.style.opacity);

    if (direction == 1) {
        var originalTopPosition = topFrame.position.clone();
        bottomFrame.position = {
            x: topFrame.position.x - config.frameWidth * 1.8,
            y: topFrame.position.y,
            z: topFrame.position.z
        };

        var endPositionX = {x: topFrame.position.x};
        var tweenPositionX = new TWEEN.Tween(bottomFrame.position).to(endPositionX,
                                                                      frameTransitionDuration);
        tweenPositionX.start();

        var endPositionZA = {z: bottomFrame.position.z + config.frameWidth * 0.6};
        var tweenPositionZA = new TWEEN.Tween(bottomFrame.position).to(endPositionZA,
                                                                       frameTransitionDuration / 2);
        tweenPositionZA.easing(TWEEN.Easing.Quadratic.Out);

        var endPositionZB = {z: bottomFrame.position.z};
        var tweenPositionZB = new TWEEN.Tween(bottomFrame.position).to(endPositionZB,
                                                                       frameTransitionDuration / 2);
        tweenPositionZB.easing(TWEEN.Easing.Quadratic.In);

        tweenPositionZA.chain(tweenPositionZB);
        tweenPositionZA.start();

        var targetRotation = {
            y: bottomFrame.rotation.y
        };

        bottomFrame.rotation.y -= Math.PI;
        var tweenRotation = new TWEEN.Tween(bottomFrame.rotation).to(targetRotation, frameTransitionDuration);
        tweenRotation.easing(TWEEN.Easing.Quadratic.In);
        tweenRotation.start();

        bottomFrame.element.style.opacity = 0;
        var tweenOpacity = new TWEEN.Tween({value: 0}).to({value: originalOpacity}, frameTransitionDuration);
        tweenOpacity.easing(TWEEN.Easing.Quadratic.InOut);
        tweenOpacity.onUpdate(function () {
            bottomFrame.element.style.opacity = this.value;
        });
        tweenOpacity.onComplete(function () {
            tweenPositionX.stop();
            tweenPositionZA.stop();
            tweenPositionZB.stop();
            tweenRotation.stop();

            bottomFrame.element.style.opacity = originalOpacity;
            bottomFrame.position = originalTopPosition;
            bottomFrame.rotation.y = targetRotation.y;

            shiftFrames(direction);
            callback();
        });
        tweenOpacity.start();

    } else {
        var originalBottomPosition = bottomFrame.position.clone();
        var endPositionX = {
            x: topFrame.position.x - config.frameWidth * 1.8,
        };

        var tweenPositionX = new TWEEN.Tween(topFrame.position).to(endPositionX,
                                                                   frameTransitionDuration);
        tweenPositionX.start();

        var endPositionZA = {z: topFrame.position.z + config.frameWidth * 0.6};
        var tweenPositionZA = new TWEEN.Tween(topFrame.position).to(endPositionZA,
                                                                   frameTransitionDuration / 2);
        tweenPositionZA.easing(TWEEN.Easing.Quadratic.Out);

        var endPositionZB = {z: topFrame.position.z};
        var tweenPositionZB = new TWEEN.Tween(topFrame.position).to(endPositionZB,
                                                                    frameTransitionDuration / 2);
        tweenPositionZB.easing(TWEEN.Easing.Quadratic.In);

        tweenPositionZA.chain(tweenPositionZB);
        tweenPositionZA.start();

        var originalRotationY = topFrame.rotation.y;
        var targetRotation = {
            y: topFrame.rotation.y - Math.PI
        };

        var tweenRotation = new TWEEN.Tween(topFrame.rotation).to(targetRotation, frameTransitionDuration);
        tweenRotation.easing(TWEEN.Easing.Quadratic.Out);
        tweenRotation.start();

        var tweenOpacity = new TWEEN.Tween({value: originalOpacity}).to({value: 0}, frameTransitionDuration);
        tweenOpacity.easing(TWEEN.Easing.Quadratic.InOut);
        tweenOpacity.onUpdate(function () {
            topFrame.element.style.opacity = this.value;
        });
        tweenOpacity.onComplete(function () {
            tweenPositionX.stop();
            tweenPositionZA.stop();
            tweenPositionZB.stop();
            tweenRotation.stop();

            topFrame.element.style.opacity = originalOpacity;
            topFrame.position = originalBottomPosition;
            topFrame.rotation.y = originalRotationY;

            shiftFrames(direction);
            callback();
        });
        tweenOpacity.start();
    }
}

function changeFrameThaumatrope(direction, callback) {
    var targetRotation = {
        x: framesGroup.rotation.x - Math.PI * direction,
        y: framesGroup.rotation.y,
        z: framesGroup.rotation.z
    };

    var tweenRotation = new TWEEN.Tween(framesGroup.rotation);
    tweenRotation.to(targetRotation, frameTransitionDuration);
    tweenRotation.start().onComplete(function () {
        framesGroup.rotation.x += Math.PI * direction;

        shiftFrames(direction);
        relocateFrames(-1);

        callback();
    });
}

function changeFrameSequence(direction, callback) {
    var middle = Math.floor(frames.length / 2);
    var auxFrames = frames.slice(middle).concat(frames.slice(0, middle));
    moveOtherFrames(auxFrames, direction);
    moveFirstFrameFast(auxFrames, direction, callback);
}

function changeFrameStack(direction, callback) {
    moveOtherFrames(frames, direction);
    moveFirstFrameJump(frames, direction, callback);
}

function changeFrameLightbox(direction, callback) {
    moveOtherFrames(frames, direction);
    moveFirstFrameRotating(frames, direction, callback);
}

function changeFrameZoetrope(direction, callback) {
    var angle = 2 * Math.PI / frames.length;

    var targetRotation = {
        x: framesGroup.rotation.x,
        y: framesGroup.rotation.y - angle * direction,
        z: framesGroup.rotation.z
    };

    var tweenRotation = new TWEEN.Tween(framesGroup.rotation);
    tweenRotation.to(targetRotation, frameTransitionDuration);
    tweenRotation.start().onComplete(function () {
        framesGroup.rotation.y += angle * direction;

        shiftFrames(-direction);
        relocateFrames(-direction);

        callback();
    });
}

function changeFrame(direction) {
    if (changingLayout || changingFrames) {
        return;
    }

    changingFrames = true;

    // if (soundEnabled) {
    //     var audio = new Audio('sounds/paper2.wav');
    //     audio.play();
    // }

    var callback = function () {
        changingFrames = false;
    }

    if (currentLayout == layouts.zoetrope) {
        changeFrameZoetrope(direction, callback);
        return;
    }

    if (currentLayout == layouts.sequence) {
        changeFrameSequence(direction, callback);
        return;
    }

    if (currentLayout == layouts.stack) {
        changeFrameStack(direction, callback);
        return;
    }

    if (currentLayout == layouts.lightbox) {
        changeFrameLightbox(direction, callback);
        return;
    }

    if (currentLayout == layouts.thaumatrope) {
        changeFrameThaumatrope(direction, callback);
        return;
    }
}

function nextFrame() {
    changeFrame(1);
}

function prevFrame() {
    changeFrame(-1);
}

function addOpacity(sum) {
    changingOpacities = true;

    var opacity = parseFloat(frames[0].element.style.opacity) + sum;
    if ((sum < 0 && opacity >= 0.1) || (sum > 0 && opacity < 1)) {
        frames.forEach(function (frame) {
            frame.element.style.opacity = opacity;
        });
    }
    var value = (opacity - 0.1) / 0.9;
    ui.setPullValue('opacity', value);

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

function setRadius(value) {
    var radius = value * 150;

    frames.forEach(function (frame) {
        frame.element.style.borderRadius = radius + 'px';
    });
}

function lessVelocity() {
    if (frameTransitionDuration + 5 < config.maxDuration) {
        frameTransitionDuration += 5;
    } else {
        frameTransitionDuration = config.maxDuration;
    }

    var value = (config.maxDuration - frameTransitionDuration) / config.maxDuration;
    if (value < 0) {
        value = 0;
    }
    ui.setPullValue('next-frame', value);
    ui.setPullValue('next-frame-instant', value);
    ui.setPullValue('prev-frame', value);
    ui.setPullValue('prev-frame-instant', value);
}

function moreVelocity() {
    if (frameTransitionDuration - 5 > 0) {
        frameTransitionDuration -= 5;
    } else {
        frameTransitionDuration = 0;
    }

    var value = (config.maxDuration - frameTransitionDuration) / config.maxDuration;
    if (value < 0) {
        value = 0;
    }
    ui.setPullValue('next-frame', value);
    ui.setPullValue('next-frame-instant', value);
    ui.setPullValue('prev-frame', value);
    ui.setPullValue('prev-frame-instant', value);
}

function setVelocityProportional(value) {
    if (value == 1) {
        inSync = true;
        return;
    };
    inSync = false;
    var duration = config.maxDuration - (config.maxDuration * value);
    if (duration < frameRate) {
        duration = frameRate;
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

function clearFrames() {
    drawings.forEach(function (drawing) {
        drawing.erase();
    });
}

function calcFrameRate() {
    if(!lastCalledTime) {
        lastCalledTime = new Date().getTime();
        frameRate = 0;
        return;
    }
    var currentTime = new Date().getTime();
    frameRate = (currentTime - lastCalledTime);
    lastCalledTime = currentTime;
    if (inSync) {
        frameTransitionDuration = frameRate;
    }
}

function changeNumberOfFrames(number) {
    frames = allFrames.slice(0, number);
    otherFrames = allFrames.slice(number);

    frameStyleTarget = {
        opacity: 0.0
    };
    otherFrames.forEach(function (frame) {
        var tweenOpacity = new TWEEN.Tween(frame.element.style).to(frameStyleTarget, 200);
        tweenOpacity.easing(TWEEN.Easing.Quadratic.InOut);
        tweenOpacity.onComplete(function () {
            frame.element.style.display = 'none';
        });
        tweenOpacity.start();
    });
    frames.forEach(function (frame) {
        frame.element.style.display = 'block';
    });

    layouts.update(frames);
    updateLayout(function () {});
}

var frameCounter = 0;
function render() {
    requestAnimationFrame(render);

    checkEvents();
    calcFrameRate();
    frameCounter += 1;
    if (inSync) {
        if (frameCounter >= 4) {
            frameCounter = 0;
            TWEEN.update();
            renderer.render(scene, camera);
        }
    } else {
        TWEEN.update();
        renderer.render(scene, camera);
    }
}

function updateFramePulls(buttonName) {
    var names = ['next-frame', 'prev-frame',
                 'next-frame-instant', 'prev-frame-instant'];

    names.forEach(function (name) {
        if (name != buttonName) {
            ui.setPullValue(name, ui.pullValue(buttonName));
        };
    });
};

function checkEvents() {
    //controls.update();

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
    if (keyboard.pressed("5")) {
        changeLayout(layouts.thaumatrope, function () {});
        ui.setRadioActive("radio-layout", "thaumatrope");
    };
    if (ui.pressed("next-frame")) {
        setVelocityProportional(ui.pullValue("next-frame"));
        updateFramePulls('next-frame');
        nextFrame();
    };
    if (ui.pressed("prev-frame")) {
        setVelocityProportional(ui.pullValue("prev-frame"));
        updateFramePulls('prev-frame');
        prevFrame();
    };
    if (keyboard.pressed("s")) {
        nextFrame();
    };
    if (keyboard.pressed("a")) {
        prevFrame();
    };
    if (ui.pressed("next-frame-instant")) {
        setVelocityProportional(ui.pullValue("next-frame-instant"));
        updateFramePulls('next-frame-instant');
        nextFrameInstant();
    };
    if (ui.pressed("prev-frame-instant")) {
        setVelocityProportional(ui.pullValue("prev-frame-instant"));
        updateFramePulls('prev-frame-instant');
        prevFrameInstant();
    };
    if (keyboard.pressed("w")) {
        nextFrameInstant();
    };
    if (keyboard.pressed("q")) {
        prevFrameInstant();
    };
    if (ui.pressed("opacity")) {
        setOpacityProportional(ui.pullValue("opacity"));
    };
    if (ui.pressed("radius")) {
        setRadius(ui.pullValue("radius"));
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
    if (keyboard.pressed("m")) {
        clearFrames();
    };
    if (keyboard.pressed("r")) {
        addFrame();
    };
}

function createUi() {
    ui.init();

    var optionsLayout = [
        {"name": "sequence", 'text': "2", 'action': function () { changeLayout(layouts.sequence, function () {}) }, 'active': true},
        {"name": "stack", 'text': "3", 'action': function () { changeLayout(layouts.stack, function () {}) }},
        {"name": "thaumatrope", 'text': "5", 'action': function () { changeLayout(layouts.thaumatrope, function () {}) }},
        {"name": "lightbox", 'text': "4", 'action': function () { changeLayout(layouts.lightbox, function () {}) }},
        {"name": "zoetrope", 'text': "1", 'action': function () { changeLayout(layouts.zoetrope, function () {}) }}
    ];

    var radioLayout = ui.createRadioButtons("radio-layout", optionsLayout);

    ui.addRow([radioLayout]);

    function unSync() {
        inSync = false;
    }

    var pullPrevFrame = ui.createPullButton({"name": "prev-frame", "text": "a", "onRelease": unSync});
    var pullNextFrame = ui.createPullButton({"name": "next-frame", "text": "s", "onRelease": unSync});
    //    ui.addPullButton({"name": "prev-frame-instant", "text": "q", "onRelease": unSync});
    //    ui.addPullButton({"name": "next-frame-instant", "text": "w", "onRelease": unSync});

    ui.addRow([pullPrevFrame, pullNextFrame], 1);

    var optionsDraw = [
        {"name": "pencil", 'text': "b", 'action': setPencil},
        {"name": "eraser", 'text': "n", 'action': setEraser}
    ];
    var radioDraw = ui.createRadioButtons("radio-draw", optionsDraw);
    var buttonClear = ui.createConfirmButton({"name": "clear-draw", "text": "m",
                                              'action': function () { clearFrames() }});

    ui.addRow([radioDraw, buttonClear]);

    var pullOpacity = ui.createPullButton({"name": "opacity", "text": "o", "initial": 1});
    var pullRadius = ui.createPullButton({"name": "radius"});

    ui.addRow([pullOpacity, pullRadius]);

    var optionsNumberOfFrames = [
        {"name": "2", 'text': "2", 'action': function () { changeNumberOfFrames(2) }},
        {"name": "7", 'text': "7", 'action': function () { changeNumberOfFrames(7) }, 'active': true},
        {"name": "11", 'text': "11", 'action': function () { changeNumberOfFrames(11) }},
        {"name": "15", 'text': "15", 'action': function () { changeNumberOfFrames(15) }},
    ];

    var radioNumberOfFrames = ui.createRadioButtons("radio-number-of-frames", optionsNumberOfFrames);

    ui.addRow([radioNumberOfFrames]);

//    var buttonHelp = ui.createButton({"name": "help"});
//    ui.addRow([buttonHelp]);
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    controls.handleResize();
    ui.updateSize();
}

function initThreeJs () {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 350;

    projector = new THREE.Projector();

    controls = new THREE.TrackballControls(camera);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    keyboard = new THREEx.KeyboardState();
}

function main() {
    initThreeJs();
    currentLayout = layouts.sequence;
    createUi();
    createShadow();
    createFramesList(15);
    changeNumberOfFrames(7);
    render();
}

main();

});
