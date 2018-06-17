var TwseRequest = require('./twse_request.js');

var testcase = [{
	company : '2330',
	year: '2018',
	month: '02'
}];

var callback = function (resp) { 
	if (resp.success) {
		console.log('[pass] TwseRequest testcase');
		console.log('company :' + resp.para.company);
		console.log('year :' + resp.para.year);
		console.log('month :' + resp.para.month);
		console.log(resp);
	} else {
		console.log('[fail] TwseRequest:' + resp.para.company + '-' + resp.para.year + resp.para.month);
		console.log('error :' + resp.error);
		console.log('httpResponse :' + resp.httpResponse);
		console.log('body :' + resp.body);
	}
}

for (i = 0; i < testcase.length; i++) { 
	var para = testcase[i];
	var TR = new TwseRequest;
	TR.getData(para, callback);
}
