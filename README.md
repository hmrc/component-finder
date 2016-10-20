# Component Finder

A tool to search repositories for a string.

[![Build Status](https://travis-ci.org/hmrc/component-finder.svg?branch=master)](https://travis-ci.org/hmrc/component-finder)

```
$ node index.js foo
# or
$ component-finder foo
```


## Table of Contents

* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)


## Requirements

* [Node.js](https://nodejs.org/en/) `>= 4.0.0`
* [npm](https://www.npmjs.com/) `>= 2.14.20`

To install multiple versions of Node.js, you may find it easier to use a node version manager:

* [nvm](https://github.com/creationix/nvm)
* [n](https://github.com/tj/n)


## Installation

Clone this repo and install its dependencies...

```
$ npm install
```

Then you'll need to tell it where to get a list of repos from to search.

Duplicate the `config.sample.json` file, naming it `config.json`, and update its contents accordingly...

```
{
  "api": {
    "protocol": "",
    "host": "",
    "paths": [],
    "headers": {}
  },
  "whitelist": []
}

```

* **api.protocol**: The protocol that should be used to communicate with the API (**Required**)
* **api.host**: The domain name of the API to fetch a list of repos from (**Required**)
* **api.paths**: The endpoint(s) of the API to fetch a list of repos from (**Required**)
* **api.headers**: Any request headers that the API requires (such as auth tokens) (**Optional**)
* **whitelist**: Regex pattern(s) for filtering the list of repos with (**Optional**)


## Usage

```
$ node index.js searchString
# or
$ component-finder searchString
```
Where `searchString`...

* Is the exact string to search for
* Should not include punctuation at the beginning of selectors
	* `.className` should be `className`
	* `#idName` should be `idName`

#### Results

Results appear in the console like this...

```
repository-name (enterprise|public) [n]
```

* **repository-name**: The name of the repository
* **(enterprise|public)**: Whether the repository lives in the open or in an enterprise instance of github
* **[n]**: The number of occurrences of `searchString` in `repository-name`

They are also saved to a `results.json` file like this...

```
 {
  "name": "repository-name",
  "github": "",
  "count": 1,
  "files": [{
    path: "",
    line: "",
    match: ""
  }]
 }
```

* **name**: The name of the repository
* **github**: Whether the repository lives in the open or in an enterprise instance of github
* **files.path**: The path to a file that contains `searchString`
* **files.line**: The line in the file where the match occurs
* **files.match**: The actual match that was found in the file


## Contributing

To contribute to Component Finder...

* Clone or fork this repo
* Create a new branch and commit your code there.
* Write or update tests for your code, and make sure the tests pass before opening a pull-request:

```
$ npm test
```

To run tests continually with a watch task...

```
$ npm run test:watch
```


## License

This code is open source software licensed under the Apache 2.0 License.
