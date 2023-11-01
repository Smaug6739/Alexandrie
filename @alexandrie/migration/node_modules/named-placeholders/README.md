[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=sidorares&url=https://github.com/sidorares/named-placeholders&title=named-placeholders&language=&tags=github&category=software)

[![NPM](https://nodei.co/npm/named-placeholders.png?downloads=true&stars=true)](https://nodei.co/npm/named-placeholders/)

[![CI](https://github.com/mysqljs/named-placeholders/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/mysqljs/named-placeholders/actions/workflows/ci.yml)

# named-placeholders

compiles "select foo where foo.id = :bar and foo.baz < :baz" into "select foo where foo.id = ? and foo.baz < ?" + ["bar", "baz"]

## usage

```sh
npm install named-placeholders
```

see [this mysql2 discussion](https://github.com/sidorares/node-mysql2/issues/117)

```js
var mysql = require('mysql');
var toUnnamed = require('named-placeholders')();

var q = toUnnamed('select 1+:test', { test: 123});
mysql.createConnection().query(q[0], q[1]);
```

## credits

parser is based on @mscdex code of his excellent [node-mariasql](https://github.com/mscdex/node-mariasql) library
