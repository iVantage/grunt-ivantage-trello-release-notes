
/*
 * grunt-ivantage-trello-release-notes
 * https://github.com/ivantage/grunt-ivantage-trello-release-notes
 *
 * Copyright (c) 2015 iVantage
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var taskName = 'ivantage_trello_release';

  grunt.registerMultiTask(taskName, 'Gather board IDs, generate version notes, and pulbish all in one.', function() {

    // Save passed options to pass along to sub-tasks
    var opts = this.options({})
      , target = this.target;

    this.requiresConfig(
      [taskName, target, 'files'].join('.'),
      [taskName, target, 'productLabel'].join('.'),
      [taskName, target, 'trelloApiKey'].join('.'),
      [taskName, target, 'trelloToken'].join('.')
    );

    var boardsTask = 'ivantage_trello_release_boards'
      , notesTask = 'ivantage_trello_release_notes'
      , publishTask = 'ivantage_trello_release_notes_publish'
      , svnCiTask = 'ivantage_trello_svn_ci';

    var mixins = {};

    // Create the "boards" task config
    mixins[boardsTask] = {};
    mixins[boardsTask][target] = {
      options: opts
    };

    // Create "notes" task config
    mixins[notesTask] = {};
    mixins[notesTask][target] = {
      options: opts,
      productLabel: this.data.productLabel,
      trelloApiKey: this.data.trelloApiKey,
      trelloToken: this.data.trelloToken
    };

    // Create the "publish" task config
    mixins[publishTask] = {};
    mixins[publishTask][target] = {
      options: opts,
      files: this.data.files
    };

    // Create the "svn ci" task config
    mixins[svnCiTask] = {};
    mixins[svnCiTask][target] = {
      options: opts
    };

    grunt.config.merge(mixins);

    // Do all the things!
    grunt.task.run([
      boardsTask,
      notesTask,
      publishTask,
      svnCiTask
    ]);
  });
};
