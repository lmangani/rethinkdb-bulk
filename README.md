# RethinkDB-Bulk
Simple Bulk Operations for RethinkDB

## About
This simple module wraps a RethinkDB Client and Bulk/Queue Handler, automatically handling Database and Table creation and rotation.

### Usage

#### Init
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

#### Queue + Client
```
rethinkDBulk.push({ name: 'random1', value: 1111, created: new Date().toISOString() });
rethinkDBulk.push({ name: 'random2', value: 2222, created: new Date().toISOString() });
rethinkDBulk.push({ name: 'random3', value: 3333, created: new Date().toISOString() });


