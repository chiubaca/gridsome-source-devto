const axios = require('axios')

class DevtoSource {
  // Default options for the plugin
  static defaultOptions() {
    return {
    }
  }
  // api is the gridsome api - https://gridsome.org/docs/server-api/#apiloadsourcefn
  // options are the params passed in my the user in gridsome.config.js
  constructor(api, options) {
    console.log("user options", options)

    api.loadSource(async ({ addCollection }) => {
      // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
      const devToArticles = await axios.get(
        'https://dev.to/api/articles/me/published?page=1&per_page=1000',
        {
          headers: { 'api-key': options.devtoToken },
        }
      )

      const collection = addCollection({
        typeName: options.typeName
      })

      for (const post of devToArticles.data) {
        collection.addNode({
          id: post.id,
          title: post.title,
          description: post.description,
          publishedAt: post.published_at,
          slug: post.slug,
          url: post.url,
          bodyMarkdown: post.body_markdown,
          tags: post.tag_list
        })
        console.log("Adding dev.to article", post.title)
      }
    })
  }
}


module.exports = DevtoSource