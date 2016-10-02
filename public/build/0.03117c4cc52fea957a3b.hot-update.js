webpackHotUpdate(0,{

/***/ 1308:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(176);

	var _reactBootstrap = __webpack_require__(770);

	var _inputProcessorActions = __webpack_require__(407);

	var _settingsActions = __webpack_require__(409);

	var _alertsActions = __webpack_require__(266);

	var _Templates = __webpack_require__(1342);

	var _Templates2 = _interopRequireDefault(_Templates);

	var _SampleCSV = __webpack_require__(1309);

	var _SampleCSV2 = _interopRequireDefault(_SampleCSV);

	var _FieldsMapping = __webpack_require__(1310);

	var _FieldsMapping2 = _interopRequireDefault(_FieldsMapping);

	var _CalculatorMapping = __webpack_require__(1311);

	var _CalculatorMapping2 = _interopRequireDefault(_CalculatorMapping);

	var _Receiver = __webpack_require__(1312);

	var _Receiver2 = _interopRequireDefault(_Receiver);

	var _lodash = __webpack_require__(403);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _Stepper = __webpack_require__(1294);

	var _RaisedButton = __webpack_require__(1313);

	var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var InputProcessor = function (_Component) {
	  _inherits(InputProcessor, _Component);

	  function InputProcessor(props) {
	    _classCallCheck(this, InputProcessor);

	    var _this = _possibleConstructorReturn(this, (InputProcessor.__proto__ || Object.getPrototypeOf(InputProcessor)).call(this, props));

	    _this.onSetReceiverCheckboxField = _this.onSetReceiverCheckboxField.bind(_this);
	    _this.onSetCalculatorMapping = _this.onSetCalculatorMapping.bind(_this);
	    _this.onRemoveUsagetMapping = _this.onRemoveUsagetMapping.bind(_this);
	    _this.onSetCustomerMapping = _this.onSetCustomerMapping.bind(_this);
	    _this.onSetReceiverField = _this.onSetReceiverField.bind(_this);
	    _this.onSetDelimiterType = _this.onSetDelimiterType.bind(_this);
	    _this.onAddUsagetMapping = _this.onAddUsagetMapping.bind(_this);
	    _this.onChangeDelimiter = _this.onChangeDelimiter.bind(_this);
	    _this.onSelectSampleCSV = _this.onSelectSampleCSV.bind(_this);
	    _this.onSetFieldMapping = _this.onSetFieldMapping.bind(_this);
	    _this.onRemoveAllFields = _this.onRemoveAllFields.bind(_this);
	    _this.onSetStaticUsaget = _this.onSetStaticUsaget.bind(_this);
	    _this.addUsagetMapping = _this.addUsagetMapping.bind(_this);
	    _this.onSetFieldWidth = _this.onSetFieldWidth.bind(_this);
	    _this.onRemoveField = _this.onRemoveField.bind(_this);
	    _this.setUsagetType = _this.setUsagetType.bind(_this);
	    _this.onSetLineKey = _this.onSetLineKey.bind(_this);
	    _this.handleCancel = _this.handleCancel.bind(_this);
	    _this.onChangeName = _this.onChangeName.bind(_this);
	    _this.onSetRating = _this.onSetRating.bind(_this);
	    _this.onAddField = _this.onAddField.bind(_this);
	    _this.handleNext = _this.handleNext.bind(_this);
	    _this.handlePrev = _this.handlePrev.bind(_this);
	    _this.onError = _this.onError.bind(_this);
	    _this.goBack = _this.goBack.bind(_this);

	    _this.state = {
	      stepIndex: 0,
	      finished: 0,
	      steps: ["parser", "processor", "customer_identification_fields", "receiver"]
	    };
	    return _this;
	  }

	  _createClass(InputProcessor, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var dispatch = this.props.dispatch;
	      var _props$location$query = this.props.location.query;
	      var file_type = _props$location$query.file_type;
	      var action = _props$location$query.action;
	      var template = _props$location$query.template;

	      if (action !== "new") dispatch((0, _inputProcessorActions.getProcessorSettings)(file_type));else if (template) dispatch((0, _inputProcessorActions.setInputProcessorTemplate)(_Templates2.default[template]));
	      dispatch((0, _settingsActions.getSettings)(["usage_types"]));
	    }
	  }, {
	    key: 'onChangeName',
	    value: function onChangeName(e) {
	      this.props.dispatch((0, _inputProcessorActions.setName)(e.target.value));
	    }
	  }, {
	    key: 'onSetDelimiterType',
	    value: function onSetDelimiterType(e) {
	      this.props.dispatch((0, _inputProcessorActions.setDelimiterType)(e.target.value));
	    }
	  }, {
	    key: 'onChangeDelimiter',
	    value: function onChangeDelimiter(e) {
	      this.props.dispatch((0, _inputProcessorActions.setDelimiter)(e.target.value));
	    }
	  }, {
	    key: 'onSelectSampleCSV',
	    value: function onSelectSampleCSV(e) {
	      var _this2 = this;

	      var file = e.target.files[0];
	      var reader = new FileReader();
	      if (!this.props.settings.get('delimiter')) return;
	      reader.onloadend = function (evt) {
	        if (evt.target.readyState == FileReader.DONE) {
	          /* Only need first line */
	          var lines = evt.target.result.split('\n');
	          var header = lines[0];
	          var fields = header.split(_this2.props.settings.get('delimiter')).map(function (field) {
	            return field.replace(/[^a-zA-Z_\d]/g, "_").toLowerCase();
	          });
	          _this2.props.dispatch((0, _inputProcessorActions.setFields)(fields));
	        }
	      };
	      var blob = file.slice(0, file.size - 1);
	      reader.readAsText(blob);
	    }
	  }, {
	    key: 'onAddField',
	    value: function onAddField(val, e) {
	      if (!val || _lodash2.default.isEmpty(val.replace(/ /g, ''))) {
	        this.props.dispatch((0, _alertsActions.showWarning)("Please input field name"));
	        return;
	      }
	      var value = val.replace(/[^a-zA-Z_]/g, "_").toLowerCase();
	      var fields = this.props.settings.get('fields');
	      if (fields.includes(value)) {
	        this.props.dispatch((0, _alertsActions.showWarning)("Field already exists"));
	        return;
	      }
	      this.props.dispatch((0, _inputProcessorActions.addCSVField)(value));
	    }
	  }, {
	    key: 'onRemoveField',
	    value: function onRemoveField(index, e) {
	      this.props.dispatch((0, _inputProcessorActions.removeCSVField)(index));
	    }
	  }, {
	    key: 'onRemoveAllFields',
	    value: function onRemoveAllFields() {
	      this.props.dispatch((0, _inputProcessorActions.removeAllCSVFields)());
	    }
	  }, {
	    key: 'onSetFieldMapping',
	    value: function onSetFieldMapping(e) {
	      var _e$target = e.target;
	      var mapping = _e$target.value;
	      var field = _e$target.id;

	      this.props.dispatch((0, _inputProcessorActions.setFieldMapping)(field, mapping));
	    }
	  }, {
	    key: 'onSetFieldWidth',
	    value: function onSetFieldWidth(e) {
	      var _e$target2 = e.target;
	      var value = _e$target2.value;
	      var field = _e$target2.dataset.field;

	      this.props.dispatch((0, _inputProcessorActions.setFieldWidth)(field, value));
	    }
	  }, {
	    key: 'onSetCalculatorMapping',
	    value: function onSetCalculatorMapping(e) {
	      var _e$target3 = e.target;
	      var mapping = _e$target3.value;
	      var field = _e$target3.id;

	      this.props.dispatch(setCalculatorMapping(field, mapping));
	    }
	  }, {
	    key: 'onAddUsagetMapping',
	    value: function onAddUsagetMapping(val) {
	      this.props.dispatch((0, _inputProcessorActions.mapUsaget)(val));
	    }
	  }, {
	    key: 'onSetStaticUsaget',
	    value: function onSetStaticUsaget(val) {
	      this.props.dispatch((0, _inputProcessorActions.setStaticUsaget)(val));
	    }
	  }, {
	    key: 'onRemoveUsagetMapping',
	    value: function onRemoveUsagetMapping(index, e) {
	      this.props.dispatch((0, _inputProcessorActions.removeUsagetMapping)(index));
	    }
	  }, {
	    key: 'setUsagetType',
	    value: function setUsagetType(val) {
	      this.props.dispatch((0, _inputProcessorActions.setUsagetType)(val));
	    }
	  }, {
	    key: 'onSetCustomerMapping',
	    value: function onSetCustomerMapping(e) {
	      var _e$target4 = e.target;
	      var mapping = _e$target4.value;
	      var field = _e$target4.id;

	      this.props.dispatch((0, _inputProcessorActions.setCustomerMapping)(field, mapping));
	    }
	  }, {
	    key: 'onSetRating',
	    value: function onSetRating(e) {
	      var _e$target5 = e.target;
	      var _e$target5$dataset = _e$target5.dataset;
	      var usaget = _e$target5$dataset.usaget;
	      var rate_key = _e$target5$dataset.rate_key;
	      var value = _e$target5.value;

	      this.props.dispatch((0, _inputProcessorActions.setRatingField)(usaget, rate_key, value));
	    }
	  }, {
	    key: 'onSetLineKey',
	    value: function onSetLineKey(e) {
	      var _e$target6 = e.target;
	      var usaget = _e$target6.dataset.usaget;
	      var value = _e$target6.value;

	      this.props.dispatch((0, _inputProcessorActions.setLineKey)(usaget, value));
	    }
	  }, {
	    key: 'onSetReceiverField',
	    value: function onSetReceiverField(e) {
	      var _e$target7 = e.target;
	      var id = _e$target7.id;
	      var value = _e$target7.value;

	      this.props.dispatch((0, _inputProcessorActions.setReceiverField)(id, value));
	    }
	  }, {
	    key: 'onSetReceiverCheckboxField',
	    value: function onSetReceiverCheckboxField(e) {
	      var _e$target8 = e.target;
	      var id = _e$target8.id;
	      var checked = _e$target8.checked;

	      this.props.dispatch((0, _inputProcessorActions.setReceiverField)(id, checked));
	    }
	  }, {
	    key: 'addUsagetMapping',
	    value: function addUsagetMapping(val) {
	      this.props.dispatch((0, _inputProcessorActions.addUsagetMapping)(val));
	    }
	  }, {
	    key: 'onError',
	    value: function onError(message) {
	      this.props.dispatch((0, _alertsActions.showDanger)(message));
	    }
	  }, {
	    key: 'goBack',
	    value: function goBack() {
	      this.context.router.push({
	        pathname: "input_processors"
	      });
	    }
	  }, {
	    key: 'handleNext',
	    value: function handleNext() {
	      var _this3 = this;

	      var stepIndex = this.state.stepIndex;

	      var cb = function cb(err) {
	        if (err) return;
	        if (_this3.state.finished) {
	          _this3.props.dispatch((0, _alertsActions.showSuccess)("Input processor saved successfully!"));
	          _this3.goBack();
	        } else {
	          var totalSteps = _this3.state.steps.length - 1;
	          var finished = stepIndex + 1 === totalSteps;
	          _this3.setState({
	            stepIndex: stepIndex + 1,
	            finished: finished
	          });
	        }
	      };
	      var part = this.state.finished ? false : this.state.steps[stepIndex];
	      this.props.dispatch((0, _inputProcessorActions.saveInputProcessorSettings)(this.props.settings, cb, part));
	    }
	  }, {
	    key: 'handlePrev',
	    value: function handlePrev() {
	      var stepIndex = this.state.stepIndex;

	      if (stepIndex > 0) return this.setState({ stepIndex: stepIndex - 1, finished: 0 });
	      var r = confirm("are you sure you want to stop editing input processor?");
	      if (r) {
	        this.props.dispatch((0, _inputProcessorActions.clearInputProcessor)());
	        this.goBack();
	      }
	    }
	  }, {
	    key: 'handleCancel',
	    value: function handleCancel() {
	      var _this4 = this;

	      var r = confirm("are you sure you want to stop editing input processor?");
	      var _props = this.props;
	      var dispatch = _props.dispatch;
	      var fileType = _props.fileType;

	      if (r) {
	        if (fileType !== true) {
	          dispatch((0, _inputProcessorActions.clearInputProcessor)());
	          this.goBack();
	        } else {
	          var cb = function cb(err) {
	            if (err) {
	              dispatch((0, _alertsActions.showDanger)("Please try again"));
	              return;
	            }
	            dispatch((0, _inputProcessorActions.clearInputProcessor)());
	            _this4.goBack();
	          };
	          dispatch((0, _inputProcessorActions.deleteInputProcessor)(this.props.settings.get('file_type'), cb));
	        }
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this5 = this;

	      var stepIndex = this.state.stepIndex;
	      var _props2 = this.props;
	      var settings = _props2.settings;
	      var usage_types = _props2.usage_types;


	      var steps = [_react2.default.createElement(_FieldsMapping2.default, { onSetFieldMapping: this.onSetFieldMapping, onAddUsagetMapping: this.onAddUsagetMapping, addUsagetMapping: this.addUsagetMapping, onRemoveUsagetMapping: this.onRemoveUsagetMapping, onError: this.onError, onSetStaticUsaget: this.onSetStaticUsaget, setUsagetType: this.setUsagetType, settings: settings, usageTypes: usage_types }), _react2.default.createElement(_SampleCSV2.default, { onChangeName: this.onChangeName, onSetDelimiterType: this.onSetDelimiterType, onChangeDelimiter: this.onChangeDelimiter, onSelectSampleCSV: this.onSelectSampleCSV, onAddField: this.onAddField, onSetFieldWidth: this.onSetFieldWidth, onRemoveField: this.onRemoveField, onRemoveAllFields: this.onRemoveAllFields, settings: settings }), _react2.default.createElement(_CalculatorMapping2.default, { onSetCalculatorMapping: this.onSetCalculatorMapping, onSetRating: this.onSetRating, onSetCustomerMapping: this.onSetCustomerMapping, onSetLineKey: this.onSetLineKey, settings: settings }), _react2.default.createElement(_Receiver2.default, { onSetReceiverField: this.onSetReceiverField, onSetReceiverCheckboxField: this.onSetReceiverCheckboxField, settings: settings.get('receiver') })];

	      var action = this.props.location.query.action;

	      var title = action === 'new' ? "New input processor" : 'Edit input processor - ' + settings.get('file_type');

	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'row' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-12' },
	            _react2.default.createElement(
	              'div',
	              { className: 'panel panel-default' },
	              _react2.default.createElement(
	                'div',
	                { className: 'panel-heading' },
	                title
	              ),
	              _react2.default.createElement(
	                'div',
	                { className: 'panel-body' },
	                _react2.default.createElement(
	                  _Stepper.Stepper,
	                  { activeStep: stepIndex },
	                  _react2.default.createElement(
	                    _Stepper.Step,
	                    null,
	                    _react2.default.createElement(
	                      _Stepper.StepLabel,
	                      null,
	                      'Select CSV'
	                    )
	                  ),
	                  _react2.default.createElement(
	                    _Stepper.Step,
	                    null,
	                    _react2.default.createElement(
	                      _Stepper.StepLabel,
	                      null,
	                      'Field Mapping'
	                    )
	                  ),
	                  _react2.default.createElement(
	                    _Stepper.Step,
	                    null,
	                    _react2.default.createElement(
	                      _Stepper.StepLabel,
	                      null,
	                      'Calculator Mapping'
	                    )
	                  ),
	                  _react2.default.createElement(
	                    _Stepper.Step,
	                    null,
	                    _react2.default.createElement(
	                      _Stepper.StepLabel,
	                      null,
	                      'Receiver'
	                    )
	                  )
	                ),
	                _react2.default.createElement(
	                  'div',
	                  { className: 'contents bordered-container' },
	                  steps[stepIndex]
	                )
	              ),
	              _react2.default.createElement(
	                'div',
	                { style: { marginTop: 12, float: "right" } },
	                _react2.default.createElement(
	                  'button',
	                  { className: 'btn btn-default',
	                    onClick: this.handleCancel,
	                    style: { marginRight: 12 } },
	                  'Cancel'
	                ),
	                function () {
	                  if (stepIndex > 0) {
	                    return _react2.default.createElement(
	                      'button',
	                      { className: 'btn btn-default',
	                        onClick: _this5.handlePrev,
	                        style: { marginRight: 12 } },
	                      'Back'
	                    );
	                  }
	                }(),
	                _react2.default.createElement(
	                  'button',
	                  { className: 'btn btn-primary',
	                    onClick: this.handleNext },
	                  stepIndex === steps.length - 1 ? "Finish" : "Next"
	                )
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return InputProcessor;
	}(_react.Component);

	InputProcessor.contextTypes = {
	  router: _react2.default.PropTypes.object.isRequired
	};

	function mapStateToProps(state, props) {
	  return { settings: state.inputProcessor,
	    usage_types: state.settings.get('usage_types') };
	}

	exports.default = (0, _reactRedux.connect)(mapStateToProps)(InputProcessor);

/***/ }

})