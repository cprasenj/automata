var assert = require('chai').assert;
var expect = require('chai').expect;
var lib = require('./util.js').util;


describe('util', function() {
  describe('#combination()', function () {
    it('should return [] for []', function () {
      assert.deepEqual(lib.allCombinations([]), []);
    });

    it('should return [1, 2, 3, [1, 2], [2, 3], [3, 1], [1, 2, 3]] for [1, 2, 3]', function () {
      var expected = [['1'], ['2'], ['3'], ['1', '2'], ['2', '3'], ['3', '1'], ['1', '2', '3']];
      var actual = lib.allCombinations(['1', '2', '3']);
      actual.every(function(actualElement) {
        expected.some(function(oneExpectedValue) {
          return actualElement.every(function(elem) {
              oneExpectedValue.indexOf(elem) >= 0;
          });
        });
      });
    });
  });

  describe('#compresssor()', function () {

    it('should return [1, 2, 3, "1, 2", "2, 3", "3, 1", "1, 2, 3"] for [["1"], ["2"], ["3"], ["1", "2"], ["2", "3"], ["3", "1"], ["1", "2", "3"]]', function () {
      var input = [['1'], ['2'], ['3'], ['1', '2'], ['2', '3'], ['3', '1'], ['1', '2', '3']];
      var expected = ['1', '2', '3', '12', '23', '31', '123']
      var actual = lib.compresssor(input);
      assert.deepEqual(expected, actual);
    });
  });
});
