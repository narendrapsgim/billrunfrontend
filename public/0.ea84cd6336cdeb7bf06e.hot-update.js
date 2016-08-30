webpackHotUpdate(0,{

/***/ 260:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = configureStore;\n\nvar _redux = __webpack_require__(183);\n\nvar _reducers = __webpack_require__(261);\n\nvar _reducers2 = _interopRequireDefault(_reducers);\n\nvar _reduxThunk = __webpack_require__(521);\n\nvar _reduxThunk2 = _interopRequireDefault(_reduxThunk);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction configureStore() {\n  var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];\n\n  return (0, _redux.createStore)(_reducers2.default, initialState, (0, _redux.applyMiddleware)(_reduxThunk2.default));\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/configureStore.js\n ** module id = 260\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/configureStore.js?");

/***/ },

/***/ 521:
/***/ function(module, exports) {

	eval("'use strict';\n\nexports.__esModule = true;\nfunction createThunkMiddleware(extraArgument) {\n  return function (_ref) {\n    var dispatch = _ref.dispatch;\n    var getState = _ref.getState;\n    return function (next) {\n      return function (action) {\n        if (typeof action === 'function') {\n          return action(dispatch, getState, extraArgument);\n        }\n\n        return next(action);\n      };\n    };\n  };\n}\n\nvar thunk = createThunkMiddleware();\nthunk.withExtraArgument = createThunkMiddleware;\n\nexports['default'] = thunk;\n\n/*****************\n ** WEBPACK FOOTER\n ** ../~/redux-thunk/lib/index.js\n ** module id = 521\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///../~/redux-thunk/lib/index.js?");

/***/ }

})