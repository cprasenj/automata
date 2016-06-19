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
    return nfaFinalStates.some(function(aFinalState) {
      return aCombination.indexOf(aFinalState) >= 0;
    });
  });
}

var findDfaTransitions = function(delta, alphabet) {
  return function(state) {
    var nextStates = util.evalNextedValue(delta, [state, alphabet]);
    var epsilonresolvedStates = nextStates.length ?
    FA.epsilonResolver(delta, util.evalNextedValue(delta, [state, 'e'])) : [];
    return _.union(epsilonresolvedStates ,nextStates);
  }
};

var nextStateForAnAlphabet = function(combination, delta, alphabet) {
  return util.sortedJoin(combination
    .map(findDfaTransitions(delta, alphabet))
    .reduce(function(bucket, states) {
      return _.union(bucket, states);
    }, []));
};

nfaToDfa.findEquvalantDfaTransitions = function(delta, combinatins, alphabets) {
  var dfaDelta = {};
  alphabets.forEach(function(alphabet) {
    combinatins.forEach(function(combination) {
      var key = combination.sort().join('');
      dfaDelta[key] || (dfaDelta[key] = {});
      dfaDelta[key][alphabet] = nextStateForAnAlphabet(combination, delta, alphabet);
    });
  })
  return dfaDelta;
}

nfaToDfa.converter = function(nfa) {
  var dfa = {};
  var alphabets = nfa['alphabets'];
  var nfaDelta = nfa['delta'];
  var combinations = nfaToDfa.findStateCombinations(nfa['states']);
  dfa['states'] = combinations.map(function(combination) {
    return util.sortedJoin(combination);
  });
  dfa['alphabets'] = alphabets;
  dfa['delta'] = nfaToDfa.findEquvalantDfaTransitions(nfaDelta, combinations, alphabets);
  dfa['start-state'] = util.sortedJoin(nfaToDfa.findStartState(nfaDelta, nfa['start-state']));
  dfa['final-states'] =
    nfaToDfa.identifyFinalStates(combinations, nfa['final-states']).map(function(combination) {
    return util.sortedJoin(combination);
  });
  return dfa;
}

exports.nfaToDfa = nfaToDfa;
