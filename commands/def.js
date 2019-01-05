const command = require('commander');

const BaseCommand = require("../lib/command").BaseCommand;


class Command extends BaseCommand {
	
	// static name = "def";
	get command_name() {
		return "def";
	}

	register() {
		command.option(this.command_name + " [value]", "Defination")
		return this.command_name;
	}

	run(value) {
		console.log("Running def command");
		return value;
	}
}

module.exports = Command;
