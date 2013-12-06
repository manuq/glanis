var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 350;

var renderer = new THREE.CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var keyboard = new THREEx.KeyboardState();

var frames;
var frameWidth = 312; // 300px width + 2*6px border
var frameHeight = 402; // 390px width + 2*6px border
var space = 60;
var currentLayout;
var currentTweens = [];

function createFrame(frameName) {
    var frameElem = document.createElement('div');
    frameElem.classList.add('frame');
    frameElem.classList.add(frameName);

    var frame = new THREE.CSS3DObject(frameElem);
    scene.add(frame);

    return frame;
}

function zeroFill(number, width)
{
    width -= number.toString().length;
    if (width > 0)
    {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
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

function sequenceLayout(callback) {
    stopCurrentTweens();
    currentLayout = arguments.callee;

    var curX = ((frameWidth * (frames.length - 0.5)) + (space * (frames.length - 1)))  / -2;
    for (var i=0; i<frames.length; i++) {
        var frame = frames[i];

        var targetPosition = {x: curX, y: 0, z: 0};
        var tweenPosition = new TWEEN.Tween(frame.position).to(targetPosition, 500);
        currentTweens.push(tweenPosition);
        tweenPosition.easing(TWEEN.Easing.Quadratic.InOut);
        tweenPosition.start();

        var targetStyle = {opacity: 1.0};
        var tweenOpacity = new TWEEN.Tween(frame.element.style).to(targetStyle, 2000);
        currentTweens.push(tweenOpacity);
        tweenOpacity.easing(TWEEN.Easing.Quadratic.InOut);
        tweenOpacity.start();

        curX += frameWidth + space;
    };

    var targetCameraPosition = {x: 0, y: 0, z: 1000};
    var tweenCameraPosition = new TWEEN.Tween(camera.position).to(targetCameraPosition, 2500);
    currentTweens.push(tweenCameraPosition);
    tweenCameraPosition.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraPosition.start();

    var targetCameraRotation = {x: 0, y: 0, z: 0};
    var tweenCameraRotation = new TWEEN.Tween(camera.rotation).to(targetCameraRotation, 2500);
    currentTweens.push(tweenCameraRotation);
    tweenCameraRotation.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraRotation.start().onComplete(callback);
}

function stackLayout(callback) {
    stopCurrentTweens();
    currentLayout = arguments.callee;

    var curZ = 0;
    for (var i=0; i<frames.length; i++) {
        var frame = frames[i];

        var targetPosition = {x: 0, y: 0, z: curZ};
        var tweenPosition = new TWEEN.Tween(frame.position).to(targetPosition, 500);
        currentTweens.push(tweenPosition);
        tweenPosition.easing(TWEEN.Easing.Quadratic.InOut);
        tweenPosition.start();

        var targetStyle = {opacity: 0.9};
        var tweenOpacity = new TWEEN.Tween(frame.element.style).to(targetStyle, 2000);
        currentTweens.push(tweenOpacity);
        tweenOpacity.easing(TWEEN.Easing.Quadratic.InOut);
        tweenOpacity.start();

        curZ -= space;
    };

    var targetCameraPosition = {x: 400, y: 250, z: 600};
    var tweenCameraPosition = new TWEEN.Tween(camera.position).to(targetCameraPosition, 2500);
    currentTweens.push(tweenCameraPosition);
    tweenCameraPosition.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraPosition.start().onComplete(callback);

    var targetCameraRotation = {x: -0.1, y: 0.5, z: 0};
    var tweenCameraRotation = new TWEEN.Tween(camera.rotation).to(targetCameraRotation, 2500);
    currentTweens.push(tweenCameraRotation);
    tweenCameraRotation.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraRotation.start();
}

function lightBoxLayout(callback) {
    stopCurrentTweens();
    currentLayout = arguments.callee;

    var curZ = 0;
    for (var i=0; i<frames.length; i++) {
        var frame = frames[i];

        var targetPosition = {x: 0, y: 0, z: curZ};
        var tweenPosition = new TWEEN.Tween(frame.position).to(targetPosition, 500);
        currentTweens.push(tweenPosition);
        tweenPosition.easing(TWEEN.Easing.Quadratic.InOut);
        tweenPosition.start();

        var targetStyle = {opacity: 0.6};
        var tweenOpacity = new TWEEN.Tween(frame.element.style).to(targetStyle, 2000);
        currentTweens.push(tweenOpacity);
        tweenOpacity.easing(TWEEN.Easing.Quadratic.InOut);
        tweenOpacity.start();

        curZ -= space / 10;
    };

    var targetCameraPosition = {x: 0, y: 0, z: 300};
    var tweenCameraPosition = new TWEEN.Tween(camera.position).to(targetCameraPosition, 2500);
    currentTweens.push(tweenCameraPosition);
    tweenCameraPosition.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraPosition.start();

    var targetCameraRotation = {x: 0, y: 0, z: 0};
    var tweenCameraRotation = new TWEEN.Tween(camera.rotation).to(targetCameraRotation, 2500);
    currentTweens.push(tweenCameraRotation);
    tweenCameraRotation.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraRotation.start().onComplete(callback);
}

function nextFrame() {
    var currentPositions = [];
    for (var i=0; i<frames.length; i++) {
        currentPositions.push(frames[i].position.clone());
    };

    frames[0].position = currentPositions[frames.length-1];
    for (var i=1; i<frames.length; i++) {
        frames[i].position = currentPositions[i-1];
    };
}

function render() {
    requestAnimationFrame(render);

    checkEvents();
    TWEEN.update();
    renderer.render(scene, camera);
}

function checkEvents() {
    if (keyboard.pressed("1") && currentLayout != sequenceLayout) {
        sequenceLayout(function () {});
    };
    if (keyboard.pressed("2") && currentLayout != stackLayout) {
        stackLayout(function () {});
    };
    if (keyboard.pressed("3") && currentLayout != lightBoxLayout) {
        lightBoxLayout(function () {});
    };
    if (keyboard.pressed("s")) {
        nextFrame();
    };
}

function main() {
    frames = createFramesList(7);
    sequenceLayout(function () {});
    render();
}

main();
