# Component Finder

A tool that clones all `-frontend` service repositories and any white-listed service repositories, searches their `*.html` files for a `<searchString>` and provides a list of files that contain said `<searchString>`.

### Requirements

* [Node.js](https://nodejs.org/en/) `>= 4.0.0`
* [npm](https://www.npmjs.com/) `>= 2.14.20`

To install multiple versions of Node.js, you may find it easier to use a node version manager:

* [nvm](https://github.com/creationix/nvm)
* [n](https://github.com/tj/n)

### Installation

```
$ npm install
```

### Usage

```
$ node index.js <searchString>
```

### Tests

To run tests
```
$ npm test
```

To run test with a watch task
```
$ npm run test:watch
```

### License

This code is open source software licensed under the Apache 2.0 License.
