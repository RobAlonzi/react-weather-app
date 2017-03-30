var React = require("react");
var ReactDOM = require("react-dom");
var expect = require("expect");
var TestUtils = require("react-addons-test-utils");

var AppContainer = require("../../js/components/AppContainer");

describe("AppContainer", () => {
	it("should exist", () => {
		expect(AppContainer).toExist();
	});
})