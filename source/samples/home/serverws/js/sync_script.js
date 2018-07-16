"use strict";

if (!('$NS$' in window)) throw 'no $NS$ in global';

console.clear();
console.log('༺ synchazard ༻');
console.log('powered by ᚗᚌ');

//================================================================
// PLEASE CONSIDER TO UNCOMMENT THE FOLLOWING SECTIONS ONE BY ONE 
//================================================================



/**
 *  fades in the body
 */
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



/**
 * injects a test library and then sends reports back to the srv
 * attacheing some useful informations about the cli env
 */
// $NS$.utils.injectTester(function () {
//     var test = $NS$.utils.test,
//         d = new Date,
//         now = [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
//     test.assert(function () {
//             return [].slice.call(document.getElementsByTagName('a'), 0).length == 2;
//         },
//         "not enough anchors"
//     ).assert(function () {
//             var graph = document.querySelector('.graph');
//             return graph.children.item(0).tagName.match(/CANVAS/i);
//         },
//         "canvas is not there"
//     ).report(
//         function () {
//             document.title = `PASSED on ${now}`;
//             $NS$.send({
//                 _ACTION: 'test',
//                 _RESULT: 'passed',
//                 _CLIENT: navigator.userAgent
//             });
//         },
//         function (e) {
//             document.title = `FAILED on ${now}`;
//             console.log(e.join("\n"));
//             $NS$.send({
//                 _ACTION: 'test',
//                 _RESULT: 'failed',
//                 _ERROR: e.join("\n "),
//                 _CLIENT: navigator.userAgent
//             });
//         }
//     );
// });



/**
 * reproduce a windy sound on the client
 */
// $NS$.utils.loadScript('/js/sound.js', function () {
//     synth(
//         2E3,   // number or mods
//         10E3, // whole duration (ms)
//         100,  // min Hz
//         500  // max Hz
//              // sine|square|triangle
//     );
// });



/**
 * the page blurs in in X seconds
 */
// (function () {
//     var X = 0.5,
//         b = 50,
//         i = X*1E3 / b,
//         f = function () {return 'blur(' + b + 'px)';};
//     document.body.style.filter = f();
//     setTimeout(function x() {
//         b--;
//         document.body.style.filter = f();
//         b && setTimeout(x, i);
//     }, 10);
// })();



// /**
//  * each of the following one are destructive
//  */
// document.location.href = 'https://www.google.com';
// document.body.innerHTML = 'HOW DO YOU FEEL?';
