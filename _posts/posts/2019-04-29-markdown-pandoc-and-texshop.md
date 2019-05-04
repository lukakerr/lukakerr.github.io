---
layout: default
title:  "Markdown, Pandoc & TeXShop"
date:   2019-04-29 10:30:00 +1100
permalink: tex/markdown-pandoc-and-texshop
category: post
tags:
  - tex
  - markdown
  - pandoc
  - macos
color: 3D6117
comments: true
---

## Markdown, Pandoc & TeXShop

<small style="color: #777; top: -10px; position: relative">
  Written by <a href="https://github.com/lukakerr">Luka Kerr</a> on April 29, 2019
</small>

I write a lot in Markdown and use Pandoc to convert from Markdown -> `.pdf`.

Following the steps below, we can add a Markdown engine to TeXShop:

- Install [Pandoc](http://pandoc.org) if you haven't already

- Change directories into the TeXShop engines directory

```bash
cd ~/Library/TeXShop/Engines
```

- Create a `Markdown.engine` file

```
touch Markdown.engine
```

- Set its permissions

```
chmod +x Markdown.engine
```

- Write the engine by adding the following to `Markdown.engine`

```bash
#!/bin/bash

# Ensure required directories are in your PATH
PATH=$PATH:/Library/TeX/texbin:/usr/texbin:/usr/local/bin

# Extract name of file and create a pdf file name from it
file_name=$(basename "$1")
pdf_file="${file_name%.*}.pdf"

# Call pandoc to do the conversion, passing in any options
pandoc "$1" \
  --from markdown+tex_math_dollars \
  -V geometry:margin=1in \
  -V fontsize=12pt \
  -o "$pdf_file"
```

Now when you open a `.md` file in TexShop, simply select the `Markdown` option from the engines dropdown
and typeset as per usual.