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
        'THREEx.KeyboardState': {
            deps: ['three'],
            exports: 'THREEx'
        },
        'tween': {
            exports: 'TWEEN'
        },
    }
});

requirejs(["app/main"]);
