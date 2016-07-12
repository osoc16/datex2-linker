#!/usr/bin/env node

//todo: these are local files, parse them properly
const parse = require('./parse');
const serve = require('./serve');
const url = require('url');

require('yargs')
  .usage('$0 <cmd> [args]')
  .command('serve', 'serve up a JSON-LD API from a datex2 feed', {
      'source': {
        alias: 's',
        describe: 'A valid datex2 feed'
      },
      'base': {
        alias: 'b',
        describe: 'baseuri for the created API'
      },
      'port': {
        alias: 'p',
        describe: 'port on which the API is served',
        default: 80
      },
      'title': {
        'alias': 't',
        'describe': 'the title of the datafeed',
        default: 'Datex2 Linked'
      }
    },
    function(argv) {
      // todo: get port inside the baseuri with something similar to location.port
      let uri = url.parse(argv.base);
      uri.port = argv.port;
      // this is a hack because somehow url.format doesn't apply new changes.
      uri = url.parse(uri.protocol + '//' + uri.hostname + ':' + uri.port);

      // parse the provided datafeed into json-ld
      parse(argv.source, url.format(uri)).then(res => {
        // serve that datafeed and create accessible URIs
        serve(res, uri, argv.title).then(res => {
          console.log(`The feed is now accessible on : ${uri.href}\n ${res}`);
          // open a browser to `uri.href`
        }).catch(err => {
          console.error(`There was an error serving the provided datafeed:\n ${err}`);
        });
      }).catch(err => {
        // todo: show in STDERR
        console.error(`There was an error parsing the provided datafeed:\n ${err}`);
        process.exit(1);
      });

    })
  .help('help')
  .alias('h', 'help')
  .argv;
