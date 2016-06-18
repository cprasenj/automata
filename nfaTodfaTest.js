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
    });
  });

  describe("findStartState()", function() {
    it('shouldReturn ["q3", "q1"] for combination and ["q1"]', function() {
        var expected = ["q3", "q1"];
        var actual = nfaToDfa.findStartState(tuple['delta'], tuple["start-state"]);
        expect(actual).to.have.members(expected);
    });
  });

  describe("findEquvalantDfaTransitions()", function() {
    it('shouldReturn ["q3", "q1"] for combination and ["q1"]', function() {
        var expected = {
          q1q2q3: { a: 'q1q2q3', b: 'q2q3' },
          q1q2: { a: 'q2q3', b: 'q2q3' },
          q1q3: { a: 'q1', b: 'q2q3' },
          q1: { a: '', b: 'q2q3' },
          q2q3: { a: 'q1q2q3', b: 'q3' },
          q2: { a: 'q2q3', b: 'q3' },
          q3: { a: 'q1', b: '' },
          '': { a: '', b: '' }
        };
        var actual = nfaToDfa.findEquvalantDfaTransitions(tuple['delta'], nfaToDfa.findStateCombinations(tuple['states']), tuple['alphabets']);
        assert.deepEqual(expected, actual);
    });
  });

});
