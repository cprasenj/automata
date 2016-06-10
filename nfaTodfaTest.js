var assert = require('chai').assert;
var expect = require('chai').expect;
var nfaToDfa = require("./nfaToDfa.js").nfaToDfa;

var nfa ={
          "name":"0*1* or 1*0*",
          "type":"nfa",
          "tuple":{
            "states":["q1","q3","q2","q5","q4"],
            "alphabets":["1","0"],
            "delta":{
                "q1":{"e":["q2","q4"]},
                "q2":{"0":["q2"],"e":["q3"]},
                "q3":{"1":["q3"]},
                "q4":{"1":["q4"],"e":["q5"]},
                "q5":{"0":["q5"]}
              },
              "start-state":"q1",
              "final-states":["q3","q5"]
            },
            "pass-cases":["","0","1","00","11","001","110","011","100","0011","1100"],
            "fail-cases":["101","010","11001","00110","0101","1010"]
          };

var tuple = nfa["tuple"]

describe('nfaTodfa', function() {
  describe('#combination()', function () {

    it('should return [] for []', function () {
      var expected = ["q1", "q2", "q3", "q4", "q5"];
      var actual = nfaToDfa.findInitialStateCombination(tuple["delta"], [tuple["start-state"]]);
      assert.deepEqual(actual, expected);
    });
  });
});
