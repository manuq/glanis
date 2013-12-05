var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.CubeGeometry(1,1,0);
var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
var plane = new THREE.Mesh( geometry, material );
scene.add( plane );

camera.position.z = 5;

function render() {
    plane.rotation.x += 0.1;
    plane.rotation.y += 0.01;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();
