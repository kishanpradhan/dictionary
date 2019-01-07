'use strict';

const expect = require('chai').expect;

const Parser = require("../lib/command").Parser;


describe("Parser Check", () => {

	before(() => {
		console.log("Before");
	});

	it("should check all number of arguments", () => {
		expect(new Parser([]).args.length).to.equal(0);
		expect(new Parser([1]).args.length).to.equal(0);
		expect(new Parser([1, 2]).args.length).to.equal(0);
		expect(new Parser([1, 2, 3]).args.length).to.equal(1);
		expect(new Parser([1, 2, 3, 4]).args.length).to.equal(2);
		expect(new Parser([1, 2, "3", 4, 5]).args.length).to.equal(3);
		expect(new Parser([1, 2, 3, 4, 5, "6"]).args.length).to.equal(4);
	});

	it("should give result", (done) => {
		let promise = new Parser(["node", "file", "def", "abcd", "ex", "sadf", "dict"]).parse();
		expect(promise instanceof Promise).to.equal(true);
		promise.then((res) => {
			expect(res.length).to.equal(3);
			done();
		}).catch((err) => {
			console.log("Error", err);
			done(err instanceof Error ? err : new Error(err));
		});
	});

	it("#2. Word Synonyms", (done) => {
		let promise = new Parser(["node", "file", "syn", "ace"]).parse();
		expect(promise instanceof Promise).to.equal(true);
		promise.then((res) => {
			console.log(res);
			expect(res.length).to.equal(1);
			done();
		}).catch((err) => {
			console.log("Error", err);
			done(err instanceof Error ? err : new Error(err));
		});
	});

	it("#3. Word Antonyms", (done) => {
		let promise = new Parser(["node", "file", "syn", "ace"]).parse();
		expect(promise instanceof Promise).to.equal(true);
		promise.then((res) => {
			console.log(res);
			expect(res.length).to.equal(1);
			done();
		}).catch((err) => {
			console.log("Error", err);
			done(err instanceof Error ? err : new Error(err));
		});
	});

	it("#5. Word Full Dict. Multiple also", (done) => {
		let promise = new Parser(["node", "file", "word1", "word2", "word3"]).parse();
		expect(promise instanceof Promise).to.equal(true);
		promise.then((res) => {
			expect(res.length).to.equal(3);
			done();
		}).catch((err) => {
			console.log("Error", err);
			done(err instanceof Error ? err : new Error(err));
		});
	});

	after(() => {
		console.log("After");
	});
});
