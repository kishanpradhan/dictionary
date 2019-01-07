const Request = require("./request").Request;
const utils = require("./utils");


class Word {

	constructor(uri) {
		this.base_url = "https://od-api.oxforddictionaries.com/api/v1";
		this.url = this.buildURL(uri);
		this.language = "en";
		this.headers = {
			"Accept": "application/json",
			"app_id": process.env.APP_ID,
			"app_key": process.env.APP_KEY,
		};
		this.request = new Request();
		this.MAX_RESULT = 510;
	}

	buildURL(uri) {
		return this.base_url + uri;
	}

	get(word) {
		return new Promise((resolve, reject) => {
			this.request.setHeaders(this.headers)
				.get(this.url)
				.then((res) => {
					resolve(this.parseResult(res));
				})
				.catch((err) => {
					// console.log("error checking oxford", err);
					reject(err);
				});
		});
	}

	getRandomWord() {
		return new Promise((resolve, reject) => {
			this.request.setHeaders(this.headers)
				.get(this.url + "?exact=false&limit=1&offset=" + utils.random(this.MAX_RESULT))
				.then((res) => {
					if(res.statusCode == "403") {
						return reject(res.body);
					}
					resolve(this.parseResult(res)[0].id);
				})
				.catch((err) => {
					// console.log("error checking oxford", err);
					reject(err);
				});
		});
	}

	parseResult(result) {
		if(result.statusCode == 200) {
			return result.body.results;
		}
		return result;
	}
}

module.exports = { Word };
