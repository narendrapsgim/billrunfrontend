webpackHotUpdate(0,{

/***/ 544:
/***/ function(module, exports) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.getList = getList;\nvar actions = {\n  GOT_LIST: 'GOT_LIST'\n};\n\nvar defaultQuery = {\n  size: 10,\n  page: 0,\n  query: {}\n};\n\nfunction gotList(collection, list) {\n  return {\n    type: actions.GOT_LIST,\n    collection: collection,\n    list: list\n  };\n}\n\nfunction fetchList(collection, params) {\n  return function (dispatch) {\n    var query = {\n      api: \"find\",\n      params: [{ collection: collection }, { size: params.size }, { page: params.page }, { params: JSON.stringify(params.params) }]\n    };\n\n    apiBillRun(query).then(function (success) {\n      dispatch(gotList(collection, success.data[0].data.details));\n    }, function (failure) {}).catch(function (error) {\n      return dispatch(apiBillRunErrorHandler(error));\n    });\n  };\n}\n\nfunction getList(collection) {\n  var query = arguments.length <= 1 || arguments[1] === undefined ? defaultQuery : arguments[1];\n\n  return function (dispatch) {\n    return dispatch(fetchList(collection, query));\n  };\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/actions/listActions.js\n ** module id = 544\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/actions/listActions.js?");

/***/ }

})