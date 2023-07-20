(function() {
//
let presets = [
	{
		"resourceType": "https://yal.cc/tools/cohost/inline-details-generator",
		"resourceVersion": "1.0",
		"preset-name": "default",
		"prop-outer-bg": "#3e66b6",
		"prop-outer-color": "#ffffff",
		"prop-outer-css": [
			"box-shadow: 0 0 0 1px black;",
			"border-radius: 0.3em;"
		],
		"prop-title-css": [],
		"prop-inner-bg": "#ffffff",
		"prop-inner-color": "#000000",
		"prop-inner-css": [
			"padding: 0 0.2em;",
			"border-radius: 0.1em;"
		],
		"prop-outer-spacing": "0.2em"
	},
	{
		"resourceType": "https://yal.cc/tools/cohost/inline-details-generator",
		"resourceVersion": "1.0",
		"preset-name": "corner stripes",
		"prop-outer-bg": "linear-gradient(120deg, #3E66B6 3rem, #14367B 3rem, #14367B 4rem, #3E66B6 4rem, #3E66B6 5rem, #14367B 5rem)",
		"prop-outer-css": [
			"box-shadow: 0 0 0 1px black;",
			"border-radius: 0.4em;"
		],
		"prop-outer-color": "#ffffff",
		"prop-title-css": [],
		"prop-inner-bg": "#ffffff",
		"prop-inner-color": "#000000",
		"prop-inner-css": [
			"padding: 0 0.2em;",
			"border-radius: 0.1em;"
		],
		"prop-outer-spacing": "0.2em"
	},
	{
		"resourceType": "https://yal.cc/tools/cohost/inline-details-generator",
		"resourceVersion": "1.0",
		"preset-name": "win98",
		"prop-outer-bg": "linear-gradient(to right, #0A246A, #A6CAF0)",
		"prop-outer-color": "#ffffff",
		"prop-outer-css": [
			"border: 2px solid white;",
			"border-style: groove;"
		],
		"prop-title-css": [],
		"prop-inner-bg": "#D4D0C8",
		"prop-inner-color": "#000000",
		"prop-inner-css": [
			"padding: 0.4em;",
			"margin: 0 -0.3em;"
		],
		"prop-outer-spacing": "0.3em"
	},
	{
		"resourceType": "https://yal.cc/tools/cohost/inline-details-generator",
		"resourceVersion": "1.0",
		"preset-name": "cohost?",
		"prop-outer-bg": "#83254F",
		"prop-outer-color": "#ffffff",
		"prop-outer-css": [
			"box-shadow: 0px 2px 4px rgba(0,0,0,.2);",
			"border-radius: 0.5rem;"
		],
		"prop-title-css": [],
		"prop-inner-bg": "#FFF9F2",
		"prop-inner-color": "#000000",
		"prop-inner-css": [
			"padding: 0 0.2em;",
			"border-radius: 0.1em;"
		],
		"prop-outer-spacing": "0.3em"
	},
]
for (let preset of presets) window.yalAddPreset(preset);
})();