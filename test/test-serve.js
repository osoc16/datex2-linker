import test from 'ava';
import url from 'url';
import got from 'got';
import serve from '../lib/serve.js';
import http from 'http';

const server = http.createServer(function(req, res) {
  res.end(`
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<string someremovednamespace:attribute="value">
<text>content</text>
</string>`);
});
server.listen('8000');

test('starts serving', t => {
  serve('http://localhost:8000/', url.parse('http://localhost:4002'), 'title', true);
});

test('serves an index', async t => {
  await serve('http://localhost:8000/', url.parse('http://localhost:4003'), 'title', true);
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
}</style></head><body><h1>title</h1><p>Generated via <a href="https://github.com/osoc16/datex2-linker">datex2-linker</a></p><p>You can find the <code>json-ld</code> at <a href="/data.json">/data.json</a> or <a href="/data.jsonld">/data.jsonld</a></p><blockquote>TODO: make this into a better landing page that fits in with moby link</blockquote></body></html>`);
});

test('content type of data.json is application/json', async t => {
  await serve('http://localhost:8000/', url.parse('http://localhost:4004'), 'title', true);
  const contentType = await got('http://localhost:4004/data.json').then(res => {
    return Promise.resolve(res.headers['content-type']);
  });
  t.is(contentType, 'application/json');
});

test('content type of data.jsonld is application/ld+json', async t => {
  await serve('http://localhost:8000/', url.parse('http://localhost:4005'), 'title', true);
  const contentType = await got('http://localhost:4005/data.jsonld').then(res => {
    return Promise.resolve(res.headers['content-type']);
  });
  t.is(contentType, 'application/ld+json');
});
