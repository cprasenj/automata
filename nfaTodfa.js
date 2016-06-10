var finiteAutomata = require('./finiteAutomata.js');
var epsilonResolver = finiteAutomata.epsilonResolver;
var utils = require('./util.js');
var nfaToDfa = {};
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

var epsilonResolver = function(delta, nextStates) {
  var resultStates = [];
  nextStates.forEach(function(aState){
    var epsilonTransition = delta[aState]["e"];
    var epsilonResolved = [];
    resultStates.push(aState);
    if(epsilonTransition) {
      epsilonResolved = epsilonTransition.map(function(state) {
        return epsilonResolver(delta, [state]);
      });
      resultStates.push(flatten_array(epsilonResolved));
    }
  });
  return flatten_array(resultStates);
}

nfaToDfa.findInitialStateCombination = function(delta, startStateSet) {
  var result = [];
  var nestedResult = epsilonResolver(delta, startStateSet);
  nestedResult.forEach(function(aNestedResult) {
    result.push(flatten_array(aNestedResult));
  })
  return flatten_array(result);
}

nfaToDfa.findStateCombinations = function() {
  
}

nfaToDfa.converter = function(nfa) {

}

exports.nfaToDfa = nfaToDfa;
