const command = require('commander');

const BaseCommand = require("../lib/command").BaseCommand;


class Command extends BaseCommand {
	
	run(value) {
		console.log("Running Word command", this.name);
		return this.name;
	}
}

module.exports = Command;

