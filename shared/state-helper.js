(function() {
//
function serialize(roots, base) {
	let obj = base ?? {};
	for (let root of roots) {
		for (let el of root.querySelectorAll(
			`input[id]:not([type="button"]), `+
			`textarea[id], select[id]`
		)) {
			if (el.nodeName == "TEXTAREA") {
				let lines = el.value.split("\n");
				obj[el.id] = lines;
			} else if (el.type == "checkbox") {
				obj[el.id] = el.checked;
			} else {
				obj[el.id] = el.value;
			}
		}
	}
	return obj;
}
function deserialize(obj, roots) {
	for (let fd of Object.keys(obj)) {
		let val = obj[fd];
		for (let root of roots) {
			let el = root.querySelector(`input#${fd}`);
			if (el) {
				if (el.type == "checkbox") {
					el.checked = val;
				} else {
					el.value = val;
				}
				break;
			}
			el = root.querySelector(`textarea#${fd}`);
			if (el) {
				if (Array.isArray(val)) val = val.join("\n");
				el.value = val;
				break;
			}
			el = root.querySelector(`select#${fd}`);
			if (el) {
				el.value = val;
				break;
			}
		}
	}
}
window.yalTools = {
	serialize,
	deserialize,
	saveJSON: (obj, filename) => {
		let blob = new Blob([JSON.stringify(obj, null, "\t")]);
		saveAs(blob, filename, "application/json");
	},
	loadJSON: (input, form, roots, then) => {
		for (let file of input.files) {
			let reader = new FileReader();
			reader.onload = function() {
				let text = reader.result;
				let obj;
				try {
					obj = JSON.parse(text);
				} catch (e) {
					alert("Invalid JSON!\n" + e);
					return;
				}
				deserialize(obj, roots);
				if (then) then();
			}
			reader.onloadend = () => { form.reset(); }
			reader.readAsText(file);
			break;
		}
	}
}
})();
