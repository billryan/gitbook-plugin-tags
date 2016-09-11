var urls = {};

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

      if (page.tags) {
        // extract from YAML
        var rawtags = page.tags;
      } else {
        // extract from page
        var _tag_exist = page.content.match(/[\r\n|\r|\n]\s?tags:\s?\[?(.*?)\]?[\r\n|\r|\n]/i);
        if (!_tag_exist) return page;
        var rawtags = _tag_exist[1].replace(/['"]+/g, '');
      }
      // process both YAML and RegExp string
      rawtags = '' + rawtags;
      tags = rawtags.split(',').map(function(e) {return e.trim();})
      console.log(tags);
      var lang = this.isLanguageBook()? this.language : '';
      if (lang) lang = lang + '/';
      console.log('path: ' + lang + page.path);
      if (page.path === 'tags.md') {
        console.log('processing tags.md');
      }
      urls.push({
        url: this.output.toURL(lang + page.path)
      });
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
