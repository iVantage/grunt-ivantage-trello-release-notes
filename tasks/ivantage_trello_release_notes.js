
/*
 * grunt-ivantage-trello-release-notes
 * https://github.com/ivantage/grunt-ivantage-trello-release-notes
 *
 * Copyright (c) 2015 iVantage
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var Trello = require('node-trello')
    , trelloUtils = require('node-trello-utils')
    , async = require('async')
    , hbs = require('handlebars');

  grunt.registerMultiTask('ivantage_trello_release_notes', 'Build release notes from user stories in Trello cards.', function() {
    var done = this.async();

    // Try to gather some info on the host package for more useful defaults
    var pkg;
    try {
      pkg = grunt.file.readJSON('package.json');
    } catch(err) {
      pkg = {version: 'X.Y.Z'};
    }

    console.log(pkg.version);

    // Merge task-specific and/or target-specific options with these defaults.
    var opts = this.options({
      sprintBoards: 'baord1,board2',
      productLabel: 'awesomeProduct',
      featuresLabel: 'Feature',
      bugLabel: 'Bug',
      outfile: 'releasenotes/tag-v' + pkg.version + '.md',
      trelloApiKey: '',
      trelloToken: '',
      doneListName: 'Live/Done',
      headerTpl: '### Version ' + pkg.version,
      storyTpl: '- {{name}} ([go to card]({{url}}))'
    });

    var t = new Trello(opts.trelloApiKey, opts.trelloToken);

    var sprintBoardIds = opts
        .sprintBoards
        .split(',')
        .map(trelloUtils.getBoardIdFromUrl);

    var productLabel = opts.productLabel.toLowerCase();

    var tpl = hbs.compile(opts.storyTpl);

    async.map(
      sprintBoardIds,
      function(boardId, cb) {
        trelloUtils.getCardsByListName(t, boardId, opts.doneListName, true, cb);
      },
      function(err, cardsAndCards) {
        if(err) {
          grunt.log.error(err);
          return done(false);
        }
        var cards = Array.prototype.concat.apply([], cardsAndCards);
        
        // We only want the cards tagged with the given product label
        cards = cards.filter(function(c) {
          return c.labels.filter(function(f) {
            return f.name.toLowerCase() === productLabel;
          }).length > 0;
        });

        buildReleaseNotesFromCards(cards);
      });

    var buildReleaseNotesFromCards = function(cards) {
      var notes = cards.map(function(c) {
        return tpl(c);
      });

      grunt.file.write(opts.outfile, [opts.headerTpl, ''].concat(notes).join('\n'));
      grunt.log.writeln('Release note written to ' + opts.outfile);
    };

  });

};
