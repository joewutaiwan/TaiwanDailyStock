var insertRecord = require('./insertRecord.js');
var sleep = require('sleep');
var fs = require('fs');

// this code is run twice
// see implementation notes below
console.log(process.pid);
 
// after this point, we are a daemon
require('daemon')();
 
// different pid because we are now forked
// original parent has exited
console.log(process.pid);

function UpdateConfig(current_para) {
	var obj = {
		current_company: current_para.company,
		current_year: current_para.year,
		current_month: current_para.month,
	}
	var save_str = JSON.stringify(obj);

	fs.writeFile('progress.config', save_str, function(err) {
    	if(err) {
        	return console.log(err);
    	}
	}); 
}

function LoadConfig(package_data) {
	var filename = 'progress.config';
	var encode = "utf8";
	return new Promise((resolve, reject) => {
		fs.readFile(filename, encode, function(err, file) {
			try {
				package_data.config = JSON.parse(file);
				resolve(package_data);
			} catch(err) {
				reject("fail at LoadConfig :" + err + file);
			}
		});
	});
}

function genParaList(company, company_list) {
	for (var y = 2013; y <= 2018; y++) {
		var year = y;
		for (var m = 1; m <= 12; m++) {
			if (y == 2018 && m > 6) {
				continue;
			}
			var tmp = '000' + m;
			var month = tmp.substring(tmp.length - 2, tmp.length);
			var para = {
				company : String(company),
				year: String(year),
				month: String(month)
			};
			company_list.push(para);
		}
	}
}

function LoadCompanyList(package_data) {
	var company_list = []
	var input = fs.createReadStream('twse_company_list');
	return new Promise((resolve, reject) => {
		var remaining = '';
		var found = 0;

	  input.on('data', function(data) {
	    remaining += data;
	    var index = remaining.indexOf('\n');
	    while (index > -1) {
	      var line = remaining.substring(0, index);
	      remaining = remaining.substring(index + 1);
				index = remaining.indexOf('\n');
				//console.log("line", line);
				genParaList(line, company_list)
	    }
	  });

	  input.on('end', function() {
			console.log("==end of parse compamny list==");
			package_data.company_list = company_list;
			package_data.index = 1;
			resolve(package_data);
		});
	});
}

function Process(package_data) {
	return new Promise((resolve, reject) => {
		(function loop(i) {
			if (i < package_data.company_list.length - 1) new Promise((resolve, reject) => {
				var current_para = package_data.company_list[package_data.index - 1];
				//console.log(": current_para", current_para);
				package_data.index += 1;
				var callback = function(request_twse) {
					if (request_twse) {
						setTimeout( () => {
							resolve();
						}, 15 * 1000);
					} else {
						resolve();
					}
					UpdateConfig(current_para);
				}
				//console.log(current_para.company , package_data.config.current_company);
				if (current_para.company < package_data.config.current_company) {
					//console.log("pass: " ,current_para.company)
					resolve();
				} else if (current_para.company == package_data.config.current_company
					&& current_para.year < package_data.config.current_year) {
						resolve();
				} else if (current_para.year == package_data.config.current_year
					&& current_para.month < package_data.config.current_month) {
						resolve();
				} else {
					current_para.callback = callback;
					insertRecord.Run(current_para);
				}

			}).then(loop.bind(null, i+1));
		})(0);

	});
}

function main() {
	
	var package_data = {};
	LoadConfig(package_data)
	.then(
		LoadCompanyList
	)
	.then(
		Process
	)
	.catch(
		// 印出失敗訊息（rejection reason）
		(reason) => {
				var date = new Date();
				var date_string = date.toLocaleString();
				console.log('[ERROR][' + date_string + "] - " + reason + '');
		}
	);

	
	//read company list

}

main();
