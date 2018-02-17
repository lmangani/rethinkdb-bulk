<img width=100 src="https://user-images.githubusercontent.com/1423657/36344292-5a8bcffc-1418-11e8-98ba-9eaaa18102ff.png">

# RethinkDB-Bulk
Simple Bulk Operations for [RethinkDB](https://github.com/rethinkdb/rethinkdb)


## About
This simple module wraps a RethinkDB Client and Bulk/Queue Handler, automatically handling Database and Table creation and rotation using `static`, `daily` or `monthly` partitions.

### Usage

#### Init
The following configuration will create a Bulk Queue connected to RethinkDB _(node or cluster)_ 
```
const rethinkDBulk = require('rethinkdb-bulk').getBucket({
    config: { 
	"servers": [ 
		{ "host": "127.0.0.1", "port": 28015 }
	}
    },
    dbName: 'myIndex',
    tableName: 'myTable',
    indexType: 'daily',
    bulk_timeout: 5000,
    bulk_maxSize: 1000,
    bulk_useInterval: true
});
```

#### Client
```
rethinkDBulk.push({ name: 'random1', value: 1111, created: new Date().toISOString() });
rethinkDBulk.push({ name: 'random2', value: 2222, created: new Date().toISOString() });
rethinkDBulk.push({ name: 'random3', value: 3333, created: new Date().toISOString() });
```

<img width=150 src="https://user-images.githubusercontent.com/1423657/36344191-d4ff702e-1416-11e8-986d-1a98fefe010e.png" style="margin-bottom:5px;"/>
