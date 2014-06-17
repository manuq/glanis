define([], function() {
    tutorialScript = [
        ['say', 'hola mundo?'],
        ['pressRadio', 'radio-layout', 'sequence'],
        ['pressRadio', 'radio-number-of-frames', '7'],
        ['wait', 3000],
        ['press', 'next-frame'],
        ['drag', 'next-frame', 0.3],
        ['wait', 3000],
        ['release', 'next-frame'],
        ['wait', 800],
        ['press', 'prev-frame'],
        ['drag', 'prev-frame', 0.3],
        ['wait', 3000],
        ['release', 'prev-frame'],
        ['wait', 800],
        ['press', 'next-frame'],
        ['drag', 'next-frame', 0.3],
        ['wait', 2000],
        ['drag', 'next-frame', 0.3, 0.9, 10000],
        ['wait', 1000],
        ['drag', 'next-frame', 0.9, 1.0, 2000],
        ['wait', 5000],
        ['drag', 'next-frame', 1.0, 0.3, 5000],
        ['release', 'next-frame'],
        ['wait', 3000],
        ['pressRadio', 'radio-layout', 'zoetrope'],
        ['wait', 3000],
        ['press', 'next-frame'],
        ['drag', 'next-frame', 0.1, 1.0, 10000],
        ['wait', 5000],
        ['drag', 'next-frame', 1.0, 0.1, 2000],
        ['release', 'next-frame'],
        ['wait', 3000],
        ['pressRadio', 'radio-layout', 'stack'],
        ['wait', 3000],
        ['press', 'next-frame'],
        ['drag', 'next-frame', 0.3, 0.6, 2000],
        ['wait', 3000],
        ['drag', 'next-frame', 0.6, 0.3, 800],
        ['release', 'next-frame'],
        ['wait', 800],
        ['press', 'opacity'],
        ['drag', 'opacity', 1.0, 0.1, 2000],
        ['drag', 'opacity', 0.1, 0.8, 2000],
        ['drag', 'opacity', 0.8, 0.1, 2000],
        ['release', 'opacity'],
        ['wait', 800],
        ['press', 'next-frame'],
        ['drag', 'next-frame', 0.3, 0.9, 2000],
        ['wait', 10000],
        ['release', 'next-frame'],
        ['wait', 1000],
        ['pressRadio', 'radio-layout', 'lightbox'],
        ['wait', 3000],
        ['press', 'next-frame'],
        ['drag', 'next-frame', 0.3],
        ['wait', 1500],
        ['release', 'next-frame'],
        ['wait', 2000],
        ['press', 'prev-frame'],
        ['drag', 'prev-frame', 0.3],
        ['wait', 1500],
        ['release', 'prev-frame'],
    ];

    return tutorialScript;
});
