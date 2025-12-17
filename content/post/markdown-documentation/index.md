---
title: Documenting Markdown Frontmatter & Content Extensions
date: 2025-07-24T00:57:01Z
draft: false
summary: My frontmatter schema + embeddable features
description: null
tags: 
  - Hugo
series: ""
featuredImage: ""
readingtime: true
displayHomepage: true
---
For Frontmatter configs, we have the following: 

| Parameter | Type | Value |
|-----------|-------| ------|
| title | `string` | Title |
| date | `YEAR-MONTH-DAYT00:00:00Z` | Date  |
| draft | `boolean` | Whether to be published |
| summary | `string` | Summary for homepage display|
| description | `string` | Description for metadata|
| tags | `array` | Taxonomic terms |
| series | `string` | Whether it is part of a series of posts |
| featuredImage | `image path` | Optional relative path to image for post |
| readingtime | `boolean` | Whether to display reading time |
| hidetoc | `boolean` | Whether to enable ToC for post |
| displayHomepage | `boolean` | Whether to display on homepage |

Below are some of the features I added for content writing. For global features, you can refer [here](/post/setting-up-a-personal-website-with-hugo/).

## Columns in posts
I used this [shortcode](https://github.com/McShelby/hugo-theme-relearn/issues/716#issuecomment-1894351244) borrowed from the hugo-relearn theme.

## Markdown Footnotes

Hugo uses [goldmark](https://github.com/yuin/goldmark) as its markdown renderer. I enabled [footnotes](https://michal.sapka.pl/tips/footnotes-in-hugo-and-goldmark/).

## Code Highlighting

[Syntax highlighting](https://gohugo.io/content-management/syntax-highlighting/) is built into Hugo. I overwrote the code block rendering hook using the file below. This is based on this [solution](https://write.rog.gr/writing/labeling-code-blocks-in-hugo/) by Roger Steve Ruiz.

```html{title = "layouts\_default\_markup\render-codeblock.html" verbatim = true}
{{- $isVerbatim := true -}}
{{- if isset .Attributes "verbatim" -}}
  {{- $isVerbatim = .Attributes.verbatim -}}
{{- end -}}
<figure class="highlight">
  {{- with .Attributes.title }}
    <figcaption>
      {{- if $isVerbatim -}}
        <span>{{ . }}</span> {{/* As a file name */}}
      {{- else -}}
        <span>{{ . | markdownify }}</span> {{/* As a code description */}}
      {{- end -}}
    </figcaption>
  {{- end }}
  {{- if transform.CanHighlight .Type }}
    <pre tabindex="0" class="chroma"><code class="language-{{ .Type }}" data-lang="{{ .Type }}">
      {{- with transform.HighlightCodeBlock . -}}
        {{ .Inner }}
      {{- end -}}
    </code></pre>
  {{- else }}
    <pre tabindex="0"><code class="language-{{ .Type }}" data-lang="{{ .Type }}">{{ .Inner }}</code></pre>
  {{- end }}
</figure>
```

## GitHub-style Alerts

[hugo-admonitions](https://github.com/KKKZOZ/hugo-admonitions) is a Hugo Module that extends markdown with some nicely formatted alerts.

> [!CODE]
> ```go{title = "hugo.toml" verbatim = true}
> [module]
> 	[[module.imports]]
> 		path = "github.com/KKKZOZ/hugo-admonitions"
> ```

## Sidenotes via Intersection Observer

Sidenotes are an alternative to footnotes and created as a Hugo shortcode. Since it may break up the reader's flow when it redirects their eyes to the bottom of the page, requiring another click to return. As an alternative to footnotes, I wanted sidenotes to be textual snippets that are located in horizontal alignment with the corresponding label in the text. We allow {{< sidenote "sidenotes" >}} Hello there! {{< /sidenote >}}to optionally accept one image and sidenotes disappear as the label is moved out of the viewport.

## Inline Notes

{{< inlineNote "Inline notes">}} $$\begin{align} \frac{\,d}{\,dx}(e^{x}) = e^{x} \end{align}$$ {{< /inlineNote >}}are very similar to Sidenotes, except they can only generate inline. These are collapsible elements regardless of the window size. They replicate the mobile-view behavior of Sidenotes.


## Embeddable PDFs
Embedded PDF files may be viewed differently across browsers. To standardize this, I've used a [pdfjs viewer element](https://github.com/alekswebnet/pdfjs-viewer-element) directly.

{{< embedPDF src="example-pdf/PJAS-2020-2.pdf">}}

## Three.js
Following the implementation by [Redstrate](https://redstrate.com/blog/2025/01/integrating-katex-and-three.js-into-hugo/) and [Jorge Martinez](https://jorgemartinez.space/posts/tutorials/running-threejs-in-my-website/), we add a shortcode `layouts\shortcodes\threejs.html` for adding mathematical animations in WebGL. I'm still playing around, so this section will be updated in the future with a better tutorial. 

{{< threejs src="/threejs/hello.js" id="hello" version="0.160.0">}}

## Apache Echarts shortcode
I implemented a shortcode `chart.html` to display some nice charts/graphs for data visualization. You can feed it data as part of the shortcode, or pass a parameter to access the Hugo `data` directory. Some other popular libraries include [chartjs](https://www.chartjs.org/), or [D3](https://d3js.org/).
{{< chart  data="example_1">}}
{
  legend: {},
  tooltip: {},
  dataset: {
    // Provide a set of data.
    source: [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1]
    ]
  },
  // Declare an x-axis (category axis).
  // The category map the first column in the dataset by default.
  xAxis: { type: 'category' },
  // Declare a y-axis (value axis).
  yAxis: {},
  // Declare several 'bar' series,
  // every series will auto-map to each column by default.
  series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
};
{{< /chart >}}


## Quizdown
The quizdown shortcode below was made by [bonartm](https://github.com/bonartm/hugo-quiz).

{{< quizdown >}}

---
primary_color: orange
secondary_color: lightgray
text_color: black
shuffle_questions: false
---

## The sound of dog

---
shuffle_answers: false
---

What do dogs sound like?

> Some hint

- [ ] yes
- [ ] no
- [ ] `self.sound = "meow"`
- [x] wuff

## Put the [days](https://en.wikipedia.org/wiki/Day) in order!

> Monday is the *first* day of the week.

1. Monday
2. Tuesday
3. Wednesday
4. Friday
5. Saturday  
{{< /quizdown >}}

## Various shortcodes
For some images, I can use the `custom-figure.html` and `figref.html` shortcodes.