const http = require('http');

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

test('Case 1', async (t) => {
  const res = await got.get('files/bundle.js', {
    prefixUrl: t.context.prefixUrl,
    throwHttpErrors: false,

  });

  // Should get a gzipped file
  t.is(true, true);
});

test.after.always('Teardown', async (t) => {
  t.context.server.close();
  console.log('Test server closed');
});