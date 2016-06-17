var util = {};
var _ = require("lodash");

util.allCombinations = function combinations(list) {
    var combinator = function(active, rest, bucket) {
        if (!active.length && !rest.length)
            return;
        if (!rest.length) {
            bucket.push(_.compact(_.flattenDeep(active)));
        } else {
            combinator([active, _.head(rest)], _.tail(rest), bucket);
            combinator([active], _.tail(rest), bucket);
        }
        return bucket;
    }
    return _.remove(combinator("", list, []), function(element) {
      return element.length != 0;
    });
}


util.compresssor = function(nestedList) {
  return nestedList.map(function(oneNestedElement) {
    return oneNestedElement.reduce(function(result, val) {
      return result += val;
    });
  });
}

util.subSet = function(oneStateSet, aNotherStateSet) {
  return (aNotherStateSet.length > 0) && aNotherStateSet.every(function(state) {
    return oneStateSet.indexOf(state) >= 0;
  });
}

exports.util = util;
