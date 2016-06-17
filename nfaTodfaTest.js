var assert = require('chai').assert;
var expect = require('chai').expect;
var nfaToDfa = require("./nfaToDfa.js").nfaToDfa;
var util = require("./util.js").util
var nfa = require("./data.js").nfa;
var tuple = nfa["tuple"];

assert.assertNestedList = function(expected, actual) {
  var isEqual = expected.every(function(expectedElement) {
    return actual.some(function(oneActualValue) {
      return expectedElement.every(function(elem) {
          return oneActualValue.indexOf(elem) >= 0;
      });
    });
  });
  expect(isEqual).to.be.true;
}

describe('nfaTodfa', function() {
  describe('findStateCombinations()', function () {

    it('should return [["q1"], ["q2"], ["q3"], ["q1", "q2"], ["q2", "q3"], ["q3", "q1"], ["q1", "q2", "q3"]] for tuple["states"]', function () {
      var expected = [["q1"], ["q2"], ["q3"], ["q1", "q2"], ["q2", "q3"], ["q3", "q1"], ["q1", "q2", "q3"]];
      var actual = nfaToDfa.findStateCombinations(tuple["states"]);
      assert.assertNestedList(expected, actual);
    });
  });

  describe("identifyFinalStates()", function() {
    it('shouldReturn [["q1"], ["q1", "q2"], ["q3", "q1"], ["q1", "q2", "q3"]] for [["q1"], ["q2"], ["q3"], ["q1", "q2"], ["q2", "q3"], ["q3", "q1"], ["q1", "q2", "q3"]] for tuple["states"] and ["q1"]', function() {
        var expected = [["q1"], ["q1", "q2"], ["q3", "q1"], ["q1", "q2", "q3"]];
        var actual = nfaToDfa.identifyFinalStates(nfaToDfa.findStateCombinations(tuple["states"]), tuple["final-states"]);
        assert.assertNestedList(expected, actual);
    })
  })

});
