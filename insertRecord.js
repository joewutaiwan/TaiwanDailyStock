var TwseRequest = require('./twse_request/twse_request.js');
var DataBase = require('./data_base/data_base.js');

var UpdateCallback = function (err, result) {
	//console.log('[pass] updateDocument', err, result);
}
var InsertCallback =  function (err, result) {
	if (err) {
		console.log('[fail] insertDocuments');
	} else {
		//console.log('[pass] insertDocuments');
	}
}

var save_fields = [
	"日期",
	"成交股數",
	"成交金額",
	"開盤價",
	"最高價",
	"最低價",
	"收盤價",
	"漲跌價差",
	"成交筆數"
];

var upsertToDB =  function (resp) {
	var save_array = [];
	try {
		body = JSON.parse(resp.body);
	} catch(err) {
		console.log(resp.body, err);
	}
	
	body.data.forEach(function(day) {
		var save_obj = {};
		save_obj.company = resp.para.company;
		save_obj.year = parseInt(resp.para.year, 10);
		save_obj.month = parseInt(resp.para.month, 10);
		
		for (var i = 0; i < day.length ; i++) {
			var key = body.fields[i];
			var value = day[i];
			save_obj[key] = value;
			if (key == "日期") {
				save_obj["day"] = parseInt(value.split('/')[2], 10);
			}
		}
		save_array.push(save_obj);
	});
	save_array.forEach(function(day_data) {
		var f_filter = Object.assign({}, resp.para, day_data.day);
		DataBase.findDocuments(f_filter, function (err, docs) {
			if (err) {
				console.log('[fail] checkExist findDocuments', err, resp.para);
			} 
			if (!docs || docs.length === 0) {
				DataBase.insertDocuments(day_data, InsertCallback);
			} else if (CheckDocsContainData(f_filter, docs) === false) {
				var u_update = {
					$set: day_data 
				};
				DataBase.updateDocument(f_filter, u_update, UpdateCallback);
			} else {
				//console.log('Exist');
			}
		});
	});
	
}

var TwseRequestCallback = function (resp) { 
	if (resp.success) {
		upsertToDB(resp);
	} else {
		console.log('[fail][TR][' + resp.para.type + '][' + resp.para.company + '][' + resp.para.year + '][' + resp.para.season + ']');
		//console.log(resp.body);
	}
	if (resp.para.callback) {
		resp.para.callback(true);
	}
}

var Run = function (para) {
	var parameter = Object.assign({}, para);
	var TR = new TwseRequest;
	console.log ("request for :", para);
	TR.getData(parameter, TwseRequestCallback);
/*
	DataBase.findDocuments(f_filter, function (err, docs) {
		if (err) {
			console.log('[fail] checkExist findDocuments');
			para.callback(false);
		} 
		if (CheckDocsContainData(para, docs) === false) {
			var TR = new TwseRequest;
			console.log ("request for :", para);
			TR.getData(parameter, TwseRequestCallback);
		} else {
			para.callback(false);
			//console.log('Exist');
		}
	});
*/
}
/*
process.argv.forEach((val, index) => {

  if (index >= 2) {
	var company = val;
	for (var y = 102; y <= 106; y++) {
		var tmp = '000' + y;
		var year = tmp.substring(tmp.length - 3, tmp.length);
		for (var s = 1; s <= 4; s++) {
			var tmp = '000' + s;
			var season = tmp.substring(tmp.length - 2, tmp.length);
			for (var type = 1; type <= 4; type++) {
				var para = {
					type: type,
					company : String(company),
					year: String(year),
					season: String(season)
				};
				Run(para);
			}
		}
	}
  }
*/
Run({
	company : '2330',
	year: '2018',
	month: '03'
});

// Example


module.exports = {  
  version : '1.0',
  Run : Run
};
