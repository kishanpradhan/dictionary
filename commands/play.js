const readline = require('readline');

const command = require('commander');

const BaseCommand = require("../lib/command").BaseCommand;
const CommandFacade = require("../lib/command").CommandFacade;
const Word = require("../lib/word").Word;
const utils = require("../lib/utils");


class Command extends BaseCommand {
	
	get command_name() {
		return "play";
	}

	getRandomWord() {
		return "ace";
	}

	run() {
		console.log("Playing Game");
		return new Promise(async (resolve, reject) => {
			let quiz_word;
			try {
				quiz_word = await new Word(`/wordlist/${this.language}/lexicalCategory=Noun,Verb,Adjective`).getRandomWord();
				// console.log("Got word", quiz_word);
			} catch(err) {
				return reject(err);
			}
			let all_commands = [
				CommandFacade.get("def").setDisplay(false).run(quiz_word),
				CommandFacade.get("syn").setDisplay(false).run(quiz_word),
				CommandFacade.get("ant").setDisplay(false).run(quiz_word),
			];
			Promise.all(all_commands).then((results) => {
				// console.log(results);
				this.play({
					value: quiz_word,
					definitions: results[0],
					synonyms: results[1],
					antonyms: results[2],
				})
			}).catch((err) => {
				reject(err);
			});
		});
	}

	get user_interface() {
		if(!this._user_interface) 
			this._user_interface = readline.createInterface({
				input: process.stdin, 
				output: process.stdout,
				prompt: ">"
			});
		return this._user_interface;
	}

	get options() {
		return `
1. Try again
2. Hint
3. Quit

Enter word or the options -> `;
	}

	get question_types() {
		return [
			this.definition(),
			this.synonym(),
			this.antonym(),
		]
	}

	get hint_types() {
		return [
			this.definition(),
			this.synonym(),
			this.antonym(),
			this.jumbleWord()
		]
	}

	definition() {
		return (word) => {
			let [category, value] = this.parseCategory(word.definitions);
			return `definition [${category}] is "${value}"`
		}
	}

	synonym() {
		return (word) => {
			let [category, value] = this.parseCategory(word.synonyms);
			return `synonym [${category}] is "${value}"`
		}
	}

	antonym() {
		return (word) => {
			let [category, value] = this.parseCategory(word.antonyms);
			return `antonym [${category}] is "${value}"`
		}
	}

	jumbleWord() {
		return (word) => {
			return "Shuffled word is " + utils.shuffleString(word.value);
		}
	}

	parseCategory(obj) {
		let categories = Object.keys(obj);
		let category = categories[utils.random(categories.length)];
		// console.log(categories, category, obj);
		// let value = obj[category][utils.random(obj[category] ? obj[category].length : 1)];
		let value = obj[category][utils.random(obj[category].length)];
		return [ category, value ];
	}

	buildQuestion(word, force = false) {
		if(!word.question || force) {
			let i = 0;
			try {
				let item = this.question_types[utils.random(this.question_types.length)];
				word.question = item(word);
				// break;
			} catch(err) {
				this.buildQuestion(word, force);
			}
		}
		// return word.question + "\n Guess the word.";
		return "Guess the word. \n\nGiven " + word.question + ".";
	}

	buidHint(word, question) {
		try {
			let hint = "Hint: \n";
			let item = this.hint_types[utils.random(this.hint_types.length)];
			let h = item(word);
			if(h == question) {
				this.buidHint(word, question);
			}
			return hint + h;
		} catch(err) {
			return "No hints could have retrived. Try option for hint again."
		}
	}

	play(word, hint="") {
		console.clear();
		let question = this.buildQuestion(word);
		let data = question + "\n\n" + hint + "\n" + this.options;
		this.user_interface.question(data, (ans) => {
			// console.log("Got answer", ans);
			switch(ans) {
				case "1":
					// console.log("Try again");
					this.play(word);
					break;
				case "2":
					// console.log("Hint");
					this.play(word, this.buidHint(word, word.question));
					break;
				case "3":
					// console.log("Closing");
					this.user_interface.close();
					break;
				case word.value:
					console.log("\nYou have got it right. Answer is", word.value);
					this.user_interface.close();
					break;
				default:
					this.play(word);
					console.log("\nYour answer is wrong. Try again");
					break;
			}
		});
	}

}

module.exports = Command;


