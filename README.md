# serve-compressed
serve-compressed is Express middleware that allows you to serve pre-compressed files.  This is different from the [compression middleware package](http://expressjs.com/en/resources/middleware/compression.html), which compresses files on the fly.  Serving pre-compressed files is faster and less memory intensive than compressing files on the fly, which means your Express server can devote resources to other, more important tasks.

# Install
```shell
npm install @mmckelvy/serve-compressed
```

# Usage
serve-compressed only works with pre-compressed files.  Compress your files during your build process using the [Webpack Compression Plugin](https://webpack.js.org/plugins/compression-webpack-plugin/) or a command line utility like `gzip`.  Once you have your compressed files in the appropriate directory, you can use serve-compressed like so:

```javascript
const path = require('path');
const express = require('express');
const serveCompressed = require('@mmckelvy/serve-compressed');

const app = express();

// Include serveCompressed BEFORE your middleware
app.use(serveCompressed({
  extensions: ['.js', '.css'],
  rootDir: __dirname
}));
app.use('/files', express.static(path.join(__dirname, 'files')));

module.exports = app;
```

Note that serve-compressed expects gzipped files (i.e. files with a `.gz` extension).

# API

## serveCompressed

### Parameters

**extensions** `string[]`.  Default: `[.js', '.css']`

An array of file extensions to include when checking for compressed assets.  For example, if you pass `[.js', '.css']` (the default), serve-compressed will check for compressed versions of any .js or .css file requested.

**rootDir** `string`.  Default: `process.cwd()`

The root directory where your compressed assets are located.
