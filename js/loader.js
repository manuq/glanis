requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    },
    shim: {
        'three': {
            exports: 'THREE'
        },
        'CSS3DRenderer': {
            deps: ['three'],
            exports: 'THREE.CSS3DRenderer'
        },
        'TrackballControls': {
            deps: ['three'],
            exports: 'THREE.TrackballControls'
        },
        'tween': {
            exports: 'TWEEN'
        },
        'paper': {
            exports: 'paper'
        },
    }
});

requirejs(["app/main"]);
