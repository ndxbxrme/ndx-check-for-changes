(function() {
  'use strict';
  var e, error, module;

  module = null;

  try {
    module = angular.module('ndx');
  } catch (error) {
    e = error;
    module = angular.module('ndx-check-for-changes', []);
  }

  module.factory('ndxCheck', function($rootScope, $window) {
    var checkScope, doCheck;
    checkScope = function(scope) {
      var key;
      for (key in scope) {
        if (Object.prototype.toString.call(scope[key]) === '[object Object]') {
          if (scope[key].$$controls) {
            if (!scope[key].$$element[0].attributes.ignore) {
              if (!scope[key].$pristine) {
                return false;
              }
            }
          }
        }
      }
      if (scope.$$childHead) {
        if (!checkScope(scope.$$childHead)) {
          return false;
        }
      }
      if (scope.$$nextSibling) {
        if (!checkScope(scope.$$nextSibling)) {
          return false;
        }
      }
      return true;
    };
    doCheck = function(scope) {
      return checkScope(scope || $rootScope);
    };
    return {
      check: doCheck,
      valid: doCheck
    };
  });

  module.run(function($window, ndxCheck) {
    return $window.onbeforeunload = function(event) {
      if (!ndxCheck.check()) {
        return true;
      }
    };
  });

}).call(this);

//# sourceMappingURL=index.js.map
