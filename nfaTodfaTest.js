var assert = require('chai').assert;
var expect = require('chai').expect;
var nfaToDfa = require("./nfaToDfa.js").nfaToDfa;

var nfa ={
          "tuple":{
            "states":["q1","q2","q3"],
            "alphabets":["a","b"],
            "delta":{
                "q1":{"b":["q2"], "e":["q3"]},
                "q2":{"a":["q2", "q3"],"b":["q3"]},
                "q3":{"a":["q1"]}
              },
              "start-state":"q1",
              "final-states":["q1"]
            },
            "pass-cases":["","0","1","00","11","001","110","011","100","0011","1100"],
            "fail-cases":["101","010","11001","00110","0101","1010"]
          };

var tuple = nfa["tuple"]

describe('nfaTodfa', function() {
  describe('#combination()', function () {

    it('should return [] for []', function () {
      var expected = [["q1"], ["q2"], ["q3"], ["q1", "q2"], ["q2", "q3"], ["q3", "q1"], ["q1", "q2", "q3"]];
      var actual = nfaToDfa.findStateCombinations(tuple["states"]);
      actual.every(function(actualElement) {
        expected.some(function(oneExpectedValue) {
          return actualElement.every(function(elem) {
              oneExpectedValue.indexOf(elem) >= 0;
          });
        });
      });
    });
  });
});
