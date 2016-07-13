import test from 'ava';
import http from 'http';
import parse from '../lib/parse.js';
import serve from '../lib/serve.js';

test('bar', async t => {
  const bar = Promise.resolve('bar');

  t.is(await bar, 'bar');
});

test('my passing test', t => {
  t.pass();
});

test('served xml is converted to json', async t => {
  let server = http.createServer(function(req, res) {
    res.end(`
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<string someremovednamespace:attribute="value">
  <text>content</text>
</string>`);
  });
  server.listen('4000');
  const json = JSON.stringify(await parse('http://localhost:4000'));
  t.is(json, '{"@context":{"@base":"http://vocab.datex.org/terms#"},"data":{"string":{"attribute":"value","text":"content"}}}');
});

test('served xml converts id to @id', async t => {
  let server = http.createServer(function(req, res) {
    res.end(`
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<d2LogicalModel xmlns="http://datex2.eu/schema/2/2_0" modelBaseVersion="2" id="azertyuiop">
</d2LogicalModel>`);
  });
  server.listen('4001');
  const json = JSON.stringify(await parse('http://localhost:4001', 'http://test.dev/datex/'));
  t.is(json, '{"@context":{"@base":"http://vocab.datex.org/terms#"},"data":{"d2LogicalModel":{"xmlns":"//datex2.eu/schema/2/2_0","modelBaseVersion":2,"@id":"http://test.dev/datex/data.jsonld#azertyuiop"}}}');
});

test('serves up an index', t => {
  serve({
    something: 'its value',
    somethingElse: 'with value'
  });
});
