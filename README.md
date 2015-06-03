# grunt-ivantage-trello-release-notes

> Build release notes from user stories in Trello cards.


## Getting Started

```shell
npm install grunt-ivantage-trello-release-notes --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with
this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ivantage-trello-release-notes');
```


## The "ivantage_trello_release_notes" task

### Overview
In your project's Gruntfile, add a section named `ivantage_trello_release_notes`
to the data object passed into `grunt.initConfig()`.

This task scrapes a trello board for user stories that are considered "done"
in order to build release note snippets.

```js
grunt.initConfig({
  ivantage_trello_release_notes: {
    your_target: {
      options: {
        // Target-specific options go here.
      }
    }
});
```

### Options

#### options.sprintBoards
Type: `String`
Default Value: *None ~ this is required*

A comma separated list of sprint board URLs or IDs.

#### options.trelloApiKey
Type: `String`
Default Value: *None ~ this is required*

[A Trello API Key](https://trello.com/docs/#generating-your-developer-key).

#### options.trelloToken
Type: `String`
Default Value: *None ~ this is required*

[A Trello token for you app](https://trello.com/docs/gettingstarted/index.html#getting-a-token-from-a-user).

#### options.productLabel
Type: `String`
Default Value: *None ~ this is required*

#### options.outfile
Type: `String`
Default Value: `releasenotes/release-v<%= *version from your package.json* %>`

The location to write the generated markdown snippet.

#### options.doneListName
Type: `String`
Default Value: `Live/Done`

The list name for "done" cards. Only cards in this list will be included in the
final release notes.

#### options.headerTpl
Type: `String`
Default Value: `### Version <%= *version from your package.json* %>`

A header template for the generated markdown snippet.

#### options.storyTpl
Type: `String`
Default Value: `- {{name}} ([go to card]({{url}}))`

The markdown template to be applied to each trello card in our done list.

### Usage Example

In this example, the default options are used to do something with whatever. So
if the `testing` file has the content `Testing` and the `123` file had the
  content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  ivantage_trello_release_notes: {
    awesome_product: {
      options: {
        sprintBoard: '3Bc143aD,https://trello.com/b/AbC123AZ/Awesome-Sprint',
        trelloApiKey: process.env.TRELLO_API_KEY,
        trelloToken: process.env.TRELLO_TOKEN,
        productLabel: 'Money Maker'
      }
    }
  },
});
```


## The "ivantage_trello_release_notes_publish" task

### Overview
This task is essentially a glorified "concat" with some markdown-to-html
conversion baked in.

```js
grunt.initConfig({
  ivantage_trello_release_notes_publish: {
    awesome_product: {
      options: {
        header: '<html>...',
        separator: '\n',
        footer: '...</html>'
      }
      files: {
        'final-notes.html': 'releasenotes/*.md'
      }
    }
  }
});
```

### Options

#### options.header
Type: `String`
Default Value: `''`

Some HTML to include before the concatenated snippets.

#### options.separator
Type: `String`
Default Value: `\n`

Text to insert between each of the given files when concatenating. Note that
files are concatenated before being converted to HTML.

#### options.footer
Type: `String`
Default Value: `''`

Some HTML to include after the concatenated snippets.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using [Grunt](http://gruntjs.com/).


## Release History
- 2015-06-03 v0.1.0 Initial Release


## License
MIT
