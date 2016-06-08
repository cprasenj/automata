# testRunner

This testRunner helps run a set of examples against your NFA and DFA.
The examples themselves sit [here](https://raw.githubusercontent.com/craftybones/examples_json/master/examples.json)


# Instructions
After cloning the repository run npm install

Then run getlatest.sh to get the latest set of examples. This will modify your
examples stored in a file called data.json.

Edit the converter.js file. You will have to implement a function called
finiteAutomata. The details of what that function accepts is contained in the
file as comments.

Usage:

node testRunner.js converter.js  // [runs all tests]

node testRunner.js converter.js dfa // [runs dfa tests]

node testRunner.js converter.js nfa // [runs nfa tests]
