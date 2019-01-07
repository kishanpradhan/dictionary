

module.exports.random = function(len) {
	return Math.floor(Math.random() * len);
}

module.exports.shuffleString = function(str) {
	return str.split('').sort(function(){ return 0.5 - Math.random() }).join('');
}
