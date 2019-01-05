
class BaseCommand {

	constructor(name) {
		this.name = name;
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
		return new Promise((resolve, reject) => {
			if(this.args.length <= 0) {
				console.log("Display all above details of word of the day"); // 6. Word of the Day Full Dict
				return;
			}

			let command_results = [];
			for(let i = 0; i < this.args.length; i += 2) {
				let name = this.args[i];
				let value = i + 1 < this.args.length ? this.args[i + 1] : null;
				// console.log(name, value);
				let command = this.getCommand(name);
				// if command is dict command, do i = i -1
				// increment i by 1

				let obj = this.getInstance(command, name);
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
				// console.log("Final Success", results);
				resolve(results);
			}).catch((err) => {
				// console.log("Final Error", err);
				reject(err);
			});
		});
	}

	getCommand(name) {
		try {
			return require("../commands/" + name);
		} catch(err) {
			return require("../commands/" + "dict");
		}
	}

	getInstance(command, name) {
		if(command.Command) {
			return new command.Command(name);
		} else if(typeof command == "function" && command.name === "Command") {
			// console.log("CAlled");
			return new command(name);
		} else {
			return;
			// process.exit();
		}
	}

	run(command, value) {
		return new Promise((resolve, reject) => {
			try {
				let res = command.run(value);
				// Add res to display buffer
				if(res instanceof Promise) {
					res.then((value) => {
						resolve(value);
					}).catch((err) => {
						reject(err);
					});
				} else {
					if(res) resolve(res);
					reject(`[${command.name}]Command's run method not returning Promise`);
				}
			} catch(err) {
				reject(err);
			}
		});
	}
}


module.exports.BaseCommand = BaseCommand;
module.exports.Parser = Parser;
