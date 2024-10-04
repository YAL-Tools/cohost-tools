import sys.Http;
import sys.io.File;
import haxe.io.Path;
import sys.FileSystem;
using StringTools;
class HttpHelper {
	public static var cacheDir = 'http-cache';
	public static function toFileName(s:String) {
		if (s.startsWith("https://")) {
			s = s.substring("https://".length);
		} else if (s.startsWith("http://")) {
			s = s.substring("http://".length);
		}
		if (s.endsWith("/")) {
			s = s.substring(0, s.length - 1);
		}
		//
		s = ~/[\/\\:\*\?<>\|\[\]]/g.map(s, function(rx:EReg) {
			var c = rx.matched(0);
			return switch (c) {
				case "[": "[lb]";
				case "]": "[rb]";
				case "<": "[lt]";
				case ">": "[gt]";
				case "/": "[s]";
				case "\\": "[bs]";
				case "|": "[pipe]";
				case ":": "[col]";
				case "*": "[star]";
				case "?": "[q]";
				default: "[" + c.charCodeAt(0) + "]";
			}
		});
		/* // very cool, except Haxe doesn't do unicode on Windows
		s = s.replace('?', '﹖');
		s = s.replace('/', '⁄');
		s = s.replace('\\', '⧵');
		s = s.replace(':', '﹕');
		s = s.replace('*', '⁎');
		s = s.replace('|', '⏐');
		s = s.replace('<', '＜');
		s = s.replace('>', '＞');
		*/
		return s;
	}
	public static function relLink(domain:String, path:String) {
		var protEnd = domain.indexOf("://");
		var domainEnd = domain.indexOf("/", protEnd >= 0 ? protEnd + 3 : 0);
		if (domainEnd < 0) {
			domain += "/";
			domainEnd = domain.length;
		} else {
			domain = domain.substring(0, domainEnd + 1);
		}
		if (path.startsWith("/")) {
			path = path.substring(1);
		}
		return domain + path;
	}
	public static function init() {
		if (!FileSystem.exists(cacheDir)) FileSystem.createDirectory(cacheDir);
	}
	public static var fromCache = false;
	public static function fetch(url:String) {
		var fname = toFileName(url) + ".html";
		var cachePath = Path.join([cacheDir, fname]);
		if (FileSystem.exists(cachePath)) {
			var html = File.getContent(cachePath);
			if (html != "") {
				fromCache = true;
				return html;
			}
		}
		fromCache = false;
		try {
			var html = Http.requestUrl(url);
			File.saveContent(cachePath, html);
			return html;
		} catch (e) {
			File.saveContent(cachePath, "");
			throw e;
		}
	}
}