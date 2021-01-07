# DEV.to source plugin for Gridsome

>  This package is under development and API might change before v1 is released.

This is a Gridsome source plugin for [DEV.to](https://docs.dev.to/api/). It retrieves all your published articles via the [DEV API (beta)](https://docs.dev.to/api/).

This plugin merges and exposes the entire schema for both the [`getArticles`](https://docs.dev.to/api/index.html#operation/getArticles) and [`getArticleById`](https://docs.dev.to/api/index.html#operation/getArticleById) so you can benefit from both endpoints effortlessly. This is useful because for example; `page_views_count` is available on [`getArticles`](https://docs.dev.to/api/index.html#operation/getArticles) but not on [`getArticleById`](https://docs.dev.to/api/index.html#operation/getArticleById). On the flip-side `body_html` is available on [`getArticleById`](https://docs.dev.to/api/index.html#operation/getArticleById) but not on [`getArticles`](https://docs.dev.to/api/index.html#operation/getArticles). Not sure why DEV.to implemented their API like this, but with this plugin, you don't need to worry about it.

## Available DEV.to attributes
<details>
  <summary>The combined dev.to schemas provides the following attributes:</summary>
  
  * `type_of`
  
  * `id`
  
  * `title`
  
  * `description`
  
  * `published`
  
  * `readable_publish_date`
  
  * `published_at`
  
  * `slug`
  
  * `url`
  
  * `comments_count`
  
  * `public_reactions_count`
  
  * `page_views_count`
  
  * `collection_id`
  
  * `published_timestamp`
  
  * `positive_reactions_count`
  
  * `social_image`
  
  * `canonical_url`
  
  * `created_at`
  
  * `edited_at`
  
  * `crossposted_at`
  
  * `published_at`
  
  * `last_comment_at`
  
  * `tag_list`
  
  * `tags`
  
  * `body_html`
  
  * `body_markdown`
  
  * `user`
</details>


## Computed attributes
<details>
  <summary>In addition, this plugin provides some handy computed attributes too: </summary>

  * `parsed_markdown`: Similar to `body_html`. However the parsed markdown has been processed to provide some additional extras such syntax highlighting by prism.js and github style auto links. Note: shortcodes are not parsed.
     
  
  * `time_to_read`: Estimated time to read an article based on [200 word per minute](https://irisreading.com/the-average-reading-speed/).
  
</details>

## Install
- `yarn add @chiubaca/gridsome-source-devto`
- `npm install @chiubaca/gridsome-source-devto`

## Example Usage

```js
// gridsome.config.js
module.exports = {
  plugins: [
    {
     use:'@chiubaca/gridsome-source-devto',
      options : {
        typeName: 'DevToArticles',
        devtoAPIKey: process.env.DEVTO_KEY
      }
    }
  ],
  templates: {
    DevToArticles: '/:title'
  }
}
```

You can render the each individual article in the `DevToArticles.vue` file.

```html
<template>
  <Layout>
    <article v-html="$page.posts.parsed_markdown" ></article>
  </Layout>
</template>

<page-query>
  query DevToArticles ($path: String!) {
    posts: DevToArticles (path: $path) {
      title
      parsed_markdown
    }
  }
</page-query>

<script>
import '@/prism_themes/prism-tomorrow.css';
export default {
  metaInfo() {
    return {
      title: this.$page.blogs.title
    };
  }
};
</script>

```
> To stylise your code blocks. You can download different stylesheets compatible with prism.js [here](https://prismjs.com/index.html).
### Options

`typeName` - String (Required)

The prefix to be used for your imported schemas field types.

`devtoAPIKey`- String (Required)

Get your Dev.to API key by following this instructions [https://docs.dev.to/api/index.html#section/Authentication/api_key]().
It is best to store your key in a `.env` file rather than exposing it inline in your `gridsome.config.js` files so that your key is not exposed publicly.


### Custom Routes

To add custom routes use the [`templates`](https://gridsome.org/docs/templates/) config with the collection type name as the key and the custom route as the value.

```js
// gridsome.config.js
module.exports = {
 templates: {
    DevToPosts: '/:title'
  }
}
```

