const command = require('commander');

const BaseCommand = require("../lib/command").BaseCommand;
const Word = require("../lib/word").Word;


class Command extends BaseCommand {
	
	// static name = "def";
	get command_name() {
		return "sync";
	}

	run(value) {
		console.log("Getting synonyms of", value);
		let uri = `/entries/${this.language}/${value}/synonyms`;
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
								// console.log(category, sense.synonyms);
								/*
								sense.synonyms.map(function(value, index){
									setTimeout(() => {
									console.log(value.text);
									}, 300);
								});
								*/
								for(let synonym of sense.synonyms) {
									final_result[category] = final_result[category].concat(synonym.text);
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
		// console.log(data);
		console.log("Synonyms \n");
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

