var util = require('./util.js').util;

var dfa_next = function(delta) {
  return function(lastState, symbol) {
    return delta[lastState][symbol];
  }
}

var dfaGenerator = function(tuple) {
    return function(inputString) {
      var lastState = inputString.split("").reduce(
        dfa_next(tuple["delta"]), tuple["start-state"]
      );
      return tuple["final-states"].indexOf(lastState) >= 0;
    }
}

var epsilonResolver = function(delta, nextStates) {
    var nextEpsilons = util.flatten_array(nextStates.map(function(state) {
      return delta[state] && delta[state]['e'] ? delta[state]['e'] : [];
    }));
    return (util.subSet(nextStates, nextEpsilons) || !nextEpsilons.length) ? nextStates :
    epsilonResolver(delta, nextEpsilons.concat(nextStates));
}

var resolveState = function(delta, states, symbol) {
  var returnStates = util.flatten_array(states.map(function(aState) {
    return (delta[aState] && delta[aState][symbol]) || [];
  }));
  return util.flatten_array(epsilonResolver(delta, returnStates).concat(returnStates));
}

var nfa_next = function(delta) {
  return function(lastStates, symbol) {
    var nextStates = resolveState(delta, lastStates, symbol);
    return util.flatten_array(nextStates);
  }
}

var nfaGenerator = function(tuple) {
  return function(inputString) {
    var lastStates = inputString.split("").reduce(nfa_next(tuple["delta"]), [tuple["start-state"]]);
    return util.interSection(tuple["final-states"], lastStates);
  }
}

exports.finiteAutomata = function(type, tuple){
    return (type == "dfa") ? dfaGenerator(tuple) : nfaGenerator(tuple);
}
