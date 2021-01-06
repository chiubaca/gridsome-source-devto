const matter = require('gray-matter');

/**
 * 
 * @param {string} markdown - markdown text to be parsed
 */
exports.parseMarkdown =  function parseMarkdown(markdown) {

    // split apart any front matter from the markdown content
    // TODO: Do something with the front matter
    const {content, frontmatter} = matter(markdown);

    let parsedMD;
    require('unified')()
         // parses the mark down into an mdast - https://github.com/remarkjs/remark/tree/main/packages/remark-parse
        .use(require('remark-parse')) 
        // adds id tag to all headers - https://github.com/remarkjs/remark-slug
        .use(require('remark-slug')) 
        // adds links to headings, used in conjunction with remark-slug - https://github.com/remarkjs/remark-autolink-headings
        .use(require('remark-autolink-headings'))
        // adds syntac highlighting to code blocks with prism.js - https://github.com/sergioramos/remark-prism
        .use(require('remark-prism'), {
            /* options */
        })
        // transforms the mdast to hast aka html - https://github.com/remarkjs/remark-rehype
        .use(require('remark-rehype'))
        // formats the output html from outputted by remark-rehype. might be able to remove this - https://github.com/rehypejs/rehype-format
        .use(require('rehype-format'))
        // stringifies the hast outputted by rehype - https://github.com/rehypejs/rehype/tree/main/packages/rehype-stringify
        .use(require('rehype-stringify'))
        .process(content, (err, file) => parsedMD = String(file));
        return parsedMD;
}
