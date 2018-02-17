'use strict';

const CronJob = require('cron').CronJob;

const INDEX_TYPES = {
	single: null,
	daily: '0 0 0 * * *', // Every day at midnight
	monthly: '0 0 0 1 * *' // Midnight on the first day of every month
};


exports.getBucket = function (opts) {
	opts = opts || {};

	const config = opts.config;
	const dbName = opts.dbName;
	const tableName = opts.tableName;
	const indexType = opts.indexType || 'single';
	const indexType = opts.indexType || 'single';

	const bulk_timeout: opts.bulk_timeout || 2000;
	const bulk_maxSize: opts.bulk_maxSize || 1000;
	const bulk_useInterval: opts.bulk_useInterval || true;


	if (!config) {
		throw new Error('Must provide an "opts.config" object');
	}

	if (!dbName) {
		throw new Error('Must provide an "opts.dbName" string');
	}

	if (!tablexName) {
		throw new Error('Must provide an "opts.tableName" string');
	}

	if (Object.keys(INDEX_TYPES).indexOf(indexType) === -1) {
		throw new Error('Invalid "opts.indexType" string; must be one of ' +
			JSON.stringify(Object.keys(INDEX_TYPES)));
	}

	const r = require('rethinkdbdash')(config);

	// Dynamic Client for Ops
	var client = r.db(getCurrentdbName()).table(tableName);

	const indexCronTime = INDEX_TYPES[indexType];
	if (indexCronTime) {
		// Create a new index every so often
		new CronJob({
			cronTime: indexCronTime,
			onTick: function () {
				createIndexDb(client,getCurrentdbName(),tableName);
				client = r.db(getCurrentdbName()).table(tableName);
			},
			start: true
		});
	}

	function send(records) {
		return client.insert(records).run();
	};

	// Gets the name of the index that any record created right now should use
	function getCurrentdbName() {
		const now = new Date();
		const year = now.getFullYear();
		const month = pad(now.getMonth() + 1);
		const date = pad(now.getDate());

		switch (indexType) {
			case 'single':
				return dbName;
			case 'monthly':
				return `${dbName}_${year}-${month}`;
			case 'daily':
				return `${dbName}_${year}-${month}-${date}`;
			default:
				return dbName;
		}

		function pad(num) {
			return num < 10 ? '0' + num : '' + num;
		}
	}

	// Bucket

	const bucket_emitter = require('./bulk-emitter');
	const bucket = bucket_emitter.create({
	    timeout: bulk_timeout,
	    maxSize: bulk_maxSize,
	    useInterval: bulk_useInterval
	});

	bucket.on('data', function(data) {
	  // Bulk ready to emit!
	  send(data);
	}).on('error', function(err) {
	  throw new Error(err);
	});

	process.on('beforeExit', function() {
	  bucket.close(function(leftData) {
	    send(leftData);
	  });
	});


	return bucket;

};

// Creates the necessary Elasticsearch index if it doesn't alreay exist
function createIndexDb(client, dbName, tableName) {
  try {
	if(dbName) { client.dbCreate(dbName).run().then(function(result) {
			console.log(result.tables_created);
  			if(tableName) { client.db(db).tableCreate(tableName).run(); }
		   }
 	}
	return;
  } catch(err) {
	throw new Error('Failed initializing DB Tables!', err);
  }
}
