---
layout: default
title:  "Choosing A MacOS Markdown Editor"
date:   2018-04-08 16:15:00 +1100
permalink: macos/choosing-a-macos-markdown-editor
category: macos
tags: 
  - macos
  - markdown
color: 67AFED
comments: true
---

# Choosing A MacOS Markdown Editor

<small style="color: #777; top: -10px; position: relative">
  Written by <a href="https://github.com/lukakerr">Luka Kerr</a> on April 8, 2018
</small>

I've recently been writing a lot of documents in markdown - on this blog, for uni notes and for general writing.
I find it much easier to write in markdown rather than Microsoft Word, pure LaTeX, plain text or rich text. 
Being able to convert markdown into PDF, HTML and plenty other formats is a huge benefit, not to mention that many websites like Github support it.

There are dozens of markdown editing apps out there for MacOS, each with different features, and pros and cons.

I've been looking for the perfect one for a while now, but still haven't found it. My criteria when searching has been:

- Must support [LaTeX](https://www.latex-project.org) (or a math subset of LaTeX)
- Must support code blocks and syntax highlighting
- Must be able to export to PDF
- Preferably be able to export to other formats (HTML, RTF, LaTeX)
- Preferably support opening folders, or workspaces
- Preferably support themeing
- Preferably free
- Preferably support both split view rendering, and inline rendering/editing
- Preferably not be an [electron](https://github.com/electron/electron) app

Each point starting with "Must", weighs 1 point, each point starting with "Preferably" weighs half a point.

Taking this crieteria, I set out to find the perfect markdown editor (if only it existed). Below are my findings, the pros/cons of each and how well the app matched my criteria (out of 6).

## Typora

> 5.5/6

Typora is a super minimal markdown editor and is still in Beta at time of writing. The only downside is that there is no split view rendering support. Occassionally when editing inline LaTeX, the cursor dissapears or jumps around.

| Pros          | Cons
| ------------- | ------------- |
| Extensive exporting support | No support for split view rendering |
| Supports opening multiple files/folders | Hard to edit LaTeX inline |
| Supports theming and allows custom themes | |

## MacDown

> 5/6

MacDown is the classic modern markdown editor for MacOS. It's open source and supports many cool features such as autocomplete and plugins.

| Pros          | Cons
| ------------- | ------------- |
| Extensive support for themeing, including [community created themes](https://github.com/rainglow/macdown) | No support for inline rendering/editing |
| Is open source | No support for opening folders |
| Supports plugins | |

## LightPaper

> 5/6

LightPaper is another paid app with heaps of features including support for Jekyll front matter, MathJax support and a menubar app for quick note taking.

| Pros          | Cons
| ------------- | ------------- |
| Support for folders and tabs | No inline editing |
| 'Real Preview' to preview the document on different websites | Slightly slower than its competition |
| Multiple markdown flavors | |
| Supports 'plugins' via CSS and JavaScript | |

## iA Writer

> 4/6

iA Writer is a paid app and has many great features such as focus mode and iCloud sync. It is not as customizable, but serves as a solid markdown editor.

| Pros          | Cons
| ------------- | ------------- |
| Dark mode | No support for split view rendering |
| Focus mode | No support for themeing |
| Has split view rendering | Only allows opening folders/multiple files if you use the iCloud library |

## Ulysses

> 3/6

Ulysses is a native MacOS app, with iOS support too. It won the 2016 Apple Award for Design. The main disadvantage to Ulysses is that it doesn't support code blocks or syntax highlighting.

| Pros          | Cons
| ------------- | ------------- |
| Support for folders | No split view or inline rendering |
| Automatic backup | No code/syntax highlighting support |
| Sync across devices | No LaTeX support |
| Support for publishing directly to Medium or Wordpress | |

In the end I went with Typora. It supports everything main feature I need except split view rendering. Perhaps when it leaves beta it may support this, but for now its just off being the perfect markdown editor.