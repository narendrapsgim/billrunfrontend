webpackHotUpdate(0,{

/***/ 175:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(176);

	var _reactRouter = __webpack_require__(199);

	var _configureStore = __webpack_require__(260);

	var _configureStore2 = _interopRequireDefault(_configureStore);

	var _Router = __webpack_require__(766);

	var _Router2 = _interopRequireDefault(_Router);

	var _immutable = __webpack_require__(265);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _reactTapEventPlugin = __webpack_require__(1336);

	var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var routes = (0, _Router2.default)();
	var store = (0, _configureStore2.default)();

	var Root = function (_Component) {
	  _inherits(Root, _Component);

	  function Root(props) {
	    _classCallCheck(this, Root);

	    var _this = _possibleConstructorReturn(this, (Root.__proto__ || Object.getPrototypeOf(Root)).call(this, props));

	    (0, _reactTapEventPlugin2.default)();
	    return _this;
	  }

	  _createClass(Root, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        _reactRedux.Provider,
	        { store: store },
	        _react2.default.createElement(
	          _reactRouter.Router,
	          { history: _reactRouter.hashHistory },
	          routes
	        )
	      );
	    }
	  }]);

	  return Root;
	}(_react.Component);

	exports.default = Root;

/***/ },

/***/ 260:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = configureStore;

	var _redux = __webpack_require__(183);

	var _reducers = __webpack_require__(261);

	var _reducers2 = _interopRequireDefault(_reducers);

	var _reduxThunk = __webpack_require__(421);

	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function configureStore() {
	  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  return (0, _redux.createStore)(_reducers2.default, initialState, (0, _redux.applyMiddleware)(_reduxThunk2.default));
	}

/***/ },

/***/ 406:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.default = function () {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
	  var action = arguments[1];
	  var field = action.field;
	  var mapping = action.mapping;
	  var width = action.width;
	  var rate_key, value, usaget;
	  var value, usaget;

	  var _ret = function () {
	    switch (action.type) {
	      case _inputProcessorActions.GOT_PROCESSOR_SETTINGS:
	        return {
	          v: _immutable2.default.fromJS(action.settings)
	        };

	      case _inputProcessorActions.SET_NAME:
	        return {
	          v: state.set('file_type', action.file_type)
	        };

	      case _inputProcessorActions.SET_DELIMITER_TYPE:
	        return {
	          v: state.set('delimiter_type', action.delimiter_type)
	        };

	      case _inputProcessorActions.SET_DELIMITER:
	        return {
	          v: state.set('delimiter', action.delimiter)
	        };

	      case _inputProcessorActions.SET_FIELDS:
	        if (state.get('fields').size > 0) return {
	            v: state.update('fields', function (list) {
	              return list.concat(action.fields);
	            })
	          };
	        return {
	          v: state.set('fields', _immutable2.default.fromJS(action.fields))
	        };

	      case _inputProcessorActions.SET_FIELD_WIDTH:
	        return {
	          v: state.setIn(['field_widths', field], parseInt(width, 10))
	        };

	      case _inputProcessorActions.SET_FIELD_MAPPING:
	        return {
	          v: state.setIn(['processor', field], mapping)
	        };

	      case _inputProcessorActions.ADD_CSV_FIELD:
	        return {
	          v: state.update('fields', function (list) {
	            return list.push(action.field);
	          })
	        };

	      case _inputProcessorActions.REMOVE_CSV_FIELD:
	        return {
	          v: state.update('fields', function (list) {
	            return list.remove(action.index);
	          })
	        };

	      case _inputProcessorActions.REMOVE_ALL_CSV_FIELDS:
	        return {
	          v: state.set('fields', _immutable2.default.List())
	        };

	      case _inputProcessorActions.SET_USAGET_TYPE:
	        return {
	          v: state.set('usaget_type', action.usaget_type)
	        };

	      case _inputProcessorActions.SET_STATIC_USAGET:
	        return {
	          v: state.setIn(['processor', 'default_usaget'], action.usaget).setIn(['rate_calculators', action.usaget], _immutable2.default.List())
	        };

	      case _inputProcessorActions.MAP_USAGET:
	        var usaget_mapping = state.getIn(['processor', 'usaget_mapping']);
	        var _action$mapping = action.mapping;
	        var pattern = _action$mapping.pattern;
	        var usaget = _action$mapping.usaget;

	        var new_map = _immutable2.default.fromJS({
	          pattern: pattern,
	          usaget: usaget
	        });
	        return {
	          v: state.updateIn(['processor', 'usaget_mapping'], function (list) {
	            return list.push(new_map);
	          }).setIn(['rate_calculators', usaget], _immutable2.default.List())
	        };

	      case _inputProcessorActions.REMOVE_USAGET_MAPPING:
	        return {
	          v: state.updateIn(['processor', 'usaget_mapping'], function (list) {
	            return list.remove(action.index);
	          })
	        };

	      case _inputProcessorActions.SET_CUSETOMER_MAPPING:
	        console.log(field, mapping, state.setIn(['customer_identification_fields', 0, field], mapping).toJS());
	        return {
	          v: state.setIn(['customer_identification_fields', 0, field], mapping)
	        };

	      case _inputProcessorActions.SET_RATING_FIELD:
	        rate_key = action.rate_key;
	        value = action.value;
	        usaget = action.usaget;

	        var new_rating = _immutable2.default.fromJS({
	          type: value,
	          rate_key: rate_key,
	          line_key: state.getIn(['rate_calculators', usaget, 0, 'line_key'])
	        });
	        return {
	          v: state.setIn(['rate_calculators', usaget, 0], new_rating)
	        };

	      case _inputProcessorActions.SET_LINE_KEY:
	        value = action.value;
	        usaget = action.usaget;

	        return {
	          v: state.setIn(['rate_calculators', usaget, 0, 'line_key'], value)
	        };

	      case _inputProcessorActions.SET_RECEIVER_FIELD:
	        return {
	          v: state.setIn(['receiver', field], mapping)
	        };

	      case _inputProcessorActions.CLEAR_INPUT_PROCESSOR:
	        return {
	          v: defaultState
	        };

	      case _inputProcessorActions.SET_INPUT_PROCESSOR_TEMPLATE:
	        return {
	          v: _immutable2.default.fromJS(action.template)
	        };

	      default:
	        return {
	          v: state
	        };
	    }
	  }();

	  if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	};

	var _immutable = __webpack_require__(265);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _lodash = __webpack_require__(403);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _inputProcessorActions = __webpack_require__(407);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var defaultState = _immutable2.default.fromJS({
	  file_type: '',
	  usaget_type: 'static',
	  delimiter: '',
	  fields: [],
	  field_widths: {},
	  processor: {
	    usaget_mapping: [],
	    static_usaget_mapping: {}
	  },
	  customer_identification_fields: [{
	    target_key: "sid",
	    conditions: [{
	      field: "usaget",
	      regex: "/.*/"
	    }],
	    clear_regex: "//"
	  }],
	  rate_calculators: {},
	  receiver: {
	    passive: false,
	    delete_received: false
	  }
	});

/***/ },

/***/ 407:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SET_INPUT_PROCESSOR_TEMPLATE = exports.SET_STATIC_USAGET = exports.REMOVE_ALL_CSV_FIELDS = exports.SET_LINE_KEY = exports.SET_USAGET_TYPE = exports.REMOVE_USAGET_MAPPING = exports.REMOVE_CSV_FIELD = exports.MAP_USAGET = exports.CLEAR_INPUT_PROCESSOR = exports.SET_FIELD_WIDTH = exports.GOT_INPUT_PROCESSORS = exports.GOT_PROCESSOR_SETTINGS = exports.SET_RECEIVER_FIELD = exports.SET_CUSETOMER_MAPPING = exports.SET_RATING_FIELD = exports.SET_CUSTOMER_MAPPING = exports.ADD_USAGET_MAPPING = exports.ADD_CSV_FIELD = exports.SET_FIELD_MAPPING = exports.SET_FIELDS = exports.SET_DELIMITER = exports.SET_DELIMITER_TYPE = exports.SET_NAME = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.getProcessorSettings = getProcessorSettings;
	exports.setName = setName;
	exports.setDelimiterType = setDelimiterType;
	exports.setDelimiter = setDelimiter;
	exports.setFields = setFields;
	exports.setFieldWidth = setFieldWidth;
	exports.setFieldMapping = setFieldMapping;
	exports.addCSVField = addCSVField;
	exports.removeCSVField = removeCSVField;
	exports.removeAllCSVFields = removeAllCSVFields;
	exports.addUsagetMapping = addUsagetMapping;
	exports.removeUsagetMapping = removeUsagetMapping;
	exports.setStaticUsaget = setStaticUsaget;
	exports.mapUsaget = mapUsaget;
	exports.setCustomerMapping = setCustomerMapping;
	exports.setRatingField = setRatingField;
	exports.setLineKey = setLineKey;
	exports.setReceiverField = setReceiverField;
	exports.saveInputProcessorSettings = saveInputProcessorSettings;
	exports.getInputProcessors = getInputProcessors;
	exports.newInputProcessor = newInputProcessor;
	exports.clearInputProcessor = clearInputProcessor;
	exports.deleteInputProcessor = deleteInputProcessor;
	exports.setUsagetType = setUsagetType;
	exports.setInputProcessorTemplate = setInputProcessorTemplate;

	var _alertsActions = __webpack_require__(266);

	var _Api = __webpack_require__(376);

	var _progressIndicatorActions = __webpack_require__(263);

	var _lodash = __webpack_require__(403);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var SET_NAME = exports.SET_NAME = 'SET_NAME';
	var SET_DELIMITER_TYPE = exports.SET_DELIMITER_TYPE = 'SET_DELIMITER_TYPE';
	var SET_DELIMITER = exports.SET_DELIMITER = 'SET_DELIMITER';
	var SET_FIELDS = exports.SET_FIELDS = 'SET_HEADERS';
	var SET_FIELD_MAPPING = exports.SET_FIELD_MAPPING = 'SET_FIELD_MAPPING';
	var ADD_CSV_FIELD = exports.ADD_CSV_FIELD = 'ADD_CSV_FIELD';
	var ADD_USAGET_MAPPING = exports.ADD_USAGET_MAPPING = 'ADD_USAGET_MAPPING';
	var SET_CUSTOMER_MAPPING = exports.SET_CUSTOMER_MAPPING = 'SET_CUSTOMER_MAPPING';
	var SET_RATING_FIELD = exports.SET_RATING_FIELD = 'SET_RATING_FIELD';
	var SET_CUSETOMER_MAPPING = exports.SET_CUSETOMER_MAPPING = 'SET_CUSETOMER_MAPPING';
	var SET_RECEIVER_FIELD = exports.SET_RECEIVER_FIELD = 'SET_RECEIVER_FIELD';
	var GOT_PROCESSOR_SETTINGS = exports.GOT_PROCESSOR_SETTINGS = 'GOT_PROCESSOR_SETTINGS';
	var GOT_INPUT_PROCESSORS = exports.GOT_INPUT_PROCESSORS = 'GOT_INPUT_PROCESSORS';
	var SET_FIELD_WIDTH = exports.SET_FIELD_WIDTH = 'SET_FIELD_WIDTH';
	var CLEAR_INPUT_PROCESSOR = exports.CLEAR_INPUT_PROCESSOR = 'CLEAR_INPUT_PROCESSOR';
	var MAP_USAGET = exports.MAP_USAGET = 'MAP_USAGET';
	var REMOVE_CSV_FIELD = exports.REMOVE_CSV_FIELD = 'REMOVE_CSV_FIELD';
	var REMOVE_USAGET_MAPPING = exports.REMOVE_USAGET_MAPPING = 'REMOVE_USAGET_MAPPING';
	var SET_USAGET_TYPE = exports.SET_USAGET_TYPE = 'SET_USAGET_TYPE';
	var SET_LINE_KEY = exports.SET_LINE_KEY = 'SET_LINE_KEY';
	var REMOVE_ALL_CSV_FIELDS = exports.REMOVE_ALL_CSV_FIELDS = 'REMOVE_ALL_CSV_FIELDS';
	var SET_STATIC_USAGET = exports.SET_STATIC_USAGET = 'SET_STATIC_USAGET';
	var SET_INPUT_PROCESSOR_TEMPLATE = exports.SET_INPUT_PROCESSOR_TEMPLATE = 'SET_INPUT_PROCESSOR_TEMPLATE';

	var convert = function convert(settings) {
	  var parser = settings.parser;
	  var processor = settings.processor;
	  var customer_identification_fields = settings.customer_identification_fields;
	  var rate_calculators = settings.rate_calculators;
	  var receiver = settings.receiver;


	  var connections = receiver ? receiver.connections ? receiver.connections[0] : {} : {};
	  var field_widths = parser.type === "fixed" ? parser.structure : {};
	  var usaget_type = !_lodash2.default.result(processor, 'usaget_mapping') || processor.usaget_mapping.length < 1 ? "static" : "dynamic";

	  var ret = {
	    file_type: settings.file_type,
	    delimiter_type: parser.type,
	    delimiter: parser.separator,
	    usaget_type: usaget_type,
	    fields: parser.type === "fixed" ? Object.keys(parser.structure) : parser.structure,
	    field_widths: field_widths,
	    customer_identification_fields: customer_identification_fields,
	    rate_calculators: rate_calculators,
	    receiver: connections
	  };
	  if (processor) {
	    var usaget_mapping = void 0;
	    if (usaget_type === "dynamic") {
	      usaget_mapping = processor.usaget_mapping.map(function (usaget) {
	        return {
	          usaget: usaget.usaget,
	          pattern: usaget.pattern.replace("/^", "").replace("$/", "")
	        };
	      });
	    } else {
	      usaget_mapping = [{}];
	    }
	    ret.processor = Object.assign({}, processor, {
	      usaget_mapping: usaget_mapping,
	      src_field: usaget_type === "dynamic" ? processor.usaget_mapping[0].src_field : ""
	    });
	    if (!rate_calculators) {
	      if (usaget_type === "dynamic") {
	        ret.rate_calculators = _lodash2.default.reduce(processor.usaget_mapping, function (acc, mapping) {
	          acc[mapping.usaget] = [];
	          return acc;
	        }, {});
	      } else {
	        ret.rate_calculators = _defineProperty({}, processor.default_usaget, []);
	      }
	    }
	    if (!customer_identification_fields) {
	      ret.customer_identification_fields = [{ target_key: "sid" }];
	    }
	  } else {
	    ret.processor = {
	      usaget_mapping: []
	    };
	  }
	  return ret;
	};

	function gotProcessorSettings(settings) {
	  return {
	    type: GOT_PROCESSOR_SETTINGS,
	    settings: settings
	  };
	}

	function fetchProcessorSettings(file_type) {
	  var query = {
	    api: "settings",
	    params: [{ category: "file_types" }, { data: JSON.stringify({ file_type: file_type }) }]
	  };
	  return function (dispatch) {
	    dispatch((0, _progressIndicatorActions.startProgressIndicator)());
	    (0, _Api.apiBillRun)(query).then(function (resp) {
	      dispatch((0, _progressIndicatorActions.finishProgressIndicator)());
	      dispatch(gotProcessorSettings(convert(resp.data.details)));
	    }).catch(function (error) {
	      console.log(error);
	      dispatch((0, _progressIndicatorActions.finishProgressIndicator)());
	      dispatch((0, _alertsActions.showDanger)("Error loading input processor"));
	    });
	  };
	}

	function getProcessorSettings(file_type) {
	  return function (dispatch) {
	    return dispatch(fetchProcessorSettings(file_type));
	  };
	}

	function setName(file_type) {
	  return {
	    type: SET_NAME,
	    file_type: file_type
	  };
	}

	function setDelimiterType(delimiter_type) {
	  return {
	    type: SET_DELIMITER_TYPE,
	    delimiter_type: delimiter_type
	  };
	}

	function setDelimiter(delimiter) {
	  return {
	    type: SET_DELIMITER,
	    delimiter: delimiter
	  };
	}

	function setFields(fields) {
	  return {
	    type: SET_FIELDS,
	    fields: fields
	  };
	}

	function setFieldWidth(field, width) {
	  return {
	    type: SET_FIELD_WIDTH,
	    field: field,
	    width: width
	  };
	}

	function setFieldMapping(field, mapping) {
	  return {
	    type: SET_FIELD_MAPPING,
	    field: field,
	    mapping: mapping
	  };
	}

	function addCSVField(field) {
	  return {
	    type: ADD_CSV_FIELD,
	    field: field
	  };
	}

	function removeCSVField(index) {
	  return {
	    type: REMOVE_CSV_FIELD,
	    index: index
	  };
	}

	function removeAllCSVFields() {
	  return {
	    type: REMOVE_ALL_CSV_FIELDS
	  };
	}

	function addedUsagetMapping(usaget) {
	  return {
	    type: ADD_USAGET_MAPPING,
	    usaget: usaget
	  };
	}

	function addUsagetMapping(usaget) {
	  var query = {
	    api: "settings",
	    params: [{ category: "usage_types" }, { action: "set" }, { data: [JSON.stringify(usaget)] }]
	  };

	  return function (dispatch) {
	    dispatch((0, _progressIndicatorActions.startProgressIndicator)());
	    (0, _Api.apiBillRun)(query).then(function (resp) {
	      dispatch((0, _progressIndicatorActions.finishProgressIndicator)());
	      if (!resp.data[0].data.status) {
	        dispatch((0, _alertsActions.showDanger)(resp.data.desc));
	      } else {
	        dispatch(addedUsagetMapping(usaget));
	      }
	    }).catch(function (error) {
	      dispatch((0, _progressIndicatorActions.finishProgressIndicator)());
	      dispatch((0, _alertsActions.showDanger)(error.data.message));
	    });
	  };
	}

	function removeUsagetMapping(index) {
	  return {
	    type: REMOVE_USAGET_MAPPING,
	    index: index
	  };
	}

	function setStaticUsaget(usaget) {
	  return {
	    type: SET_STATIC_USAGET,
	    usaget: usaget
	  };
	}

	function mapUsaget(mapping) {
	  return {
	    type: MAP_USAGET,
	    mapping: mapping
	  };
	}

	function setCustomerMapping(field, mapping) {
	  return {
	    type: SET_CUSETOMER_MAPPING,
	    field: field,
	    mapping: mapping
	  };
	}

	function setRatingField(usaget, rate_key, value) {
	  return {
	    type: SET_RATING_FIELD,
	    usaget: usaget,
	    rate_key: rate_key,
	    value: value
	  };
	}

	function setLineKey(usaget, value) {
	  return {
	    type: SET_LINE_KEY,
	    usaget: usaget,
	    value: value
	  };
	}

	function setReceiverField(field, mapping) {
	  return {
	    type: SET_RECEIVER_FIELD,
	    field: field,
	    mapping: mapping
	  };
	}

	function saveInputProcessorSettings(state, callback) {
	  var part = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  var processor = state.get('processor'),
	      customer_identification_fields = state.get('customer_identification_fields'),
	      rate_calculators = state.get('rate_calculators'),
	      receiver = state.get('receiver');

	  var settings = {
	    "file_type": state.get('file_type'),
	    "parser": {
	      "type": state.get('delimiter_type'),
	      "separator": state.get('delimiter'),
	      "structure": state.get('delimiter_type') === "fixed" ? state.get('field_widths') : state.get('fields')
	    }
	  };
	  if (processor) {
	    var processor_settings = state.get('usaget_type') === "static" ? { default_usaget: processor.get('default_usaget') } : { usaget_mapping: processor.get('usaget_mapping').map(function (usaget) {
	        return {
	          "src_field": processor.get('src_field'),
	          "pattern": '/^' + usaget.get('pattern') + '$/',
	          "usaget": usaget.get('usaget')
	        };
	      }).toJS() };
	    settings.processor = _extends({
	      "type": "Usage",
	      "date_field": processor.get('date_field'),
	      "volume_field": processor.get('volume_field')
	    }, processor_settings);
	  }
	  if (customer_identification_fields) {
	    settings.customer_identification_fields = customer_identification_fields.toJS();
	  }
	  if (rate_calculators) {
	    settings.rate_calculators = rate_calculators.toJS();
	  }
	  if (receiver) {
	    settings.receiver = {
	      "type": "ftp",
	      "connections": [receiver.toJS()]
	    };
	  }

	  var settingsToSave = void 0;
	  if (part === "customer_identification_fields") {
	    var _settingsToSave;

	    settingsToSave = (_settingsToSave = { file_type: state.get('file_type') }, _defineProperty(_settingsToSave, part, _extends({}, settings[part])), _defineProperty(_settingsToSave, 'rate_calculators', settings.rate_calculators), _settingsToSave);
	  } else {
	    settingsToSave = part ? _defineProperty({ file_type: state.get('file_type') }, part, _extends({}, settings[part])) : settings;
	  }
	  var query = {
	    api: "settings",
	    params: [{ category: "file_types" }, { action: "set" }, { data: JSON.stringify(settingsToSave) }]
	  };
	  return function (dispatch) {
	    dispatch((0, _progressIndicatorActions.startProgressIndicator)());
	    (0, _Api.apiBillRun)(query).then(function (success) {
	      dispatch((0, _progressIndicatorActions.finishProgressIndicator)());
	      callback(false);
	    }, function (failure) {
	      dispatch((0, _progressIndicatorActions.finishProgressIndicator)());
	      var msg = _lodash2.default.result(failure, 'error[0].error.data.message') ? failure.error[0].error.data.message : failure.error[0].error.desc;
	      dispatch((0, _alertsActions.showDanger)('Error - ' + msg));
	      callback(true);
	    }).catch(function (error) {
	      dispatch((0, _progressIndicatorActions.finishProgressIndicator)());
	      dispatch((0, _alertsActions.showDanger)("Error saving input processor"));
	      dispatch((0, _Api.apiBillRunErrorHandler)(error));
	    });
	  };
	}

	function gotInputProcessors(input_processors) {
	  return {
	    type: GOT_INPUT_PROCESSORS,
	    input_processors: input_processors
	  };
	}

	function getInputProcessors() {
	  return function (dispatch) {
	    return dispatch(fetchInputProcessors());
	  };
	}

	function newInputProcessor() {
	  return {
	    type: 'NEW_PROCESSOR'
	  };
	}

	function clearInputProcessor() {
	  return {
	    type: CLEAR_INPUT_PROCESSOR
	  };
	}

	function deleteInputProcessor(file_type, callback) {
	  var query = {
	    api: "settings",
	    params: [{ category: "file_types" }, { action: "unset" }, { data: JSON.stringify({ "file_type": file_type }) }]
	  };

	  return function (dispatch) {
	    (0, _Api.apiBillRun)(query).then(function (success) {
	      callback(false);
	    }, function (failure) {
	      callback(true);
	    }).catch(function (error) {
	      console.log(error);
	    });
	  };
	}

	function setUsagetType(usaget_type) {
	  return {
	    type: SET_USAGET_TYPE,
	    usaget_type: usaget_type
	  };
	}

	function setInputProcessorTemplate(template) {
	  var converted = convert(template);
	  return {
	    type: SET_INPUT_PROCESSOR_TEMPLATE,
	    template: converted
	  };
	}

/***/ },

/***/ 766:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(199);

	var _Authentication = __webpack_require__(767);

	var _Authentication2 = _interopRequireDefault(_Authentication);

	var _App = __webpack_require__(932);

	var _App2 = _interopRequireDefault(_App);

	var _Dashboard = __webpack_require__(1033);

	var _Dashboard2 = _interopRequireDefault(_Dashboard);

	var _LoginPage = __webpack_require__(1121);

	var _LoginPage2 = _interopRequireDefault(_LoginPage);

	var _PageNotFound = __webpack_require__(1123);

	var _PageNotFound2 = _interopRequireDefault(_PageNotFound);

	var _CustomersList = __webpack_require__(1125);

	var _CustomersList2 = _interopRequireDefault(_CustomersList);

	var _CustomerSetup = __webpack_require__(1139);

	var _CustomerSetup2 = _interopRequireDefault(_CustomerSetup);

	var _ProductsList = __webpack_require__(1149);

	var _ProductsList2 = _interopRequireDefault(_ProductsList);

	var _Product = __webpack_require__(1151);

	var _Product2 = _interopRequireDefault(_Product);

	var _PlansList = __webpack_require__(1273);

	var _PlansList2 = _interopRequireDefault(_PlansList);

	var _Plan = __webpack_require__(1275);

	var _Plan2 = _interopRequireDefault(_Plan);

	var _InputProcessorsList = __webpack_require__(1305);

	var _InputProcessorsList2 = _interopRequireDefault(_InputProcessorsList);

	var _InputProcessor = __webpack_require__(1307);

	var _InputProcessor2 = _interopRequireDefault(_InputProcessor);

	var _UsageList = __webpack_require__(1315);

	var _UsageList2 = _interopRequireDefault(_UsageList);

	var _InvoicesList = __webpack_require__(1318);

	var _InvoicesList2 = _interopRequireDefault(_InvoicesList);

	var _Settings = __webpack_require__(1320);

	var _Settings2 = _interopRequireDefault(_Settings);

	var _PaymentGateways = __webpack_require__(1327);

	var _PaymentGateways2 = _interopRequireDefault(_PaymentGateways);

	var _User = __webpack_require__(1332);

	var _User2 = _interopRequireDefault(_User);

	var _UserSetup = __webpack_require__(1334);

	var _UserSetup2 = _interopRequireDefault(_UserSetup);

	var _SelectTemplate = __webpack_require__(1347);

	var _SelectTemplate2 = _interopRequireDefault(_SelectTemplate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  return _react2.default.createElement(
	    _reactRouter.Route,
	    { path: '/', component: _App2.default },
	    _react2.default.createElement(_reactRouter.IndexRedirect, { to: '/dashboard', component: (0, _Authentication2.default)(_Dashboard2.default) }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/dashboard', component: (0, _Authentication2.default)(_Dashboard2.default), title: 'Dashboard' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/plans', component: (0, _Authentication2.default)(_PlansList2.default), title: 'Plans' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/plan', component: (0, _Authentication2.default)(_Plan2.default), title: 'Create / Edit Plan' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/customers', component: (0, _Authentication2.default)(_CustomersList2.default), title: 'Customers' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/products', component: (0, _Authentication2.default)(_ProductsList2.default), title: 'Products' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/product', component: (0, _Authentication2.default)(_Product2.default), title: 'Create / Edit Product' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/customer', component: (0, _Authentication2.default)(_CustomerSetup2.default), title: 'Customer' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/input_processor', component: (0, _Authentication2.default)(_InputProcessor2.default), title: 'Input Processor' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/input_processors', component: (0, _Authentication2.default)(_InputProcessorsList2.default), title: 'Input Processors' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/usage', component: (0, _Authentication2.default)(_UsageList2.default), title: 'Usage' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/invoices', component: (0, _Authentication2.default)(_InvoicesList2.default), title: 'Invoices' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/settings', component: (0, _Authentication2.default)(_Settings2.default), title: 'Settings' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/payment_gateways', component: (0, _Authentication2.default)(_PaymentGateways2.default), title: 'Payment Gateways' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/users', component: (0, _Authentication2.default)(_User2.default), title: 'Users' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/user', component: (0, _Authentication2.default)(_UserSetup2.default), title: 'Users' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/select_input_processor_template', component: (0, _Authentication2.default)(_SelectTemplate2.default), title: 'Input Processor' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '/login', component: _LoginPage2.default, title: 'Login' }),
	    _react2.default.createElement(_reactRouter.Route, { path: '*', component: _PageNotFound2.default })
	  );
	};

/***/ },

/***/ 1025:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(176);

	var _redux = __webpack_require__(183);

	var _reactRouter = __webpack_require__(199);

	var _userActions = __webpack_require__(414);

	var _classnames = __webpack_require__(773);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _reactBootstrap = __webpack_require__(770);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Navigator = function (_Component) {
	  _inherits(Navigator, _Component);

	  function Navigator(props) {
	    _classCallCheck(this, Navigator);

	    var _this = _possibleConstructorReturn(this, (Navigator.__proto__ || Object.getPrototypeOf(Navigator)).call(this, props));

	    _this.clickLogout = function (e) {
	      e.preventDefault();
	      _this.props.userDoLogout();
	    };

	    _this.onToggleMenu = _this.onToggleMenu.bind(_this);
	    _this.onWindowResize = _this.onWindowResize.bind(_this);

	    _this.state = {
	      uiOpenSetting: true,
	      showCollapseButton: false,
	      showFullMenu: true
	    };
	    return _this;
	  }

	  _createClass(Navigator, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      this.onWindowResize();
	      window.addEventListener('resize', this.onWindowResize);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      window.removeEventListener('resize', this.onWindowResize);
	    }
	  }, {
	    key: 'onWindowResize',
	    value: function onWindowResize() {
	      var small = window.innerWidth < 768;
	      this.setState({ showCollapseButton: small, showFullMenu: !small });
	    }
	  }, {
	    key: 'onToggleMenu',
	    value: function onToggleMenu() {
	      var showFullMenu = this.state.showFullMenu;

	      this.setState({ showFullMenu: !showFullMenu });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      return _react2.default.createElement(
	        'nav',
	        { className: 'navbar navbar-default navbar-static-top', role: 'navigation', style: { marginBottom: 0 } },
	        _react2.default.createElement(
	          'div',
	          { className: 'navbar-header' },
	          _react2.default.createElement(
	            _reactRouter.Link,
	            { to: '/', className: 'navbar-brand' },
	            _react2.default.createElement('img', { src: '/img/billrun-logo-tm.png', style: { height: 22 } })
	          )
	        ),
	        _react2.default.createElement(
	          'ul',
	          { className: 'nav navbar-top-links navbar-right' },
	          _react2.default.createElement(
	            _reactBootstrap.NavDropdown,
	            { id: 'nav-user-menu', title: _react2.default.createElement('i', { className: 'fa fa-user fa-fw' }) },
	            _react2.default.createElement(
	              _reactBootstrap.MenuItem,
	              { eventKey: '4', onClick: this.clickLogout },
	              _react2.default.createElement('i', { className: 'fa fa-sign-out fa-fw' }),
	              ' Logout'
	            )
	          )
	        ),
	        function () {
	          if (!_this2.state.showFullMenu) return null;
	          return _react2.default.createElement(
	            'div',
	            { className: 'navbar-default sidebar', role: 'navigation' },
	            _react2.default.createElement(
	              'div',
	              { className: 'sidebar-nav navbar-collapse' },
	              _react2.default.createElement(
	                'ul',
	                { className: 'nav in', id: 'side-menu' },
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    _reactRouter.Link,
	                    { to: '/dashboard' },
	                    _react2.default.createElement('i', { className: 'fa fa-dashboard fa-fw' }),
	                    ' Dashboard'
	                  )
	                ),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    _reactRouter.Link,
	                    { to: '/plans' },
	                    _react2.default.createElement('i', { className: 'fa fa-cubes fa-fw' }),
	                    ' Plans'
	                  )
	                ),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    _reactRouter.Link,
	                    { to: '/products' },
	                    _react2.default.createElement('i', { className: 'fa fa-book fa-fw' }),
	                    ' Products'
	                  )
	                ),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    _reactRouter.Link,
	                    { to: '/customers' },
	                    _react2.default.createElement('i', { className: 'fa fa-users fa-fw' }),
	                    ' Customers'
	                  )
	                ),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    _reactRouter.Link,
	                    { to: '/usage' },
	                    _react2.default.createElement('i', { className: 'fa fa-list fa-fw' }),
	                    ' Usage'
	                  )
	                ),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    _reactRouter.Link,
	                    { to: '/invoices' },
	                    _react2.default.createElement('i', { className: 'fa fa-file-text-o fa-fw' }),
	                    ' Invoices'
	                  )
	                ),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    _reactRouter.Link,
	                    { to: '/users' },
	                    _react2.default.createElement('i', { className: 'fa fa-user fa-fw' }),
	                    ' User Managment'
	                  )
	                ),
	                _react2.default.createElement(
	                  'li',
	                  { className: (0, _classnames2.default)({ 'active': !_this2.state.uiOpenSetting }) },
	                  _react2.default.createElement(
	                    'a',
	                    { href: true, onClick: function onClick(e) {
	                        e.preventDefault();_this2.setState({ uiOpenSetting: !_this2.state.uiOpenSetting });
	                      } },
	                    _react2.default.createElement('i', { className: 'fa fa-cog fa-fw' }),
	                    ' Settings',
	                    _react2.default.createElement('span', { className: 'fa arrow' })
	                  ),
	                  _react2.default.createElement(
	                    'ul',
	                    { className: (0, _classnames2.default)({ 'nav nav-second-level': true, 'collapse': _this2.state.uiOpenSetting }) },
	                    _react2.default.createElement(
	                      'li',
	                      null,
	                      _react2.default.createElement(
	                        _reactRouter.Link,
	                        { to: '/settings?setting=billrun' },
	                        'Date, Time and Zone'
	                      )
	                    ),
	                    _react2.default.createElement(
	                      'li',
	                      null,
	                      _react2.default.createElement(
	                        _reactRouter.Link,
	                        { to: '/settings?setting=pricing' },
	                        'Currency and Tax'
	                      )
	                    ),
	                    _react2.default.createElement(
	                      'li',
	                      null,
	                      _react2.default.createElement(
	                        _reactRouter.Link,
	                        { to: '/input_processors' },
	                        'Input Processors'
	                      )
	                    ),
	                    _react2.default.createElement(
	                      'li',
	                      null,
	                      _react2.default.createElement(
	                        _reactRouter.Link,
	                        { to: '/payment_gateways' },
	                        'Payment Gateways'
	                      )
	                    )
	                  )
	                )
	              )
	            )
	          );
	        }()
	      );
	    }
	  }]);

	  return Navigator;
	}(_react.Component);

	function mapDispatchToProps(dispatch) {
	  return (0, _redux.bindActionCreators)({
	    userDoLogout: _userActions.userDoLogout }, dispatch);
	}
	exports.default = (0, _reactRedux.connect)(null, mapDispatchToProps)(Navigator);

/***/ },

/***/ 1137:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _immutable = __webpack_require__(265);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _moment = __webpack_require__(267);

	var _moment2 = _interopRequireDefault(_moment);

	var _Util = __webpack_require__(1138);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/* ACTIONS */


	var List = function (_Component) {
	  _inherits(List, _Component);

	  function List(props) {
	    _classCallCheck(this, List);

	    var _this = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

	    _this.onClickHeader = _this.onClickHeader.bind(_this);

	    _this.state = {
	      sort: {}
	    };
	    return _this;
	  }

	  _createClass(List, [{
	    key: 'displayByType',
	    value: function displayByType(field, entity) {
	      switch (field.type) {
	        case 'date':
	          return (0, _moment2.default)(entity.get(field.id)).format('L');
	        case 'time':
	          return (0, _moment2.default)(entity.get(field.id)).format('LT');
	        case 'datetime':
	          return (0, _moment2.default)(entity.get(field.id)).format('L LT');
	        case 'text':
	        default:
	          return entity.get(field.id);
	      }
	    }
	  }, {
	    key: 'printEntityField',
	    value: function printEntityField() {
	      var entity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable2.default.Map();
	      var field = arguments[1];

	      if (!_immutable2.default.Iterable.isIterable(entity)) return this.printEntityField(_immutable2.default.fromJS(entity), field);
	      if (field.parser) return field.parser(entity);
	      if (field.type) return this.displayByType(field, entity);
	      return entity.get(field.id);
	    }
	  }, {
	    key: 'buildRow',
	    value: function buildRow(entity, fields) {
	      var _this2 = this;

	      return fields.map(function (field, key) {
	        return _react2.default.createElement(
	          'td',
	          { key: key },
	          _this2.printEntityField(entity, field)
	        );
	      });
	    }
	  }, {
	    key: 'onClickHeader',
	    value: function onClickHeader(field) {
	      var _this3 = this;

	      var _props$onSort = this.props.onSort;
	      var onSort = _props$onSort === undefined ? function () {} : _props$onSort;
	      var sort = this.state.sort;

	      var sort_dir = sort[field] === -1 ? 1 : -1;
	      this.setState({ sort: _defineProperty({}, field, sort_dir) }, function () {
	        onSort(JSON.stringify(_this3.state.sort));
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this4 = this;

	      var _props = this.props;
	      var items = _props.items;
	      var _props$fields = _props.fields;
	      var fields = _props$fields === undefined ? [] : _props$fields;
	      var _props$onClickEdit = _props.onClickEdit;
	      var onClickEdit = _props$onClickEdit === undefined ? function () {} : _props$onClickEdit;
	      var _props$edit = _props.edit;
	      var edit = _props$edit === undefined ? false : _props$edit;
	      var _props$editText = _props.editText;
	      var editText = _props$editText === undefined ? "edit" : _props$editText;


	      var table_header = fields.map(function (field, key) {
	        var onclick = field.sort ? _this4.onClickHeader.bind(_this4, field.id) : function () {};
	        var style = field.sort ? { cursor: "pointer" } : {};
	        var arrow = null;
	        if (field.sort) {
	          arrow = _this4.state.sort[field.id] ? _react2.default.createElement('i', { className: 'sort-indicator fa fa-sort-' + (_this4.state.sort[field.id] === 1 ? 'down' : 'up') }) : _react2.default.createElement('i', { className: 'sort-indicator fa fa-sort' });
	        }
	        if (!field.title && !field.placeholder) return _react2.default.createElement(
	          'th',
	          { key: key, onClick: onclick, style: style },
	          (0, _Util.titlize)(field.id),
	          arrow
	        );
	        return _react2.default.createElement(
	          'th',
	          { key: key, onClick: onclick, style: style },
	          field.title || field.placeholder,
	          arrow
	        );
	      });
	      if (edit) table_header.push(_react2.default.createElement(
	        'th',
	        { key: fields.length },
	        '\xA0'
	      ));

	      var table_body = items.size < 1 ? _react2.default.createElement(
	        'tr',
	        null,
	        _react2.default.createElement(
	          'td',
	          { colSpan: fields.length, style: { textAlign: "center" } },
	          'No items found'
	        )
	      ) : items.map(function (entity, index) {
	        return _react2.default.createElement(
	          'tr',
	          { key: index },
	          _this4.buildRow(entity, fields),
	          edit ? _react2.default.createElement(
	            'td',
	            null,
	            _react2.default.createElement(
	              'button',
	              { className: 'btn btn-link', onClick: onClickEdit.bind(_this4, entity) },
	              editText
	            )
	          ) : null
	        );
	      });

	      return _react2.default.createElement(
	        'div',
	        { className: 'List row' },
	        _react2.default.createElement(
	          'div',
	          { className: 'table-responsive col-lg-12' },
	          _react2.default.createElement(
	            'table',
	            { className: 'table table-hover table-striped' },
	            _react2.default.createElement(
	              'thead',
	              null,
	              _react2.default.createElement(
	                'tr',
	                null,
	                table_header
	              )
	            ),
	            _react2.default.createElement(
	              'tbody',
	              null,
	              table_body
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return List;
	}(_react.Component);

	exports.default = List;

/***/ },

/***/ 1306:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(176);

	var _List = __webpack_require__(1136);

	var _List2 = _interopRequireDefault(_List);

	var _reactBootstrap = __webpack_require__(770);

	var _listActions = __webpack_require__(375);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var InputProcessorsList = function (_Component) {
	  _inherits(InputProcessorsList, _Component);

	  function InputProcessorsList(props) {
	    _classCallCheck(this, InputProcessorsList);

	    var _this = _possibleConstructorReturn(this, (InputProcessorsList.__proto__ || Object.getPrototypeOf(InputProcessorsList)).call(this, props));

	    _this.onClickInputProcessor = _this.onClickInputProcessor.bind(_this);
	    _this.onClickNew = _this.onClickNew.bind(_this);
	    _this.onSort = _this.onSort.bind(_this);
	    _this.buildQuery = _this.buildQuery.bind(_this);

	    _this.state = {
	      sort: ''
	    };
	    return _this;
	  }

	  _createClass(InputProcessorsList, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.props.dispatch((0, _listActions.getList)("input_processors", this.buildQuery()));
	    }
	  }, {
	    key: 'buildQuery',
	    value: function buildQuery() {
	      return {
	        api: "settings",
	        params: [{ category: "file_types" }, { sort: this.state.sort }, { data: JSON.stringify({}) }]
	      };
	    }
	  }, {
	    key: 'onClickInputProcessor',
	    value: function onClickInputProcessor(input_processor, e) {
	      this.context.router.push({
	        pathname: 'input_processor',
	        query: {
	          file_type: input_processor.get('file_type'),
	          action: 'update'
	        }
	      });
	    }
	  }, {
	    key: 'onClickNew',
	    value: function onClickNew() {
	      this.context.router.push({
	        pathname: 'select_input_processor_template',
	        query: {
	          action: 'new'
	        }
	      });
	    }
	  }, {
	    key: 'onSort',
	    value: function onSort(sort) {
	      var _this2 = this;

	      this.setState({ sort: sort }, function () {
	        _this2.props.dispatch((0, _listActions.getList)('input_processors', _this2.buildQuery()));
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var inputProcessors = this.props.inputProcessors;

	      var fields = [{ id: "file_type", title: "Name" }];

	      return _react2.default.createElement(
	        'div',
	        { className: 'InputProcessorsList' },
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
	                _react2.default.createElement(
	                  'span',
	                  null,
	                  'All available input processors'
	                ),
	                _react2.default.createElement(
	                  'div',
	                  { className: 'pull-right' },
	                  _react2.default.createElement(
	                    _reactBootstrap.DropdownButton,
	                    { title: 'Actions', id: 'ActionsDropDown', bsSize: 'xs', pullRight: true },
	                    _react2.default.createElement(
	                      _reactBootstrap.MenuItem,
	                      { eventKey: '1', onClick: this.onClickNew },
	                      'New'
	                    )
	                  )
	                )
	              ),
	              _react2.default.createElement(
	                'div',
	                { className: 'panel-body' },
	                _react2.default.createElement(_List2.default, { items: inputProcessors, fields: fields, edit: true, onClickEdit: this.onClickInputProcessor, onSort: this.onSort })
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return InputProcessorsList;
	}(_react.Component);

	InputProcessorsList.contextTypes = {
	  router: _react2.default.PropTypes.object.isRequired
	};

	function mapStateToProps(state, props) {
	  return {
	    inputProcessors: state.list.get('input_processors') || []
	  };
	}

	exports.default = (0, _reactRedux.connect)(mapStateToProps)(InputProcessorsList);

/***/ },

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


	      var steps = [_react2.default.createElement(_SampleCSV2.default, { onChangeName: this.onChangeName, onSetDelimiterType: this.onSetDelimiterType, onChangeDelimiter: this.onChangeDelimiter, onSelectSampleCSV: this.onSelectSampleCSV, onAddField: this.onAddField, onSetFieldWidth: this.onSetFieldWidth, onRemoveField: this.onRemoveField, onRemoveAllFields: this.onRemoveAllFields, settings: settings }), _react2.default.createElement(_FieldsMapping2.default, { onSetFieldMapping: this.onSetFieldMapping, onAddUsagetMapping: this.onAddUsagetMapping, addUsagetMapping: this.addUsagetMapping, onRemoveUsagetMapping: this.onRemoveUsagetMapping, onError: this.onError, onSetStaticUsaget: this.onSetStaticUsaget, setUsagetType: this.setUsagetType, settings: settings, usageTypes: usage_types }), _react2.default.createElement(_CalculatorMapping2.default, { onSetCalculatorMapping: this.onSetCalculatorMapping, onSetRating: this.onSetRating, onSetCustomerMapping: this.onSetCustomerMapping, onSetLineKey: this.onSetLineKey, settings: settings }), _react2.default.createElement(_Receiver2.default, { onSetReceiverField: this.onSetReceiverField, onSetReceiverCheckboxField: this.onSetReceiverCheckboxField, settings: settings.get('receiver') })];

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

/***/ },

/***/ 1309:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _SelectDelimiter = __webpack_require__(1343);

	var _SelectDelimiter2 = _interopRequireDefault(_SelectDelimiter);

	var _SelectCSV = __webpack_require__(1344);

	var _SelectCSV2 = _interopRequireDefault(_SelectCSV);

	var _CSVFields = __webpack_require__(1345);

	var _CSVFields2 = _interopRequireDefault(_CSVFields);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/* COMPONENTS */


	var SampleCSV = function (_Component) {
	  _inherits(SampleCSV, _Component);

	  function SampleCSV(props) {
	    _classCallCheck(this, SampleCSV);

	    var _this = _possibleConstructorReturn(this, (SampleCSV.__proto__ || Object.getPrototypeOf(SampleCSV)).call(this, props));

	    _this.addField = _this.addField.bind(_this);
	    _this.removeAllFields = _this.removeAllFields.bind(_this);

	    _this.state = {
	      newField: ''
	    };
	    return _this;
	  }

	  _createClass(SampleCSV, [{
	    key: 'addField',
	    value: function addField(val, e) {
	      this.props.onAddField.call(this, this.state.newField);
	      this.setState({ newField: '' });
	    }
	  }, {
	    key: 'removeAllFields',
	    value: function removeAllFields() {
	      var r = confirm("Are you sure you want to remove all fields?");
	      if (r) {
	        this.props.onRemoveAllFields.call(this);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var _props = this.props;
	      var settings = _props.settings;
	      var onChangeName = _props.onChangeName;
	      var onSetDelimiterType = _props.onSetDelimiterType;
	      var onChangeDelimiter = _props.onChangeDelimiter;
	      var onSelectSampleCSV = _props.onSelectSampleCSV;
	      var onSetFieldWidth = _props.onSetFieldWidth;
	      var onRemoveField = _props.onRemoveField;
	      var onAddField = _props.onAddField;


	      var selectDelimiterHTML = _react2.default.createElement(_SelectDelimiter2.default, { settings: settings,
	        onSetDelimiterType: onSetDelimiterType,
	        onChangeDelimiter: onChangeDelimiter });

	      var fieldsHTML = _react2.default.createElement(_CSVFields2.default, { onRemoveField: onRemoveField, settings: settings, onSetFieldWidth: onSetFieldWidth });

	      var setFieldsHTML = _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-3' },
	            _react2.default.createElement(
	              'label',
	              null,
	              'Field ',
	              _react2.default.createElement(
	                'small',
	                null,
	                _react2.default.createElement(
	                  'a',
	                  { onClick: this.removeAllFields },
	                  '(remove all)'
	                )
	              )
	            )
	          ),
	          function () {
	            if (settings.get('delimiter_type') === "fixed") {
	              return _react2.default.createElement(
	                'div',
	                { className: 'col-lg-3' },
	                _react2.default.createElement(
	                  'label',
	                  null,
	                  'Width'
	                )
	              );
	            }
	          }()
	        ),
	        fieldsHTML,
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-3' },
	            _react2.default.createElement('input', { className: 'form-control', value: this.state.newField, onChange: function onChange(e) {
	                _this2.setState({ newField: e.target.value });
	              }, placeholder: 'Field Name' })
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-2' },
	            _react2.default.createElement(
	              'button',
	              { type: 'button',
	                className: 'btn btn-info btn-circle',
	                disabled: !settings.get('file_type') || !this.state.newField,
	                onClick: this.addField },
	              _react2.default.createElement('i', { className: 'fa fa-plus' })
	            )
	          )
	        )
	      );

	      var selectCSVHTML = _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_SelectCSV2.default, { onSelectSampleCSV: onSelectSampleCSV,
	          settings: settings }),
	        setFieldsHTML
	      );

	      return _react2.default.createElement(
	        'form',
	        { className: 'InputProcessor form-horizontal' },
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-3' },
	            _react2.default.createElement(
	              'label',
	              { htmlFor: 'file_type' },
	              'Name'
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
	              { className: 'col-lg-7' },
	              _react2.default.createElement('input', { id: 'file_type', className: 'form-control', onChange: onChangeName, value: settings.get('file_type') })
	            )
	          )
	        ),
	        selectDelimiterHTML,
	        selectCSVHTML
	      );
	    }
	  }]);

	  return SampleCSV;
	}(_react.Component);

	exports.default = SampleCSV;

/***/ },

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

/***/ },

/***/ 1312:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Receiver = function (_Component) {
	  _inherits(Receiver, _Component);

	  function Receiver(props) {
	    _classCallCheck(this, Receiver);

	    return _possibleConstructorReturn(this, (Receiver.__proto__ || Object.getPrototypeOf(Receiver)).call(this, props));
	  }

	  _createClass(Receiver, [{
	    key: "render",
	    value: function render() {
	      var _props = this.props;
	      var settings = _props.settings;
	      var onSetReceiverField = _props.onSetReceiverField;
	      var onSetReceiverCheckboxField = _props.onSetReceiverCheckboxField;


	      var period_options = [{ min: 1, label: "1 Minute" }, { min: 15, label: "15 Minutes" }, { min: 30, label: "30 Minutes" }, { min: 60, label: "1 Hour" }, { min: 360, label: "6 Hours" }, { min: 720, label: "12 Hours" }, { min: 1440, label: "24 Hours" }].map(function (opt, key) {
	        return _react2.default.createElement(
	          "option",
	          { value: opt.min, key: key },
	          opt.label
	        );
	      });

	      return _react2.default.createElement(
	        "div",
	        { className: "ReceiverSettings" },
	        _react2.default.createElement(
	          "h4",
	          null,
	          "FTP"
	        ),
	        _react2.default.createElement(
	          "form",
	          { className: "form-horizontal" },
	          _react2.default.createElement(
	            "div",
	            { className: "form-group" },
	            _react2.default.createElement(
	              "label",
	              { htmlFor: "name", className: "col-xs-2 control-label" },
	              "Name"
	            ),
	            _react2.default.createElement(
	              "div",
	              { className: "col-xs-4" },
	              _react2.default.createElement("input", { className: "form-control", id: "name", onChange: onSetReceiverField, value: settings.get('name') })
	            )
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "form-group" },
	            _react2.default.createElement(
	              "label",
	              { htmlFor: "host", className: "col-xs-2 control-label" },
	              "Host"
	            ),
	            _react2.default.createElement(
	              "div",
	              { className: "col-xs-4" },
	              _react2.default.createElement("input", { className: "form-control", id: "host", onChange: onSetReceiverField, value: settings.get('host') })
	            )
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "form-group" },
	            _react2.default.createElement(
	              "label",
	              { htmlFor: "user", className: "col-xs-2 control-label" },
	              "User"
	            ),
	            _react2.default.createElement(
	              "div",
	              { className: "col-xs-4" },
	              _react2.default.createElement("input", { className: "form-control", id: "user", onChange: onSetReceiverField, value: settings.get('user') })
	            )
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "form-group" },
	            _react2.default.createElement(
	              "label",
	              { htmlFor: "password", className: "col-xs-2 control-label" },
	              "Password"
	            ),
	            _react2.default.createElement(
	              "div",
	              { className: "col-xs-4" },
	              _react2.default.createElement("input", { className: "form-control", id: "password", onChange: onSetReceiverField, value: settings.get('password') })
	            )
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "form-group" },
	            _react2.default.createElement(
	              "label",
	              { htmlFor: "remote_directory", className: "col-xs-2 control-label" },
	              "Directory"
	            ),
	            _react2.default.createElement(
	              "div",
	              { className: "col-xs-4" },
	              _react2.default.createElement("input", { className: "form-control", id: "remote_directory", onChange: onSetReceiverField, value: settings.get('remote_directory') })
	            )
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "form-group" },
	            _react2.default.createElement(
	              "label",
	              { htmlFor: "filename_regex", className: "col-xs-2 control-label" },
	              "Regex"
	            ),
	            _react2.default.createElement(
	              "div",
	              { className: "col-xs-4" },
	              _react2.default.createElement("input", { className: "form-control", id: "filename_regex", onChange: onSetReceiverField, value: settings.get('filename_regex') })
	            )
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "form-group" },
	            _react2.default.createElement(
	              "label",
	              { htmlFor: "period", className: "col-xs-2 control-label" },
	              "Period"
	            ),
	            _react2.default.createElement(
	              "div",
	              { className: "col-xs-4" },
	              _react2.default.createElement(
	                "select",
	                { className: "form-control", id: "period", onChange: onSetReceiverField, value: settings.get('period') },
	                period_options
	              )
	            )
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "form-group" },
	            _react2.default.createElement(
	              "label",
	              { htmlFor: "delete_received", className: "col-xs-2 control-label" },
	              "Delete on retrieve"
	            ),
	            _react2.default.createElement(
	              "div",
	              { className: "col-xs-4" },
	              _react2.default.createElement("input", { type: "checkbox", id: "delete_received",
	                onChange: onSetReceiverCheckboxField,
	                checked: settings.get('delete_received', false),
	                value: "1" })
	            )
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "form-group" },
	            _react2.default.createElement(
	              "label",
	              { htmlFor: "passive", className: "col-xs-2 control-label" },
	              "Passive"
	            ),
	            _react2.default.createElement(
	              "div",
	              { className: "col-xs-4" },
	              _react2.default.createElement("input", { type: "checkbox", id: "passive",
	                onChange: onSetReceiverCheckboxField,
	                checked: settings.get('passive', false),
	                value: "1" })
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return Receiver;
	}(_react.Component);

	exports.default = Receiver;

/***/ },

/***/ 1342:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
			value: true
	});
	var Templates = {
			Asterisk_CDR: {
					"file_type": "Asterisk_CDR",
					"parser": {
							"type": "separator",
							"separator": "|",
							"structure": ["accountcode", "src", "dst", "dcontext", "clid", "channel", "dstchannel", "lastapp", "lastdata", "start", "answer", "end", "duration", "billsec", "disposition", "amaflags", "userfield", "uniqueid"],
							"custom_keys": ["accountcode", "src", "dst", "dcontext", "clid", "channel", "dstchannel", "lastapp", "lastdata", "start", "answer", "end", "duration", "billsec", "disposition", "amaflags", "userfield", "uniqueid"],
							"line_types": {
									"H": "/^none$/",
									"D": "//",
									"T": "/^none$/"
							}
					},
					"processor": {
							"type": "Usage",
							"date_field": "answer",
							"volume_field": "duration",
							"default_usaget": "call",
							"orphan_files_time": "6 hours"
					},
					"customer_identification_fields": [{
							"target_key": "sid",
							"conditions": [{
									"field": "usaget",
									"regex": "/.*/"
							}],
							"clear_regex": "//",
							"src_key": "src"
					}],
					"rate_calculators": {
							"call": [{
									"type": "longestPrefix",
									"rate_key": "params.prefix",
									"line_key": "dst"
							}]
					},
					"receiver": {
							"type": "ftp",
							"connections": [{
									"passive": true,
									"delete_received": false,
									"name": "Astersik_CDR",
									"host": "46.101.149.208",
									"user": "ftp_user",
									"password": "j8(B2c_sV",
									"remote_directory": "/Dori/Asterisk_CDR/"
							}],
							"limit": 3
					}
			},
			UK_Standard_CDR_v3: {
					"file_type": "UK_Standard_CDR_v3",
					"parser": {
							"type": "separator",
							"separator": ",",
							"structure": ["call_type", "call_cause", "customer_identifier", "telephone_number_dialled", "call_date", "call_time", "duration", "bytes_transmitted", "bytes_received", "description", "chargecode", "time_band", "salesprice", "salesprice__pre_bundle_", "extension", "ddi", "grouping_id", "call_class", "carrier", "recording", "vat", "country_of_origin", "network", "retail_tariff_code", "remote_network", "apn", "diverted_number", "ring_time", "recordid", "currency", "presentation_number", "network_access_reference", "ngcs_access_charge", "ngcs_service_charge", "total_bytes_transferred", "user_id", "onward_billing_reference", "contract_name", "bundle_name", "bundle_allowance", "discount_reference", "routing_code"],
							"custom_keys": ["call_type", "call_cause", "customer_identifier", "telephone_number_dialled", "call_date", "call_time", "duration", "bytes_transmitted", "bytes_received", "description", "chargecode", "time_band", "salesprice", "salesprice__pre_bundle_", "extension", "ddi", "grouping_id", "call_class", "carrier", "recording", "vat", "country_of_origin", "network", "retail_tariff_code", "remote_network", "apn", "diverted_number", "ring_time", "recordid", "currency", "presentation_number", "network_access_reference", "ngcs_access_charge", "ngcs_service_charge", "total_bytes_transferred", "user_id", "onward_billing_reference", "contract_name", "bundle_name", "bundle_allowance", "discount_reference", "routing_code"],
							"line_types": {
									"H": "/^none$/",
									"D": "//",
									"T": "/^none$/"
							}
					},
					"processor": {
							"type": "Usage",
							"date_field": "call_date",
							"volume_field": "duration",
							"usaget_mapping": [{
									"src_field": "call_type",
									"pattern": "/^G$/",
									"usaget": "GPRS Data"
							}],
							"orphan_files_time": "6 hours"
					},
					"customer_identification_fields": [{
							"target_key": "sid",
							"conditions": [{
									"field": "usaget",
									"regex": "/.*/"
							}],
							"clear_regex": "//",
							"src_key": "customer_identifier"
					}],
					"rate_calculators": {
							"GPRS Data": [{
									"type": "match",
									"rate_key": "key",
									"line_key": "apn"
							}]
					},
					"receiver": {
							"type": "ftp",
							"connections": [{
									"passive": true,
									"delete_received": false,
									"name": "UK_Standerd_CDR",
									"host": "46.101.149.208",
									"user": "ftp_user",
									"password": "j8(B2c_sV",
									"remote_directory": "/Dori/UK_Standard_CDR/"
							}],
							"limit": 3
					}
			},
			FreeSWITCH_CDR: {
					"file_type": "FreeSWITCH_CDR",
					"parser": {
							"type": "separator",
							"separator": ",",
							"structure": ["caller_id_name", "caller_id_number", "destination_number", "context", "start_stamp", "answer_stamp", "end_stamp", "duration", "billsec", "hangup_cause", "uuid", "bleg_uuid", "accountcode", "read_codec", "write_codec"],
							"custom_keys": ["caller_id_name", "caller_id_number", "destination_number", "context", "start_stamp", "answer_stamp", "end_stamp", "duration", "billsec", "hangup_cause", "uuid", "bleg_uuid", "accountcode", "read_codec", "write_codec"],
							"line_types": {
									"H": "/^none$/",
									"D": "//",
									"T": "/^none$/"
							}
					},
					"processor": {
							"type": "Usage",
							"date_field": "answer_stamp",
							"volume_field": "billsec",
							"default_usaget": "call",
							"orphan_files_time": "6 hours"
					},
					"customer_identification_fields": [{
							"target_key": "sid",
							"conditions": [{
									"field": "usaget",
									"regex": "/.*/"
							}],
							"clear_regex": "//",
							"src_key": "caller_id_number"
					}],
					"rate_calculators": {
							"call": [{
									"type": "longestPrefix",
									"rate_key": "params.prefix",
									"line_key": "caller_id_number"
							}]
					},
					"receiver": {
							"type": "ftp",
							"connections": [{
									"passive": true,
									"delete_received": false,
									"name": "FreeSWITCH_CDR",
									"host": "46.101.149.208",
									"user": "ftp_user",
									"password": "j8(B2c_sV",
									"remote_directory": "/Dori/FreeSWITCH_CDR/"
							}],
							"limit": 3
					}
			}
	};

	exports.default = Templates;

/***/ },

/***/ 1343:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SelectDelimiter = function (_Component) {
	  _inherits(SelectDelimiter, _Component);

	  function SelectDelimiter(props) {
	    _classCallCheck(this, SelectDelimiter);

	    return _possibleConstructorReturn(this, (SelectDelimiter.__proto__ || Object.getPrototypeOf(SelectDelimiter)).call(this, props));
	  }

	  _createClass(SelectDelimiter, [{
	    key: "render",
	    value: function render() {
	      var _props = this.props;
	      var settings = _props.settings;
	      var onSetDelimiterType = _props.onSetDelimiterType;
	      var onChangeDelimiter = _props.onChangeDelimiter;


	      return _react2.default.createElement(
	        "div",
	        { className: "form-group" },
	        _react2.default.createElement(
	          "div",
	          { className: "col-lg-3" },
	          _react2.default.createElement(
	            "label",
	            { htmlFor: "delimiter" },
	            "Delimiter"
	          )
	        ),
	        _react2.default.createElement(
	          "div",
	          { className: "col-lg-9" },
	          _react2.default.createElement(
	            "div",
	            { className: "col-lg-1", style: { marginTop: 8 } },
	            _react2.default.createElement("i", { className: "fa fa-long-arrow-right" })
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "col-lg-5" },
	            _react2.default.createElement(
	              "div",
	              { className: "input-group" },
	              _react2.default.createElement(
	                "div",
	                { className: "input-group-addon" },
	                _react2.default.createElement("input", { type: "radio", name: "delimiter-type",
	                  value: "separator",
	                  disabled: !settings.get('file_type', false),
	                  onChange: onSetDelimiterType,
	                  checked: settings.get('delimiter_type', '') === "separator" }),
	                "By delimiter"
	              ),
	              _react2.default.createElement("input", { id: "separator",
	                className: "form-control",
	                type: "text",
	                maxLength: "1",
	                disabled: !settings.get('file_type', '') || settings.get('delimiter_type', '') !== "separator",
	                style: { width: 35 },
	                onChange: onChangeDelimiter,
	                value: settings.get('delimiter', '') })
	            )
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "col-lg-3", style: { marginTop: 10 } },
	            _react2.default.createElement("input", { type: "radio", name: "delimiter-type",
	              value: "fixed",
	              disabled: !settings.get('file_type', false),
	              onChange: onSetDelimiterType,
	              checked: settings.get('delimiter_type', '') === "fixed" }),
	            "Fixed width"
	          )
	        )
	      );
	    }
	  }]);

	  return SelectDelimiter;
	}(_react.Component);

	exports.default = SelectDelimiter;

/***/ },

/***/ 1344:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SelectCSV = function (_Component) {
	  _inherits(SelectCSV, _Component);

	  function SelectCSV(props) {
	    _classCallCheck(this, SelectCSV);

	    return _possibleConstructorReturn(this, (SelectCSV.__proto__ || Object.getPrototypeOf(SelectCSV)).call(this, props));
	  }

	  _createClass(SelectCSV, [{
	    key: "render",
	    value: function render() {
	      var _props = this.props;
	      var settings = _props.settings;
	      var onSelectSampleCSV = _props.onSelectSampleCSV;


	      return _react2.default.createElement(
	        "div",
	        { className: "form-group" },
	        _react2.default.createElement(
	          "div",
	          { className: "col-lg-3" },
	          _react2.default.createElement(
	            "label",
	            { htmlFor: "sample_csv" },
	            "Select Sample CSV"
	          ),
	          _react2.default.createElement(
	            "p",
	            { className: "help-block" },
	            "Notice: Spaces will be convereted to underscores"
	          )
	        ),
	        _react2.default.createElement(
	          "div",
	          { className: "col-lg-9" },
	          _react2.default.createElement(
	            "div",
	            { className: "col-lg-1", style: { marginTop: 8 } },
	            _react2.default.createElement("i", { className: "fa fa-long-arrow-right" })
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "col-lg-9" },
	            _react2.default.createElement("input", { type: "file", id: "sample_csv",
	              onChange: onSelectSampleCSV,
	              disabled: !settings.get('file_type') || !settings.get('delimiter_type') || settings.get('delimiter_type') !== "separator" })
	          )
	        )
	      );
	    }
	  }]);

	  return SelectCSV;
	}(_react.Component);

	exports.default = SelectCSV;

/***/ },

/***/ 1345:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _CSVField = __webpack_require__(1346);

	var _CSVField2 = _interopRequireDefault(_CSVField);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/* COMPONENTS */


	var CSVFields = function (_Component) {
	  _inherits(CSVFields, _Component);

	  function CSVFields(props) {
	    _classCallCheck(this, CSVFields);

	    return _possibleConstructorReturn(this, (CSVFields.__proto__ || Object.getPrototypeOf(CSVFields)).call(this, props));
	  }

	  _createClass(CSVFields, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var settings = _props.settings;
	      var onRemoveField = _props.onRemoveField;
	      var onSetFieldWidth = _props.onSetFieldWidth;

	      var fixed = settings.get('delimiter_type', '') === "fixed";

	      return _react2.default.createElement(
	        'div',
	        null,
	        settings.get('fields', []).map(function (field, key) {
	          return _react2.default.createElement(_CSVField2.default, { key: key, index: key,
	            onRemoveField: onRemoveField,
	            field: field,
	            onSetFieldWidth: onSetFieldWidth,
	            fixed: fixed,
	            disabled: !settings.get('file_type'),
	            width: settings.getIn(['field_widths', field]) });
	        })
	      );
	    }
	  }]);

	  return CSVFields;
	}(_react.Component);

	exports.default = CSVFields;

/***/ },

/***/ 1346:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CSVFields = function (_Component) {
	  _inherits(CSVFields, _Component);

	  function CSVFields(props) {
	    _classCallCheck(this, CSVFields);

	    var _this = _possibleConstructorReturn(this, (CSVFields.__proto__ || Object.getPrototypeOf(CSVFields)).call(this, props));

	    _this.removeField = function () {
	      var _this$props = _this.props;
	      var onRemoveField = _this$props.onRemoveField;
	      var index = _this$props.index;

	      onRemoveField(index);
	    };

	    return _this;
	  }

	  _createClass(CSVFields, [{
	    key: "render",
	    value: function render() {
	      var _props = this.props;
	      var field = _props.field;
	      var fixed = _props.fixed;
	      var onSetFieldWidth = _props.onSetFieldWidth;
	      var disabled = _props.disabled;
	      var width = _props.width;

	      return _react2.default.createElement(
	        "div",
	        { className: "form-group" },
	        _react2.default.createElement(
	          "div",
	          { className: "col-lg-3" },
	          _react2.default.createElement(
	            "button",
	            { type: "button",
	              className: "btn btn-danger btn-circle",
	              disabled: disabled,
	              onClick: this.removeField },
	            _react2.default.createElement("i", { className: "fa fa-minus" })
	          ),
	          field
	        ),
	        fixed ? _react2.default.createElement(
	          "div",
	          { className: "col-lg-2" },
	          _react2.default.createElement("input", { type: "number",
	            className: "form-control",
	            "data-field": field,
	            style: { width: 70 },
	            onChange: onSetFieldWidth,
	            value: width })
	        ) : null
	      );
	    }
	  }]);

	  return CSVFields;
	}(_react.Component);

	exports.default = CSVFields;

/***/ },

/***/ 1347:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _Templates = __webpack_require__(1342);

	var _Templates2 = _interopRequireDefault(_Templates);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SelectTemplate = function (_Component) {
	  _inherits(SelectTemplate, _Component);

	  function SelectTemplate(props) {
	    _classCallCheck(this, SelectTemplate);

	    var _this = _possibleConstructorReturn(this, (SelectTemplate.__proto__ || Object.getPrototypeOf(SelectTemplate)).call(this, props));

	    _this.onCheck = function (e) {
	      var value = e.target.value;

	      _this.setState({ selected: value });
	    };

	    _this.onSelectTemplate = function (e) {
	      var value = e.target.value;

	      _this.setState({ template: value });
	    };

	    _this.handleCancel = function () {
	      _this.context.router.push({
	        pathname: 'input_processors'
	      });
	    };

	    _this.handleNext = function () {
	      var _this$state = _this.state;
	      var selected = _this$state.selected;
	      var template = _this$state.template;

	      var query = selected === "predefined" ? { action: "new", template: template } : { action: "new" };
	      _this.context.router.push({
	        pathname: 'input_processor',
	        query: query
	      });
	    };

	    _this.state = {
	      selected: "predefined",
	      template: Object.keys(_Templates2.default)[0]
	    };
	    return _this;
	  }

	  _createClass(SelectTemplate, [{
	    key: 'render',
	    value: function render() {
	      var _state = this.state;
	      var selected = _state.selected;
	      var template = _state.template;


	      var template_options = Object.keys(_Templates2.default).map(function (type, idx) {
	        return _react2.default.createElement(
	          'option',
	          { value: type, key: idx },
	          type
	        );
	      });

	      return _react2.default.createElement(
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
	              _react2.default.createElement(
	                'span',
	                null,
	                'Create new input processor'
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'panel-body' },
	              _react2.default.createElement(
	                'form',
	                { className: 'form-horizontal' },
	                _react2.default.createElement(
	                  'div',
	                  { className: 'form-group' },
	                  _react2.default.createElement(
	                    'div',
	                    { className: 'col-lg-3 col-md-4' },
	                    _react2.default.createElement('input', { type: 'radio',
	                      name: 'select-template',
	                      value: 'predefined',
	                      checked: true,
	                      onChange: this.onCheck }),
	                    'I will use predefined input processor'
	                  ),
	                  _react2.default.createElement(
	                    'div',
	                    { className: 'col-lg-9 col-md-9' },
	                    _react2.default.createElement(
	                      'select',
	                      { className: 'form-control',
	                        value: template,
	                        onChange: this.onSelectTemplate,
	                        disabled: selected !== "predefined" },
	                      template_options
	                    )
	                  )
	                ),
	                _react2.default.createElement(
	                  'div',
	                  { className: 'form-group' },
	                  _react2.default.createElement(
	                    'div',
	                    { className: 'col-lg-3 col-md-4' },
	                    _react2.default.createElement('input', { type: 'radio',
	                      name: 'select-template',
	                      value: 'manual',
	                      onChange: this.onCheck }),
	                    'I will configure a custom input processor'
	                  )
	                ),
	                _react2.default.createElement(
	                  'div',
	                  { style: { marginTop: 12, float: "right" } },
	                  _react2.default.createElement(
	                    'button',
	                    { className: 'btn btn-default',
	                      type: 'button',
	                      onClick: this.handleCancel,
	                      style: { marginRight: 12 } },
	                    'Cancel'
	                  ),
	                  _react2.default.createElement(
	                    'button',
	                    { className: 'btn btn-primary',
	                      type: 'button',
	                      disabled: !selected,
	                      onClick: this.handleNext },
	                    'Next'
	                  )
	                )
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return SelectTemplate;
	}(_react.Component);

	exports.default = SelectTemplate;


	SelectTemplate.contextTypes = {
	  router: _react2.default.PropTypes.object.isRequired
	};

/***/ }

})