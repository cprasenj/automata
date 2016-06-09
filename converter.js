var flatten_array = function (nestedArray) {
  return [].concat.apply([], nestedArray);
}

var hasInterSection = function(list, elemList) {
  return elemList.some(function(elem) {
    return list.indexOf(elem) >= 0;
  });
}

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
  var resultStates = [];
  nextStates.forEach(function(aState){
    var epsilonTransition = delta[aState]["e"];
    var epsilonResolved = [];
    if(epsilonTransition) {
      epsilonResolved = epsilonTransition.map(function(state) {
        return epsilonResolver(delta, [state]);
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

var nfa_next = function(delta) {
  return function(lastStates, symbol) {
    var nextStates = lastStates.map(function(aNextState) {
      return resolveState(delta, aNextState, symbol);
    })
    return flatten_array(nextStates);
  }
}

var beginingEpsilonRisolver = function(delta, inputString, start_state) {
  if(!inputString[0]) {
    startStates = flatten_array(resolveState(delta, start_state, ""));
  } else {
    startStates = delta[start_state]["e"];
    if(delta[start_state][inputString[0]]) {
      startStates = flatten_array([startStates, delta[start_state][inputString[0]]]);
    }
  }
  return startStates;
}

var nfaGenerator = function(tuple) {
  return function(inputString) {
    var start_state = tuple["start-state"];
    var delta = tuple["delta"];
    var startStates = [start_state];
    var inputList = inputString.split("");
    if(delta[start_state]["e"]) {
      startStates = beginingEpsilonRisolver(delta, inputString, start_state);
      delta[start_state][inputList[0]] && (inputList = inputList.slice(1));
    }
    var lastStates = inputList.reduce(nfa_next(tuple["delta"]), startStates);
    lastStates = flatten_array(epsilonResolver(delta, lastStates));
    return hasInterSection(tuple["final-states"], lastStates);
  }
}

exports.finiteAutomata = function(type, tuple){
    return (type == "dfa") ? dfaGenerator(tuple) : nfaGenerator(tuple);
}
