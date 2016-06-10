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
    return util.subSet(nextStates, nextEpsilons) || !nextEpsilons.length ? nextStates :
    epsilonResolver(delta, nextEpsilons.concat(nextStates));
}

var resolveState = function(delta, aState, symbol) {
  var returnStates = (delta[aState] && delta[aState][symbol]) || [];
  var epsilonReturnStates = delta[aState] && delta[aState]["e"] ?
  (delta, delta[aState]["e"]) : [];
  return util.flatten_array([returnStates, epsilonReturnStates])
}

var nfa_next = function(delta) {
  return function(lastStates, symbol) {
    var nextStates = lastStates.map(function(aNextState) {
      return resolveState(delta, aNextState, symbol);
    })
    return util.flatten_array(nextStates);
  }
}

var initialTransition = function(delta, inputString, start_state) {
  var startStates = [start_state];
  if(delta[start_state] && delta[start_state]["e"]) {
    if(!inputString[0]) {
      startStates = util.flatten_array(resolveState(delta, start_state, ""));
    } else {
      startStates = delta[start_state]["e"];
      var transitionForFirstSymbol = delta[start_state][inputString[0]];
      if(transitionForFirstSymbol) {
        startStates = util.flatten_array([startStates, transitionForFirstSymbol]);
      }
    }
  }
  return startStates;
}

var nfaGenerator = function(tuple) {
  return function(inputString) {
    var start_state = tuple["start-state"];
    var delta = tuple["delta"];
    var inputList = inputString.split("");
    var startStates = initialTransition(delta, inputString, start_state);
    delta[start_state][inputList[0]] && (inputList = inputList.slice(1));
    var lastStates = inputList.reduce(nfa_next(tuple["delta"]), startStates);
    lastStates = util.flatten_array(epsilonResolver(delta, lastStates));
    return util.interSection(tuple["final-states"], lastStates);
  }
}

exports.finiteAutomata = function(type, tuple){
    return (type == "dfa") ? dfaGenerator(tuple) : nfaGenerator(tuple);
}
