# gitbook-plugin-tags

[![npm](https://img.shields.io/npm/v/gitbook-plugin-tags.svg?style=plastic)](https://npmjs.org/package/gitbook-plugin-tags) [![npm](https://img.shields.io/npm/dm/gitbook-plugin-tags.svg?style=plastic)](https://npmjs.org/package/gitbook-plugin-tags) [![npm](https://img.shields.io/npm/dt/gitbook-plugin-tags.svg?style=plastic)](https://npmjs.org/package/gitbook-plugin-tags)

## Tags for GitBook

Since GitBook do not support this feature native, currently I create this plugin to create tags if `tags: xxx` in markdown page or YAML header.

## Usage

### create `tags.md` file and put it into `SUMMARY.md`

Create a file named `tags.md` at the root dir and put it at the last entry of `SUMMARY.md`.
A valid `SUMMARY.md` is:
```
# Summary

* [Introduction](README.md)
* [First Chapter](chapter1.md)
* [Tags](tags.md)
```
You can keep the file `tags.md` empty or add header such as
```
# Tags
```

### add plugin in `book.json`

```
{
  "plugins": [
    "tags"
  ],
}
```

### add tags in page

Just drop one line such as
```
tags: tag1, tag2, tag3 is here
```
tags are separated by comma.

### config placement

Tags will show after the title by default, you can config the placement in the bottom.

```
    "pluginsConfig": {
        "tags": {
            "placement": "bottom"
        }
    }
```

Demo website ==> https://yuanbin.gitbooks.io/test/content/

Enjoy!
