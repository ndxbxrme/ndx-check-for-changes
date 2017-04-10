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
    var checkScope, doCheck, setPristine;
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
    setPristine = function(scope) {
      var key;
      for (key in scope) {
        if (Object.prototype.toString.call(scope[key]) === '[object Object]') {
          if (scope[key].$$controls) {
            if (!scope[key].$$element[0].attributes.ignore) {
              if (!scope[key].$pristine) {
                scope[key].$setPristine();
              }
            }
          }
        }
      }
      if (scope.$$childHead) {
        setPristine(scope.$$childHead);
      }
      if (scope.$$nextSibling) {
        return setPristine(scope.$$nextSibling);
      }
    };
    doCheck = function(scope) {
      return checkScope(scope || $rootScope);
    };
    return {
      check: doCheck,
      valid: doCheck,
      setPristine: function(scope) {
        return setPristine(scope || $rootScope);
      }
    };
  });

  module.run(function($window, $rootScope, ndxCheck) {
    $window.onbeforeunload = function(event) {
      if (!ndxCheck.check()) {
        return true;
      }
    };
    return $rootScope.$on('$stateChangeStart', function(event) {
      if (!ndxCheck.check()) {
        if (!confirm('Changes you made may not be saved.  Are you sure you want to proceed?')) {
          return event.preventDefault();
        }
      }
    });
  });

}).call(this);

//# sourceMappingURL=index.js.map
