var assert = require('chai').assert;
var expect = require('chai').expect;
var util = require('./util.js').util;

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

describe('util', function() {
  describe('#combination()', function () {
    it('should return [] for []', function () {
      assert.deepEqual(util.allCombinations([]), []);
    });

    it('should return [1, 2, 3, [1, 2], [2, 3], [3, 1], [1, 2, 3]] for [1, 2, 3]', function () {
      var expected = [['1'], ['2'], ['3'], ['1', '2'], ['2', '3'], ['3', '1'], ['1', '2', '3']];
      var actual = util.allCombinations(['1', '2', '3']);

      assert.assertNestedList(expected, actual);
    });

    it('should return [["q1"], ["q2"], ["q3"], ["q1", "q2"], ["q2", "q3"], ["q3", "q1"], ["q1", "q2", "q3"]] for tuple["states"]', function () {
      var expected = [["q1"], ["q2"], ["q3"], ["q1", "q2"], ["q2", "q3"], ["q3", "q1"], ["q1", "q2", "q3"]];
      var actual = util.allCombinations(["q1", "q2", "q3"]);
      assert.assertNestedList(expected, actual);
    });

  });

});
