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

      // get page path
      var lang = this.isLanguageBook()? this.language : '';
      if (lang) lang = lang + '/';
      var page_path = this.output.toURL(lang + page.path);

      if (page.path === 'tags.md') {
        for (var key in tags_map) {
          if (tags_map.hasOwnProperty(key)) {
            var tag_header = ''.concat(eol, '## ', key, eol);
            page.content = page.content.concat(tag_header);
            tags_map[key].forEach(function(e) {
              var tag_body = ''.concat(eol, '- ', '[', e.title, ']', '(', e.url, ')');
              page.content = page.content.concat(tag_body);
            })
            page.content = page.content.concat(eol);
          }
        }
      }

      // extract tags from page or YAML
      var rawtags = '';
      if (page.tags) {
        // extract from YAML
        rawtags = page.tags;
      } else {
        // extract from page
        var _tag_exist = page.content.match(/[\r\n]\s*tags:\s*\[*(.*?)\]*[\r\n]/i);
        if (!_tag_exist) return page;
        rawtags = _tag_exist[1];
      }

      // process both YAML and RegExp string
      rawtags = ('' + rawtags).split(',');
      var tags = [];
      rawtags.forEach(function(e) {
        var tags_ = e.match(/^\s*['"]*\s*(.*?)\s*['"]*\s*$/)[1];
        if (tags_) tags.push(tags_);
      })

      // push to tags_map
      var page_title = page.content.match(/^#\s*(.*?)[\r\n|\r|\n]/)[1];
      tags.forEach(function(e) {
        if (!tags_map[e]) tags_map[e] = [];
        tags_map[e].push({
          url: page_path,
          title: page_title
        });
      })

      // generate tags for markdown
      var tags_md_ = [];
      tags.forEach(function(e) {
        tags_md_.push('[' + e + ']' + '(' + lang + 'tags.html#' + slug(e) + ')');
      })
      var tags_md = eol + '<i class="fa fa-tags" aria-hidden="true"></i> ' + tags_md_.join(' ') + eol;

      // override tags in markdown page
      page.content = page.content.replace(/[\r\n|\r|\n]\s?tags:\s?\[?(.*?)\]?[\r\n|\r|\n]/i, '');
      // replace tags info from page and YAML
      var title_tags = ''.concat('# ', page_title, eol, '<!-- tags -->', tags_md, eol, '<!-- tagsstop -->', eol);
      page.content = page.content.replace(/^#\s*(.*?)[\r\n|\r|\n]/, title_tags);

      return page;
    },

    "page": function(page) {
      page.content = page.content.replace('<!-- tags -->', '<!-- tags --><div id="tags" class="tags">');
      page.content = page.content.replace('<!-- tagsstop -->', '</div><!-- tagsstop -->');
      return page;
    }
  }
};
