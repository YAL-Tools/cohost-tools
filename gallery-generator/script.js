(() => {
//
const findId = (id) => document.getElementById(id);
const _input = document.getElementById("in");
const _output = document.getElementById("out");
const _convert = document.getElementById("convert");
const _useClass = document.getElementById("useClass");
const _bg0 = document.getElementById("bg-0");
const _bg1 = document.getElementById("bg-1");
const _fg0 = document.getElementById("fg-0");
const _fg1 = document.getElementById("fg-1");
const _preview = document.getElementById("preview");
const _outPreview = document.getElementById("outPreview");
const clPrefix = "gal-";
function getCSS(styles) {
	let css = [];
	for (let name of Object.keys(styles)) {
		css.push(`.${clPrefix + name} {`)
		for (let line of styles[name]) {
			line = "    " + line.replace(":", ": ") + ";";
			css.push(line);
		}
		css.push(`}`);
	}
	return css.join("\n");
}
function syncCSS(styles) {
	let css = getCSS(styles);
	document.getElementById("css").value = css;
	document.getElementById("preview-css").innerHTML = css;
}

// https://stackoverflow.com/a/5499821/5578773
const escapeHTML_map = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};
function escapeHTML_mapper(tag) {
	return escapeHTML_map[tag] || tag;
}
function escapeHTML(snip) {
	return snip.replace(/[&<>]/g, escapeHTML_mapper);
}

function proc() {
	const inLines = _input.value.split("\n");
	const lbPrev = escapeHTML(document.getElementById("lb-prev").value);
	const lbNext = escapeHTML(document.getElementById("lb-next").value);
	//
	const bgPage = document.getElementById("bg-page").value;
	const fgPage = document.getElementById("fg-page").value;
	const styles = {
		outer: [
			"position:relative",
			"overflow:hidden",
			"background:" + bgPage,
			"color:" + fgPage,
		],
		nav: [
			"display:inline-block",
			// "z-index:100",
			"width:40px",
			"height:40px",
			"line-height:40px",
			"text-align:center",
			"border-radius:0.5rem",
		],
		enabled: [
			"background:" + _bg1.value,
			"color:" + _fg1.value,
		],
		disabled: [
			"background:" + _bg0.value,
			"color:" + _fg0.value,
		],
		clickable: [
			"user-select:none",
			"cursor:pointer",
			"pointer-events:all",
		],
		controls: [
			"text-align:right",
			"pointer-events:none",
		],
		next: [
			"margin:5px calc((50% - 40px) - 5px) 5px 5px",
		],
		prev: [
			"position:absolute",
			"left:calc(50% - 50px)",
			"margin:5px",
		],
		offsetWhenOpen: [
			"width:45px",
			"display:inline-block",
		],
		page: [
			"background:" + bgPage,
			"color:" + fgPage,
			"position:absolute",
			"inset:0",
		],
		ref: ["margin:0 auto"],
		img: [
			"margin:0 auto",
			"pointer-events:all",
		],
	};
	syncCSS(styles);
	//
	const rxURL = /^http[s]:\/\/.+$/;
	const rxTag = /^!\[(.*?)\]\((.*?)\)$/;
	const snippets = [];
	for (let line of inLines) {
		line = line.trim();
		if (line == "" || line.startsWith("#")) continue;
		let mt;
		
		if (mt = rxURL.exec(line)) {
			snippets.push(`<img src="${line}"/>`);
			continue;
		}
		if (mt = rxTag.exec(line)) {
			snippets.push(`<img alt="${mt[1]}" src="${mt[2]}"/>`);
			continue;
		}
		snippets.push(line);
	}
	
	let useClass = _useClass.checked;
	let cc = (_class) => {
		let args = _class.split(" ");
		if (useClass) return `class="${args.map((c) => clPrefix + c).join(" ")}"`;
		let lines = [];
		for (let name of args) lines = lines.concat(styles[name]);
		return `style="${lines.join(";")}"`;
	}
	
	let html = ``;
	for (let i = 0; i < snippets.length; i++) {
		let snippet = snippets[i];
		
		// add class to image:
		let imgClass = (i > 0 ? "img" : "ref");
		if (useClass) {
			let mt = /^(.+?\bclass=["']\/)(.+)/.exec(snippet);
			if (mt) {
				snippet = mt[1] + clPrefix + imgClass + mt[2];
			} else if (mt = /^(.*<img\b)(.+)/.exec(snippet)) {
				snippet = mt[1] + ` class="${clPrefix + imgClass}"` + mt[2];
			}
		} else {
			let mt = /^(.+?\bstyle=["']\/)(.+)/.exec(snippet);
			let imgCSS = styles[imgClass].join(";");
			if (mt) {
				snippet = mt[1] + imgCSS + ";" + mt[2];
			} else if (mt = /^(.*<img\b)(.+)/.exec(snippet)) {
				snippet = mt[1] + ` style="${imgCSS}"` + mt[2];
			}
		}
		
		if (i == 0) {
			html = `<div ${cc("outer")}>
${snippet}
<div ${cc("controls")}>
<div ${cc("nav prev disabled")}>${lbPrev}</div><!--next-->
</div></div>
`;
		} else html = html.replace("<!--next-->", `<details>
<summary ${cc("nav next clickable enabled")}>${lbNext}</summary><div ${cc("offsetWhenOpen")}></div>
<div ${cc("page")}>
${snippet}
<div ${cc("controls")}>
<div ${cc("nav prev enabled")}>${lbPrev}</div><!--next-->
</div></div></details>`);
	}
	html = html.replace("<!--next-->", `<div ${cc("nav next disabled")}>${lbNext}</div>`);
	_output.value = html;
	if (_preview.checked) _outPreview.innerHTML = html;
};

_convert.onclick = (e) => { proc() };
_useClass.onchange = (e) => { proc() };
_preview.onchange = (e) => { proc() };
_convert.onclick();

let roots = [document.querySelector("table#config")];
findId("save-settings").onclick = () => {
	let name = findId("preset-name").value;
	let obj = window.yalTools.serialize(roots, {
		resourceType: "https://yal.cc/tools/cohost/gallery-generator",
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
})();