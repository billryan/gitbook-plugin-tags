var tags_map = {};
var slug = require('github-slugid');
var eol = require('os').EOL;

module.exports = {
  book: {
    assets: './assets',
    css: [
      "plugin.css"
    ]
  },
  hooks: {
    "page:before": function(page) {
      if (this.output.name != 'website') return page;

      var rawtags = '';
      if (page.tags) {
        // extract from YAML
        rawtags = page.tags;
      } else {
        // extract from page
        var _tag_exist = page.content.match(/[\r\n|\r|\n]\s?tags:\s?\[?(.*?)\]?[\r\n|\r|\n]/i);
        if (!_tag_exist) return page;
        rawtags = _tag_exist[1].replace(/['"]+/g, '');
      }
      // process both YAML and RegExp string
      rawtags = '' + rawtags;
      var tags = rawtags.split(',').map(function(e) {return e.trim();});

      // get page path
      var lang = this.isLanguageBook()? this.language : '';
      if (lang) lang = lang + '/';
      var page_path = this.output.toURL(lang + page.path);
      console.log('page path: ' + page_path);

      // push to tags_map
      tags.forEach(function(e) {
        console.log('push tag ' + e);
        if (!tags_map[e]) tags_map[e] = [];
        tags_map[e].push({
          url: page_path,
          title: page.title
        });
      })
      console.log(tags_map);

      // generate tags markdown
      var tags_md_ = [];
      tags.forEach(function(e) {
        tags_md_.push('[' + e + ']' + '(' + lang + 'tags/#' + slug(e) + ')');
      })
      var tags_md = eol + 'tags: ' + tags_md_.join(', ') + eol;
      console.log('tags_md' + tags_md);

      // remove tags info from page
      // page.content = page.content.
      if (page.path === 'tags.md') {
        console.log('processing tags.md');
      }
      return page;
    },

    "page": function(page) {
      if (page.tags) console.log('tags in YAML' + page.tags);
      console.log(this.output.toURL(page.path));
      return page;
    },

    "finish": function() {

    }
  }
};
