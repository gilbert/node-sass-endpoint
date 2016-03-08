var sass = require('node-sass');
var fs = require('fs');
var path = require('path');
var nodeEnv = process.env.NODE_ENV || 'development';

if (! Object.assign) {
  console.error("\n----\n");
  console.error("! Object.assign is not defined");
  console.error("  Please install node v4.0.0+ or npm install es6-object-assign");
  console.error("\n----\n");
}

exports.serve = function (filePath, options) {

  options = options || {};

  if ( ! fs.existsSync(filePath) ) {
    throw Error('[node-sass-endpoint] File does not exist: ' + filePath);
  }

  options.watchDir = options.watchDir || path.dirname(filePath);

  options.includePaths = options.includePaths || [path.dirname(filePath)];
  options.includePaths.push( path.join(process.cwd(), 'node_modules') );

  var cache = null;

  var sassOptions = {
    file: filePath,
    includePaths: options.includePaths,
    outputStyle: options.outputStyle || 'nested'
  };

  if (nodeEnv === 'development') {

    fs.watch(options.watchDir, { recursive: true }, function(e, file) {
      if (! isSassFile(file) ) return;

      if (options.debug) {
        console.log("[node-sass-endpoint] Clearing cache for:", path.basename(filePath));
      }
      cache = null;
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

var ext = /\.(sass|scss)$/;
function isSassFile (file) {
  return file.match(ext);
}
