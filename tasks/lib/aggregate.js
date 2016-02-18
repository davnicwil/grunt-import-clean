module.exports = (function() {

  'use strict';

  var path = require( 'path' );

  return function( files, importsToIgnore, logIgnoredVerbose ) {

    var result = {
      unused: {},
      totalFiles: files.length,
      foundFiles: 0,
      foundImports: 0,
      ignoredImports: 0
    };

    var isIgnoredImport = function( unused ) {
      return importsToIgnore.indexOf(unused) != -1;
    };

    var reportUnusedImport = function( unused ) {
      if (isIgnoredImport( unused )) {
        result.ignoredImports++;
        return logIgnoredVerbose && unused + '   (IGNORED)';
      } else {
        result.foundImports++;
        return unused;
      }
    };

    var validReport = function( report ) {
      return !!report;
    }

    files.forEach(function( file ) {
      var name = path.basename( file.src );
      if (file.unused.length) {
        var fileReport = file.unused.map(reportUnusedImport).filter(validReport);
        if(fileReport.length) {
          result.unused[name] = fileReport;
        }
        result.foundFiles++;
      }
    });

    return result;
  };
}());
