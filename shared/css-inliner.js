function yal_css_inline(html, styles, sep) {
	const rx = /(\bclass=")(.+?)"(?:(\s*style=")(.+?)")?/g;
	const rxClass = /(\S+)/g;
	const rxProp = /^(.+?):\s*(.*)/;
	const rxImportant = /!important\s*$/;
	if (!sep) html = html.replace(rx, function(full, classPre, classVal, stylePre, styleVal) {
		let classList = [];
		classVal.replace(rxClass, function(full_cl, cl) {
			classList.push(cl);
			return full_cl;
		});
		let styleDefs = [];
		for (let className of classList) {
			let classDefs = styles[className];
			if (!classDefs) {
				console.error(`Can't find class "${className}" in "${full}"`)
				continue;
			}
			if (!Array.isArray(classDefs)) classDefs = [classDefs];
			for (def of classDefs) {
				if (def.endsWith(";")) def = def.substring(0, def.length - 1);
				let mt = rxProp.exec(def);
				let prop = mt[1];
				let propVal = mt[2];
				for (let k = 0; k < styleDefs.length; k++) {
					let sd = styleDefs[k];
					if (rxProp.exec(sd)[1] != prop) continue;
					if (rxImportant.test(def) || !rxImportant.test(sd)) {
						styleDefs.splice(k, 1);
						break;
					}
				}
				styleDefs.push(prop + ":" + propVal);
			}
		}
		if (styleDefs.length == 0) {
			if (!styleVal) styleVal = "";
		} else if (styleVal) {
			styleVal = styleDefs.join(";") + ";" + styleVal;
		} else {
			styleVal = styleDefs.join(";");
		}
		if (stylePre) {
			return stylePre.trimStart() + styleVal + '"';
		} else {
			return `style="${styleVal}"`
		}
	});
	let css = "";
	if (sep) {
		let cssLines = [];
		for (let [className, classDefs] of Object.entries(styles)) {
			cssLines.push(`.${className} {`);
			for (let def of classDefs) cssLines.push(`\t${def};`);
			cssLines.push("}");
		}
		css = cssLines.join("\n");
	}
	return {html,css};
}
