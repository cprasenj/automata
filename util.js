var util = {};

util.allCombinations = function(listofElements) {
  var result = [];
  var combinationGenerator = function(prefix, listofElements) {
    for (var i = 0; i < listofElements.length; i++) {
      result.push(prefix + listofElements[i]);
      combinationGenerator(prefix + listofElements[i], listofElements.slice(i + 1));
    }
  }
  combinationGenerator('', listofElements);
  return result.map(function(elem) {
    return elem.split('');
  });
}

util.compresssor = function(nestedList) {
  return nestedList.map(function(oneNestedElement) {
    return oneNestedElement.reduce(function(result, val) {
      return result += val;
    });
  });
}

exports.util = util;
