var FA = require('./finiteAutomata.js').FA;
var util = require('./util.js').util;
var nfaToDfa = {};
var _ = require("lodash");

nfaToDfa.identifyFinalStates = function(combinations, nfaFinalStates) {
  return combinations.filter(function(aCombination) {
    return _.intersection(nfaFinalStates, aCombination);
  });
}

nfaToDfa.findStateCombinations = function(allStates) {
  return util.allCombinations(allStates);
}

nfaToDfa.converter = function(nfa) {

}

exports.nfaToDfa = nfaToDfa;
