(function() {
//
let findId = (id) => document.getElementById(id);
let tbOut = findId("out");
let elOut = findId("preview");
let propOverride = null;
function propValue(id) {
	if (propOverride) return propOverride[id];
	return findId(id).value;
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
function render(title, text, asPreset) {
	let spacing = propValue("prop-outer-spacing");
	let lb = "\n";
	let outerCSS = propLines("prop-outer-css");
	if (asPreset) return `<div style="` + [
		"display:inline-flex",
		"padding:0 " + spacing,
		"background:" + propValue("prop-outer-bg"),
		"color:" + propValue("prop-outer-color"),
	].concat(outerCSS).join(";") + `">` + title + `</div>`;
	return `<details style="` + [
		"display:inline-flex",
		"padding:0 " + spacing,
		"background:" + propValue("prop-outer-bg"),
		"color:" + propValue("prop-outer-color"),
	].concat(outerCSS).join(";") + `"${lb}>`
		+ `<summary style="` + [
			"display:inline",
			"font-size:0",
			"cursor:default",
		].join(";") + `"${lb}>`
			+ `<span style="` + [
				"font-size:1rem"
			].concat(propLines("prop-title-css")).join(";") + `"${lb}>${title}</span>`
		+ `</summary${lb}>`
		+ `<div style="` + [
			"background:" + propValue("prop-inner-bg"),
			"color:" + propValue("prop-inner-color"),
			"margin-bottom:" + spacing,
		].concat(propLines("prop-inner-css")).join(";") + `"${lb}>${text}</div>`
	+ `</details>`;
}
function proc() {
	tbOut.value = render("TODO: TITLE", "TODO: TEXT");
	let wasOpen = elOut.querySelector("details")?.open;
	elOut.innerHTML = render("details-window",
		`For this trick to work, the "window" needs to be wide enough for text to wrap `+
		`- otherwise it will try to display inline and will kind of just poke out of the `+
		`text row and look awkward.`+
		`<p>And this is a paragraph element.</p>`+
		`You can add two line breaks around your content and use markup on cohost, `+
		`but you'll need to make the first and the last paragraph a &lt;div&gt; element `+
		`instead so that it doesn't pad out the header/footer.`
	);
	if (wasOpen) elOut.querySelector("details").open = true;;
}
proc();
findId("proc").onclick = () => proc();

let roots = [document.querySelector("table.props")];
findId("save-settings").onclick = () => {
	let name = findId("preset-name").value;
	let obj = window.yalTools.serialize(roots, {
		resourceType: "https://yal.cc/tools/cohost/inline-details-generator",
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

window.yalAddPreset = function(obj) {
	let tmp = document.createElement("div"); 
	propOverride = obj;
	tmp.innerHTML = render(obj["preset-name"], "", true);
	propOverride = null;
	let el = tmp.children[0];
	el.onclick = () => {
		window.yalTools.deserialize(obj, roots);
		proc();
	};
	let presets = findId("presets");
	presets.appendChild(el);
	presets.appendChild(document.createTextNode(" "));
}

console.log("hello!");
})();
