# Datex2 Linker

> creating an accessible and standard JSON-LD page from an existing datex2 feed

# Getting started

## installing

Make sure you have [node](https://nodejs.org/en/download/) and npm installed.

Install `datex2-linker`

```sh
$ npm install -g datex2-linker
$ datex2-linker serve --source "http://www.verkeerscentrum.be/uitwisseling/datex2full" --base "http://localhost:8000/" --port 8000
```

Then you should be able to find a list of all of the terms at `/terms#`, a data source in [`json-ld`](http://json-ld.org) at `/data.jsonld` and `/data.json`. At `/` there's some information about datex2, and other relevant links.

If there are issues with combining this and your existing (valid) datex2, you should either open an issue or send a message on [gitter](https://gitter.im/oSoc16).


# Features

- [x] parse xml to json
- [x] give each id an unique URI
- [x] make that URI accessible on the web
- [x] make an easy cli interface to start
- [ ] test with a lot of datafeeds
- [x] publish on npm

If you have an issue that the context does not contain a particular term, open an issue on [OpenTransport/linked-datex2](https://github.com/OpenTransport/linked-datex2).

# License

© 2016 - Open Knowledge Belgium - iMinds — Haroen Viaene and [contributors](https://github.com/oSoc16/datex2-linker/graphs/contributors)

Licensed under the Apache 2.0 license.
