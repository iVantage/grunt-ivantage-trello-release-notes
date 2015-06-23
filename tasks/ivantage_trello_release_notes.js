
/*
 * grunt-ivantage-trello-release-notes
 * https://github.com/ivantage/grunt-ivantage-trello-release-notes
 *
 * Copyright (c) 2015 iVantage
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var Trello = require('node-trello')
    , trelloUtils = require('node-trello-utils')
    , async = require('async')
    , hbs = require('handlebars');

  var taskName = 'ivantage_trello_release_notes';

  hbs.registerHelper('ivhStoryName', function(name) {
    // Stip out things in square brackets and trim
    return name.replace(/\[[^\]]+\]/g, '').trim();
  });

  grunt.registerMultiTask(taskName, 'Build release notes from user stories in Trello cards.', function() {
    var done = this.async();

    // Try to gather some info on the host package for more useful defaults
    var pkg;
    try {
      pkg = grunt.file.readJSON('package.json');
    } catch(err) {
      pkg = {version: 'X.Y.Z'};
    }

    // Merge task-specific and/or target-specific options with these defaults.
    var opts = this.options({
      outfile: 'releasenotes/release-v' + pkg.version + '.md',
      doneListName: 'Live/Done',
      doneDoneDomain: '',
      headerTpl: '### Version ' + pkg.version,
      storyTpl: '- {{ivhStoryName name}} ([go to card]({{url}})) {{#if donedone}}{{#each donedone}}([#{{issue}}]({{url}})) {{/each}}{{/if}}'
    });

    // Make sure we have our required configs
    this.requiresConfig(
      [taskName, this.target, 'sprintBoards'].join('.'),
      [taskName, this.target, 'productLabel'].join('.'),
      [taskName, this.target, 'trelloApiKey'].join('.'),
      [taskName, this.target, 'trelloToken'].join('.')
    );

    var t = new Trello(
      this.data.trelloApiKey,
      this.data.trelloToken
    );

    var sprintBoardIds = this.data
        .sprintBoards
        .split(',')
        .filter(function(b) {
          return b.trim().length > 0;
        })
        .map(trelloUtils.getBoardIdFromUrl);

    if(!sprintBoardIds.length) {
      grunt.log.writeln('No sprint boards provided... skipping release note generation');
      return done(true);
    }

    var productLabel = this.data.productLabel.toLowerCase();

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

        // Sort cards by story size, then alphabetically
        cards.sort(function(a, b) {
          var aSize = -1
            , bSize = -1;
          if(/\((\d+)\)/.exec(a.name)) {
            aSize = parseInt(RegExp.$1, 10);
          }
          if(/\((\d+)\)/.exec(b.name)) {
            bSize = parseInt(RegExp.$1, 10);
          }

          // i.e. both -1
          if(aSize === bSize) {
            return a < b ? -1 : 1;
          }

          if(aSize > -1 && bSize > -1) {
            return aSize < bSize ? 1 : -1;
          }

          return aSize > -1 ? -1 : 1;
        });

        buildReleaseNotesFromCards(cards);
      });

    var buildReleaseNotesFromCards = function(cards) {

      // Get any embedded DoneDone links
      if(opts.doneDoneDomain) {
        var pattern = new RegExp('https://' + opts.doneDoneDomain + '\.mydonedone\.com/issuetracker/projects/([0-9])*/issues/([0-9])*','ig');

        cards.forEach(function(c) {
          var donedone = []
            , matches
            , match
            , url;
          matches = c.desc.match(pattern);
          if(matches) {
            url = RegExp.lastMatch;
            match = url.match('issues\/([0-9]*)');
            if(match) {
              donedone.push({
                url: url,
                issue: match[1]
              });
            }
          }
          c.donedone = donedone;
        });
      }

      var notes = cards.map(function(c) {
        return tpl(c);
      });

      var shard = [opts.headerTpl, ''].concat(notes)
                  .join('\n')
                  .concat('\n'); // Signal that list is complete.

      grunt.file.write(opts.outfile, shard);
      grunt.log.writeln('Notes written to "' + opts.outfile + '"');
      done();
    };

  });

};
