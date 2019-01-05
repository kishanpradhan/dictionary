const command = require('commander');


class DefinationCommand {
	
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
	}
}

module.exports = DefinationCommand;
