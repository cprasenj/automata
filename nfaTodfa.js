var FA = require('./finiteAutomata.js').FA;
var util = require('./util.js').util;
var nfaToDfa = {};
var _ = require("lodash");

var nfa = require("./data.js").nfa;
var tuple = nfa["tuple"];

nfaToDfa.findStateCombinations = function(allStates) {
  return util.allCombinations(allStates);
}

nfaToDfa.findStartState = function(delta, initialState) {
  return FA.epsilonResolver(delta, [initialState]);
}

nfaToDfa.identifyFinalStates = function(combinations, nfaFinalStates) {
  return combinations.filter(function(aCombination) {
    return _.intersection(nfaFinalStates, aCombination);
  });
}

nfaToDfa.findEquvalantDfaTransitions = function(delta, combinatins, alphabets) {
  var dfaDelta = {};
  alphabets.forEach(function(alphabet) {
    combinatins.forEach(function(combination) {
      var key = combination.join("");
      dfaDelta[key] || (dfaDelta[key] = {});
      dfaDelta[key][alphabet] = combination.reduce(function(bucket, state) {
        return _.union(_.uniq(FA.epsilonResolver(delta, [state]), delta[state][alphabet]), bucket);
      }, []);
    });
  })
  return dfaDelta;
}

console.log(nfaToDfa.findEquvalantDfaTransitions(tuple['delta'], util.allCombinations(tuple['states']), tuple['alphabets']))

nfaToDfa.converter = function(nfa) {

}

exports.nfaToDfa = nfaToDfa;
