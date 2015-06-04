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

### Settings

#### sprintBoards
Type: `String`
Default Value: *None ~ this is required... kinda*

A comma separated list of sprint board URLs or IDs. This can be omitted when
using the `ivantage_trello_release_boards` tasks.

#### trelloApiKey
Type: `String`
Default Value: *None ~ this is required*

[A Trello API Key](https://trello.com/docs/#generating-your-developer-key).

#### trelloToken
Type: `String`
Default Value: *None ~ this is required*

[A Trello token for you app](https://trello.com/docs/gettingstarted/index.html#getting-a-token-from-a-user).

#### productLabel
Type: `String`
Default Value: *None ~ this is required*

A string matching a label for Trello cards to include in the notes.

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


## The "ivantage_trello_release_notes_publish" task

### Overview
This task is essentially a glorified "concat" with some markdown-to-html
conversion baked in.

### Settings

#### files
Type: `Object`
Default Value: *None ~ this is required*

A standard grunt files hash.

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


## The "ivantage_trello_release_boards" task

### Overview
Running this task will allow the user to select which Trello boards from among
their most recently created they would like to build release notes from.

### Settings

#### options.boardFilter
Type: `RegExp|Function`
Default Value: `/\[Sprint\]/i`

Used to filter which boards are presented for selection.

When a RegExp is used only boards whose name `test` positive will be considered.

When a function is used it will be used to filter an array of board meta data
objects of the form:

```
{
  id: '... board id ...',
  name: '... board name ...'
}
```

#### trelloApiKey
Type: `String`
Default Value: *None ~ this is required... kinda*

A Trello api key. If you are using the `ivantage_trello_release_notes` task and
have specified an api key there under a target of the same name this setting can
be read from there.

#### trelloToken
Type: `String`
Default Value: *None ~ this is required... kinda*

A Trello user token. If you are using the `ivantage_trello_release_notes` task
and have specified a token there under a target of the same name this setting
can be read from there.

#### options.showMostRecent
Type: `String`
Default Value: `5`

Boards are sorted by creation date, this option configures the size of the list
to present the use with.

#### options.updateConfigPath
Type: `String`
Default Value: `'ivantage_trello_release_notes.<%= this.target %>.sprintBoards`

Allows the user to omit the `sprintBoards` setting in their
`ivantage_trello_release_notes` task. Upon completion the task will update this
grunt config path to reflect chosen boards.

#### options.trelloOrganization
Type: `String`
Default Value: `'ivantage`

The Trello API requires that we fetch lists of boards in the context of a user
or organization.


## Usage Example

A full blown example:

```js
grunt.initConfig({
  ivantage_trello_release_boards: {
    awesome_product: {
      // Silence is golden.
      //
      // We can omit most settings here, they will be read fromt the
      // ivantage_trello_release_notes's target of the same name.
    }
  },

  ivantage_trello_release_notes: {
    options: {
    },
    awesome_product: {
      productLabel: 'AWESOME_PRODUCT',
      trelloApiKey: process.env.TRELLO_API_KEY,
      trelloToken: process.env.TRELLO_TOKEN
      // Note that in this case board ids are set by the
      // `ivantage_trello_release_boards` task target of the same name.
    }
  },

  ivantage_trello_release_notes_publish: {
    awesome_product: {
      files: {
        'path/to/public/folder/release-notes.html': 'releasenotes/*.md'
      }
    }
  },
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using [Grunt](http://gruntjs.com/).


## Release History
- 2015-06-04 v0.2.0 Add publish and board selection tasks
- 2015-06-03 v0.1.0 Initial Release


## License
MIT
