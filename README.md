# mysql-promise

Small promises wrapper for [`mysql2`](https://github.com/sidorares/node-mysql2), 
it's forked and compatible with [`mysql-promise`](https://github.com/martinj/node-mysql-promise).

[![build status](https://travis-ci.org/namshi/node-mysql2-promise.svg)](http://travis-ci.org/namshi/node-mysql2-promise)
[![NPM](https://img.shields.io/npm/v/mysql2-promise.svg)](https://www.npmjs.com/package/mysql2-promise)
[![NPM](https://img.shields.io/npm/dm/mysql2-promise.svg)](https://www.npmjs.com/package/mysql2-promise)

## Installation

This module is installed via npm:

``` bash
$ npm install mysql2-promise --save
```

## Example Usage of query

``` js
var db = require('mysql2-promise')();

db.configure({
	"host": "localhost",
	"user": "foo",
	"password": "bar",
	"database": "db"
});

db.query('UPDATE foo SET key = ?', ['value']).then(function () {
	return db.query('SELECT * FROM foo');
}).spread(function (rows) {
	console.log('Look at all the foo', rows);
});

//using multiple databases, giving it a name 'second-db' so it can be retrieved inside other modules/files.
var db2 = require('mysql-promise')('second-db');

db2.configure({
	"host": "localhost",
	"user": "foo",
	"password": "bar",
	"database": "another-db"
});

db2.query('SELECT * FROM users').spread(function (users) {
	console.log('Hello users', users);
});


```

## Example Usage of execute

`execute()` function is similar to `query` but it use [prepared-statements](https://github.com/sidorares/node-mysql2#prepared-statements).

``` js
var db = require('mysql2-promise')();

db.configure({
	"host": "localhost",
	"user": "foo",
	"password": "bar",
	"database": "db"
});

db.execute('SELECT * FROM users WHERE LIMIT = ?', [10]).spread(function (users) {
	console.log('Hello users', users);
});

```

## Example usage of [namedPlaceholders]((https://github.com/sidorares/node-mysql2#named-placeholders))

``` js
var db = require('mysql2-promise')();

db.configure({
	"host": "localhost",
	"user": "foo",
	"password": "bar",
	"database": "db"
});

db.pool.on('connection', function (poolConnection) {
    poolConnection.config.namedPlaceholders = true;
});

db.execute('SELECT * FROM users WHERE LIMIT = :limit', {limit: 10}).spread(function (users) {
	console.log('Hello users', users);
});

```

## Credits

This library is forked from [`mysql-promise`](https://github.com/martinj/node-mysql-promise)
