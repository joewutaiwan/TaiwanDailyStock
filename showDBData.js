var DataBase = require('./data_base/data_base.js');
var assert = require('assert');

var findCallback = function (err, docs) {
	assert.equal(err, null);
	console.log(docs);
	console.log('[pass] findDocuments');
}
var f_filter = {
	//"company": "2330", "year":"2017", "month": '01'
};
process.argv.forEach(function (val, index, array) {
	if (index < 2) {
		return;
	}
	switch(index) {
		case 2:
			console.log('company: ' + val);
			f_filter.company = val;
			break;
		case 3:
			console.log('year: ' + val);
			f_filter.year = parseInt(val, 10);
			break;
		case 4:
			console.log('month: ' + val);
			f_filter.month = parseInt(val, 10);
			break;
		case 5:
			console.log('day: ' + val);
			f_filter.day = parseInt(val, 10);
			break;
	}
	
});

DataBase.findDocuments(f_filter, findCallback);
