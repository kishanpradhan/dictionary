
class BaseCommand {

	constructor() {
	}

	register() {
		console.log("Registering command");
	}

	run() {
		console.log("Running command");
	}
}


class Parser {

	constructor(args) {
		this.args = args || [];
		this.args = this.args.slice(2);// As first 2 parameters are node and file name
	}

	parse() {
		if(this.args.length <= 0) {
			console.log("Display all above details of word of the day"); // 6. Word of the Day Full Dict
			return;
		}

		let command_results = [];
		for(let i = 0; i < this.args.length; i += 2) {
			let name = this.args[i];
			let value = this.args[i + 1];
			console.log(name, value);
			let command = this.getCommand(name);
			if(!command) {
				console.error(`Command not found. Please check the command path for ${name}.`);
				continue;
			}
			let obj = this.getInstance(command);
			if(!obj) {
				console.log(`${name} does not have Command class or you haven't exported Command class`);
			}

			if(!(obj instanceof BaseCommand)) {
				console.log(`${name} is not extending BaseCommand`);
				return;
			}

			if(typeof obj.run !== "function") {
				console.log(`${name} does not have run method or you haven't exported run method`);
				continue;
			}
			command_results.push(this.run(obj, value));
		}
		Promise.all(command_results).then((results) => {
			console.log("Final Success", results);
		}).catch((err) => {
			console.log("Final Error", err);
		});
	}

	getCommand(name) {
		try {
			return require("../commands/" + name);
		} catch(err) {
			console.log(err);
			return;
		}
	}

	getInstance(command) {
		if(command.Command) {
			return new command.Command();
		} else if(typeof command == "function" && command.name === "Command") {
			// console.log("CAlled");
			return new command();
		} else {
			return;
			// process.exit();
		}
	}

	run(command, value) {
		try {
			let res = command.run(value);
			// Add to display buffer
			if(res instanceof Promise) {
				return res;
			}
			return new Promise((resolve, reject) => {
				if(res) resolve(res);
				reject("Command's run method not returning Promise");
			});
		} catch(err) {
			reject(err);
		}
	}
}


module.exports.BaseCommand = BaseCommand;
module.exports.Parser = Parser;
