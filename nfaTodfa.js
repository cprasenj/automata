var FA = require('./finiteAutomata.js').FA;
var utils = require('./util.js').util;
var nfaToDfa = {};

nfaToDfa.findEntry = function(delta, startState) {
  return FA.epsilonResolver(delta, [startState]);
}

nfaToDfa.findStateCombinations = function(allStates) {
    return utils.allCombinations(allStates);
}

nfaToDfa.converter = function(nfa) {

}

exports.nfaToDfa = nfaToDfa;
