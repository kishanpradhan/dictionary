// const command = require('commander');

const get_config = require('./config');
const Parser = require('./lib/command').Parser;


let config;

function run() {
	// console.log(config.commands);
	// command.parse(process.argv);
	new Parser(process.argv).parse();
}

function boot() {
	config = get_config(false, true);
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
