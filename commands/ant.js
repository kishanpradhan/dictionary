const command = require('commander');

const BaseCommand = require("../lib/command").BaseCommand;
const Word = require("../lib/word").Word;


class Command extends BaseCommand {
	
	// static name = "def";
	get command_name() {
		return "ant";
	}

	run(value) {
		// console.log("Getting antonyms of", value);
		let uri = `/entries/${this.language}/${value}/antonyms`;
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
						for(let entry of lexical_entry.entries) {
							for(let sense of entry.senses) {
								// console.log(category, sense.antonyms);
								for(let antonym of sense.antonyms) {
									final_result[category] = final_result[category].concat(antonym.text);
								}
							}
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
		console.log("\nAntonyms \n");
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


