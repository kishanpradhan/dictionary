const https = require("https");

class BaseCommand {

	constructor(name) {
		this.name = name;
		this.language = 'en';
		this.output = true;
	}

	setDisplay(value) {
		this.output = false;
		return this;
	}

	register() {
		console.log("Registering command");
	}

	// Make it abstract
	run(value) {
		console.log("Super command called");
		throw new Error("Not implemented");
		/*
		return new Promise((resolve, reject) => {
			request(url, { headers: headers, json: true }, (err, res, body) => {
				if(err) {
					return reject(err);
				}
				if(res.statusCode == 200) {
					resolve(body.results);
				} else {
					reject(body);
				}
			});
		});
		*/
	}

}

class CommandFacade {

	static get(name) {
		let command = CommandFacade.getModule(name);
		if(command) {
			let instance = CommandFacade.getInstance(command, name);
			return instance;
		}
	}

	static getModule(name) {
		try {
			return require("../commands/" + name);
		} catch(err) {
			console.log(err);
			return;
		}
	}

	static getInstance(command, name) {
		if(command.Command) {
			return new command.Command(name);
		} else if(typeof command == "function" && command.name === "Command") {
			// console.log("CAlled");
			return new command(name);
		} else {
			return;
		}
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
				this.args = ["word_of_the_day"];
			}

			let command_results = [];
			for(let i = 0; i < this.args.length; i += 2) {
				let name = this.args[i];
				let value = i + 1 < this.args.length ? this.args[i + 1] : null;
				// console.log(name, value);
				let command = CommandFacade.getModule(name);
				if(!command) {
					command = CommandFacade.getModule("dict");
					// if command is dict command, do i = i -1
					// increment i by 1
					i = i - 1;
				}

				let obj = CommandFacade.getInstance(command, name);
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
				// console.log(obj, value);
				command_results.push(this.run(obj, value));
			}
			Promise.all(command_results).then((results) => {
				// console.log("Final Success", results, results[0][0].lexicalEntries);
				resolve(results);
			}).catch((err) => {
				console.log("Final Error", err);
				reject(err);
			});
		});
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
				// console.log(`[${command.name}]Command's run method not returning Promise`);
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
module.exports.CommandFacade = CommandFacade;
module.exports.Parser = Parser;
