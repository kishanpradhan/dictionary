const command = require('commander');

const BaseCommand = require("../lib/command").BaseCommand;


class Command extends BaseCommand {
	
	run(value) {
		value = value || this.name;
		console.log("Running Word(dict) command", value);
		return value;
	}
}

module.exports = Command;

