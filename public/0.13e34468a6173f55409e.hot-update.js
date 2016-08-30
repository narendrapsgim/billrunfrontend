webpackHotUpdate(0,{

/***/ 262:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nexports.default = function () {\n  var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];\n  var action = arguments[1];\n  var collection = action.collection;\n  var list = action.list;\n\n  switch (action.type) {\n    case _listActions.actions.GOT_LIST:\n      return state.set(collection, _immutable2.default.fromJS(list).toList());\n\n    default:\n      return state;\n  }\n};\n\nvar _immutable = __webpack_require__(263);\n\nvar _immutable2 = _interopRequireDefault(_immutable);\n\nvar _listActions = __webpack_require__(264);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar defaultState = _immutable2.default.Map();\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/reducers/listReducer.js\n ** module id = 262\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/reducers/listReducer.js?");

/***/ }

})