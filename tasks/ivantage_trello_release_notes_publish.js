
/*
 * grunt-ivantage-trello-release-notes
 * https://github.com/ivantage/grunt-ivantage-trello-release-notes
 *
 * Copyright (c) 2015 iVantage
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var async = require('async')
    , kramed = require('kramed');

  grunt.registerMultiTask('ivantage_trello_release_notes_publish', 'Publish consolidated release notes.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var opts = this.options({
      header: '',
      separator: '\n\n\n',
      footer: '',
      sortShardsFn: require('../lib/sort-md-files.js')
    });

    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      src.sort(opts.sortShardsFn);
      
      src = src.map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(opts.separator));

      // Process markdown
      src = kramed(src);

      // Write the destination file.
      grunt.file.write(f.dest, opts.header + src + opts.footer);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};

