const command = require('commander');

const BaseCommand = require("../lib/command").BaseCommand;
const CommandFacade = require("../lib/command").CommandFacade;


class Command extends BaseCommand {
	
	run(value) {
		return new Promise((resolve, reject) => {
			value = value || this.name;
			console.log("Running dict command", value);
			let all_commands = [
				CommandFacade.get("def").setDisplay(false).run(value),
				CommandFacade.get("syn").setDisplay(false).run(value),
				CommandFacade.get("ant").setDisplay(false).run(value),
				CommandFacade.get("ex").setDisplay(false).run(value),
			];
			Promise.all(all_commands).then((results) => {
				// let final_result = {};
				this.parse(results).then((final_result) => {
					this.display(final_result);
					resolve(results);
				}).catch((err) => {
					reject(err);
				});
			}).catch((err) => {
				reject(err);
			});
			return value;
		});
	}

	parse(results) {
		return new Promise((resolve, reject) => {
			let final_result = {};
			final_result["Noun"] = {
				"Definitions": results[0].Noun,
				"Examples": results[3].Noun,
				"Synonyms": results[1].Noun,
				"Antonyms": results[2].Noun,
			};
			final_result["Adjective"] = {
				"Definitions": results[0].Adjective,
				"Examples": results[3].Adjective,
				"Synonyms": results[1].Adjective,
				"Antonyms": results[2].Adjective,
			};
			final_result["Verb"] = {
				"Definitions": results[0].Verb,
				"Examples": results[3].Verb,
				"Synonyms": results[1].Verb,
				"Antonyms": results[2].Verb,
			};
			resolve(final_result);
			/*
			Promise.all(
			).then((res) => {
			}).catch((err) => {
				reject(err);
			});
			*/
		});
	}

	display(data) {
		if(!this.output) { return }
		// console.log(data);
		console.log("Add data \n");
		for(let category in data) {
			console.log("    ", category, ":");
			for(let type in data[category]) {
				console.log("\t", type, ":");
				for(let i in data[category][type]) {
					console.log("\t\t", parseInt(i) + 1 + ".",  data[category][type][i]);
				}
			}
			console.log();
		}
	}
}

module.exports = Command;

