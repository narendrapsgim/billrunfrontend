webpackHotUpdate(0,{

/***/ 260:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = configureStore;\n\nvar _redux = __webpack_require__(183);\n\nvar _reducers = __webpack_require__(261);\n\nvar _reducers2 = _interopRequireDefault(_reducers);\n\nvar _reactRedux = __webpack_require__(176);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction configureStore() {\n  var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];\n\n  return (0, _redux.createStore)(_reducers2.default, initialState, (0, _reactRedux.applyMiddleware)(thunkMiddleware));\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/configureStore.js\n ** module id = 260\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/configureStore.js?");

/***/ }

})