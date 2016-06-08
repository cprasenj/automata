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

exports.finiteAutomata = function(type, tuple){
    return (type == "dfa") ? dfaGenerator(tuple) : dfaGenerator(tuple);
}
