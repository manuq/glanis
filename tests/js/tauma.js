define(["domReady!", "three",
        "app/drawing",
        "CSS3DRenderer"],
function(doc, THREE, Drawing) {

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 500;

    var projector = new THREE.Projector();

    var renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var groupObj = new THREE.Object3D();
    scene.add(groupObj);

    var frameElemA = document.createElement('canvas');
    frameElemA.width = 350;
    frameElemA.height = 350;
    frameElemA.classList.add('frame');
    frameElemA.classList.add('circular');

    var frameA = new THREE.CSS3DObject(frameElemA);

    var drawingA = new Drawing(frameElemA, frameA, camera, projector);
    drawingA.load('../images/test/tauma-a.png');

    frameA.position.z = 0.1;

    groupObj.add(frameA);

    var frameElemB = document.createElement('canvas');
    frameElemB.width = 350;
    frameElemB.height = 350;
    frameElemB.classList.add('frame');
    frameElemB.classList.add('circular');

    var frameB = new THREE.CSS3DObject(frameElemB);

    var drawingB = new Drawing(frameElemB, frameB, camera, projector);
    drawingB.load('../images/test/tauma-b.png');

    frameB.position.z = -0.1;
    frameB.rotation.x = Math.PI;

    groupObj.add(frameB);

    var vel = 0.01;

    function render() {
        requestAnimationFrame(render);
        groupObj.rotation.x += vel;
        if (vel > Math.PI) {
            groupObj.rotation.x = 0;
            vel = Math.PI;
        } else {
            vel += 0.003;
        };
        renderer.render(scene, camera);
    }

    render();
});
