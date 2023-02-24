const fs = require('fs');

function readConfig(file) {
	let json = JSON.parse(fs.readFileSync(file));
	return json;
}

function deepReplace(obj, callback) {
	if (Array.isArray(obj)) {
		
	}
}

module.exports = readConfig;