const axios = require('axios')

class DevtoSource {
  // Default options for the plugin
  static defaultOptions() {
    return {
    }
  }

  constructor(api, options) {
    console.log("user options", options)

    api.loadSource(async ({ addCollection }) => {

      // TODO : Fetch all articles smarter like this: 
      // https://github.com/cevr/me/blob/5bcc358fe1d892b1d0936429eb832d62a686bc2d/src/lib/posts.ts#L104
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

      }
    })
  }
}


module.exports = DevtoSource