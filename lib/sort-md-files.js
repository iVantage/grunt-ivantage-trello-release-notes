
/**
 * Helper to sort markdown shards before publishing
 *
 * <description>
 *
 * @package <package-name>
 * @copyright 2015 iVantage Health Analytics, Inc.
 */

'use strict';

var semver = require('semver');

var getSemverFromFileName = function(f) {
  if(/v(\d+\.\d+\.\d+)/.exec(f)) {
    return RegExp.$1;
  }
  return '0.0.0';
};

module.exports = function(f1, f2) {
  var s1 = getSemverFromFileName(f1)
    , s2 = getSemverFromFileName(f2);
  return semver.rcompare(s1, s2);
};
