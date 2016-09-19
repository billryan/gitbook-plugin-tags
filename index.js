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

      if (page.path === 'tags.md') {
        for (var key in tags_map) {
          if (tags_map.hasOwnProperty(key)) {
            var tag_header = eol.concat('## ', key, eol);
            page.content = page.content.concat(tag_header);
            tags_map[key].forEach(function(e) {
              var tag_body = eol.concat('- ', '[', e.title, ']', '(', e.url, ')');
              page.content = page.content.concat(tag_body);
            })
            page.content = page.content.concat(eol);
          }
        }
        return page;
      }

      // extract tags from page or YAML
      var rawtags = '';
      if (page.tags) {
        // extract from YAML
        rawtags = page.tags;
      } else {
        // extract from page
        page.content = page.content.concat(eol);  // prevent no end of line
        var _tag_exist = page.content.match(/^\s*tags:\s*\[*(.*?)\]*$/im);
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
      var page_url = this.output.toURL(page.path);
      tags.forEach(function(e) {
        if (!tags_map[e]) tags_map[e] = [];
        tags_map[e].push({
          url: page_url,
          title: page.title
        });
      })

      // generate tags for markdown
      var tags_md_ = [];
      tags.forEach(function(e) {
        tags_md_.push('[' + e + ']' + '(' + '/tags.html#' + slug(e) + ')');
      })
      var tags_md = eol + '<i class="fa fa-tags" aria-hidden="true"></i> ' + tags_md_.join(' ') + eol;

      // override tags in markdown page
      page.content = page.content.replace(/^\s?tags:\s?\[?(.*?)\]?$/im, eol);
      // replace tags info from page and YAML
      var tags_format = eol.concat('<!-- tags -->', tags_md, eol, '<!-- tagsstop -->', eol);
      var placement = this.config.get('pluginsConfig.tags.placement') || 'top';
      if (placement === 'bottom') {
        page.content = page.content.concat(tags_format);
      } else {
        page.content = page.content.replace(/^#\s*(.*?)$/m, '# $1' + tags_format);
      }

      return page;
    },

    "page": function(page) {
      // add tags id and class
      page.content = page.content.replace('<!-- tags -->', '<!-- tags --><div id="tags" class="tags">');
      page.content = page.content.replace('<!-- tagsstop -->', '</div><!-- tagsstop -->');
      return page;
    }
  }
};
