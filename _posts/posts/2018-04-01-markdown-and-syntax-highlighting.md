---
layout: default
title:  "Markdown & Syntax Highlighting"
date:   2018-04-01 12:25:00 +1100
permalink: rails/markdown-and-syntax-highlighting
category: post
tags:
  - rails
  - gem
color: 5F221D
comments: true
---

# Markdown & Syntax Highlighting

<small style="color: #777; top: -10px; position: relative">
  Written by <a href="https://github.com/lukakerr">Luka Kerr</a> on April 1, 2018
</small>

To implement markdown with syntax highlighting into your Rails application, you need two Ruby gems; [`redcarpet`](https://github.com/vmg/redcarpet) a markdown parser and [`pygments.rb`](https://github.com/tmm1/pygments.rb) a Ruby wrapper for a Python syntax highlighter.

To get started, simply add the following two lines into your `Gemfile` and run `bundle install`:

```ruby
gem 'redcarpet'
gem 'pygments.rb'
```

Next we need to create a helper method, so that we can use a simple function in our views. Lets create this method inside the `/helpers/application_helper.rb` file.

```ruby
module ApplicationHelper
  class HTMLwithPygments < Redcarpet::Render::HTML
    def block_code(code, language)
      Pygments.highlight(code, lexer: language)
    end
  end

  def markdown(text)
    renderer = HTMLwithPygments.new(hard_wrap: true, filter_html: true)
    options = {
      autolink: true,
      no_intra_emphasis: true,
      fenced_code_blocks: true,
      lax_html_blocks: true,
      strikethrough: true,
      superscript: true,
    }
    Redcarpet::Markdown.new(renderer, options).render(text).html_safe
  end
end
```

For the `markdown()` function, we use a hash to add markdown extensions such as `autolink`. You can find more extensions [here](https://github.com/vmg/redcarpet#and-its-like-really-simple-to-use).

Next we need to create a file inside `/assets/stylesheets/` called `pygments.css.erb` and paste just the following line into that file:

```erb
<%= Pygments.css(style: "monokai") %>
```

This example uses the `monokai` syntax highlighting style, but there are [many more options to choose from](http://jwarby.github.io/jekyll-pygments-themes/languages/javascript.html).

Finally, in our views file, such as `show.html.erb`, simply include the `markdown()` function before any database call that includes text. For example, if you're using a `Post` model and want to fetch the post body, use the following line:

```erb
<%= markdown(@post.body) %>
```

Make sure to restart your server as well.

Once this is all done, simply create a new post, and style it using markdown and include a programming language's syntax you like, the results speak for themselves.

![1]({{ "/assets/img/rails/markdown-syntax-highlighting.jpg" | absolute_url }})
