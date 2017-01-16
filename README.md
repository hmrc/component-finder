# Component Finder

A tool to search repositories for a string.

[![Build Status](https://travis-ci.org/hmrc/component-finder.svg?branch=master)](https://travis-ci.org/hmrc/component-finder)

```
$ node index.js foo
# or
$ component-finder foo
# or
$ ./cf foo
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

### GitHub SSH keys
This tool clones your GitHub repositories via SSH. To search these repositories please generate any relevant GitHub SSH
keys.
For further information: [generating-an-ssh-key](https://help.github.com/articles/generating-an-ssh-key) 

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
# or
$ ./cf searchString
```
Where `searchString`...

* Is the exact string
** `searchString`
* A single CSS selector rule
** `.className` or `#id`
* CSS selector rule with child
** `.className .className-child`

### A single CSS selector rule
`.`, `#` and `:psuedo-selectors` are removed from CSS selectors. 
E.g a `searchString` of:
* `.className` will search for `className`
* `#id` will search for `id`
* `.className:before` will search for `className`.

> If searching for an id with a # symbol your searchString needs to be quoted

### CSS selector rule with child
When a CSS selector rule has children only the furthest descendant child will be searched for. 
E.g a `searchString` of `.className .className-child` will search for `className-child`. 

> When using child selectors your searchString needs to be quoted

### Sanitization
Input is cleaned up before a search is performed. The following characters are removed from `searchString` input:
* `>`
* `~`
* `*`
* `+`
* `[disabled]` (attribute selectors)
* `   ` (extraneous whitespace)

### Advanced Options

The advanced flags listed below must be listed **AFTER** the searchstring. The following is correct :

`./cf searchString -c`

The following command will not perform as expected, and will search for `-c`, because the real searchstring follows another option flag:

`./cf -c searchstring`


#### File Extensions

By default, component finder searches through html files. You can modify or expand the search to include other file types with the `-f` flag and including a comma separated list of file extensions. This list should not include 'dot's or spaces. If it does include spaces, it should be enclosed in quotes :

e.g. `node index.js searchstring -f html,scala`

e.g. `node index.js searchstring -f jade`

#### Search Mode

You can restrict your search to HTML Classes, Tags, or Attributes using the following flags listed below. These flags are mutually exclusive, in that you can only submit a search for classes or tags or attributes, not combinations.

##### HTML Classes Search Mode
Pass a `-c` flag to the search to try and find it's use within HTML classes :

e.g. `node index.js searchString -c`

##### HTML Tags Search Mode (i.e. Element Names)
Pass a `-t` flag to search for element tag names. For example to search for the `<code>` element :

`component-finder code -t`

##### HTML Attributes Search Mode
Pass a `-a` flag to search for HTML attributes such as `data-sticky-nav` :

`./cf data-sticky-nav -a`


### Results

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
