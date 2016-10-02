webpackHotUpdate(0,{

/***/ 1310:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(176);

	var _inputProcessorActions = __webpack_require__(407);

	var _lib = __webpack_require__(770);

	var _FontIcon = __webpack_require__(1195);

	var _FontIcon2 = _interopRequireDefault(_FontIcon);

	var _colors = __webpack_require__(975);

	var Colors = _interopRequireWildcard(_colors);

	var _reactSelect = __webpack_require__(1144);

	var _reactSelect2 = _interopRequireDefault(_reactSelect);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FieldsMapping = function (_Component) {
	  _inherits(FieldsMapping, _Component);

	  function FieldsMapping(props) {
	    _classCallCheck(this, FieldsMapping);

	    var _this = _possibleConstructorReturn(this, (FieldsMapping.__proto__ || Object.getPrototypeOf(FieldsMapping)).call(this, props));

	    _this.onChangePattern = _this.onChangePattern.bind(_this);
	    _this.onChangeUsaget = _this.onChangeUsaget.bind(_this);
	    _this.addUsagetMapping = _this.addUsagetMapping.bind(_this);
	    _this.onChangeUsaget = _this.onChangeUsaget.bind(_this);
	    _this.onSetType = _this.onSetType.bind(_this);
	    _this.onChangeStaticUsaget = _this.onChangeStaticUsaget.bind(_this);

	    _this.state = {
	      pattern: "",
	      usaget: ""
	    };
	    return _this;
	  }

	  _createClass(FieldsMapping, [{
	    key: 'onChangePattern',
	    value: function onChangePattern(e) {
	      this.setState({ pattern: e.target.value });
	    }
	  }, {
	    key: 'onChangeUsaget',
	    value: function onChangeUsaget(val) {
	      var usageTypes = this.props.usageTypes;


	      var found = usageTypes.find(function (usaget) {
	        return usaget === val;
	      });
	      if (!found) {
	        this.props.addUsagetMapping(val);
	      }

	      this.setState({ usaget: val });
	    }
	  }, {
	    key: 'onChangeStaticUsaget',
	    value: function onChangeStaticUsaget(usaget) {
	      this.onChangeUsaget(usaget);
	      this.props.onSetStaticUsaget.call(this, usaget);
	    }
	  }, {
	    key: 'addUsagetMapping',
	    value: function addUsagetMapping(e) {
	      var _state = this.state;
	      var usaget = _state.usaget;
	      var pattern = _state.pattern;
	      var onError = this.props.onError;

	      if (!this.props.settings.getIn(['processor', 'src_field'])) {
	        onError("Please select usage type field");
	        return;
	      }
	      if (!usaget || !pattern) {
	        onError("Please input a value and unit type");
	        return;
	      }
	      if (pattern.match(/[^a-zA-Z0-9_]/g)) {
	        onError("Only alphanumeric and underscore characters are allowed");
	        return;
	      }
	      this.props.onAddUsagetMapping.call(this, { usaget: usaget, pattern: pattern });
	      this.setState({ pattern: "", usaget: "" });
	    }
	  }, {
	    key: 'removeUsagetMapping',
	    value: function removeUsagetMapping(index, e) {
	      this.props.onRemoveUsagetMapping.call(this, index);
	    }
	  }, {
	    key: 'onSetType',
	    value: function onSetType(e) {
	      var value = e.target.value;

	      this.props.setUsagetType(value);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var _props = this.props;
	      var settings = _props.settings;
	      var usageTypes = _props.usageTypes;
	      var onSetFieldMapping = _props.onSetFieldMapping;

	      var available_fields = [_react2.default.createElement(
	        'option',
	        { disabled: true, value: '', key: -1 },
	        'Select Field'
	      )].concat(_toConsumableArray(settings.get('fields', []).map(function (field, key) {
	        return _react2.default.createElement(
	          'option',
	          { value: field, key: key },
	          field
	        );
	      })));
	      var available_units = usageTypes.map(function (usaget, key) {
	        return { value: usaget, label: usaget };
	      }).toJS();

	      return _react2.default.createElement(
	        'form',
	        { className: 'form-horizontal FieldsMapping' },
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-3' },
	            _react2.default.createElement(
	              'label',
	              { htmlFor: 'date_field' },
	              'Time'
	            ),
	            _react2.default.createElement(
	              'p',
	              { className: 'help-block' },
	              'Time of record creation'
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-9' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-lg-1', style: { marginTop: 8 } },
	              _react2.default.createElement('i', { className: 'fa fa-long-arrow-right' })
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-lg-9' },
	              _react2.default.createElement(
	                'select',
	                { id: 'date_field',
	                  className: 'form-control',
	                  onChange: onSetFieldMapping,
	                  value: settings.getIn(['processor', 'date_field'], '') },
	                available_fields
	              )
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement('div', { className: 'col-lg-3' }),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-9' },
	            'Date'
	          )
	        ),
	        _react2.default.createElement('div', { className: 'separator' }),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-3' },
	            _react2.default.createElement(
	              'label',
	              { htmlFor: 'volume_field' },
	              'Volume'
	            ),
	            _react2.default.createElement(
	              'p',
	              { className: 'help-block' },
	              'Amount calculated'
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-9' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-lg-1', style: { marginTop: 8 } },
	              _react2.default.createElement('i', { className: 'fa fa-long-arrow-right' })
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-lg-9' },
	              _react2.default.createElement(
	                'select',
	                { id: 'volume_field',
	                  className: 'form-control',
	                  onChange: onSetFieldMapping,
	                  value: settings.getIn(['processor', 'volume_field'], '') },
	                available_fields
	              )
	            )
	          )
	        ),
	        _react2.default.createElement('div', { className: 'separator' }),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-2' },
	            _react2.default.createElement(
	              'label',
	              null,
	              'Usage types'
	            ),
	            _react2.default.createElement(
	              'p',
	              { className: 'help-block' },
	              'Types of usages'
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-1' },
	            _react2.default.createElement(
	              'label',
	              null,
	              _react2.default.createElement('input', { type: 'radio',
	                name: 'usage_types_type',
	                value: 'static',
	                checked: settings.get('usaget_type', '') === "static",
	                onChange: this.onSetType }),
	              'Static'
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-9' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-lg-1', style: { marginTop: 8 } },
	              _react2.default.createElement('i', { className: 'fa fa-long-arrow-right' })
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-lg-9' },
	              _react2.default.createElement(_reactSelect2.default, {
	                id: 'unit',
	                options: available_units,
	                allowCreate: true,
	                value: settings.getIn(['processor', 'default_usaget'], ''),
	                disabled: settings.get('usaget_type', '') !== "static",
	                style: { marginTop: 3 },
	                onChange: this.onChangeStaticUsaget
	              })
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-offset-2 col-lg-1' },
	            _react2.default.createElement(
	              'label',
	              null,
	              _react2.default.createElement('input', { type: 'radio',
	                name: 'usage_types_type',
	                value: 'dynamic',
	                checked: settings.get('usaget_type', '') === "dynamic",
	                onChange: this.onSetType }),
	              'Dynamic'
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-9' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-lg-1', style: { marginTop: 8 } },
	              _react2.default.createElement('i', { className: 'fa fa-long-arrow-right' })
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-lg-9' },
	              _react2.default.createElement(
	                'select',
	                { id: 'src_field',
	                  className: 'form-control',
	                  onChange: onSetFieldMapping,
	                  value: settings.getIn(['processor', 'src_field'], ''),
	                  disabled: settings.get('usaget_type', '') !== "dynamic" },
	                available_fields
	              )
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-offset-3 col-lg-7' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-lg-offset-1 col-lg-10' },
	              _react2.default.createElement(
	                'div',
	                { className: 'col-lg-5' },
	                _react2.default.createElement(
	                  'strong',
	                  null,
	                  'Input Value'
	                )
	              ),
	              _react2.default.createElement(
	                'div',
	                { className: 'col-lg-5' },
	                _react2.default.createElement(
	                  'strong',
	                  null,
	                  'Usage Type'
	                )
	              )
	            )
	          )
	        ),
	        settings.getIn(['processor', 'usaget_mapping'], []).map(function (usage_t, key) {
	          return _react2.default.createElement(
	            'div',
	            { className: 'form-group' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-lg-offset-3 col-lg-7' },
	              _react2.default.createElement(
	                'div',
	                { className: 'col-lg-offset-1 col-lg-10' },
	                _react2.default.createElement(
	                  'div',
	                  { className: 'col-lg-5' },
	                  usage_t.get('pattern', '')
	                ),
	                _react2.default.createElement(
	                  'div',
	                  { className: 'col-lg-5' },
	                  usage_t.get('usaget', '')
	                ),
	                _react2.default.createElement(
	                  'div',
	                  { className: 'col-lg-2' },
	                  _react2.default.createElement(
	                    'button',
	                    { type: 'button',
	                      className: 'btn btn-danger btn-circle',
	                      disabled: settings.get('usaget_type', '') !== "dynamic",
	                      onClick: _this2.removeUsagetMapping.bind(_this2, key) },
	                    _react2.default.createElement('i', { className: 'fa fa-minus' })
	                  )
	                )
	              )
	            )
	          );
	        }),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-offset-3 col-lg-7' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-lg-offset-1 col-lg-10' },
	              _react2.default.createElement(
	                'div',
	                { className: 'col-lg-5' },
	                _react2.default.createElement('input', { className: 'form-control',
	                  onChange: this.onChangePattern,
	                  disabled: settings.get('usaget_type', '') !== "dynamic",
	                  value: this.state.pattern })
	              ),
	              _react2.default.createElement(
	                'div',
	                { className: 'col-lg-5' },
	                _react2.default.createElement(_reactSelect2.default, {
	                  id: 'unit',
	                  options: available_units,
	                  allowCreate: true,
	                  value: this.state.usaget,
	                  style: { marginTop: 3 },
	                  disabled: settings.get('usaget_type', '') !== "dynamic",
	                  onChange: this.onChangeUsaget
	                })
	              ),
	              _react2.default.createElement(
	                'div',
	                { className: 'col-lg-2' },
	                _react2.default.createElement(
	                  'button',
	                  { type: 'button',
	                    className: 'btn btn-info btn-circle',
	                    disabled: settings.get('usaget_type', '') !== "dynamic",
	                    onClick: this.addUsagetMapping },
	                  _react2.default.createElement('i', { className: 'fa fa-plus' })
	                )
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return FieldsMapping;
	}(_react.Component);

	exports.default = FieldsMapping;

/***/ }

})