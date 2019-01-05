const command = require('commander');


let CONFIG; // Global config storage

class Config {

	constructor(manual=false) {
		this.commands = {};
		this.storage = null;
		// this.defaultConfig();
		if(!manual) {
			this.registerCommands();
			this.registerStorage();
		}

		CONFIG = this;
	}

	/*
	defaultConfig() {
		this._command_paths = ["./commands"];
	}

	get command_path() {
		if(this._command_paths) {
			return this._command_paths;
		}
	}
	*/

	registerCommands() {
		let command_path = process.env.COMMAND_PATH || "./commands";
		let command_routes = require(command_path);
		console.log(command_path, command_routes);
		// def syn ant ex play
		/*
		for(let name in command_routes) {
			let command = new command_routes[name]();
			let command_name = command.register();
			this.commands[command_name] = command;
		}*/
		command.arguments('<command> [name]').action((command, name, cmd) => {
				console.log("AAA", command, name, cmd);
				/*
			if (command in this.commands) {
			} else {
				console.log("Command " + command + " not found");
			}
			*/
		});
	}

	registerStorage() {
	}
}

module.exports = function(new_config = false, ...args) {
	if(new_config || CONFIG == undefined) {
		return new Config(...args);
	} else {
		return CONFIG;
	}
}
