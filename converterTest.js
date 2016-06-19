var nfaToDfa = require("./"+process.argv[2]).nfaToDfa;
var dfa = require('./finiteAutomata.js').FA.dfaGenerator;
var exampleData = require('./data.json');
var util = require("util");
var chalk = require("chalk");

var runTestCases = function(automata, dataSet) {
  dataSet["pass-cases"].forEach(function(pass_case){
    if(automata(pass_case)) {
      console.log(chalk.green(util.format("%s : pass", pass_case)));
    } else {
      console.log(chalk.bold.red(util.format("%s : fail", pass_case)));
    }
  });

  dataSet["fail-cases"].forEach(function(pass_case){
    if(automata(pass_case)) {
      console.log(chalk.bold.red(util.format("%s : fail", pass_case)));
    } else {
      console.log(chalk.green(util.format("%s : pass", pass_case)));
    }
  });
}

var run = function(data, converter){
  data.forEach(function(dataSet) {
    var type = dataSet.type;
    var tuple = dataSet.tuple;
    if(type == 'nfa') {
      var automata = dfa(converter(tuple));
      console.log(chalk.yellow(util.format("Running %s example for %s", dataSet["name"], dataSet["type"])));
      console.log(chalk.yellow("Running for inputs:"));
      runTestCases(automata, dataSet);
    }
  });
}

run(JSON.parse(exampleData), nfaToDfa.converter);
