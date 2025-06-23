# lukakerr.github.io

My Github Pages jekyll site.

Front matter [color reference](https://raw.githubusercontent.com/Diastro/github-colors/master/github-colors.json)

### Start

`bundle exec jekyll serve`

### Resize photos

To resize all to 700px wide:

```
# Convert to 700px wide
convert '*.jpg' -set filename:fn '%[basename]-small' -geometry 700x '%[filename:fn].jpg'
```

To create a cover.jpg:

```
# Crop to 393px tall and wide - change depending on short size of cover image
convert ./cover.jpg -gravity center -crop 393x393+0+0 cropped.jpg
```
