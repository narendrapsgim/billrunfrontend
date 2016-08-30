webpackHotUpdate(0,{

/***/ 264:
/***/ function(module, exports, __webpack_require__) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.actions = undefined;\nexports.getPlans = getPlans;\n\nvar _Api = __webpack_require__(265);\n\nvar actions = exports.actions = {\n  GOT_PLANS: \"GOT_PLANS\"\n};\n\nfunction gotPlans(plans) {\n  return {\n    type: actions.GOT_PLANS,\n    plans: plans\n  };\n}\n\nfunction fetchPlans(query) {\n  return function (dispatch) {\n    var query = {\n      api: \"find\",\n      params: [{ collection: \"plans\" }, { size: 10 }, { page: 0 }, { query: JSON.stringify({}) }]\n    };\n    (0, _Api.apiBillRun)(query).then(function (success) {\n      dispatch(gotPlans(success.data[0].data.details));\n    }, function (failure) {}).catch(function (error) {\n      return dispatch(apiBillRunErrorHandler(error));\n    });\n  };\n}\n\nfunction getPlans() {\n  var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];\n\n  return function (dispatch) {\n    return dispatch(fetchPlans(query));\n  };\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/actions/plansActions.js\n ** module id = 264\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/actions/plansActions.js?");

/***/ }

})