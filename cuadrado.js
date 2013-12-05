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


function sequenceLayout() {
    var curX = ((frameWidth * (frames.length - 0.5)) + (space * (frames.length - 1)))  / -2;
    for (var i=0; i<frames.length; i++) {
        frames[i].position.x = curX;
        frames[i].position.y = 0;
        frames[i].position.z = 0;
        frames[i].position.z = 0;
        frames[i].element.style.opacity = 0.8;

        curX += frameWidth + space;
    };

    camera.position.z = 350;
}

function stackLayout() {
    var curZ = 0;
    for (var i=0; i<frames.length; i++) {
        frames[i].position.x = 0;
        frames[i].position.y = 0;
        frames[i].position.z = curZ;
        frames[i].element.style.opacity = 0.2;

        curZ -= space / 10;
    };

    camera.position.z = 100;
}

function render() {
    requestAnimationFrame(render);

    // Update objects here

    renderer.render(scene, camera);
}

function main() {
    frames = createFramesList(7);
    sequenceLayout();
//    stackLayout();
    render();
}

main();
