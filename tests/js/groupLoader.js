requirejs.config({
    baseUrl: '../js/lib',
    paths: {
        app: '../app',
        tests: '../../tests/js',

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

requirejs(["tests/group"]);
