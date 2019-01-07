const request = require("request");


class Request {

	setHeaders(headers) {
		this._headers = headers;
		return this;
	}

	get headers() {
		if(!this._headers) {
			this._headers = {
				"Accept": "application/json",
				"app_id": "40aa452b",
				"app_key": "3c27163f93688161846ecda30d3987a1"
			}
		}
		return this._headers;
	}

	get(url, options) {
		return new Promise((resolve, reject) => {
			request({
				headers: this.headers,
				uri: url,
				json: true,
				method: 'GET'
			}, function (err, res, body) {
				if(err) {
					reject(err);
				} else {
					console.log("Checking oxford");
					resolve(res.toJSON());
				}
			});
		});
	}

	post(uri, data, options) {
		return new Promise((resolve, reject) => {
			let url = `${base_url}/entries/${language}/${value}`;
			request({
				headers: headers,
				uri: url,
				json: true,
				body: data,
				method: 'POST'
			}, function (err, res, body) {
				if(err) {
					reject(err);
				} else {
					resolve(res.toJSON());
				}
			});
		});
	}
}

module.exports = {
	Request
}

