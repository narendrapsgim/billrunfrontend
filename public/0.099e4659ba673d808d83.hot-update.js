webpackHotUpdate(0,{

/***/ 262:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nexports.default = function () {\n  var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];\n  var action = arguments[1];\n\n  console.log(action);\n  switch (action.type) {\n    case _plansActions.actions.GOT_PLANS:\n      return state.set('plans', _immutable2.default.fromJS(action.plans));\n\n    default:\n      return state;\n  }\n};\n\nvar _immutable = __webpack_require__(263);\n\nvar _immutable2 = _interopRequireDefault(_immutable);\n\nvar _plansActions = __webpack_require__(264);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar defaultState = _immutable2.default.fromJS([{ name: \"test\" }]);\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/reducers/plansReducer.js\n ** module id = 262\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/reducers/plansReducer.js?");

/***/ }

})