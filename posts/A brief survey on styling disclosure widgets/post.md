## Basics

A &lt;details&gt; element without styling looks like this:

<details><summary>&lt;details&gt;: The Details disclosure element</summary>

The `details` HTML element creates a disclosure widget in which information is visible only when the widget is toggled into an "open" state. A summary or label must be provided using the `summary` element.

(read more [on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details))

</details>

Its appearance (a block element with a little arrow inside the summary element) is fairly consistent across browsers. That's about as far as it goes though.

## Hiding the arrow

What you're _supposed_ to do is
<pre>
details > summary {
  list-style: none;
}

details > summary::marker,
details > summary::-webkit-details-marker {
  display: none;
}
</pre>
we can't do that second part on cohost though!

So what if we change `display` and `list-style` of `summary`?

<details>
  <summary style="list-style:none;display:block">Click me</summary>
  Very well?
</details>

Depending on your browser you may already see the caveat - this works in Chromium and Firefox (even `display: block` is enough), but not Safari (which wants that `-webkit-details-marker` after all).

The size of the arrow depends on the size of the font, so we can just set that to 0, and set it back in a `span` element inside the `summary`:

<details>
  <summary style="display:block;font-size:0"><span style="font-size:1rem">Click me</span></summary>
  Very well.
</details>

And we probably want to indicate to the user that our now-regular-looking summary is interactive, so let's give it an underline:

<details>
  <summary style="display:block;font-size:0"><span style="font-size:1rem; text-decoration: underline; text-decoration-style: dotted">Click me</span></summary>
  Very well.
</details>

And that's about it, but if you don't get an underline in Safari, you might have to separate `text-decoration: underline dotted` into `text-decoration: underline; text-decoration-style: dotted`.

Most interactive tricks that you'll see around here are variations of this formula - the summary is what you can click and the rest of the elements inside the details-element are what should appear/disappear.

<div style="position:relative">
  <details class="noarrow underline">
    <summary><span>🍎 take a bite</span></summary>
    <div style="position:absolute; inset:0; background:white">all gone!</div>
  </details>
</div>

The elements can overlap (`position: absolute`), be click-through (`pointer-events: none`), push each other around (via flexboxes or even just `float`), and so on - inspect an element in your favorite CSS crime and you might find something new.

## Inline disclosure

So you want a little clarification or a bit of trivia right in the middle of the text. You should be able to <details style="display:inline; background: #FFF037"><summary style="display:inline">just make details and summary inline</summary>  (by giving them `display:inline`)</details>, right?

<div class="p">
  Alright, maybe not <em>that</em> easy - <code>details</code> is a block element so it breaks the paragraph, but if we 
  <details style="display:inline; background: #FFF037"><summary style="display:inline">make our own paragraph</summary> (out of a DIV element, of course - it doesn't need much apart of `margin: 1.25em 0` to mimic the regular paragraphs)</details>, it should be fine.
</div>

<div class="p">
  Apparently not! For reasons that probably require digging into the specification, disclosure element can only be an inline-block, not inline.
  But there is this funky new-ish (2018 and onward) display style called "contents", which kind of just pretends that a container doesn't exist and flows its children individually. So we
  <details style="display:contents;"><summary style="display:inline; background: #FFF037">give it to details</summary> (and don't give it to summary, because that renders the disclosure element non-interactive on Safari)</details>, and that's it for real?
</div>

<div class="p">
  Well, mostly. Since the disclosure element isn't real anymore, it can't have a background (not that you really wanted it to, I bet), and also Chromium is a problem this time! When a display: contents disclosure is closed, it adds a newline after it for some reason. Here, have a look:<br> 
  <details style="display:contents;"><summary style="display:inline; font-size:0"><span style="font-size:1rem; background: #FFF037;">A disclosure</span></summary> (now open!)</details> and a bit of trailing text.
</div>

But still, good for trailing details in a paragraph, I suppose?

## Inline block disclosure

<div class="p rel">
  Given the right conditions, we can <details class="block"><summary><span>make it seem</span></summary>
  <div>
    If you have enough text to push your little inline box to screen width, you can style it like a little window or an infobox.
    I'm also making this one into an <code>inline-flex</code> container so that the entirety of the "title bar" remains clickable when it's open.
  </div>
</details> like an inline block is what we wanted to achieve all along.
</div>

I wrote [a generator](https://cohost.org/YellowAfterlife/post/2126213-i-made-a-new-tool) for these.

## Floating disclosure

<div class="p rel">
I also had this idea to create <details class="tip"><summary><span>tooltips</span></summary><span></span><div>
  The little arrow-tip is a relative-positioned element, and this content-div is an absolute-positioned element - try inspecting it.
</div></details> through a combination of factors, and it sure looks neat, but I feel like this is going to combust at first opportunity.
</div>

## Conclusions

Fun element, isn't it?

For less-esoteric purposes you may also be interested in [eevee's tutorial](https://cohost.org/lexyeevee/post/2107474-css-for-css-baby-3)