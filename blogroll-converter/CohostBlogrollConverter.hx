import haxe.Json;
import sys.Http;
import sys.io.File;

class CohostBlogrollConverter {
	static function main() {
		Sys.println("Hello!");
		var tsvPath = "Cohost blogroll - Websites.tsv";
		var tsv = try {
			File.getContent(tsvPath);
		} catch (e) {
			trace('Failed to open "$tsvPath"');
			return;
		}
		tsv = StringTools.replace(tsv, "\r", "");
		//
		var startMark = "Username\t";
		var start = tsv.indexOf(startMark);
		if (start < 0) {
			trace('Can\'t see "$startMark" in there');
			return;
		}
		start = tsv.indexOf("\n", start);
		tsv = tsv.substring(start + 1);
		//
		var rows = tsv.split("\n");
		var fetchCount = 0;
		var items:Array<CohostBlogrollItem> = [];
		for (row in rows) {
			var cols = row.split("\t");
			var col = 0;
			var next = () -> cols[col++];
			//
			var username = next();
			var name = next();
			var url = next();
			var notes = next();
			var feed = next();
			var button = next();
			var shouldHaveFeed = false;
			switch (feed) {
				case "", "soon": feed = null;
				case "Y": {
					shouldHaveFeed = true;
					feed = null;
				}
			}
			var item:CohostBlogrollItem = {
				name: name,
				username: username,
				url: url,
				notes: notes,
				feed: feed,
				button: button,
			};
			if (shouldHaveFeed) item.shouldHaveFeed = true;
			items.push(item);
			//
			if (feed == null) fetchCount += 1;
		}
		Sys.println('$fetchCount website(s) may need their feeds looked up');
		//
		var rss:EReg, rssHREF:EReg; {
			var some = "[^>]+";
			var sp = '\\s*';
			var equ = sp + "=" + sp;
			var q = '["\']';
			var qq = q + '?';
			rss = new EReg("<link\\b" + some
				+ "type" + equ
				+ qq + 'application/(?:rss|atom)\\+xml' + qq
				+ some
			+ ">", "");
			rssHREF = new EReg("\\b"
				+ "href" + equ
				+ "(?:"
					+ q + "(.+?)" + q
				+ "|"
					+ "(\\S+)"
				+ ")"
			, "");
		}
		//
		var fetchIndex = 0;
		var newFetches = 0;
		HttpHelper.init();
		var feeds = [];
		var errors = [];
		var brokenPromises = [];
		for (item in items) {
			if (item.feed != null) {
				feeds.push(item.feed);
				continue;
			}
			//
			var url = item.url;
			fetchIndex += 1;
			Sys.print('[$fetchIndex/$fetchCount] $url -> ');
			//
			try {
				var html = HttpHelper.fetch(url);
				if (HttpHelper.fromCache) {
					Sys.print('[cached] ');
				} else newFetches += 1;
				if (html == '') throw 'Previous fetch failed';
				//
				if (!rss.match(html)) throw 'URL contains no RSS/Atom <link>';
				var link = rss.matched(0);
				//
				if (!rssHREF.match(link)) throw '$link contains no HREF..?';
				var href = rssHREF.matched(1);
				if (href == null) href = rssHREF.matched(2);
				if (href.indexOf("://") < 0) {
					href = HttpHelper.relLink(url, href);
				}
				//
				feeds.push(href);
				item.feed = href;
				Sys.println(href);
			} catch (e) {
				errors.push(url + ': ' + e.message);
				/*errors.push({
					url: url,
					error: e,
				});*/
				Sys.println('[error] ' + e.message);
				item.error = e.message;
			}
			if (item.shouldHaveFeed && item.feed == null) {
				brokenPromises.push('"${item.url}": ' + item.error);
			}
			//Sys.getChar(false);
		}
		Sys.println('New fetches: $newFetches');
		brokenPromises.unshift("The following were marked as containing feeds, but we couldn't find them:");
		if (brokenPromises.length == 1) {
			brokenPromises.push("(no entries! All's well!)");
		}
		if (errors.length == 0) errors.push("(no errors!)");
		//
		var fcRoot = {
			Instances: [{
				Id: "Eggbug Blog Feed",
				Username: "Egghead",
				RssUrls: feeds,
			}]
		};
		File.saveContent("users.json", Json.stringify(items, null, "\t"));
		File.saveContent("feedcord.json", Json.stringify(fcRoot, null, "  "));
		File.saveContent("errors.txt", errors.join("\r\n"));
		File.saveContent("broken-promises.txt", brokenPromises.join("\r\n"));
		Sys.println("Updated users.json, feedcord.json, errors.txt, broken-promises.txt");
		Sys.println("Bye!");
	} // main
}
typedef CohostBlogrollItem = {
	name:String,
	username:String,
	url:String,
	notes:String,
	feed:String,
	button:String,
	?error:String,
	?shouldHaveFeed:Bool,
};
