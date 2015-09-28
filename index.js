var sass = require('node-sass');
var fs = require('fs');
var path = require('path');
var nodeEnv = process.env.NODE_ENV || 'development';

exports.serve = function (filePath, options) {

  options = options || {};

  options.watchDir = options.watchDir || path.dirname(filePath);
  options.includePaths = options.includePaths || [path.dirname(filePath)];

  var deps  = new Set([ path.basename(filePath, '.scss') ]);
  var cache = null;

  var sassOptions = {
    file: filePath,
    includePaths: options.includePaths
  };

  if (nodeEnv === 'development') {
    sassOptions.importer = function (file, prev, done) {
      deps.add(file);
      return file;
    };

    fs.watch(options.watchDir, { recursive: true }, function(e, file) {
      if (! isSassFile(file) ) return;

      // Remove underscores (the importer fn receives file names without underscores)
      var basename = file.replace(/\.scss$/, '').replace(/\/_/, '/');

      if (deps.has(basename)) {
        if (options.debug) console.log("[node-sass-endpoint] Clearing cache for:", path.basename(filePath));
        cache = null;
      }
    });
  }


  return function (req, res) {

    res.set('Content-Type', 'text/css');

    if (cache) {
      return res.send(cache);
    }

    sass.render( Object.assign({}, sassOptions), function(error, result) {
      if (error) {
        console.log("\n----------------------------\n");
        console.log("SASS ERROR:", error.message);
        console.log("\tin file", error.file);
        console.log("\ton line", error.line, "col", error.column);
        console.log("\n----------------------------\n");
        return res.status(500).send(error);
      }

      cache = result.css;
      res.send(result.css);
    });
  }

}

var ext = /\.scss$/;
function isSassFile (file) {
  return file.match(ext);
}
