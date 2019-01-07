const Request = require("./request").Request;


class Word {

	constructor(uri) {
		this.base_url = "https://od-api.oxforddictionaries.com/api/v1";
		this.url = this.buildURL(uri);
		this.language = "en";
		this.headers = {
			"Accept": "application/json",
			"app_id": "40aa452b",
			"app_key": "3c27163f93688161846ecda30d3987a1"
		};
		this.request = new Request();
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

	parseResult(result) {
		if(result.statusCode == 200) {
			return result.body.results;
		}
		return result;
	}
}

module.exports = { Word };
