---
layout: default
title:  "Acts As Votable"
date:   2018-03-31 14:10:00 +1100
permalink: rails/acts-as-votable
category: rails
comments: true
---

# Acts As Votable

<small style="color: #777; top: -10px; position: relative">
  Written by <a href="https://github.com/lukakerr">Luka Kerr</a> on March 31, 2018
</small>

The [Acts As Votable](https://github.com/ryanto/acts_as_votable) gem allows for any model to be voted on. For example, if you had an `image` model, you could use this gem to setup upvoting and downvoting.

Firstly, you must add the gem to your `Gemfile` and run `bundle install`:

```ruby
gem 'acts_as_votable', '~> 0.10.0'
```

Next you need to generate the Acts As Votable migrations and migrate the database:

```bash
rails g acts_as_votable:migration
rake db:migrate
```

Next you need to decide what model you want to allow voting on. For this example we are using an `image` model. For you this may differ, in which you should replace each instance of `image` with whatever model you are using. You need to add the line `acts_as_votable` to your `image.rb` model file.

In the `routes.rb` file you need to add the following for the `images` resource. The syntax here is important:

```ruby
resources :images do
  member do
      put "upvote", to: "images#upvote"
      put 'downvote', to: 'images#downvote'
  end
end
```

Next, inside the `images_controller.rb` you need to setup the methods for upvoting and downvoting. This assumes you have the helper method `current_user`:

```ruby
def upvote
  @image.upvote_by current_user
  redirect_to :back
end

def downvote
    @image.downvote_by current_user
    redirect_to :back
end
```

You also need to make sure you have a `before_action` to find the image. If you do, add the `:upvote, :downvote` methods to the before filter. If you don't, add this line at the top of each method:

```ruby
@image = Image.find(params[:id])
```

In your `show.html.erb` inside the `images/` folder, add the following lines:

```erb
<%= link_to "Upvote", upvote_image_path(@image), method: :put %>
<%= link_to "Downvote, downvote_image_path(@image), method: :put %>
```

Next, before we show the score, we should add caching to out voting. Do this by generating an empty migration:

```
rails g migration add_cached_votes_to_images
```

Inside the generated migration, paste the following code:

```ruby
def self.up
  add_column :images, :cached_votes_total, :integer, :default => 0
  add_column :images, :cached_votes_score, :integer, :default => 0
  add_column :images, :cached_votes_up, :integer, :default => 0
  add_column :images, :cached_votes_down, :integer, :default => 0
  add_column :images, :cached_weighted_score, :integer, :default => 0
  add_column :images, :cached_weighted_total, :integer, :default => 0
  add_column :images, :cached_weighted_average, :float, :default => 0.0
  add_index  :images, :cached_votes_total
  add_index  :images, :cached_votes_score
  add_index  :images, :cached_votes_up
  add_index  :images, :cached_votes_down
  add_index  :images, :cached_weighted_score
  add_index  :images, :cached_weighted_total
  add_index  :images, :cached_weighted_average
  
  Image.find_each(&:update_cached_votes)
  end
  
def self.down
  remove_column :images, :cached_votes_total
  remove_column :images, :cached_votes_score
  remove_column :images, :cached_votes_up
  remove_column :images, :cached_votes_down
  remove_column :images, :cached_weighted_score
  remove_column :images, :cached_weighted_total
  remove_column :images, :cached_weighted_average
end
```

Run `rake db:migrate` after this.

Finally, inside the `show.html.erb` add the following line which will show the score (upvotes - downvotes):

```erb
<%= @image.weighted_score %>
```