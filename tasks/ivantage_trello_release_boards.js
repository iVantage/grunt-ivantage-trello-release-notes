
/*
 * grunt-ivantage-trello-release-notes
 * https://github.com/ivantage/grunt-ivantage-trello-release-notes
 *
 * Copyright (c) 2015 iVantage
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var inquirer = require('inquirer')
    , Trello = require('node-trello')
    , trelloUtils = require('node-trello-utils');

  var taskName = 'ivantage_trello_release_boards';

  grunt.registerMultiTask(taskName, 'Select sprint boards to build release notes from.', function() {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var opts = this.options({
      // How to recognize sprint boards must be function or RegExp. If function
      // should expect to get a board object with just name and id fields,
      // should return a boolean to indicate inclusion.
      boardFilter: /\[Sprint\]/i,

      // How many boards to show
      showMostRecent: 5,

      // Where should we place the selected board ids? Assume there's a 
      updateConfigPath: [
        'ivantage_trello_release_notes',
        this.target,
        'sprintBoards'
      ].join('.'),

      // Organize to inspect boards for
      trelloOrganization: 'ivantage'
    });

    // If (1) the release notes task is being used and (2) it has a target with
    // `this.name` and (3) we weren't given an api key or token just grab it
    // from there.

    var propTrelloApiKey = [
      'ivantage_trello_release_notes',
      this.target,
      'trelloApiKey'
    ].join('.');

    var propTrelloToken = [
      'ivantage_trello_release_notes',
      this.target,
      'trelloToken'
    ].join('.');

    var trelloApiKey = this.data.trelloApiKey ||
      grunt.config.get(propTrelloApiKey);

    var trelloToken = this.data.trelloToken ||
      grunt.config.get(propTrelloToken);

    if(!trelloApiKey) {
      this.requiresConfig(propTrelloApiKey);
    }

    if(!trelloToken) {
      this.requiresConfig(propTrelloToken);
    }

    var t = new Trello(trelloApiKey, trelloToken);

    t.get(
      '/1/organizations/' + opts.trelloOrganization + '/boards',
      {fields: 'id,name', filter: 'open'},
      function(err, boards) {
        if(err) {
          grunt.log.error(err);
          done(false);
        }

        boards = typeof opts.boardFilter === 'function' ?
          boards.filter(opts.boardFilter) :
          boards.filter(function(b) {
            return opts.boardFilter.test(b.name);
          });

        /**
         * Trello stores boards info in a mongo backend. They don't explicitly
         * expose a creation time for boards but we can get this information
         * from the board id itself. The fist 8 chars represent a hex timestamp
         * of the creation time.
         *
         * @see http://help.trello.com/article/759-getting-the-time-a-card-or-board-was-created
         */
        boards.sort(function(a, b) {
          var aTime = parseInt(a.id.substring(0,8), 16)
            , bTime = parseInt(b.id.substring(0,8), 16);
          // We want these in descending order
          return aTime < bTime ? 1 : -1;
        });

        if(boards.length > opts.showMostRecent) {
          boards.length = opts.showMostRecent;
        }

        inquirer.prompt([{
          type: 'checkbox',
          message: 'Select boards to build release notes from',
          name: 'boardIds',
          choices: boards.map(function(b) {
            return {
              name: b.name,
              value: b.id
            };
          })
        }], function(answers) {
          grunt.config.set(
            opts.updateConfigPath,
            answers.boardIds.join(','));
          done();
        });

      });


  });

};


