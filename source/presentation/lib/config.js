Reveal.initialize({
	controls: true,
	progress: true,
	history: true,
	center: true,
	transition : 'concave',
	backgroundTransition: 'convex',
	// parallaxBackgroundSize : '200vw 100vh',
	// parallaxBackgroundHorizontal: 10,

	// Optional reveal.js plugins
	dependencies: [
		{
			src: 'lib/reveal.js-master/lib/js/classList.js',
			condition: function() {return !document.body.classList;} 
		},
		{
			src: 'lib/reveal.js-master/plugin/markdown/marked.js',
			condition: function() {return !!document.querySelector('[data-markdown]');}
		},
		{
			src: 'lib/reveal.js-master/plugin/markdown/markdown.js', 
			condition: function() {return !!document.querySelector('[data-markdown]');}
		},
		{
			src: 'lib/reveal.js-master/plugin/highlight/highlight.js',
			async: true, callback: function() { hljs.initHighlightingOnLoad(); }
		},
		{
			src: 'lib/reveal.js-master/plugin/zoom-js/zoom.js',
			async: true
		},
		{
			src: 'lib/reveal.js-master/plugin/notes/notes.js',
			async: true
		}
	]
});

