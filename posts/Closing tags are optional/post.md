## Closing tags are optional

(I regret to inform that)

Call this one HTML Crimes if you might.

In HTML, [some elements](https://developer.mozilla.org/en-US/docs/Glossary/Void_element) cannot have children - for example, you _can_ write

```
<img src="https://cohost.org/static/de31eb962de32ee6933f.svg">text</img>
```
but this won't do much - the text will just "fall out" of the tag.

<div style="border-left: 0.25em solid var(--tw-prose-quote-borders); padding-left: 1em;">
  <img src="https://cohost.org/static/de31eb962de32ee6933f.svg">text</img>
</div>

Some elements cannot contain specific other elements and will auto-close if followed by them (["tag omisssion](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p)) - for example, you can't nest paragraph tags, so

```
<p>One
<p>Two
<p>Three
</p>
```
has the same effect as closing each paragraph before opening a new one:

<div style="border-left: 0.25em solid var(--tw-prose-quote-borders); padding-left: 1em;">
  <p>One
  <p>Two
  <p>Three
</p>
</div>

Same goes for list items, which is handy:
```
<ol>
<li>One
<li>Two
<li>Three</li>
</ol>
```

<div style="border-left: 0.25em solid var(--tw-prose-quote-borders); padding-left: 1em;">
  <ol>
  <li>One
  <li>Two
  <li>Three</li>
  </ol>
</div>

But we don't really need that last `</li>` - when we close a block tag (like `</ol>` in this case), it closes any nested tags "leading up" to it. Prior to gzip support becoming widespread, this [was used](https://web.archive.org/web/20131220132121/https://developers.google.com/speed/articles/optimizing-html) to reduce page sizes, but remains occasionally handy for handwritten HTML.

Suppose you're doing a post with a bunch of nested [disclosure widgets](https://cohost.org/YellowAfterlife/post/2110414-a-brief-survey-on-st).

It's a good way to do storytelling without showing the reader illustrations or text effects ahead of the time, but it also means that the end of your post is going to look like

<pre style="overflow:hidden;text-overflow: ellipsis;">
&lt;/details&gt;&lt;/details&gt;&lt;/details&gt;&lt;/details&gt;&lt;/details&gt;&lt;/details&gt;&lt;/details&gt;&lt;/details&gt;&lt;/details&gt;&lt;/details&gt;&lt;/details&gt;&lt;/details&gt;
</pre>

But it doesn't have to - so long as you have a container element (or if there's no "footer" after all the widgets), you can just

```
<div>

  Section 1
  
  <details><summary>Summary 2</summary>

  Section 2

  <details><summary>Summary 3</summary>

  Section 3

  <details><summary>Summary 4</summary>

  Section 4
  
</div>
```

<div style="border-left: 0.25em solid var(--tw-prose-quote-borders); padding-left: 1em;">

  Section 1
  
  <details><summary>Summary 2</summary>

  Section 2

  <details><summary>Summary 3</summary>

  Section 3

  <details><summary>Summary 4</summary>

  Section 4
  
</div>

Neat, isn't it?