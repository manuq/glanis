define(["domReady!", "three", "CSS3DRenderer"],
function(doc, THREE) {

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1000;

    var renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var groupElem = document.createElement('div');
    var groupObj = new THREE.CSS3DObject(groupElem);
    window.groupObj = groupObj;
    scene.add(groupObj);

    var elem1 = document.createElement('div');
    elem1.style.width = "300px";
    elem1.style.height = "300px";
    elem1.style.backgroundColor = "#0ff";

    var obj1 = new THREE.CSS3DObject(elem1);
    obj1.position.x = -200;
    obj1.rotation.y = Math.PI / 2;
    groupObj.add(obj1);

    var elem2 = document.createElement('div');
    elem2.style.width = "300px";
    elem2.style.height = "300px";
    elem2.style.backgroundColor = "#f0f";

    var obj2 = new THREE.CSS3DObject(elem2);
    obj2.position.x = 200;
    obj2.rotation.y = Math.PI / 2;
    groupObj.add(obj2);

    function render() {
        requestAnimationFrame(render);
        groupObj.rotation.x += 0.01;
        groupObj.rotation.y += 0.1;
        renderer.render(scene, camera);
    }

    render();
});
