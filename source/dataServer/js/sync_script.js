"use strict";

if (!('$NS$' in window)) throw 'no $NS$ in global';

console.clear();
console.log('༺ synchazard ༻');
console.log('powered by ᚗᚌ');

// (function () {
//     var o = 0;
//     (function x() {
//         document.body.style.opacity = o;
//         if (o < 1) {
//             o += 0.01
//             setTimeout(x, 5);
//         }
//     })();
// })();


// $NS$.utils.injectTester(function () {
//     var test = $NS$.utils.test,
//         d = new Date,
//         now = [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
//     test.assert(function () {
//             return [].slice.call(document.getElementsByTagName('a'), 0).length == 2;
//         },
//         "not enough anchors"
//     ).assert(function () {
//             var graph = document.getElementById('graph');
//             return graph.children.item(0).tagName.match(/CANVAS/i);
//         },
//         "canvas is not there"
//     ).report(
//         function () {
//             document.title = `PASSED on ${now}`;
//             $NS$.send({
//                 ___ACTION: 'test',
//                 ___RESULT: 'passed',
//                 ___CLIENT: navigator.userAgent
//             });
//         },
//         function (e) {
//             document.title = `FAILED on ${now}`;
//             console.log(e.join("\n"));
//             $NS$.send({
//                 ___ACTION: 'test',
//                 ___RESULT: 'failed',
//                 ___ERROR: e.join("\n "),
//                 ___CLIENT: navigator.userAgent
//             });
//         }
//     );
// });

// $NS$.utils.loadScript('/js/sound.js', function () {
//     synth(
//         2E3,   // number or mods
//         10E3, // whole duration (ms)
//         100,  // min Hz
//         500  // max Hz
//              // sine|square|triangle
//     );
// });

// document.location.href = 'https://www.google.com';

// document.body.innerHTML = 'HOW DO YOU FEEL?';
