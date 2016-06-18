var FA = require('./finiteAutomata.js').FA;
var util = require('./util.js').util;
var nfaToDfa = {};
var _ = require("lodash");

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
      var key = combination.sort().join('');
      dfaDelta[key] || (dfaDelta[key] = {});
      dfaDelta[key][alphabet] = combination.map(function(state) {
        var nextStates = delta[state] ? (delta[state][alphabet] || []) : [];
        var epsilonresolvedStates = nextStates.length ? FA.epsilonResolver(delta, delta[state]['e'] || []) : [];
        return _.union(epsilonresolvedStates ,nextStates);
      }).reduce(function(bucket, states) {
        return _.union(bucket, states);
      }, []).sort().join('');
    });
  })
  return dfaDelta;
}

nfaToDfa.converter = function(nfa) {

}

exports.nfaToDfa = nfaToDfa;
