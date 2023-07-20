(() => {
//
const _input = document.getElementById("in");
const _output = document.getElementById("out");
const _convert = document.getElementById("convert");
const _useClass = document.getElementById("useClass");
const _preview = document.getElementById("preview");
const _outPreview = document.getElementById("outPreview");
const styles = {
	outer: [
		"position:relative",
		"overflow:hidden",
	],
	nav: [
		"display:inline-block",
		"z-index:100",
		"width:40px",
		"height:40px",
		"line-height:40px",
		"text-align:center",
		"color:rgb(var(--color-text))",
		"border-radius:0.5rem",
	],
	enabled: [
		"background:rgb(var(--color-foreground-600))"
	],
	disabled: [
		"background:rgb(var(--color-secondary-200))"
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
		"width:50px",
		"display:inline-block",
	],
	page: [
		"background:white",
		"position:absolute",
		"inset:0",
	],
	ref: ["margin:0 auto"],
	img: [
		"margin:0 auto",
		"pointer-events:all",
	],
};
const clPrefix = "gal-";
function getCSS() {
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
(function() {
	let css = getCSS();
	document.getElementById("css").value = css;
	document.getElementById("preview-css").innerHTML = css;
})();

function proc() {
	const inLines = _input.value.split("\n");
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
<div ${cc("nav prev disabled")}>&lt;</div>
<!--next-->
</div></div>
`;
		} else html = html.replace("<!--next-->", `<details>
<summary ${cc("nav next clickable enabled")}>&gt;</summary>
<div ${cc("offsetWhenOpen")}></div>
<div ${cc("page")}>
${snippet}
<div ${cc("controls")}>
<div ${cc("nav prev enabled")}>&lt;</div>
<!--next-->
</div></div></details>`);
	}
	html = html.replace("<!--next-->", `<div ${cc("nav next disabled")}>&gt;</div>`);
	_output.value = html;
	if (_preview.checked) _outPreview.innerHTML = html;
};

_convert.onclick = (e) => { proc() };
_useClass.onchange = (e) => { proc() };
_preview.onchange = (e) => { proc() };
_convert.onclick();
})();