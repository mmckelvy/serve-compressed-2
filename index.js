const fs = require('fs');
const path = require('path');

const mime = require('mime');

/*
Checks for a compressed resource and modifies the req and res properties
accordingly.

@param {string[]} extensions - List of compressed file types to check.
*/
module.exports = function serveCompressed({
  extensions = ['.js', '.css'],
  basePath = process.cwd()
} = {}) {
  // Usual Express middleware params...
  return function serve(req, res, next) {
    const includedFile = extensions.includes(path.extname(req.url));
    // Better logic here.
    const requestedCompressed = req.header('accept-encoding');

    // Not a compressed file type or compressed resource not requested, bail early.
    if (!includedFile || !requestedCompressed) {
      return next();
    }

    // Build the compressed file path
    // Make this smarter
    const compressedPath = `${path.join(basePath, req.url)}.gz`;

    // Check for existence of the compressed resource
    fs.stat(compressedPath, (err, stats) => {
      // Resource doesn't exist or there was an error, bail.
      if (err || !stats.isFile()) {
        return next();
      }

      // Compressed file is available, set the appropriate headers
      res.set({
        'content-encoding': 'gzip',
        'content-type': mime.getType(req.url),
      });

      // Update the url to use the compressed resource
      req.url = `${req.url}.gz`;

      // Pass control to the next function
      next();
    });
  }
}
