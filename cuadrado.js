var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.CSS3DRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var element = document.createElement( 'div' );
element.style.width = '100px';
element.style.height = '100px';
element.style.background = "#ffff00";

var plane = new THREE.CSS3DObject( element );
scene.add( plane );

camera.position.z = 350;

function render() {
    plane.rotation.x += 0.1;
    plane.rotation.y += 0.01;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();
