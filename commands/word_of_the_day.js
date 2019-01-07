const command = require('commander');

const BaseCommand = require("../lib/command").BaseCommand;
const CommandFacade = require("../lib/command").CommandFacade;
const Word = require("../lib/word").Word;


class Command extends BaseCommand {
	
	get command_name() {
		return "word_of_the_day";
	}

	run(value) {
		let uri = `/entries/${this.language}/${value}/synonyms`;
		return new Promise((resolve, reject) => {
			new Word(`/wordlist/${this.language}/lexicalCategory=Noun,Verb,Adjective`)
				.getRandomWord()
				.then((word) => {
					console.log("Word of the day \"" + word + "\"\n");
					CommandFacade.get("dict").run(word).then((res) => {
						// this.display(word, res);
						resolve(res);
					}).catch((err) => {
						reject(err);
					});
				}).catch((err) => { reject(err) })
		});
		// return super.run(value);
	}

	display(word, data) {
		if(!this.output) { return }
		console.log(data);
		console.log("Word of the day \"" + word + "\"\n");
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

