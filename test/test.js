const http = require('http');
const fs = require('fs');
const { gunzip } = require('zlib');
const { promisify } = require('util');

const gunzipAsync = promisify(gunzip);
const read = promisify(fs.readFile);

const test = require('ava');
const got = require('got');
const listen = require('test-listen');

const app = require('./app.js');

// Properly serve a compressed asset
test.before(async (t) => {
  try {
    t.context.server = http.createServer(app);
    t.context.prefixUrl = await listen(t.context.server);
    console.log('Test server started');

  } catch (err) {
    console.log(err);
    console.log('TEST FAILED AT SETUP');
  }
});

// Serve compressed files when requested.
test('Case 1', async (t) => {
  const res = await got.get('files/bundle.js', {
    prefixUrl: t.context.prefixUrl,
    throwHttpErrors: false,
    decompress: false,
    headers: {
      'accept-encoding': 'gzip'
    }
  });

  t.true(Buffer.isBuffer(res.body));
  t.is(res.headers['content-encoding'], 'gzip');
  t.is(
    res.headers['content-type'].toLowerCase(),
    'application/javascript; charset=utf-8'
  );

  const decompressed = await gunzipAsync(res.body);
  const actual = decompressed.toString();

  const expected = await read(`${__dirname}/files/bundle.js`, {
    encoding: 'utf8'
  });

  t.is(actual, expected);
});

// Serve uncompressed files when compressed files are not available.
test('Case 2', async (t) => {
  const res = await got.get('files/style.css', {
    prefixUrl: t.context.prefixUrl,
    throwHttpErrors: false,
    decompress: false,
    headers: {
      'accept-encoding': 'gzip'
    }
  });

  t.falsy(res.headers['content-encoding']);
  t.is(
    res.headers['content-type'].toLowerCase(),
    'text/css; charset=utf-8'
  );

  const actual = res.body;
  const expected = await read(`${__dirname}/files/style.css`, {
    encoding: 'utf8'
  });

  t.is(actual, expected);
});

// Serve uncompressed files when the accept-encoding header is not present.
test('Case 3', async (t) => {
  const res = await got.get('files/bundle.js', {
    prefixUrl: t.context.prefixUrl,
    throwHttpErrors: false,
    decompress: false,
  });

  t.falsy(res.headers['content-encoding']);
  t.is(
    res.headers['content-type'].toLowerCase(),
    'application/javascript; charset=utf-8'
  );

  const actual = res.body;
  const expected = await read(`${__dirname}/files/bundle.js`, {
    encoding: 'utf8'
  });

  t.is(actual, expected);
});

test.after.always('Teardown', async (t) => {
  t.context.server.close();
  console.log('Test server closed');
});
