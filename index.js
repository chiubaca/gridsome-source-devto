const axios = require('axios')
const { zipWith } = require('lodash');
const { parseMarkdown, estimateTimeToRead } = require('./utils')
class DevtoSource {

  constructor(api, options) {
    /**
     * Number of articles that should be retrieved from dev.to endpoint at one time.
     * the maximum is 1000.
     */
    const ARTICLES_PER_PAGE = 100;

    /**
     * API call to /articles/me/published endpoint
     * https://docs.dev.to/api/index.html#operation/getUserPublishedArticles
     * @param {number} page - Pagination page
     * @returns {Array<{}>}
     */
    async function fetchArticles(page) {
      const articles = await axios.get(
        `https://dev.to/api/articles/me/published?page=${page}&per_page=${ARTICLES_PER_PAGE}`,
        {
          headers: { 'api-key': options.devtoAPIKey },
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
     * @param {array} results - array to store results from API call. 
     *                          We concat the results of the current cycle for the next run.
     */
    async function fetchAllUserArticles(page = 1, results = []) {
      const resp = await fetchArticles(page)

      if (resp.status !== 200) {
        return Promise.reject(resp.statusText)
      }

      if (resp.data.length === ARTICLES_PER_PAGE) {

        // increment the page and fetch all articles again, whilst appending the results to the next call.
        return fetchAllUserArticles(page + 1, results.concat(resp.data))
      }

      return results.concat(resp.data);
    }

    /**
     * Retrieves a single published article from dev.to via it's article Id
     * https://docs.dev.to/api/index.html#operation/getArticleById
     * @param {number} id - dev.to article ID 
     */
    async function fetchArticleById(id) {
      const articles = await axios.get(
        `https://dev.to/api/articles/${id}`,
      )
      return articles
    }

    /**
     * @param {array} articleIds - an array of dev.to article ids to lookup
     */
    async function fetchAllUsersArticlesById(articleIds) {
      const allArticles = []

      const batchRequestArticleById = articleIds.map(async id => fetchArticleById(id))

      for (const request of batchRequestArticleById) {
        const result = await request
        allArticles.push(result.data)
      }

      return allArticles
    }


    api.loadSource(async ({ addCollection }) => {

      // Invoke retrieval of all published articles from your dev.to account
      const allUserArticles = await fetchAllUserArticles()

      // Build an array of only the article ids. e.g [21323, 12312, 12321]
      const allArticleIds = allUserArticles.map(obj => obj.id)

      // Invoke retrieval of dev.to articles by Ids
      const allArticlesByID = await fetchAllUsersArticlesById(allArticleIds)
      // Now we can merge both the array of dev.to article objects together.
      // Credits for logic on merge an array of objects together: https://stackoverflow.com/a/53517790/7207193
      const merge = (obj1, obj2) => ({ ...obj1, ...obj2 });
      const mergedArticles = zipWith(allArticlesByID, allUserArticles, merge)

      const collection = addCollection({
        typeName: options.typeName
      })

      for (const article of mergedArticles) {

        collection.addNode({
          type_of: article.type_of,
          id: article.id,
          title: article.title,
          description: article.description,
          published: article.published,
          readable_publish_date: article.readable_publish_date,
          published_at: article.published_at,
          slug: article.slug,
          path: article.path,
          url: article.url,
          comments_count: article.comments_count,
          public_reactions_count: article.public_reactions_count,
          page_views_count: article.page_views_count,
          collection_id: article.collection_id,
          published_timestamp: article.published_timestamp,
          positive_reactions_count: article.positive_reactions_count,
          cover_image: article.cover_image,
          social_image: article.social_image,
          canonical_url: article.canonical_url,
          created_at: article.created_at,
          edited_at: article.edited_at,
          crossposted_at: article.crossposted_at,
          published_at: article.published_at,
          last_comment_at: article.last_comment_at,
          tag_list: article.tag_list,
          tags: article.tags,
          body_html: article.body_html,
          body_markdown: article.body_markdown,
          user: article.user,

          // Computed properties
          parsed_markdown: parseMarkdown(article.body_markdown),
          time_to_read: estimateTimeToRead(article.body_markdown)
        })
      }

    })
  }
}


module.exports = DevtoSource