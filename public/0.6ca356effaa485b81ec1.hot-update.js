webpackHotUpdate(0,{

/***/ 175:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(4);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(176);\n\nvar _reactRouter = __webpack_require__(199);\n\nvar _configureStore = __webpack_require__(265);\n\nvar _configureStore2 = _interopRequireDefault(_configureStore);\n\nvar _Router = __webpack_require__(260);\n\nvar _Router2 = _interopRequireDefault(_Router);\n\nvar _immutable = __webpack_require__(264);\n\nvar _immutable2 = _interopRequireDefault(_immutable);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar routes = (0, _Router2.default)();\n\nvar Root = function (_Component) {\n  _inherits(Root, _Component);\n\n  function Root(props) {\n    _classCallCheck(this, Root);\n\n    return _possibleConstructorReturn(this, (Root.__proto__ || Object.getPrototypeOf(Root)).call(this, props));\n  }\n\n  _createClass(Root, [{\n    key: 'render',\n    value: function render() {\n      return _react2.default.createElement(\n        _reactRedux.Provider,\n        { store: store },\n        _react2.default.createElement(\n          _reactRouter.Router,\n          { history: _reactRouter.hashHistory },\n          routes\n        )\n      );\n    }\n  }]);\n\n  return Root;\n}(_react.Component);\n\nexports.default = Root;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/containers/Root.js\n ** module id = 175\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/containers/Root.js?");

/***/ },

/***/ 265:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = configureStore;\n\nvar _redux = __webpack_require__(183);\n\nvar _reducers = __webpack_require__(266);\n\nvar _reducers2 = _interopRequireDefault(_reducers);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction configureStore() {\n  var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];\n\n  return (0, _redux.createStore)(_reducers2.default, initialState);\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/configureStore.js\n ** module id = 265\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/configureStore.js?");

/***/ },

/***/ 266:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _redux = __webpack_require__(183);\n\nvar _plansReducer = __webpack_require__(267);\n\nvar _plansReducer2 = _interopRequireDefault(_plansReducer);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = (0, _redux.combineReducers)({\n  plansReducer: _plansReducer2.default\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/reducers/index.js\n ** module id = 266\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/reducers/index.js?");

/***/ },

/***/ 267:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nexports.default = function () {\n  var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];\n  var action = arguments[1];\n\n  switch (action.type) {\n    default:\n      return state;\n  }\n};\n\nvar _immutable = __webpack_require__(264);\n\nvar _immutable2 = _interopRequireDefault(_immutable);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar defaultState = _immutable2.default.fromJS({});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/reducers/plansReducer.js\n ** module id = 267\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/reducers/plansReducer.js?");

/***/ }

})