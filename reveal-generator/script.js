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
function render(sep) {
	let img1 = propValue("img-1");
	let img2 = propValue("img-2");
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
		],
		"-summary-span": [
			"font-size: 1rem",
		],
	};
	
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
		styles["-about"] = propLines("about-css");
		styles["-about-popup"] = propLines("about-popup-css");
		aboutHTML = `<details>
			<summary class="reveal-round reveal-clickable reveal-about">${aboutLabel}</summary>
			<div class="reveal-about-popup">${aboutPopupHTML}</div>
		</details>`
	}
	
	let revealText = propValue("reveal-label");
	let html = `<div class="reveal">
		<img class="reveal-one" src="${img1}"/>
		${sizeHTML}<details>
			<img class="reveal-two" src="${img2}"/>
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
			`max-${front}: calc(100% - 0.6em)`,
		];
		let resize = [
			`resize: ${isHor ? "horizontal" : "vertical"}`,
			`${side}: calc(50% + 0.5rem)`,
			"overflow: auto",
			`${front}: 1.5rem`,
			`max-${front}: 100%`,
			`min-${front}: 0`,
			"pointer-events: all",
		];
		let handle = [];
		if (isHor) {
			handle.push("top: calc(50% - 1em)");
			if (isLeft) {
				overlay.push(
					"flex-direction: row-reverse"
				);
				bg.push(
					"background-position: top right"
				);
				resize.push(
					"transform: scale(-1, 1)"
				);
				handle.push(
					"left: -0.75em",
				);
			} else {
				handle.push(
					"right: -0.75em",
				);
			} 
		} else {
			handle.push("left: calc(50% - 1em)");
			if (isUp) {
				overlay.push(
					"flex-direction: column-reverse"
				);
				bg.push(
					"background-position: bottom left"
				);
				resize.push(
					"transform: scale(1, -1)"
				);
				handle.push(
					"top: -0.75em",
				);
			} else {
				overlay.push(
					"flex-direction: column"
				);
				handle.push(
					"bottom: -0.75em",
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