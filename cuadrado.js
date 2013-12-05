var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 350;

var renderer = new THREE.CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var frames;
var frameWidth = 100;
var frameHeight = 130;
var space = 20;

function createFrame() {
    var frameElem = document.createElement('div');
    frameElem.classList.add('frame');

    var frame = new THREE.CSS3DObject(frameElem);
    scene.add(frame);

    return frame;
}

function createFramesList(amount) {
    var frames = [];

    for (var i=0; i<amount; i++) {
        var frame = createFrame();
        frames.push(frame);
    };

    return frames;
}


function sequenceLayout(callback) {
    var curX = ((frameWidth * (frames.length - 0.5)) + (space * (frames.length - 1)))  / -2;
    for (var i=0; i<frames.length; i++) {
        var frame = frames[i];

        var targetPosition = {x: curX, y: 0, z: 0};
        var tweenPosition = new TWEEN.Tween(frame.position).to(targetPosition, 500);
        tweenPosition.easing(TWEEN.Easing.Quadratic.InOut);
        tweenPosition.start();

        var targetStyle = {opacity: 0.8};
        var tweenOpacity = new TWEEN.Tween(frame.element.style).to(targetStyle, 2000);
        tweenOpacity.easing(TWEEN.Easing.Quadratic.InOut);
        tweenOpacity.start();

        curX += frameWidth + space;
    };

    var targetCameraPosition = {x: 0, y: 0, z: 350};
    var tweenCameraPosition = new TWEEN.Tween(camera.position).to(targetCameraPosition, 2500);
    tweenCameraPosition.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraPosition.start().onComplete(callback);
}

function stackLayout(callback) {
    var curZ = 0;
    for (var i=0; i<frames.length; i++) {
        var frame = frames[i];

        var targetPosition = {x: 0, y: 0, z: curZ};
        var tweenPosition = new TWEEN.Tween(frame.position).to(targetPosition, 500);
        tweenPosition.easing(TWEEN.Easing.Quadratic.InOut);
        tweenPosition.start();

        var targetStyle = {opacity: 0.2};
        var tweenOpacity = new TWEEN.Tween(frame.element.style).to(targetStyle, 2000);
        tweenOpacity.easing(TWEEN.Easing.Quadratic.InOut);
        tweenOpacity.start();

        curZ -= space / 10;
    };

    var targetCameraPosition = {x: 0, y: 0, z: 100};
    var tweenCameraPosition = new TWEEN.Tween(camera.position).to(targetCameraPosition, 2500);
    tweenCameraPosition.easing(TWEEN.Easing.Quadratic.InOut);
    tweenCameraPosition.start().onComplete(callback);
}

function render() {
    requestAnimationFrame(render);

    TWEEN.update();

    renderer.render(scene, camera);
}

function main() {
    frames = createFramesList(7);
//    sequenceLayout(function () {stackLayout()});
    stackLayout(function () {sequenceLayout()});
    render();
}

main();
