'use strict'
module = null
try
  module = angular.module 'ndx'
catch e
  module = angular.module 'ndx-check-for-changes', []
module.factory 'ndxCheck', ($rootScope, $window) ->
  checkScope = (scope) ->
    for key of scope
      if Object.prototype.toString.call(scope[key]) is '[object Object]'
        if scope[key].$$controls
          if not scope[key].$$element[0].attributes.ignore
            if not scope[key].$pristine
              return false
    if scope.$$childHead
      if not checkScope scope.$$childHead
        return false
    if scope.$$nextSibling
      if not checkScope scope.$$nextSibling
        return false
    return true
  doCheck = (scope) ->
    checkScope scope or $rootScope
  check: doCheck
  valid: doCheck
module.run ($window, ndxCheck) ->
  $window.onbeforeunload = (event) ->
    if not ndxCheck.check()
      return true