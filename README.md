[![codecov](https://codecov.io/gh/molgenis/molgenis-js-i18n/branch/master/graph/badge.svg)](https://codecov.io/gh/molgenis/molgenis-js-i18n)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

molgenis-js-client
-------------------
A javascript wrapper around the [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) API.
Simplifies using REST api's by abstracting get, post, and delete and providing default options.

Installation
------------

### NPM
```bash
npm install @molgenis/molgenis-api-client --save
```

### Yarn
```bash
yarn add @molgenis/molgenis-api-client
```

Usage
-----

__Import in your HTML__
```html
<script src="path/to/molgenis-api-client.js"></script>

<!-- Include a polyfill for ES6 Promises (optional) for IE11, UC Browser and Android browser support -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/core-js/2.4.1/core.js"></script>
```

__Import as ES6 module__
```js
import api from '@molgenis/molgenis-api-client'

api.get(...)
api.post(...)
api.put(...)
api.delete_(...)
api.postFile(...)
```

__CommonJS import__
```js
const api = require('@molgenis/molgenis-api-client/dist/molgenis-api-client.js')

api.get(...)
api.post(...)
api.put(...)
api.delete_(...)
api.postFile(...)
```

Examples
--------

the molgenis-api-client supports three methods: get, post, and delete

__GET__ examples

```js
get('/api/v2/EntityType').then(response => {...}, error => {...}))
get('/api/v2/EntityType', { headers: { 'Content-type': 'text' } }).then(response => {...}, error => {...})
```

__POST__ examples

```js
const data = {
  'items': ['1', '2'],
  'id': 'example'
}

const options = {
  'body': JSON.stringify(data)
}

post('api/v2/PostData', options).then(response => {...}, error => {...})

const forceOptions = true
// options not merged with defaults
post('api/v2/PostData', options, forceOptions).then(response => {...}, error => {...}) 
```
__PUT__ examples

```js
const data = {
  items: ['1', '2'],
  status: 'SUCCESS'
}

const options = {
  body: JSON.stringify(data)
}

put('https://test.com/molgenis-test/put-something', options).then(response => {...}, error => {...})
```

__DELETE__ examples

```js
delete_('/api/v2/deleteById/1').then(response => {...}, error => {...})
```

__POST_FILE__ examples
```js
postFile('/plugin/one-click-importer/upload').then(response => {...}, error => {...})
```

Methods
-------

| Method | Description |
|--------|-------------|
| api.get() | Performs a fetch with method 'GET' |
| api.post() | Performs a fetch with method 'POST' |
| api.put() | Performs a fetch with method 'PUT' |
| api.delete_() | Performs a fetch with method 'DELETE' |
| api.postFile() | Performs a fetch with method 'POST' and attached FormData() containing a 'file' parameter. Ignores other options |

Options
-------

The options object that can be supplied to different API methods can contain the following parameters.

| Parameter | Description | Default value |
|-----------|-------------|---------------|
| method | `GET, POST, PUT, DELETE, HEAD` | Defaults to GET for get(), POST for post() and DELETE for delete() and PUT for put() |
| headers | associated Headers object | 'headers': { 'Accept': 'application/json', 'Content-Type': 'application/json' } |
| referrer | referrer of the request | undefined |
| mode | `cors, no-cors, same-origin` | undefined |
| credentials | should cookies go with the request? `omit, same-origin` | same-origin |
| redirect | What to do on redirect. `follow, error, manual` | error |
| integrity | subresource integrity value | undefined |
| cache | cache mode `default, reload, no-cache` | undefined |


ForceOptions
---------
By default the passed options get merged with the default options.
If you do not want to merge with the default options, but instead set all the options yourself,
setting the forceOptions flag to true forces the passed options to be used as is.

forceOptions defaults to false

example:
```
 const forceOptions = true
 const options = { some: 'options'}
 post('api/v2/PostData', options, forceOptions)
 ```

Browser compatibility
---------------------

| IE11* | Edge | Chrome | Firefox | Safari | Opera | Android Browser* | UC Browser* |
|-------|------|--------|---------|--------|-------|------------------|-------------|
|  ✅   |   ✅  |   ✅   |     ✅   |   ✅   |    ✅   |        ✅        |      ✅      |


\* ES6 Promise polyfill should be included, see this [example](#usage).

Note that this library is used in bleeding edge front end development. We __do not__ and __will not__ provide support on IE8 or lower.

Contributing
------------

This project uses [Yarn](https://yarnpkg.com) for development, uses [Mocha](https://mochajs.org/
) for testing and is compiled with [Rollup](https://rollupjs.org/)

To get started: `yarn install`

To build: `yarn build`

To test: `yarn test`

To test with coverage: `yarn test:cover`

To get coverage: `yarn coveralls`

To lint: `yarn lint`

To debug:
 first add node-inspector: `npm install -g node-inspector`
 then run: `yarn debug`

## Development
`yarn dev` to run dev server during development.

`yarn test` to run tests.

`yarn build` to create new production build.

### How to commit
We use conventional commits to generate changelogs and release notes. Please check: https://www.conventionalcommits.org/

**Example**
```
git commit file.ext -m "fix(file.ext): fixes something"
```

### How to publish
Each time a PR is merged a release will be done to NPM. The CHANGELOG.md and GitHub release will be ammended. 

The version of the package is based upon convential commits. Check: http://commitizen.github.io/cz-cli/.

## Changelog
Details changes for each release are documented in the [CHANGELOG.md](https://github.com/molgenis/molgenis-js-client/blob/master/CHANGELOG.md).

### License

[LGPL-3.0](http://opensource.org/licenses/LGPL-3.0)
