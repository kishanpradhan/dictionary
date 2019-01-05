'use strict';

const fs = require("fs");
const expect = require('chai').expect;

const Parser = require("../lib/command").Command;
let command_path = "../commands/";


describe("Command Check", () => {

	before(() => {
	});

	it("should all commands have Command class and run method", (done) => {
		let commands = fs.readdirSync(__dirname + "/" + command_path);
		// console.log(commands);
		for(let i in commands) {
			let name = commands[i];
			let command = require(command_path + name);
			try {
			expect(typeof command, `${typeof commands[name]} : "${name}" does not have Command class`).to.equal("function");
			expect(typeof new command().run, `${name} does not have method run`).to.equal("function");
			} catch(err) {

				expect(typeof command.Command, `${typeof commands[name]} : "${name}" does not have Command class`).to.equal("function");
				expect(typeof new command.Command().run, `${name} does not have method run`).to.equal("function");
			}
			// console.log(name);
		}
		done();
	});

	after(() => {
	});
});

