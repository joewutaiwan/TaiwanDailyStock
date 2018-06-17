var request = require('request');

const TWSE_REQUEST_URL             = 'http://www.twse.com.tw/exchangeReport/STOCK_DAY';

var Error = function (para, error, httpResponse, body) {
	return {
		success: false,
		para: para,
		error: error,
		httpResponse: httpResponse,
		body: body
	};
}

var Success = function (para, error, httpResponse, body) {
	return {
		success: true,
		para: para,
		error: error,
		httpResponse: httpResponse,
		body: body
	};
}

var getData = function (para, callback) { 

	if (!para.company || !para.year || !para.month) {
		callback(Error(para, 'para error'));
		return;
	}

	var url = TWSE_REQUEST_URL;
	url += '?response=json';
	url += '&date=' + para.year.toString() + para.month.toString() + '01';
	url += '&stockNo=' + para.company;

	//console.log(url);

	request.post({url:url, form: {key:'value'}}, function (error, httpResponse, body){
		var ret;
		if (!error && httpResponse.statusCode == 200) {
			if (body.length < 500) {
				ret = Error(para, error, httpResponse, body);
			} else {
				ret = Success(para, error, httpResponse, body);
			}
		} else {
			ret = Error(para, error, httpResponse, body);
		}
		callback(ret);
	})

};

var help = function () {
	console.log('\
	para format = {                                   \n\
		company:  2330,                               \n\
		year:     2018,                               \n\
		month:      03                                \n\
	}	                                              \n\
	');
};

function TwseRequest() {
}

TwseRequest.prototype.getData = getData;

module.exports = TwseRequest; 

/*
module.exports = {  
  version : '1.0',
  help: help,
  getData : getData
};
*/