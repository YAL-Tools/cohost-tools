(() => {
//
let findId = (id) => document.getElementById(id);
let tbOut = findId("out");
let tbOutCss = findId("out-css");
let elOut = findId("preview");
let propOverride = null;
function propValue(id) {
	if (propOverride) return propOverride[id];
	let el = findId(id);
	if (el.tagName == "INPUT" && el.type == "checkbox") return el.checked;
	return el.value;
}
function propLines(id) {
	let text;
	if (propOverride) {
		text = propOverride[id];
		if (Array.isArray(text)) text = text.join("\n");
	} else text = findId(id).value;
	text = text.trim();
	let lines = text.split("\n");
	lines = lines.map(line => {
		line = line.trim();
		if (line.endsWith(";")) line = line.substring(0, line.length - 1);
		return line;
	})
	lines = lines.filter(line => line != "");
	return lines;
}
// https://stackoverflow.com/a/9756789
function quoteattr(s, preserveCR) {
    preserveCR = preserveCR ? '&#13;' : '\n';
    return ('' + s) /* Forces the conversion to string. */
        .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
        .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        /*
        You may add other replacements here for HTML only 
        (but it's not necessary).
        Or for XML, only if the named entities are defined in its DTD.
        */ 
        .replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
        .replace(/[\r\n]/g, preserveCR);
        ;
}
function render(sep) {
	let img1 = propValue("img-1");
	let img2 = propValue("img-2");
	let alt1 = propValue("alt-1");
	let alt2 = propValue("alt-2");
	let alt1A = alt1 ? ' alt="' + quoteattr(alt1) + '"' : '';
	let alt2A = alt2 ? ' alt="' + quoteattr(alt2) + '"' : '';
	let imgWidth = propValue("width");
	let imgHeight = propValue("height");
	let imgWidthA = imgWidth ? ' width="' + imgWidth + '"' : '';
	let imgHeightA = imgWidth ? ' height="' + imgHeight + '"' : '';
	let imgSizeA = imgWidthA + imgHeightA;
	let dir = propValue("direction");
	let isLeft = dir == "left";
	let isRight = dir == "right";
	let isUp = dir == "up";
	let isDown = dir == "down";
	let isDir = dir != "";
	let isHor = isLeft || isRight;
	let isVert = isUp || isDown;
	
	let styles = {
		"reveal": [
			"position: relative",
		],
		"-one": [
			"width: 100%",
			"margin: 0",
		],
		"-two": [
			"width: 100%",
			"margin: 0",
			"position: absolute",
			"inset: 0",
		],
		"-round": [
			"position: absolute",
			"width: 2rem",
			"height: 2rem",
			"background: " + propValue("round-bg"),
			"color: " + propValue("round-fg"),
			"display: flex",
			"font-size: 1rem",
			"align-items: center",
			"justify-content: center",
		],
		"-summary": [
			"font-size: 0",
			"z-index: 1",
		],
		"-clickable": [
			"cursor: pointer",
			// you know, you are not supposed to use hand cursor for elements
			// that don't cause navigation, but then you can hardly tell whether
			// these are interactive as there's no unified UI design language on web
		],
		"-about": [
			"font-size: 0",
		],
		"-summary-span": [
			"font-size: 1rem",
		],
	};
	if (propValue("css-safety")) {
		styles["-one"].push(
			"max-width: 100%",
			"vertical-align: middle",
		);
		styles["-two"].push(
			"max-width: 100%",
			//"vertical-align: middle", // not needed because it's position: absolute anyway?
		);
	}
	
	// resize block + handle
	let sizeHTML = "";
	if (isDir) {
		sizeHTML = `<div class="reveal-overlay">
			<div class="reveal-overlay-bg">
				<div class="reveal-resize"></div>
				<div class="reveal-round reveal-handle">${isVert?"↕":"↔"}</div>
			</div>
		</div>`;
	}
	
	let aboutHTML = "";
	if (propValue("about-enable")) {
		let aboutLabel = propValue("about-label");
		let aboutPopupHTML = propValue("about-popup-html");
		styles["-about"] = styles["-about"].concat(propLines("about-css"));
		styles["-about-popup"] = propLines("about-popup-css");
		aboutHTML = `<details>
			<summary class="reveal-round reveal-clickable reveal-about"><span class="reveal-summary-span">${aboutLabel}</span></summary>
			<div class="reveal-about-popup">${aboutPopupHTML}</div>
		</details>`
	}
	
	let revealText = propValue("reveal-label");
	let html = `<div class="reveal">
		<img class="reveal-one" src="${img1}"${alt1A}${imgSizeA}/>
		${sizeHTML}<details>
			<img class="reveal-two" src="${img2}"${alt2A}${imgSizeA}/>
			<summary class="reveal-round reveal-clickable reveal-summary"><span class="reveal-summary-span">${revealText}</span></summary>
		</details>${aboutHTML}
	</div>`
	html = html.replace(/\n\t/g, "\n");
	
	styles["-round"] = styles["-round"].concat(propLines("round-css"));
	styles["-summary"] = styles["-summary"].concat(propLines("reveal-css"));
	if (isDir) {
		let front = isHor ? "width" : "height";
		let side = isHor ? "height" : "width";
		let overlay = [
			"position: absolute",
			"inset: 0",
			"display: flex",
			"pointer-events: none",
		];
		let bg = [
			`background-image: url(${img2})`,
			`background-size: ${isHor ? "auto 100%" : "100% auto"}`,
			`${side}: 100%`,
			"position: relative",
			`max-${front}: calc(100% - 1rem)`,
		];
		let resize = [
			`resize: ${isHor ? "horizontal" : "vertical"}`,
			"position: relative",
			"overflow: auto",
			`${front}: 1.25rem`,
			`max-${front}: 100%`,
			`min-${front}: 0`,
			"pointer-events: all",
		];
		let trsFront = "0.65rem";
		let trsSide = "0.15rem";
		let handle = [];
		if (isHor) {
			resize.push(
				"top: calc(50% - 1rem)",
				"height: 1.5rem",
			);
			handle.push("top: calc(50% - 1rem)");
			// ah, but handle could now be inside resize...
			if (isLeft) {
				overlay.push(
					"flex-direction: row-reverse"
				);
				bg.push(
					"background-position: top right"
				);
				resize.push(
					`transform: scale(-1, 1) translate(${trsFront}, ${trsSide})`
				);
				handle.push(
					"left: -1rem",
				);
			} else {
				resize.push(
					`transform: translate(${trsFront}, ${trsSide})`
				);
				handle.push(
					"right: -1rem",
				);
			} 
		} else {
			resize.push(
				"left: calc(50% - 1rem)",
				"width: 1.5rem",
			);
			handle.push("left: calc(50% - 1rem)");
			if (isUp) {
				overlay.push(
					"flex-direction: column-reverse"
				);
				bg.push(
					"background-position: bottom left"
				);
				resize.push(
					`transform: scale(1, -1) translate(${trsSide}, ${trsFront})`
				);
				handle.push(
					"top: -1rem",
				);
			} else {
				overlay.push(
					"flex-direction: column"
				);
				resize.push(
					`transform: translate(${trsSide}, ${trsFront})`
				);
				handle.push(
					"bottom: -1rem",
				);
			}
		}
		styles["-overlay"] = overlay;
		styles["-overlay-bg"] = bg;
		styles["-resize"] = resize;
		styles["-handle"] = handle;
	}
	
	styles = function(__styles) {
		let styles = {};
		for (let [key, val] of Object.entries(__styles)) {
			if (key.startsWith("-")) key = "reveal" + key;
			styles[key] = val;
		}
		return styles;
	}(styles);
	
	return yal_css_inline(html, styles, sep);
}
function proc() {
	elOut.innerHTML = render(false).html;
	let result = render(propValue("css-classes"));
	tbOut.value = result.html;
	tbOutCss.value = result.css;
}
proc();
findId("proc").onclick = () => proc();

let roots = [document.querySelector("table.props")];
findId("save-settings").onclick = () => {
	let name = findId("preset-name").value;
	let obj = window.yalTools.serialize(roots, {
		resourceType: "https://yal.cc/tools/cohost/reveal-generator",
		resourceVersion: "1.0",
		"preset-name": name,
	});
	window.yalTools.saveJSON(obj, name + ".json");
};
let loadInput = findId("load-settings");
let loadForm = findId("load-settings-form");
loadInput.onchange = () => {
	window.yalTools.loadJSON(loadInput, loadForm, roots, proc);
};

console.log("hello!");
//
})();