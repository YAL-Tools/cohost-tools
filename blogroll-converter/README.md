# Cohost blogroll converter

## Building
1. Install [Haxe](https://haxe.org)
1. Download (Code ➜ Download ZIP) or check out this repository  
   Unzip if downloaded.
1. Open command prompt / terminal in the directory
1. `haxe build.hxml`

## Running
**Warning:** running the application will fetch a bunch of URLs from the spreadsheet. Take privacy precautions if necessary.

1. Open the [spreadsheet](https://docs.google.com/spreadsheets/d/1BCJ7PFpUEjaysOA4C77z9Ckdo0YbutPihTh7oimm2AA/edit?gid=0#gid=0).
1. Download the TSV file (menu:File ➜ Download ➜ Tab Separated Values)
1. Place the downloaded file in the directory  
   (should be called `Cohost blogroll - Websites.tsv`)
1. Open command prompt / terminal in the directory
1. `neko CohostBlogrollConverter.n`
1. Wait for program to complete!

Once complete, the program will \[re-]write
users.json (organized information with error messages)
and feedcord.json (valid feeds only).