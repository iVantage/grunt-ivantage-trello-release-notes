
/*
 * grunt-ivantage-trello-release-notes
 * https://github.com/ivantage/grunt-ivantage-trello-release-notes
 *
 * Copyright (c) 2015 iVantage
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var taskName = 'ivantage_trello_svn_ci'
    , sh = require('shelljs');

  grunt.registerMultiTask(taskName, 'SVN commit generated release notes.', function() {

    // Save passed options to pass along to sub-tasks
    var opts = this.options({
      dryRun: false,
      svnDoCommit: false,
      svnForceAdd: true,
      svnCommitPaths: ['.']
    });

    if(!opts.svnDoCommit) {
      // Skipping...
      grunt.log.writeln('Skipping svn commit');
      return true;
    }

    if(!sh.which('svn')) {
      grunt.log.error('Task "' + taskName + '" requires the svn executable to be in your path.');
      return false;
    }

    // Add release notes to svn
    var addCmd = 'svn add ';

    if(opts.svnForceAdd) {
      addCmd += '--force ';
    }

    addCmd += opts.svnCommitPaths.join(' ');

    if(opts.dryRun) {
      grunt.log.writeln('Not running: "' + addCmd + '"');
    } else {
      var addCmdOut = sh.exec(addCmd, {silent: true});
      if(0 !== addCmd.code) {
        grunt.log.error('Failed to add release notes to version control.');
        return false;
      }
    }

    // Commit release notes
    var ciCmd = 'svn ci ' + opts.svnCommitPaths.join(' ');

    if(opts.dryRun) {
      grunt.log.writeln('Note running: "' + ciCmd + '"');
    } else {
      var ciCmdOut = sh.exec(ciCmd, {silent: true});
      if(0 !== ciCmdOut.code) {
        grunt.log.error('Failed to commit release notes.');
        return false;
      }
    }

    grunt.log.writeln('Release notes added to version control');
  });
};

