/*
 * grunt-ivantage-trello-release-notes
 * https://github.com/ivantage/grunt-ivantage-trello-release-notes
 *
 * Copyright (c) 2015 jtrussell
 * Licensed under the MIT license.
 */

'use strict'

module.exports = function (grunt) {
  var pkg = grunt.file.readJSON('package.json')

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: ['gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    /**
     * @todo Create a public board for this to be tested against... eh not
     * really a "unit" test...
     */
    // ivantage_trello_release_notes: {
    //   all: {
    //     options: {
    //       outfile: 'releasenotes/release-v' + pkg.version + '.md',
    //       doneListName: 'Live/Done',
    //       headerTpl: '### Version ' + pkg.version,
    //       storyTpl: '- {{name}} ([go to card]({{url}}))'
    //     },
    //     //sprintBoards: '********,********',
    //     //productLabel: '********',
    //     //trelloApiKey: '********************************',
    //     //trelloToken: '****************************************************************',
    //   }
    // },

    ivantage_trello_release_notes_publish: {
      test: {
        options: {
          header: '<html>',
          footer: '</html>'
        },
        files: {
          'tmp/consolidated-notes.html': 'test/fixtures/releasenotes/*.md'
        }
      }
    },

    nodeunit: {
      options: {
        reporter: 'minimal'
      },
      tests: ['test/*_test.js']
    }
  })

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks')

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-nodeunit')

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'clean',
    //'ivantage_trello_release_notes',
    'ivantage_trello_release_notes_publish',
    'nodeunit'
  ])

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test'])
}
