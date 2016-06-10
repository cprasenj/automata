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

util.flatten_array = function (nestedArray) {
  typeof nestedArray != 'object' && (nestedArray = [nestedArray]);
  return [].concat.apply([], nestedArray);
}

util.subSet = function(oneStateSet, aNotherStateSet) {
  return (aNotherStateSet.length > 0) && aNotherStateSet.every(function(state) {
    return oneStateSet.indexOf(state) >= 0;
  });
}

util.interSection = function(list, elemList) {
  return elemList.some(function(elem) {
    return list.indexOf(elem) >= 0;
  });
}

exports.util = util;
