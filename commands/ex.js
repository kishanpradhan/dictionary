const BaseCommand = require("../lib/command").BaseCommand;


class Command extends BaseCommand {
	
	// static name = "def";
	get command_name() {
		return "def";
	}

	run(value) {
		return new Promise((resolve, reject) => {
			console.log("Running ex command");
			// reject(value);
			resolve(value);
		});
	}
}

module.exports.Command = Command;

