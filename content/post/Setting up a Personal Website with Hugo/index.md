---
title: Setting up a Personal Website with Hugo
date: 2025-06-19T16:52:25Z
draft: false
summary: Some details about creating this blog and implementing certain features
description: null
tags: ""
series: ""
categories: ""
featuredImage: null
readingtime: true
---

Lately, I have been reorganizing some of my past work scattered across many paper notebooks, computer folders, and OneNote. I wanted to create a minimalist, academic site to showcase some of my projects and general mathematical thoughts. At the same time, establishing an internet presence beyond a LinkedIn profile seemed to be a good investment for the modern era. This blog post details part of my journey into setting up this website (and serves as documentation for me). While this post may lack certain details, it is useful to check out the following sources for more information.

- [Hugo Forums](https://discourse.gohugo.io/)
- [Collection of Hugo Themes](https://themes.gohugo.io/)
- [CloudCannon Beginner Tutorial](https://cloudcannon.com/tutorials/hugo-beginner-tutorial/)

## Why Hugo?

Static site generators (SSG) are very popular options for personal websites in recent years. Their low floor and high ceiling let those with a range of programming experience customize easily. I choose Hugo due to its build speed (sporting build time in the milliseconds!) and theme ecosystem. I felt that writing articles in markdown was also very natural, coming from a LaTeX background.

For those with some familiarity with other static site generators, I found this [note](https://gist.github.com/janert/4e22671044ffb06ee970b04709dd7d81) that described the way Hugo works really helpful. Hugo has a sharp learning curve, but, in the end, I'm happy with my resulting website.

## Choosing a Theme

Part of the strengths of any well-developed SSG is the community support. Thankfully, Hugo has been around for a number of years, meaning users have a bunch of open-source themes. I selected the **Poison** theme as a professional template, but below are some other ones worth checking out in my opinion.

- [Poison](https://github.com/lukeorth/poison)
- [PaperMod](https://github.com/adityatelange/hugo-PaperMod)
- [Minimalist Academic](https://github.com/pmichaillat/hugo-website)
- [XMIN](https://github.com/yihui/hugo-xmin)
- [BearBlog](https://github.com/janraasch/hugo-bearblog)

It's important when selecting a theme to look at the config file; this will usually tell you how much control you have over the styling of the site and how you can organize your content. 

## Implementing LaTeX support via KaTeX

As a mathematician, LaTeX typesetting was a must for writing some future posts. Luckily, there are two major libraries that support math rendering (See MathJax and KaTeX). I ended up choosing KaTeX for no particular reason. Implementing this server-side was as simple as including a couple of lines of HTML and a custom render hook.

```go{title = "layouts\_default\_markup\render-passthrough.html" verbatim = true}
{{ $opts := dict "output" "htmlAndMathml" }}
{{ if eq .Type "block" }}
  {{ $opts = merge $opts (dict "displayMode" true) }}
{{ end }}
{{ transform.ToMath .Inner $opts }}
{{ .Page.Store.Set "hasMath" true }}
```

Don't forget to include the following style-sheet in the head of your project!

```html{title="KaTeX Stylesheet" verbatim = false}
<link href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css" rel="stylesheet">
```

Some themes may already have built-in LaTeX support, so make sure to check before implementing yourself. For those interested in having the LaTeX rendered client-side, [transform.ToMath](https://gohugo.io/functions/transform/tomath/) is the relevant Hugo documentation. Importantly, I prefer to use `$$...$$` and `$...$` as my delimiters for block and inline.


## Comments System using Giscus

Hugo Documentation notes that it comes shipped with Disqus, a JavaScript-based commenting system. However, I'd recommend not using it since:

1. Disqus, while free-to-use, shows ads to viewers of your website.
2. There are [privacy concerns](https://news.ycombinator.com/item?id=27060609) regarding the third-party service.
3. I didn't like the default design.

I settled on [Giscus](https://giscus.app/), itself heavily inspired by the earlier [utterances](https://github.com/utterance) package. Comments are stored as part of the GitHub Repository's discussions page. The biggest drawback is that it requires an account to post. Since I don't expect much traffic on my site/GitHub repo, I thought this was fair trade-off. In any case, for those without an account, they could reach me through my [e-mail](mailto:dzheng24@sas.upenn.edu).

For my page, I choose to use the Catppuccin Frappe and Catppuccin Latte themes for dark and light mode respectively.

## Light & Dark Mode

Speaking of which, the Poison theme already implements a Light/Dark mode switch. You can see how I overrode some of the behavior and synced it up with my Giscus theme in the `assets\js\light_dark.js` at my GitHub repository for this site. 

## Pagefind Static Search

Pagefind is a static search package that builds an index after your static site is finished building. It comes with a [prebuilt search bar](https://pagefind.app/docs/ui-usage/) to easily drop into your site, but I choose to build my own using their API to have greater control over styling and customization. For my purposes, since Hugo automatically generates many taxonomy pages by default, I added the `data-pagefind-ignore` to many parts of site to prevent those sections from being indexed, along with the LaTeX in my `pagefind.config` file. For the **Poison** theme, `npx pagefind` was also detecting the sidebar's title, instead of the posts'. These issues are relatively easy to fix and I found configuring Pagefind very straightforward. For those looking for a more high-powered solution, you can look at [a list of static search libraries](https://jamieede.com/posts/pagefind-search-for-hugo/).

The search bar design I ended up using is modified from [uiverse.io by @satyamchaudharydev](https://uiverse.io/satyamchaudharydev/plastic-bobcat-37).

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

Not much to say here. [hugo-admonitions](https://github.com/KKKZOZ/hugo-admonitions) is a Hugo Module that extends markdown with some nicely formatted alerts. Great that it also supports Light/Dark mode right out of the box.

> [!CODE]
> ```go{title = "hugo.toml" verbatim = true}
> [module]
> 	[[module.imports]]
> 		path = "github.com/KKKZOZ/hugo-admonitions"
> ```

## Table of Contents

Hugo comes with a built-in Table of Contents method. It works by detecting `<h1>`-`<h6>` elements and generating it based on that. The bolded entry in the table of contents represents the items that most recently entered the viewfinder. This leads to some finicky behavior using [sidsbrmnn's](https://github.com/sidsbrmnn/scrollspy) ScrollSpy implementation using IntersectionObserver. 

## Markdown Footnotes

Hugo uses [goldmark](https://github.com/yuin/goldmark) as its markdown renderer. Luckily, there are many ways to customize it, through enabling [footnotes](https://michal.sapka.pl/tips/footnotes-in-hugo-and-goldmark/) or writing render hooks.

## Sidenotes via Intersection Observer

Sidenotes are an alternative to footnotes and created as a Hugo shortcode. Since it may break up the reader's flow when it redirects their eyes to the bottom of the page, requiring another click to return. As an alternative to footnotes, I wanted sidenotes to be textual snippets that are located in horizontal alignment with the corresponding label in the text. We allow {{< sidenote "sidenotes" >}} Hello there! {{< /sidenote >}}to optionally accept one image and sidenotes disappear as the label is moved out of the viewport.

## Inline Notes

{{< inlineNote "Inline notes">}} $$\begin{align} \frac{\,d}{\,dx}(e^{x}) = e^{x} \end{align}$$ {{< /inlineNote >}}are very similar to Sidenotes, except they can only generate, as their name suggests, inline. These are collapsible elements regardless of the window size. They replicate the mobile-view behavior of Sidenotes.

## Mobile Publishing

Since I want to be able to edit content on my phone, I looked for an Android-based markdown editor with GitHub sync support. I initially used [GitJournal](https://gitjournal.io/), but the app does not seem to be in active development. I disliked the syncing issues and it just seems I was running into more problems as I tried to fix them. Additionally, the relatively high cost put me off the app. 

Instead, as of November 2025, I've switched over to using [GitSync](https://github.com/ViscousPot/GitSync) and [Obsidian](https://obsidian.md/) for mobile writing. So far, it seems to work well, and I'm considering transitioning more of my note-taking ecosystem towards the Obsidian framework (Unfortunately at the moment, my notes are scattered across my [reMarkable 2](https://remarkable.com/) tablet + paper + LaTeX).

## Daily Website Refresh via CRON Job for Scheduled Posts

By design, the static site served to the user by GitHub pages is a bundle of HTML, CSS, JavaScript, etc. This makes the problem of scheduling posts via Hugo's own [PublishDate](https://gohugo.io/methods/page/publishdate/#article) frontmatter parameter difficult. The workaround is to use a CRON job to trigger a rebuild of your website each day (I schedule mine for 1 AM EST). More details on the solution can be found in Mike Rhodes' [post](https://dx13.co.uk/articles/2023/04/16/scheduled-posts-hugo-gh-pages-actions/).

## Columns in posts
I used this [shortcode](https://github.com/McShelby/hugo-theme-relearn/issues/716#issuecomment-1894351244) borrows from the hugo-relearn theme.

## Mobile View + Sidebar-Toggle

The standard view on mobile devices for the **Poison** theme causes the sidebar to cover up much of the content. Taking inspiration from [this github issue](https://github.com/lukeorth/poison/issues/165), we can use CSS media queries to change the sizing. You can see the customization for this and other features in my `assets/custom.css` file.

I added a button to also toggle the sidebar, since it may be distracting for desktop users on longer files.

## Faster Loading using InstantPage

[instant.page](https://instant.page/) is a tiny JavaScript package that feels like magic. It uses "just-in-time preloading" to make page transitions on your site feel smoother. It was very easy to add this script to the `layouts/head/head.html` file. Note that for many of my JavaScript files, I use Hugo's asset processing pipeline to minify and fingerprint them to reduce their size. This is actually quite confusing, so I'll just link a tutorial [here](https://app.studyraid.com/en/read/15011/518997/using-hugo-pipes-for-asset-processing).

## Caching using Google WorkBox + ServiceWorkers

Service Workers are attached to websites to facilitate communication from the user to the server. I wanted to modify my static site into a Progressive Web App (or PWA), so that users already on the site could navigate it if their internet connection went out. In order to do this, I had to implement some sort of caching solution. Google offers a workbox [library](https://developer.chrome.com/docs/workbox/) that helps remove some of the set-up. [Bill Baer's](https://wbaer.net/2022/05/setting-up-a-service-worker-with-hugo/) and [Cuterwrite's](https://cuterwrite.top/en/p/hugo-pwa/) posts both helped me with my implementation.

Along the way, I also added a `webmanifest.json` file, so that readers could download my website as a mobile app, although I'd recommend using an RSS feed instead.

## Favicons

Favicons are the brand logos desktop users see in the tab of your webpage, or for mobile users, the app icon. I used [FaviCraft](https://favicraft.com/) to generate and check my favicons I created.

## Deployment via GitHub Pages

There are some number of options for static website hosting, including Netlify and Cloudflare. In the end, I choose GitHub pages for its simplicity, free-to-use, and my familiarity with its ecosystem. You can see this [tutorial](https://gohugo.io/host-and-deploy/host-on-github-pages/) on how to get it up and running.

## Content Management System (CMS)

For VSCode users, I'd recommend [Front Matter](https://frontmatter.codes/), or [Decap CMS](https://decapcms.org/). The first has a easy-to-use in-application GUI, although I found some customization options lacking without writing the CMS yourself. DecapCMS is incredibly popular, but the initial configuration can take a lot of time. Overall, I find I don't really need a CMS and usually type directly in VSCode, or open the markdown in [Typora](https://typora.io/) (You do need to pay $15 USD for a license for up to three devices, but it is a wonderful piece of software).

For Typora, it's useful to install some open-source themes from the [Themes Gallery](https://theme.typora.io/), as well as add some mathematical macros ([How to implement macros](https://github.com/typora/typora-issues/issues/100) and [Built-in and Customized Extra LaTeX Macros in Typora](https://gist.github.com/garylavayou/97fa124dec4ad15bbe7c9bf800f98f5a)).

## VSCode Extensions
Some VSCode Extensions are useful for working with Hugo. I used [Hugo Runner](https://marketplace.visualstudio.com/items?itemName=stuartleeks.vscode-hugo-runner) and [Hugo Language/Syntax Support](https://marketplace.visualstudio.com/items?itemName=budparr.language-hugo-vscode) for coding and testing the website. 

For writing in VSCode directly, I'm still testing between multiple workflows. I use [Harper](https://marketplace.visualstudio.com/items?itemName=elijah-potter.harper), an open source spellchecker alongside [FrontMatter CMS](https://marketplace.visualstudio.com/items?itemName=eliostruyf.vscode-front-matter-beta). For more intensive writing, I use [Typora](https://typora.io/) and the [Open in External App](https://marketplace.visualstudio.com/items?itemName=YuTengjing.open-in-external-app) extension to make the swap seamless. 

## Email Link Symbols, Emojis & Icons

We can use a CSS selector to add an SVG icon after links. 

```css{title="assets\css\custom.css" verbatim=true}
.post a[href^="mailto:"]::after {
  content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1.2em" viewBox="0 -75 485.211 485.211"><path fill="RoyalBlue" d="M301.393,241.631L464.866,424.56H20.332l163.474-182.928l58.801,51.443L301.393,241.631z M462.174,60.651H23.027 l219.579,192.142L462.174,60.651z M324.225,221.67l160.986,180.151V80.792L324.225,221.67z M0,80.792v321.029L160.972,221.64 L0,80.792z"/></svg>') " ";
  font-size: 1em;
  margin-left: 0.25em;
}
```

The icons are taken from [Simple Icons](https://simpleicons.org/). The emojis are enabled by adding `enableEmoji = true` to your config file. A full list of supported emojis are [here](https://github.com/ikatyang/emoji-cheat-sheet/).

## RSS Feed

Hugo automatically generates an RSS feed. I replaced the link using [Subscribe Openly](https://subscribeopenly.net/) to make it more digestible.

## Embeddable PDFs
Embedded PDF files may be viewed differently across browsers. To standardize this, I've used a [pdfjs viewer element](https://github.com/alekswebnet/pdfjs-viewer-element) directly.

{{< embedPDF src="example-pdf/PJAS-2020-2.pdf">}}

## Robots.txt
With excessive AI crawlers and LLMs being used today, I took care to implement a `robots.txt` file at the root of my project to [prevent crawlers](https://en.wikipedia.org/wiki/Robots.txt). Originally, I wrote it by hand, but using the method from [Dynamic Robots.txt with Hugo External Data Sources](https://runtimeterror.dev/dynamic-robots-txt-hugo-external-data-sources/) helps make sure that it stays somewhat up-to-date. Unfortunately, a non-compliant web bot could choose to simply ignore such protocols, but it would be difficult to prevent all of them without some serious security implementations. Note that despite blocking crawling, it does not block indexing by search engines necessarily, although it may impact the description generated.

## Three.js
Following the implementation by [Redstrate](https://redstrate.com/blog/2025/01/integrating-katex-and-three.js-into-hugo/) and [Jorge Martinez](https://jorgemartinez.space/posts/tutorials/running-threejs-in-my-website/), we add a shortcode `layouts\shortcodes\threejs.html` for adding mathematical animations in WebGL. I'm still playing around, so this section will be updated in the future with a better tutorial. 

## MediumZoom.js
This [library](https://github.com/francoischalifour/medium-zoom) allows for zooming in on images in my posts when you click on them. 