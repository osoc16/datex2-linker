import test from 'ava';
import http from 'http';
import url from 'url';
import got from 'got';
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

test('starts serving', t => {
  serve({
    something: 'its value',
    somethingElse: 'with value'
  }, url.parse('http://localhost:4002'), 'title');
});

test('serves an index', async t => {
  await serve({
    something: 'its value',
    somethingElse: 'with value'
  }, url.parse('http://localhost:4003'), 'title');
  const response = await got('http://localhost:4003').then(res => {
    return Promise.resolve(res.body);
  });
  // todo: change this when the index changes looks
  t.is(response,
    `<!DOCTYPE html><html lang="en"><head><title>title</title><style>body {
  font-family: -apple-system, sans-serif;
}
code {
  font-family: Menlo, monospace;
}</style></head><body><h1>title</h1><p>Generated via <a href="https://github.com/osoc16/datex2-linker">datex2-linker</a></p><p>You can find the <code>json-ld</code> at <a href="/data.json">/data.json</a> or <a href="/data.jsonld">/data.jsonld</a></p><blockquote>TODO: make this into a better landing page that fits in with moby link</blockquote></body></html>`)
});

test('content type of data.json is application/json', async t => {
  await serve({
    something: 'its value',
    somethingElse: 'with value'
  }, url.parse('http://localhost:4004'), 'title');
  const contentType = await got('http://localhost:4004/data.json').then(res => {
    // todo: return content type
    return Promise.resolve(res);
  });
  t.is(contentType, 'application/json');
});

test('content type of data.jsonld is application/ld+json', async t => {
  await serve({
    something: 'its value',
    somethingElse: 'with value'
  }, url.parse('http://localhost:4004'), 'title');
  const contentType = await got('http://localhost:4004/data.jsonld').then(res => {
    // todo: return content type
    return Promise.resolve(res);
  });
  t.is(contentType, 'application/ld+json');
});
