const command = require('commander');

const get_config = require('./config');


let config;

function run() {
	// console.log(config.commands);
	command.parse(process.argv);
	console.log("Command running");
}

function boot() {
	config = get_config();
	// Register commands
	// Register storage
	// On close event registration
}

function start() {
	boot();
	console.log("App starting");
	run();
}

module.exports = {
	start,
	boot
}
