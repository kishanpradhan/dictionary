const command = require('commander');

const BaseCommand = require("../lib/command").BaseCommand;
const Word = require("../lib/word").Word;


class Command extends BaseCommand {
	
	get command_name() {
		return "ex";
	}

	run(value) {
		// console.log("Getting examples for", value);
		let uri = `/entries/${this.language}/${value}/sentences`;
		return new Promise((resolve, reject) => {
			new Word(uri).get(value).then((results) => {
				// console.log("Got data", JSON.stringify(results[0], null, 6));
				let final_result = {};
				for(let i in results) {
					let result = results[i];
					// console.log(result.lexicalEntries);
					for(let lexical_entry of result.lexicalEntries || []) {
						let category = lexical_entry.lexicalCategory;
						final_result[category] = [];
						for(let sentence of lexical_entry.sentences) {
							// console.log(final_result[category].push, category, sentence);
							final_result[category].push(sentence.text);
						}
					}
				}
				this.display(final_result);
				// this.sucess(res);
				resolve(final_result);
			}).catch((err) => {
				reject(err);
			});
		});
		// return super.run(value);
	}

	display(data) {
		if(!this.output) { return }
		// console.log(data);
		console.log("\n Examples \n");
		for(let category in data) {
			console.log("    ", category, ":");
			for(let i in data[category]) {
				console.log("\t", parseInt(i) + 1 + ".",  data[category][i]);
			}
			console.log();
		}
	}
}

module.exports = Command;

