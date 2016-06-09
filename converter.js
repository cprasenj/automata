var flatten_array = function (nestedArray) {
  return [].concat.apply([], nestedArray);
}

var dfa_step_evaluator = function(delta) {
  return function(lastState, symbol) {
    return delta[lastState][symbol];
  }
}

var dfaGenerator = function(tuple) {
    return function(inputString) {
      var lastState = inputString.split("").reduce(dfa_step_evaluator(tuple["delta"]), tuple["start-state"]);
      return tuple["final-states"].indexOf(lastState) >= 0;
    }
}

var epsilonResolver = function(delta, nextStates) {
  var resultStates = [];
  nextStates.forEach(function(aState){
    var epsilonTransition = delta[aState]["e"];
    var epsilonResolved = [];
    if(epsilonTransition) {
      epsilonResolved = epsilonTransition.map(function(state) {
        return epsilonResolver(delta, state);
      });
      resultStates.push(epsilonResolved);
    } else {
      resultStates.push(aState);
    }
  });
  return flatten_array(resultStates);
}

var resolveState = function(delta, aState, symbol) {
  var returnStates = delta[aState][symbol] || [];
  var epsilonReturnStates = delta[aState]["e"] ? epsilonResolver(delta, delta[aState]["e"]) : [];
  return flatten_array([returnStates, epsilonReturnStates])
}

var nfa_step_evaluator = function(delta) {
  return function(lastStates, symbol) {
    var nextStates = lastStates.map(function(aNextState) {
      return resolveState(delta, aNextState, symbol);
    })
    return flatten_array(nextStates);
  }
}

var nfaGenerator = function(tuple) {
  return function(inputString) {
    var inputList = inputString.split("");
    var start_state = tuple["start-state"];
    var delta = tuple["delta"];

    var startStates = delta[start_state]["e"] &&
    (!delta[start_state][inputString[0]]) ?
    delta[start_state]["e"] : [start_state];

    var lastStates = inputList.reduce(nfa_step_evaluator(tuple["delta"]), startStates);
    return lastStates.some(function(aState) {
      return tuple["final-states"].indexOf(aState) >= 0;
    })
  }
}

exports.finiteAutomata = function(type, tuple){
    return (type == "dfa") ? dfaGenerator(tuple) : nfaGenerator(tuple);
}
