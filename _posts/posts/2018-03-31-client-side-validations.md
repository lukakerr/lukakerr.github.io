---
layout: default
title:  "Client Side Validations"
date:   2018-03-31 15:00:00 +1100
permalink: rails/client-side-validations
category: post
tags:
  - rails
  - gem
color: 5F221D
comments: true
---

# Client Side Validations

<small style="color: #777; top: -10px; position: relative">
  Written by <a href="https://github.com/lukakerr">Luka Kerr</a> on March 31, 2018
</small>

Every Rails application should have validations put in place inside a model whenever dealing with forms. For example, when validating the exact length of a field you could use something like this:

```ruby
validates :field, length: { is: 10 }
```

The problem with this is that these validations are only checked when the form submit button is pressed, not in real time when the user is filling out each field. To combat this issue, we can use the [`client_side_validations`](https://github.com/DavyJonesLocker/client_side_validations) gem. This allows for real time checking of validations located in the model.

To get started, add this line to your `Gemfile`:

```ruby
gem 'client_side_validations'
```

Then run `bundle install` and `rails g client_side_validations:install`.

This will create a `config/initializers/client_side_validations.rb` file. Inside this file will be some commented out code. Read this code and decide what to uncomment. Inside my `client_side_validations.rb` file I have uncommented this section:

```ruby
ActionView::Base.field_error_proc = Proc.new do |html_tag, instance|
   unless html_tag =~ /^<label/
     %{<div class="field_with_errors">#{html_tag}<label for="#{instance.send(:tag_id)}" class="message">#{instance.error_message.first}</label></div>}.html_safe
   else
     %{<div class="field_with_errors">#{html_tag}</div>}.html_safe
   end
 end
```

Next you need to add a line to the `/assets/javascripts/application.js` before the `//= require_tree .` line and after the `//= require turbolinks` line:

```javascript
//= require rails.validations
```

Next you need to modify your form. You can use the default Rails form, or Simple Form, whichever you prefer.

```erb
<%= form_for @booking, validate: true do |f| %>
<!-- Or -->
<%= simple_form_for @booking, validate: true do |f| %>
```

Remember, if you do not have any validations in the model, this will not work. Also, if you want to style the error messages, modify the CSS for the following classes:

* `.field_with_errors`
* `.message`

Once this is all done, try to fill out a form field incorrectly and you will see inline, real time error messages.

![client-side-validations]({{ "/assets/img/rails/client-side-validations.jpg" | absolute_url }})