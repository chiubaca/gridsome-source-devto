/**
 * 
 * @param {string} markdown - markdown text to be parsed
 */
exports.parseMarkdown =  function parseMarkdown(markdown) {

    let parsedMD;
    require('unified')()
        .use(require('remark-parse'))
        .use(require('remark-prism'), {
            /* options */
        })
        .use(require('remark-rehype'))
        .use(require('rehype-format'))
        .use(require('rehype-stringify'))
        .process(markdown, (err, file) => parsedMD = String(file));
        return parsedMD;
}
