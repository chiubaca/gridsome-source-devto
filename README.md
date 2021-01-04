# Dev.to source for Gridsome

>  This package is under development and API might change before v1 is released.

This is a source plugin for [DEV.to](https://dev.to/). It retrieves all your published articles via the [DEV API (beta)](https://docs.dev.to/api/).

This plugin merges and exposes the entire schema for both the [`getArticles`](https://docs.dev.to/api/index.html#operation/getArticles) and [`getArticleById`](https://docs.dev.to/api/index.html#operation/getArticleById) so you can benifit from both data sources easily. This is useful becasue for example `page_views_count` is available on [`getArticles`](https://docs.dev.to/api/index.html#operation/getArticles) but not on [`getArticleById`](https://docs.dev.to/api/index.html#operation/getArticleById). On the flip-side `body_html` is available on [`getArticleById`](https://docs.dev.to/api/index.html#operation/getArticleById) but not on [`getArticles`](https://docs.dev.to/api/index.html#operation/getArticles). I dont know why DEV.to have implemented their API like this, but with this plugin you dont need to worry about it.

## Install
- `yarn add @gridsome/source-contentful`
- `npm install @gridsome/source-contentful`


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
  ]
}
```

### Options

`typeName` - String (Required)

The prefix to be used for your imported schema's field types.

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

