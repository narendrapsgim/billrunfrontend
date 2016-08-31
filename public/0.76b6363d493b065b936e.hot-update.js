webpackHotUpdate(0,{

/***/ 287:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(4);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRouter = __webpack_require__(199);\n\nvar _App = __webpack_require__(288);\n\nvar _App2 = _interopRequireDefault(_App);\n\nvar _PlansList = __webpack_require__(291);\n\nvar _PlansList2 = _interopRequireDefault(_PlansList);\n\nvar _InputProcessorsList = __webpack_require__(544);\n\nvar _InputProcessorsList2 = _interopRequireDefault(_InputProcessorsList);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = function () {\n  return _react2.default.createElement(\n    _reactRouter.Route,\n    { path: '/', component: _App2.default },\n    _react2.default.createElement(_reactRouter.Route, { name: 'plans', path: '/plans', component: _PlansList2.default }),\n    _react2.default.createElement(_reactRouter.Route, { name: 'input_processor', path: '/input_processor', component: InputProcessor }),\n    _react2.default.createElement(_reactRouter.Route, { name: 'input_processors', path: '/input_processors', component: _InputProcessorsList2.default })\n  );\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/routes/Router.js\n ** module id = 287\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/routes/Router.js?");

/***/ }

})