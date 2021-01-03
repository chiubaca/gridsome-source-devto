const axios = require('axios')

class DevtoSource {
  // Default options for the plugin
  static defaultOptions() {
    return {
    }
  }

  constructor(api, options) {
    console.log("user options", options)

    /**
     * Number of articles that should be retrieved from dev.to endpoint at one time.
     * the maximum is 1000.
     */
    const ARTICLES_PER_PAGE = 100;

    /**
     * Sleep utility
     * @param {number} ms 
     */
    function sleep(ms) {
      new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * API call to /articles/me/published endpoint
     * https://docs.dev.to/api/index.html#operation/getUserPublishedArticles
     * @param {number} page - Pagination page
     */
    async function fetchArticles(page) {
      const articles = await axios.get(
        `https://dev.to/api/articles/me/published?page=${page}&per_page=${ARTICLES_PER_PAGE}`,
        {
          headers: { 'api-key': options.devtoToken },
        }
      )
      return articles
    }

    /**
     * Recursive function to retrieve all articles for a given user.
     * Function exits when the length of the results is not the same as ARTICLES_PER_PAGE
     * Credits to - https://github.com/cevr/me/blob/5bcc358fe1d892b1d0936429eb832d62a686bc2d/src/lib/posts.ts#L104
     * 
     * @param {number} page - pagination of dev.to getUserPublishedArticles endpoint.
     * @param {array} results - starts as empty array. We concat the results for the next run.
     */
    async function fetchAllArticles(page = 1, results = []) {

      const resp = await fetchArticles(page)

      if (resp.status !== 200) {
        return Promise.reject(resp.statusText)
      }
      // 
      if (resp.data.length === ARTICLES_PER_PAGE) {
        // small pause is required so we don't hit 429 error "Too many requests" issue.
        await sleep(100)
        // increment the page and fetch all articles again, whilst appending the results to the next call.
        return fetchAllArticles(page + 1, results.concat(resp.data))
      }
      return results.concat(resp.data);
    }

    api.loadSource(async ({ addCollection }) => {

      const allArticles = await fetchAllArticles()

      console.log("Got Articels!", allArticles.length)

      const collection = addCollection({
        typeName: options.typeName
      })

      for (const article of allArticles) {
        collection.addNode({
          id: article.id,
          title: article.title,
          description: article.description,
          published_at: article.published_at,
          slug: article.slug,
          url: article.url,
          body_markdown: article.body_markdown,
          tags: article.tag_list,
          // Computed properties
        })
      }

    })
  }
}


module.exports = DevtoSource