var util = require('./util.js').util;
var _ = require("lodash");

var dfa_transit = function(delta) {
  return function(lastState, symbol) {
    return delta[lastState][symbol];
  }
}

var dfaGenerator = function(tuple) {
    return function(inputString) {
      var lastState = inputString.split("").reduce(
        dfa_transit(tuple["delta"]), tuple["start-state"]
      );
      return tuple["final-states"].indexOf(lastState) >= 0;
    }
}

var epsilonResolver = function(delta, nextStates) {
    var nextEpsilons = _.flatten(nextStates.map(function(state) {
      return delta[state] && delta[state]['e'] ? delta[state]['e'] : [];
    }));
    return (util.subSet(nextStates, nextEpsilons) || !nextEpsilons.length) ? nextStates :
    epsilonResolver(delta, _.union(nextEpsilons, nextStates));
}

var nfa_transit = function(delta) {
  return function(lastStates, symbol) {
    var returnStates = _.flatten(lastStates.map(function(aState) {
      return (delta[aState] && delta[aState][symbol]) || [];
    }));
    return _.flatten(_.union(epsilonResolver(delta, returnStates), returnStates));
  }
}

var nfaGenerator = function(tuple) {
  return function(inputString) {
    var delta = tuple["delta"];
    var lastStates = inputString.split("").reduce(
      nfa_transit(delta), epsilonResolver(delta, [tuple["start-state"]])
    );
    return _.intersection(tuple["final-states"], lastStates).length > 0;
  }
}

exports.finiteAutomata = function(type, tuple){
    return (type == "dfa") ? dfaGenerator(tuple) : nfaGenerator(tuple);
}

exports.FA = {
  "dfaGenerator": dfaGenerator,
  "dfa_transit": dfa_transit,
  "nfa_transit": nfa_transit,
  "nfaGenerator": nfaGenerator,
  "epsilonResolver": epsilonResolver
}
