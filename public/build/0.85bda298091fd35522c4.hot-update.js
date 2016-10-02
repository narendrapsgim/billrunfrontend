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

	var _DevTools = __webpack_require__(422);

	var _DevTools2 = _interopRequireDefault(_DevTools);

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
	          'div',
	          null,
	          _react2.default.createElement(
	            _reactRouter.Router,
	            { history: _reactRouter.hashHistory },
	            routes
	          ),
	          _react2.default.createElement(_DevTools2.default, null)
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

	var _DevTools = __webpack_require__(422);

	var _DevTools2 = _interopRequireDefault(_DevTools);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var enhancer = (0, _redux.compose)(
	// Middleware you want to use in development:
	(0, _redux.applyMiddleware)(_reduxThunk2.default),
	// Required! Enable Redux DevTools with the monitors you chose
	_DevTools2.default.instrument());

	function configureStore() {
	  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  return (0, _redux.createStore)(_reducers2.default, initialState, enhancer);
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
	exports.SET_STATIC_USAGET = exports.REMOVE_ALL_CSV_FIELDS = exports.SET_LINE_KEY = exports.SET_USAGET_TYPE = exports.REMOVE_USAGET_MAPPING = exports.REMOVE_CSV_FIELD = exports.MAP_USAGET = exports.CLEAR_INPUT_PROCESSOR = exports.SET_FIELD_WIDTH = exports.GOT_INPUT_PROCESSORS = exports.GOT_PROCESSOR_SETTINGS = exports.SET_RECEIVER_FIELD = exports.SET_CUSETOMER_MAPPING = exports.SET_RATING_FIELD = exports.SET_CUSTOMER_MAPPING = exports.ADD_USAGET_MAPPING = exports.ADD_CSV_FIELD = exports.SET_FIELD_MAPPING = exports.SET_FIELDS = exports.SET_DELIMITER = exports.SET_DELIMITER_TYPE = exports.SET_NAME = undefined;

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

	var _axios = __webpack_require__(378);

	var _axios2 = _interopRequireDefault(_axios);

	var _alertsActions = __webpack_require__(266);

	var _Api = __webpack_require__(376);

	var _progressIndicatorActions = __webpack_require__(263);

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

	var axiosInstance = _axios2.default.create({
	  withCredentials: true,
	  baseURL: globalSetting.serverUrl
	});

	function gotProcessorSettings(settings) {
	  return {
	    type: GOT_PROCESSOR_SETTINGS,
	    settings: settings
	  };
	}

	function fetchProcessorSettings(file_type) {
	  var convert = function convert(settings) {
	    var parser = settings.parser;
	    var processor = settings.processor;
	    var customer_identification_fields = settings.customer_identification_fields;
	    var rate_calculators = settings.rate_calculators;
	    var receiver = settings.receiver;


	    var connections = receiver ? receiver.connections ? receiver.connections[0] : {} : {};
	    var field_widths = parser.type === "fixed" ? parser.structure : {};
	    var usaget_type = !processor.usaget_mapping || processor.usaget_mapping.length < 1 ? "static" : "dynamic";

	    return {
	      file_type: settings.file_type,
	      delimiter_type: parser.type,
	      delimiter: parser.separator,
	      usaget_type: usaget_type,
	      fields: parser.type === "fixed" ? Object.keys(parser.structure) : parser.structure,
	      field_widths: field_widths,
	      processor: Object.assign({}, processor, {
	        usaget_mapping: usaget_type === "dynamic" ? processor.usaget_mapping.map(function (usaget) {
	          return {
	            usaget: usaget.usaget,
	            pattern: usaget.pattern.replace("/^", "").replace("$/", "")
	          };
	        }) : [{}],
	        src_field: usaget_type === "dynamic" ? processor.usaget_mapping[0].src_field : ""
	      }),
	      customer_identification_fields: customer_identification_fields,
	      rate_calculators: rate_calculators,
	      receiver: connections
	    };
	  };

	  var fetchUrl = '/api/settings?category=file_types&data={"file_type":"' + file_type + '"}';
	  return function (dispatch) {
	    dispatch((0, _progressIndicatorActions.startProgressIndicator)());
	    var request = axiosInstance.get(fetchUrl).then(function (resp) {
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
	  var setUrl = '/api/settings?category=usage_types&action=set&data=[' + JSON.stringify(usaget) + ']';
	  return function (dispatch) {
	    dispatch((0, _progressIndicatorActions.startProgressIndicator)());
	    var request = axiosInstance.post(setUrl).then(function (resp) {
	      dispatch((0, _progressIndicatorActions.finishProgressIndicator)());
	      if (!resp.data.status) {
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

	  var processor_settings = state.get('usaget_type') === "static" ? { default_usaget: processor.get('default_usaget') } : { usaget_mapping: processor.get('usaget_mapping').map(function (usaget) {
	      return {
	        "src_field": processor.get('src_field'),
	        "pattern": '/^' + usaget.get('pattern') + '$/',
	        "usaget": usaget.get('usaget')
	      };
	    }).toJS() };

	  var settings = {
	    "file_type": state.get('file_type'),
	    "parser": {
	      "type": state.get('delimiter_type'),
	      "separator": state.get('delimiter'),
	      "structure": state.get('delimiter_type') === "fixed" ? state.get('field_widths') : state.get('fields')
	    },
	    "processor": _extends({
	      "type": "Usage",
	      "date_field": processor.get('date_field'),
	      "volume_field": processor.get('volume_field')
	    }, processor_settings),
	    "customer_identification_fields": customer_identification_fields.toJS(),
	    "rate_calculators": rate_calculators.toJS(),
	    "receiver": {
	      "type": "ftp",
	      "connections": [receiver.toJS()]
	    }
	  };

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
	      dispatch((0, _alertsActions.showDanger)('Error - ' + failure.error[0].error.desc));
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

	function fetchInputProcessors() {
	  var setUrl = '/api/settings?category=file_types&data={}';
	  return function (dispatch) {
	    dispatch((0, _progressIndicatorActions.startProgressIndicator)());
	    var request = axiosInstance.post(setUrl).then(function (resp) {
	      dispatch((0, _progressIndicatorActions.finishProgressIndicator)());
	      dispatch(gotInputProcessors(resp.data.details));
	    }).catch(function (error) {
	      dispatch((0, _alertsActions.showDanger)(error.data.message));
	      dispatch((0, _progressIndicatorActions.finishProgressIndicator)());
	    });
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

/***/ },

/***/ 422:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reduxDevtools = __webpack_require__(423);

	var _reduxDevtoolsLogMonitor = __webpack_require__(559);

	var _reduxDevtoolsLogMonitor2 = _interopRequireDefault(_reduxDevtoolsLogMonitor);

	var _reduxDevtoolsDockMonitor = __webpack_require__(730);

	var _reduxDevtoolsDockMonitor2 = _interopRequireDefault(_reduxDevtoolsDockMonitor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// createDevTools takes a monitor and produces a DevTools component


	// Monitors are separate packages, and you can make a custom one
	var DevTools = (0, _reduxDevtools.createDevTools)(
	// Monitors are individually adjustable with props.
	// Consult their repositories to learn about those props.
	// Here, we put LogMonitor inside a DockMonitor.
	// Note: DockMonitor is visible by default.
	_react2.default.createElement(
	  _reduxDevtoolsDockMonitor2.default,
	  { toggleVisibilityKey: 'ctrl-h',
	    changePositionKey: 'ctrl-q',
	    defaultIsVisible: true },
	  _react2.default.createElement(_reduxDevtoolsLogMonitor2.default, { theme: 'tomorrow' })
	));

	// Exported from redux-devtools
	exports.default = DevTools;

/***/ },

/***/ 423:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _reduxDevtoolsInstrument = __webpack_require__(424);

	Object.defineProperty(exports, 'instrument', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_reduxDevtoolsInstrument).default;
	  }
	});
	Object.defineProperty(exports, 'ActionCreators', {
	  enumerable: true,
	  get: function get() {
	    return _reduxDevtoolsInstrument.ActionCreators;
	  }
	});
	Object.defineProperty(exports, 'ActionTypes', {
	  enumerable: true,
	  get: function get() {
	    return _reduxDevtoolsInstrument.ActionTypes;
	  }
	});

	var _persistState = __webpack_require__(499);

	Object.defineProperty(exports, 'persistState', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_persistState).default;
	  }
	});

	var _createDevTools = __webpack_require__(558);

	Object.defineProperty(exports, 'createDevTools', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_createDevTools).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },

/***/ 424:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.INIT_ACTION = exports.ActionCreators = exports.ActionTypes = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.liftAction = liftAction;
	exports.liftReducerWith = liftReducerWith;
	exports.unliftState = unliftState;
	exports.unliftStore = unliftStore;
	exports.default = instrument;

	var _difference = __webpack_require__(425);

	var _difference2 = _interopRequireDefault(_difference);

	var _union = __webpack_require__(491);

	var _union2 = _interopRequireDefault(_union);

	var _isPlainObject = __webpack_require__(185);

	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

	var _symbolObservable = __webpack_require__(497);

	var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ActionTypes = exports.ActionTypes = {
	  PERFORM_ACTION: 'PERFORM_ACTION',
	  RESET: 'RESET',
	  ROLLBACK: 'ROLLBACK',
	  COMMIT: 'COMMIT',
	  SWEEP: 'SWEEP',
	  TOGGLE_ACTION: 'TOGGLE_ACTION',
	  SET_ACTIONS_ACTIVE: 'SET_ACTIONS_ACTIVE',
	  JUMP_TO_STATE: 'JUMP_TO_STATE',
	  IMPORT_STATE: 'IMPORT_STATE',
	  LOCK_CHANGES: 'LOCK_CHANGES',
	  PAUSE_RECORDING: 'PAUSE_RECORDING'
	};

	/**
	 * Action creators to change the History state.
	 */
	var ActionCreators = exports.ActionCreators = {
	  performAction: function performAction(action) {
	    if (!(0, _isPlainObject2.default)(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }

	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }

	    return { type: ActionTypes.PERFORM_ACTION, action: action, timestamp: Date.now() };
	  },
	  reset: function reset() {
	    return { type: ActionTypes.RESET, timestamp: Date.now() };
	  },
	  rollback: function rollback() {
	    return { type: ActionTypes.ROLLBACK, timestamp: Date.now() };
	  },
	  commit: function commit() {
	    return { type: ActionTypes.COMMIT, timestamp: Date.now() };
	  },
	  sweep: function sweep() {
	    return { type: ActionTypes.SWEEP };
	  },
	  toggleAction: function toggleAction(id) {
	    return { type: ActionTypes.TOGGLE_ACTION, id: id };
	  },
	  setActionsActive: function setActionsActive(start, end) {
	    var active = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

	    return { type: ActionTypes.SET_ACTIONS_ACTIVE, start: start, end: end, active: active };
	  },
	  jumpToState: function jumpToState(index) {
	    return { type: ActionTypes.JUMP_TO_STATE, index: index };
	  },
	  importState: function importState(nextLiftedState, noRecompute) {
	    return { type: ActionTypes.IMPORT_STATE, nextLiftedState: nextLiftedState, noRecompute: noRecompute };
	  },
	  lockChanges: function lockChanges(status) {
	    return { type: ActionTypes.LOCK_CHANGES, status: status };
	  },
	  pauseRecording: function pauseRecording(status) {
	    return { type: ActionTypes.PAUSE_RECORDING, status: status };
	  }
	};

	var INIT_ACTION = exports.INIT_ACTION = { type: '@@INIT' };

	/**
	 * Computes the next entry with exceptions catching.
	 */
	function computeWithTryCatch(reducer, action, state) {
	  var nextState = state;
	  var nextError = void 0;
	  try {
	    nextState = reducer(state, action);
	  } catch (err) {
	    nextError = err.toString();
	    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && (typeof window.chrome !== 'undefined' || typeof window.process !== 'undefined' && window.process.type === 'renderer')) {
	      // In Chrome, rethrowing provides better source map support
	      setTimeout(function () {
	        throw err;
	      });
	    } else {
	      console.error(err);
	    }
	  }

	  return {
	    state: nextState,
	    error: nextError
	  };
	}

	/**
	 * Computes the next entry in the log by applying an action.
	 */
	function computeNextEntry(reducer, action, state, shouldCatchErrors) {
	  if (!shouldCatchErrors) {
	    return { state: reducer(state, action) };
	  }
	  return computeWithTryCatch(reducer, action, state);
	}

	/**
	 * Runs the reducer on invalidated actions to get a fresh computation log.
	 */
	function recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, shouldCatchErrors) {
	  // Optimization: exit early and return the same reference
	  // if we know nothing could have changed.
	  if (!computedStates || minInvalidatedStateIndex === -1 || minInvalidatedStateIndex >= computedStates.length && computedStates.length === stagedActionIds.length) {
	    return computedStates;
	  }

	  var nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
	  for (var i = minInvalidatedStateIndex; i < stagedActionIds.length; i++) {
	    var actionId = stagedActionIds[i];
	    var action = actionsById[actionId].action;

	    var previousEntry = nextComputedStates[i - 1];
	    var previousState = previousEntry ? previousEntry.state : committedState;

	    var shouldSkip = skippedActionIds.indexOf(actionId) > -1;
	    var entry = void 0;
	    if (shouldSkip) {
	      entry = previousEntry;
	    } else {
	      if (shouldCatchErrors && previousEntry && previousEntry.error) {
	        entry = {
	          state: previousState,
	          error: 'Interrupted by an error up the chain'
	        };
	      } else {
	        entry = computeNextEntry(reducer, action, previousState, shouldCatchErrors);
	      }
	    }
	    nextComputedStates.push(entry);
	  }

	  return nextComputedStates;
	}

	/**
	 * Lifts an app's action into an action on the lifted store.
	 */
	function liftAction(action) {
	  return ActionCreators.performAction(action);
	}

	/**
	 * Creates a history state reducer from an app's reducer.
	 */
	function liftReducerWith(reducer, initialCommittedState, monitorReducer, options) {
	  var initialLiftedState = {
	    monitorState: monitorReducer(undefined, {}),
	    nextActionId: 1,
	    actionsById: { 0: liftAction(INIT_ACTION) },
	    stagedActionIds: [0],
	    skippedActionIds: [],
	    committedState: initialCommittedState,
	    currentStateIndex: 0,
	    computedStates: [],
	    isLocked: options.shouldStartLocked === true,
	    isPaused: options.shouldRecordChanges === false
	  };

	  /**
	   * Manages how the history actions modify the history state.
	   */
	  return function (liftedState, liftedAction) {
	    var _ref = liftedState || initialLiftedState;

	    var monitorState = _ref.monitorState;
	    var actionsById = _ref.actionsById;
	    var nextActionId = _ref.nextActionId;
	    var stagedActionIds = _ref.stagedActionIds;
	    var skippedActionIds = _ref.skippedActionIds;
	    var committedState = _ref.committedState;
	    var currentStateIndex = _ref.currentStateIndex;
	    var computedStates = _ref.computedStates;
	    var isLocked = _ref.isLocked;
	    var isPaused = _ref.isPaused;


	    if (!liftedState) {
	      // Prevent mutating initialLiftedState
	      actionsById = _extends({}, actionsById);
	    }

	    function commitExcessActions(n) {
	      // Auto-commits n-number of excess actions.
	      var excess = n;
	      var idsToDelete = stagedActionIds.slice(1, excess + 1);

	      for (var i = 0; i < idsToDelete.length; i++) {
	        if (computedStates[i + 1].error) {
	          // Stop if error is found. Commit actions up to error.
	          excess = i;
	          idsToDelete = stagedActionIds.slice(1, excess + 1);
	          break;
	        } else {
	          delete actionsById[idsToDelete[i]];
	        }
	      }

	      skippedActionIds = skippedActionIds.filter(function (id) {
	        return idsToDelete.indexOf(id) === -1;
	      });
	      stagedActionIds = [0].concat(stagedActionIds.slice(excess + 1));
	      committedState = computedStates[excess].state;
	      computedStates = computedStates.slice(excess);
	      currentStateIndex = currentStateIndex > excess ? currentStateIndex - excess : 0;
	    }

	    function computePausedAction(shouldInit) {
	      var _extends2;

	      var computedState = void 0;
	      if (shouldInit) {
	        computedState = computedStates[currentStateIndex];
	        monitorState = monitorReducer(monitorState, liftedAction);
	      } else {
	        computedState = computeNextEntry(reducer, liftedAction.action, computedStates[currentStateIndex].state, false);
	      }
	      if (!options.pauseActionType || nextActionId === 1) {
	        return {
	          monitorState: monitorState,
	          actionsById: { 0: liftAction(INIT_ACTION) },
	          nextActionId: 1,
	          stagedActionIds: [0],
	          skippedActionIds: [],
	          committedState: computedState.state,
	          currentStateIndex: 0,
	          computedStates: [computedState],
	          isLocked: isLocked,
	          isPaused: true
	        };
	      }
	      if (shouldInit) {
	        stagedActionIds = [].concat(stagedActionIds, [nextActionId]);
	        nextActionId++;
	        currentStateIndex++;
	      }
	      return {
	        monitorState: monitorState,
	        actionsById: _extends({}, actionsById, (_extends2 = {}, _extends2[nextActionId - 1] = liftAction({ type: options.pauseActionType }), _extends2)),
	        nextActionId: nextActionId,
	        stagedActionIds: stagedActionIds,
	        skippedActionIds: skippedActionIds,
	        committedState: committedState,
	        currentStateIndex: currentStateIndex,
	        computedStates: [].concat(computedStates.slice(0, currentStateIndex), [computedState]),
	        isLocked: isLocked,
	        isPaused: true
	      };
	    }

	    // By default, agressively recompute every state whatever happens.
	    // This has O(n) performance, so we'll override this to a sensible
	    // value whenever we feel like we don't have to recompute the states.
	    var minInvalidatedStateIndex = 0;

	    switch (liftedAction.type) {
	      case ActionTypes.PERFORM_ACTION:
	        {
	          if (isLocked) return liftedState || initialLiftedState;
	          if (isPaused) return computePausedAction();

	          // Auto-commit as new actions come in.
	          if (options.maxAge && stagedActionIds.length === options.maxAge) {
	            commitExcessActions(1);
	          }

	          if (currentStateIndex === stagedActionIds.length - 1) {
	            currentStateIndex++;
	          }
	          var actionId = nextActionId++;
	          // Mutation! This is the hottest path, and we optimize on purpose.
	          // It is safe because we set a new key in a cache dictionary.
	          actionsById[actionId] = liftedAction;
	          stagedActionIds = [].concat(stagedActionIds, [actionId]);
	          // Optimization: we know that only the new action needs computing.
	          minInvalidatedStateIndex = stagedActionIds.length - 1;
	          break;
	        }
	      case ActionTypes.RESET:
	        {
	          // Get back to the state the store was created with.
	          actionsById = { 0: liftAction(INIT_ACTION) };
	          nextActionId = 1;
	          stagedActionIds = [0];
	          skippedActionIds = [];
	          committedState = initialCommittedState;
	          currentStateIndex = 0;
	          computedStates = [];
	          break;
	        }
	      case ActionTypes.COMMIT:
	        {
	          // Consider the last committed state the new starting point.
	          // Squash any staged actions into a single committed state.
	          actionsById = { 0: liftAction(INIT_ACTION) };
	          nextActionId = 1;
	          stagedActionIds = [0];
	          skippedActionIds = [];
	          committedState = computedStates[currentStateIndex].state;
	          currentStateIndex = 0;
	          computedStates = [];
	          break;
	        }
	      case ActionTypes.ROLLBACK:
	        {
	          // Forget about any staged actions.
	          // Start again from the last committed state.
	          actionsById = { 0: liftAction(INIT_ACTION) };
	          nextActionId = 1;
	          stagedActionIds = [0];
	          skippedActionIds = [];
	          currentStateIndex = 0;
	          computedStates = [];
	          break;
	        }
	      case ActionTypes.TOGGLE_ACTION:
	        {
	          var _ret = function () {
	            // Toggle whether an action with given ID is skipped.
	            // Being skipped means it is a no-op during the computation.
	            var actionId = liftedAction.id;

	            var index = skippedActionIds.indexOf(actionId);
	            if (index === -1) {
	              skippedActionIds = [actionId].concat(skippedActionIds);
	            } else {
	              skippedActionIds = skippedActionIds.filter(function (id) {
	                return id !== actionId;
	              });
	            }
	            // Optimization: we know history before this action hasn't changed
	            minInvalidatedStateIndex = stagedActionIds.indexOf(actionId);
	            return 'break';
	          }();

	          if (_ret === 'break') break;
	        }
	      case ActionTypes.SET_ACTIONS_ACTIVE:
	        {
	          // Toggle whether an action with given ID is skipped.
	          // Being skipped means it is a no-op during the computation.
	          var start = liftedAction.start;
	          var end = liftedAction.end;
	          var active = liftedAction.active;

	          var actionIds = [];
	          for (var i = start; i < end; i++) {
	            actionIds.push(i);
	          }if (active) {
	            skippedActionIds = (0, _difference2.default)(skippedActionIds, actionIds);
	          } else {
	            skippedActionIds = (0, _union2.default)(skippedActionIds, actionIds);
	          }

	          // Optimization: we know history before this action hasn't changed
	          minInvalidatedStateIndex = stagedActionIds.indexOf(start);
	          break;
	        }
	      case ActionTypes.JUMP_TO_STATE:
	        {
	          // Without recomputing anything, move the pointer that tell us
	          // which state is considered the current one. Useful for sliders.
	          currentStateIndex = liftedAction.index;
	          // Optimization: we know the history has not changed.
	          minInvalidatedStateIndex = Infinity;
	          break;
	        }
	      case ActionTypes.SWEEP:
	        {
	          // Forget any actions that are currently being skipped.
	          stagedActionIds = (0, _difference2.default)(stagedActionIds, skippedActionIds);
	          skippedActionIds = [];
	          currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
	          break;
	        }
	      case ActionTypes.IMPORT_STATE:
	        {
	          if (Array.isArray(liftedAction.nextLiftedState)) {
	            // recompute array of actions
	            actionsById = { 0: liftAction(INIT_ACTION) };
	            nextActionId = 1;
	            stagedActionIds = [0];
	            skippedActionIds = [];
	            currentStateIndex = liftedAction.nextLiftedState.length;
	            computedStates = [];
	            committedState = liftedAction.preloadedState;
	            minInvalidatedStateIndex = 0;
	            // iterate through actions
	            liftedAction.nextLiftedState.forEach(function (action) {
	              actionsById[nextActionId] = liftAction(action);
	              stagedActionIds.push(nextActionId);
	              nextActionId++;
	            });
	          } else {
	            var _liftedAction$nextLif = liftedAction.nextLiftedState;
	            // Completely replace everything.

	            monitorState = _liftedAction$nextLif.monitorState;
	            actionsById = _liftedAction$nextLif.actionsById;
	            nextActionId = _liftedAction$nextLif.nextActionId;
	            stagedActionIds = _liftedAction$nextLif.stagedActionIds;
	            skippedActionIds = _liftedAction$nextLif.skippedActionIds;
	            committedState = _liftedAction$nextLif.committedState;
	            currentStateIndex = _liftedAction$nextLif.currentStateIndex;
	            computedStates = _liftedAction$nextLif.computedStates;


	            if (liftedAction.noRecompute) {
	              minInvalidatedStateIndex = Infinity;
	            }
	          }

	          break;
	        }
	      case ActionTypes.LOCK_CHANGES:
	        {
	          isLocked = liftedAction.status;
	          minInvalidatedStateIndex = Infinity;
	          break;
	        }
	      case ActionTypes.PAUSE_RECORDING:
	        {
	          isPaused = liftedAction.status;
	          if (isPaused) return computePausedAction(true);
	          minInvalidatedStateIndex = Infinity;
	          break;
	        }
	      case '@@redux/INIT':
	        {
	          if (options.shouldHotReload === false && liftedState) {
	            return liftedState;
	          }

	          // Recompute states on hot reload and init.
	          minInvalidatedStateIndex = 0;

	          if (options.maxAge && stagedActionIds.length > options.maxAge) {
	            // States must be recomputed before committing excess.
	            computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, options.shouldCatchErrors);

	            commitExcessActions(stagedActionIds.length - options.maxAge);

	            // Avoid double computation.
	            minInvalidatedStateIndex = Infinity;
	          }

	          break;
	        }
	      default:
	        {
	          // If the action is not recognized, it's a monitor action.
	          // Optimization: a monitor action can't change history.
	          minInvalidatedStateIndex = Infinity;
	          break;
	        }
	    }

	    computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, options.shouldCatchErrors);
	    monitorState = monitorReducer(monitorState, liftedAction);
	    return {
	      monitorState: monitorState,
	      actionsById: actionsById,
	      nextActionId: nextActionId,
	      stagedActionIds: stagedActionIds,
	      skippedActionIds: skippedActionIds,
	      committedState: committedState,
	      currentStateIndex: currentStateIndex,
	      computedStates: computedStates,
	      isLocked: isLocked,
	      isPaused: isPaused
	    };
	  };
	}

	/**
	 * Provides an app's view into the state of the lifted store.
	 */
	function unliftState(liftedState) {
	  var computedStates = liftedState.computedStates;
	  var currentStateIndex = liftedState.currentStateIndex;
	  var state = computedStates[currentStateIndex].state;

	  return state;
	}

	/**
	 * Provides an app's view into the lifted store.
	 */
	function unliftStore(liftedStore, liftReducer) {
	  var _extends3;

	  var lastDefinedState = void 0;

	  function getState() {
	    var state = unliftState(liftedStore.getState());
	    if (state !== undefined) {
	      lastDefinedState = state;
	    }
	    return lastDefinedState;
	  }

	  return _extends({}, liftedStore, (_extends3 = {

	    liftedStore: liftedStore,

	    dispatch: function dispatch(action) {
	      liftedStore.dispatch(liftAction(action));
	      return action;
	    },


	    getState: getState,

	    replaceReducer: function replaceReducer(nextReducer) {
	      liftedStore.replaceReducer(liftReducer(nextReducer));
	    }
	  }, _extends3[_symbolObservable2.default] = function () {
	    return _extends({}, liftedStore[_symbolObservable2.default](), {
	      subscribe: function subscribe(observer) {
	        if ((typeof observer === 'undefined' ? 'undefined' : _typeof(observer)) !== 'object') {
	          throw new TypeError('Expected the observer to be an object.');
	        }

	        function observeState() {
	          if (observer.next) {
	            observer.next(getState());
	          }
	        }

	        observeState();
	        var unsubscribe = liftedStore.subscribe(observeState);
	        return { unsubscribe: unsubscribe };
	      }
	    });
	  }, _extends3));
	}

	/**
	 * Redux instrumentation store enhancer.
	 */
	function instrument() {
	  var monitorReducer = arguments.length <= 0 || arguments[0] === undefined ? function () {
	    return null;
	  } : arguments[0];
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  /* eslint-disable no-eq-null */
	  if (options.maxAge != null && options.maxAge < 2) {
	    /* eslint-enable */
	    throw new Error('DevTools.instrument({ maxAge }) option, if specified, ' + 'may not be less than 2.');
	  }

	  return function (createStore) {
	    return function (reducer, initialState, enhancer) {

	      function liftReducer(r) {
	        if (typeof r !== 'function') {
	          if (r && typeof r.default === 'function') {
	            throw new Error('Expected the reducer to be a function. ' + 'Instead got an object with a "default" field. ' + 'Did you pass a module instead of the default export? ' + 'Try passing require(...).default instead.');
	          }
	          throw new Error('Expected the reducer to be a function.');
	        }
	        return liftReducerWith(r, initialState, monitorReducer, options);
	      }

	      var liftedStore = createStore(liftReducer(reducer), enhancer);
	      if (liftedStore.liftedStore) {
	        throw new Error('DevTools instrumentation should not be applied more than once. ' + 'Check your store configuration.');
	      }

	      return unliftStore(liftedStore, liftReducer);
	    };
	  };
	}

/***/ },

/***/ 425:
/***/ function(module, exports, __webpack_require__) {

	var baseDifference = __webpack_require__(426),
	    baseFlatten = __webpack_require__(473),
	    baseRest = __webpack_require__(482),
	    isArrayLikeObject = __webpack_require__(478);

	/**
	 * Creates an array of `array` values not included in the other given arrays
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons. The order and references of result values are
	 * determined by the first array.
	 *
	 * **Note:** Unlike `_.pullAll`, this method returns a new array.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {Array} array The array to inspect.
	 * @param {...Array} [values] The values to exclude.
	 * @returns {Array} Returns the new array of filtered values.
	 * @see _.without, _.xor
	 * @example
	 *
	 * _.difference([2, 1], [2, 3]);
	 * // => [1]
	 */
	var difference = baseRest(function(array, values) {
	  return isArrayLikeObject(array)
	    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
	    : [];
	});

	module.exports = difference;


/***/ },

/***/ 426:
/***/ function(module, exports, __webpack_require__) {

	var SetCache = __webpack_require__(427),
	    arrayIncludes = __webpack_require__(464),
	    arrayIncludesWith = __webpack_require__(469),
	    arrayMap = __webpack_require__(470),
	    baseUnary = __webpack_require__(471),
	    cacheHas = __webpack_require__(472);

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * The base implementation of methods like `_.difference` without support
	 * for excluding multiple arrays or iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Array} values The values to exclude.
	 * @param {Function} [iteratee] The iteratee invoked per element.
	 * @param {Function} [comparator] The comparator invoked per element.
	 * @returns {Array} Returns the new array of filtered values.
	 */
	function baseDifference(array, values, iteratee, comparator) {
	  var index = -1,
	      includes = arrayIncludes,
	      isCommon = true,
	      length = array.length,
	      result = [],
	      valuesLength = values.length;

	  if (!length) {
	    return result;
	  }
	  if (iteratee) {
	    values = arrayMap(values, baseUnary(iteratee));
	  }
	  if (comparator) {
	    includes = arrayIncludesWith;
	    isCommon = false;
	  }
	  else if (values.length >= LARGE_ARRAY_SIZE) {
	    includes = cacheHas;
	    isCommon = false;
	    values = new SetCache(values);
	  }
	  outer:
	  while (++index < length) {
	    var value = array[index],
	        computed = iteratee ? iteratee(value) : value;

	    value = (comparator || value !== 0) ? value : 0;
	    if (isCommon && computed === computed) {
	      var valuesIndex = valuesLength;
	      while (valuesIndex--) {
	        if (values[valuesIndex] === computed) {
	          continue outer;
	        }
	      }
	      result.push(value);
	    }
	    else if (!includes(values, computed, comparator)) {
	      result.push(value);
	    }
	  }
	  return result;
	}

	module.exports = baseDifference;


/***/ },

/***/ 427:
/***/ function(module, exports, __webpack_require__) {

	var MapCache = __webpack_require__(428),
	    setCacheAdd = __webpack_require__(462),
	    setCacheHas = __webpack_require__(463);

	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values ? values.length : 0;

	  this.__data__ = new MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}

	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;

	module.exports = SetCache;


/***/ },

/***/ 462:
/***/ function(module, exports) {

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED);
	  return this;
	}

	module.exports = setCacheAdd;


/***/ },

/***/ 463:
/***/ function(module, exports) {

	/**
	 * Checks if `value` is in the array cache.
	 *
	 * @private
	 * @name has
	 * @memberOf SetCache
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `true` if `value` is found, else `false`.
	 */
	function setCacheHas(value) {
	  return this.__data__.has(value);
	}

	module.exports = setCacheHas;


/***/ },

/***/ 464:
/***/ function(module, exports, __webpack_require__) {

	var baseIndexOf = __webpack_require__(465);

	/**
	 * A specialized version of `_.includes` for arrays without support for
	 * specifying an index to search from.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludes(array, value) {
	  var length = array ? array.length : 0;
	  return !!length && baseIndexOf(array, value, 0) > -1;
	}

	module.exports = arrayIncludes;


/***/ },

/***/ 465:
/***/ function(module, exports, __webpack_require__) {

	var baseFindIndex = __webpack_require__(466),
	    baseIsNaN = __webpack_require__(467),
	    strictIndexOf = __webpack_require__(468);

	/**
	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  return value === value
	    ? strictIndexOf(array, value, fromIndex)
	    : baseFindIndex(array, baseIsNaN, fromIndex);
	}

	module.exports = baseIndexOf;


/***/ },

/***/ 466:
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 1 : -1);

	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}

	module.exports = baseFindIndex;


/***/ },

/***/ 467:
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.isNaN` without support for number objects.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	 */
	function baseIsNaN(value) {
	  return value !== value;
	}

	module.exports = baseIsNaN;


/***/ },

/***/ 468:
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.indexOf` which performs strict equality
	 * comparisons of values, i.e. `===`.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function strictIndexOf(array, value, fromIndex) {
	  var index = fromIndex - 1,
	      length = array.length;

	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}

	module.exports = strictIndexOf;


/***/ },

/***/ 469:
/***/ function(module, exports) {

	/**
	 * This function is like `arrayIncludes` except that it accepts a comparator.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @param {Function} comparator The comparator invoked per element.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludesWith(array, value, comparator) {
	  var index = -1,
	      length = array ? array.length : 0;

	  while (++index < length) {
	    if (comparator(value, array[index])) {
	      return true;
	    }
	  }
	  return false;
	}

	module.exports = arrayIncludesWith;


/***/ },

/***/ 470:
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array ? array.length : 0,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	module.exports = arrayMap;


/***/ },

/***/ 472:
/***/ function(module, exports) {

	/**
	 * Checks if a `cache` value for `key` exists.
	 *
	 * @private
	 * @param {Object} cache The cache to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function cacheHas(cache, key) {
	  return cache.has(key);
	}

	module.exports = cacheHas;


/***/ },

/***/ 473:
/***/ function(module, exports, __webpack_require__) {

	var arrayPush = __webpack_require__(474),
	    isFlattenable = __webpack_require__(475);

	/**
	 * The base implementation of `_.flatten` with support for restricting flattening.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {number} depth The maximum recursion depth.
	 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
	 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, depth, predicate, isStrict, result) {
	  var index = -1,
	      length = array.length;

	  predicate || (predicate = isFlattenable);
	  result || (result = []);

	  while (++index < length) {
	    var value = array[index];
	    if (depth > 0 && predicate(value)) {
	      if (depth > 1) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, depth - 1, predicate, isStrict, result);
	      } else {
	        arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}

	module.exports = baseFlatten;


/***/ },

/***/ 475:
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(476),
	    isArguments = __webpack_require__(477),
	    isArray = __webpack_require__(481);

	/** Built-in value references. */
	var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

	/**
	 * Checks if `value` is a flattenable `arguments` object or array.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
	 */
	function isFlattenable(value) {
	  return isArray(value) || isArguments(value) ||
	    !!(spreadableSymbol && value && value[spreadableSymbol]);
	}

	module.exports = isFlattenable;


/***/ },

/***/ 491:
/***/ function(module, exports, __webpack_require__) {

	var baseFlatten = __webpack_require__(473),
	    baseRest = __webpack_require__(482),
	    baseUniq = __webpack_require__(492),
	    isArrayLikeObject = __webpack_require__(478);

	/**
	 * Creates an array of unique values, in order, from all given arrays using
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {...Array} [arrays] The arrays to inspect.
	 * @returns {Array} Returns the new array of combined values.
	 * @example
	 *
	 * _.union([2], [1, 2]);
	 * // => [2, 1]
	 */
	var union = baseRest(function(arrays) {
	  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
	});

	module.exports = union;


/***/ },

/***/ 492:
/***/ function(module, exports, __webpack_require__) {

	var SetCache = __webpack_require__(427),
	    arrayIncludes = __webpack_require__(464),
	    arrayIncludesWith = __webpack_require__(469),
	    cacheHas = __webpack_require__(472),
	    createSet = __webpack_require__(493),
	    setToArray = __webpack_require__(496);

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} [iteratee] The iteratee invoked per element.
	 * @param {Function} [comparator] The comparator invoked per element.
	 * @returns {Array} Returns the new duplicate free array.
	 */
	function baseUniq(array, iteratee, comparator) {
	  var index = -1,
	      includes = arrayIncludes,
	      length = array.length,
	      isCommon = true,
	      result = [],
	      seen = result;

	  if (comparator) {
	    isCommon = false;
	    includes = arrayIncludesWith;
	  }
	  else if (length >= LARGE_ARRAY_SIZE) {
	    var set = iteratee ? null : createSet(array);
	    if (set) {
	      return setToArray(set);
	    }
	    isCommon = false;
	    includes = cacheHas;
	    seen = new SetCache;
	  }
	  else {
	    seen = iteratee ? [] : result;
	  }
	  outer:
	  while (++index < length) {
	    var value = array[index],
	        computed = iteratee ? iteratee(value) : value;

	    value = (comparator || value !== 0) ? value : 0;
	    if (isCommon && computed === computed) {
	      var seenIndex = seen.length;
	      while (seenIndex--) {
	        if (seen[seenIndex] === computed) {
	          continue outer;
	        }
	      }
	      if (iteratee) {
	        seen.push(computed);
	      }
	      result.push(value);
	    }
	    else if (!includes(seen, computed, comparator)) {
	      if (seen !== result) {
	        seen.push(computed);
	      }
	      result.push(value);
	    }
	  }
	  return result;
	}

	module.exports = baseUniq;


/***/ },

/***/ 493:
/***/ function(module, exports, __webpack_require__) {

	var Set = __webpack_require__(494),
	    noop = __webpack_require__(495),
	    setToArray = __webpack_require__(496);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/**
	 * Creates a set object of `values`.
	 *
	 * @private
	 * @param {Array} values The values to add to the set.
	 * @returns {Object} Returns the new set.
	 */
	var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
	  return new Set(values);
	};

	module.exports = createSet;


/***/ },

/***/ 495:
/***/ function(module, exports) {

	/**
	 * This method returns `undefined`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.3.0
	 * @category Util
	 * @example
	 *
	 * _.times(2, _.noop);
	 * // => [undefined, undefined]
	 */
	function noop() {
	  // No operation performed.
	}

	module.exports = noop;


/***/ },

/***/ 497:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/* global window */
	'use strict';

	module.exports = __webpack_require__(498)(global || window || this);

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 498:
/***/ function(module, exports) {

	'use strict';

	module.exports = function symbolObservablePonyfill(root) {
		var result;
		var Symbol = root.Symbol;

		if (typeof Symbol === 'function') {
			if (Symbol.observable) {
				result = Symbol.observable;
			} else {
				result = Symbol('observable');
				Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}

		return result;
	};


/***/ },

/***/ 499:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.default = persistState;

	var _mapValues = __webpack_require__(500);

	var _mapValues2 = _interopRequireDefault(_mapValues);

	var _identity = __webpack_require__(483);

	var _identity2 = _interopRequireDefault(_identity);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function persistState(sessionId) {
	  var deserializeState = arguments.length <= 1 || arguments[1] === undefined ? _identity2.default : arguments[1];
	  var deserializeAction = arguments.length <= 2 || arguments[2] === undefined ? _identity2.default : arguments[2];

	  if (!sessionId) {
	    return function (next) {
	      return function () {
	        return next.apply(undefined, arguments);
	      };
	    };
	  }

	  function deserialize(state) {
	    return _extends({}, state, {
	      actionsById: (0, _mapValues2.default)(state.actionsById, function (liftedAction) {
	        return _extends({}, liftedAction, {
	          action: deserializeAction(liftedAction.action)
	        });
	      }),
	      committedState: deserializeState(state.committedState),
	      computedStates: state.computedStates.map(function (computedState) {
	        return _extends({}, computedState, {
	          state: deserializeState(computedState.state)
	        });
	      })
	    });
	  }

	  return function (next) {
	    return function (reducer, initialState, enhancer) {
	      var key = 'redux-dev-session-' + sessionId;

	      var finalInitialState = void 0;
	      try {
	        var json = localStorage.getItem(key);
	        if (json) {
	          finalInitialState = deserialize(JSON.parse(json)) || initialState;
	          next(reducer, initialState);
	        }
	      } catch (e) {
	        console.warn('Could not read debug session from localStorage:', e);
	        try {
	          localStorage.removeItem(key);
	        } finally {
	          finalInitialState = undefined;
	        }
	      }

	      var store = next(reducer, finalInitialState, enhancer);

	      return _extends({}, store, {
	        dispatch: function dispatch(action) {
	          store.dispatch(action);

	          try {
	            localStorage.setItem(key, JSON.stringify(store.getState()));
	          } catch (e) {
	            console.warn('Could not write debug session to localStorage:', e);
	          }

	          return action;
	        }
	      });
	    };
	  };
	}

/***/ },

/***/ 500:
/***/ function(module, exports, __webpack_require__) {

	var baseAssignValue = __webpack_require__(501),
	    baseForOwn = __webpack_require__(502),
	    baseIteratee = __webpack_require__(512);

	/**
	 * Creates an object with the same keys as `object` and values generated
	 * by running each own enumerable string keyed property of `object` thru
	 * `iteratee`. The iteratee is invoked with three arguments:
	 * (value, key, object).
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Object
	 * @param {Object} object The object to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @returns {Object} Returns the new mapped object.
	 * @see _.mapKeys
	 * @example
	 *
	 * var users = {
	 *   'fred':    { 'user': 'fred',    'age': 40 },
	 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
	 * };
	 *
	 * _.mapValues(users, function(o) { return o.age; });
	 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.mapValues(users, 'age');
	 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	 */
	function mapValues(object, iteratee) {
	  var result = {};
	  iteratee = baseIteratee(iteratee, 3);

	  baseForOwn(object, function(value, key, object) {
	    baseAssignValue(result, key, iteratee(value, key, object));
	  });
	  return result;
	}

	module.exports = mapValues;


/***/ },

/***/ 502:
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(503),
	    keys = __webpack_require__(505);

	/**
	 * The base implementation of `_.forOwn` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return object && baseFor(object, iteratee, keys);
	}

	module.exports = baseForOwn;


/***/ },

/***/ 503:
/***/ function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(504);

	/**
	 * The base implementation of `baseForOwn` which iterates over `object`
	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();

	module.exports = baseFor;


/***/ },

/***/ 504:
/***/ function(module, exports) {

	/**
	 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	module.exports = createBaseFor;


/***/ },

/***/ 512:
/***/ function(module, exports, __webpack_require__) {

	var baseMatches = __webpack_require__(513),
	    baseMatchesProperty = __webpack_require__(540),
	    identity = __webpack_require__(483),
	    isArray = __webpack_require__(481),
	    property = __webpack_require__(555);

	/**
	 * The base implementation of `_.iteratee`.
	 *
	 * @private
	 * @param {*} [value=_.identity] The value to convert to an iteratee.
	 * @returns {Function} Returns the iteratee.
	 */
	function baseIteratee(value) {
	  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
	  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
	  if (typeof value == 'function') {
	    return value;
	  }
	  if (value == null) {
	    return identity;
	  }
	  if (typeof value == 'object') {
	    return isArray(value)
	      ? baseMatchesProperty(value[0], value[1])
	      : baseMatches(value);
	  }
	  return property(value);
	}

	module.exports = baseIteratee;


/***/ },

/***/ 513:
/***/ function(module, exports, __webpack_require__) {

	var baseIsMatch = __webpack_require__(514),
	    getMatchData = __webpack_require__(537),
	    matchesStrictComparable = __webpack_require__(539);

	/**
	 * The base implementation of `_.matches` which doesn't clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatches(source) {
	  var matchData = getMatchData(source);
	  if (matchData.length == 1 && matchData[0][2]) {
	    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
	  }
	  return function(object) {
	    return object === source || baseIsMatch(object, source, matchData);
	  };
	}

	module.exports = baseMatches;


/***/ },

/***/ 514:
/***/ function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(515),
	    baseIsEqual = __webpack_require__(521);

	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;

	/**
	 * The base implementation of `_.isMatch` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Object} source The object of property values to match.
	 * @param {Array} matchData The property names, values, and compare flags to match.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, source, matchData, customizer) {
	  var index = matchData.length,
	      length = index,
	      noCustomizer = !customizer;

	  if (object == null) {
	    return !length;
	  }
	  object = Object(object);
	  while (index--) {
	    var data = matchData[index];
	    if ((noCustomizer && data[2])
	          ? data[1] !== object[data[0]]
	          : !(data[0] in object)
	        ) {
	      return false;
	    }
	  }
	  while (++index < length) {
	    data = matchData[index];
	    var key = data[0],
	        objValue = object[key],
	        srcValue = data[1];

	    if (noCustomizer && data[2]) {
	      if (objValue === undefined && !(key in object)) {
	        return false;
	      }
	    } else {
	      var stack = new Stack;
	      if (customizer) {
	        var result = customizer(objValue, srcValue, key, object, source, stack);
	      }
	      if (!(result === undefined
	            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
	            : result
	          )) {
	        return false;
	      }
	    }
	  }
	  return true;
	}

	module.exports = baseIsMatch;


/***/ },

/***/ 521:
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqualDeep = __webpack_require__(522),
	    isObject = __webpack_require__(436),
	    isObjectLike = __webpack_require__(188);

	/**
	 * The base implementation of `_.isEqual` which supports partial comparisons
	 * and tracks traversed objects.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {boolean} [bitmask] The bitmask of comparison flags.
	 *  The bitmask may be composed of the following flags:
	 *     1 - Unordered comparison
	 *     2 - Partial comparison
	 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, bitmask, stack) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
	}

	module.exports = baseIsEqual;


/***/ },

/***/ 522:
/***/ function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(515),
	    equalArrays = __webpack_require__(523),
	    equalByTag = __webpack_require__(525),
	    equalObjects = __webpack_require__(528),
	    getTag = __webpack_require__(529),
	    isArray = __webpack_require__(481),
	    isTypedArray = __webpack_require__(534);

	/** Used to compose bitmasks for comparison styles. */
	var PARTIAL_COMPARE_FLAG = 2;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag = '[object Object]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;

	  if (!objIsArr) {
	    objTag = getTag(object);
	    objTag = objTag == argsTag ? objectTag : objTag;
	  }
	  if (!othIsArr) {
	    othTag = getTag(other);
	    othTag = othTag == argsTag ? objectTag : othTag;
	  }
	  var objIsObj = objTag == objectTag,
	      othIsObj = othTag == objectTag,
	      isSameTag = objTag == othTag;

	  if (isSameTag && !objIsObj) {
	    stack || (stack = new Stack);
	    return (objIsArr || isTypedArray(object))
	      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
	      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
	  }
	  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	    if (objIsWrapped || othIsWrapped) {
	      var objUnwrapped = objIsWrapped ? object.value() : object,
	          othUnwrapped = othIsWrapped ? other.value() : other;

	      stack || (stack = new Stack);
	      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  stack || (stack = new Stack);
	  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
	}

	module.exports = baseIsEqualDeep;


/***/ },

/***/ 523:
/***/ function(module, exports, __webpack_require__) {

	var SetCache = __webpack_require__(427),
	    arraySome = __webpack_require__(524),
	    cacheHas = __webpack_require__(472);

	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `array` and `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
	  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	      arrLength = array.length,
	      othLength = other.length;

	  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(array);
	  if (stacked && stack.get(other)) {
	    return stacked == other;
	  }
	  var index = -1,
	      result = true,
	      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

	  stack.set(array, other);
	  stack.set(other, array);

	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, arrValue, index, other, array, stack)
	        : customizer(arrValue, othValue, index, array, other, stack);
	    }
	    if (compared !== undefined) {
	      if (compared) {
	        continue;
	      }
	      result = false;
	      break;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (seen) {
	      if (!arraySome(other, function(othValue, othIndex) {
	            if (!cacheHas(seen, othIndex) &&
	                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
	              return seen.push(othIndex);
	            }
	          })) {
	        result = false;
	        break;
	      }
	    } else if (!(
	          arrValue === othValue ||
	            equalFunc(arrValue, othValue, customizer, bitmask, stack)
	        )) {
	      result = false;
	      break;
	    }
	  }
	  stack['delete'](array);
	  stack['delete'](other);
	  return result;
	}

	module.exports = equalArrays;


/***/ },

/***/ 524:
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.some` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check,
	 *  else `false`.
	 */
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array ? array.length : 0;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	module.exports = arraySome;


/***/ },

/***/ 525:
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(476),
	    Uint8Array = __webpack_require__(526),
	    eq = __webpack_require__(451),
	    equalArrays = __webpack_require__(523),
	    mapToArray = __webpack_require__(527),
	    setToArray = __webpack_require__(496);

	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]';

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
	  switch (tag) {
	    case dataViewTag:
	      if ((object.byteLength != other.byteLength) ||
	          (object.byteOffset != other.byteOffset)) {
	        return false;
	      }
	      object = object.buffer;
	      other = other.buffer;

	    case arrayBufferTag:
	      if ((object.byteLength != other.byteLength) ||
	          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
	        return false;
	      }
	      return true;

	    case boolTag:
	    case dateTag:
	    case numberTag:
	      // Coerce booleans to `1` or `0` and dates to milliseconds.
	      // Invalid dates are coerced to `NaN`.
	      return eq(+object, +other);

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings, primitives and objects,
	      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
	      // for more details.
	      return object == (other + '');

	    case mapTag:
	      var convert = mapToArray;

	    case setTag:
	      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
	      convert || (convert = setToArray);

	      if (object.size != other.size && !isPartial) {
	        return false;
	      }
	      // Assume cyclic values are equal.
	      var stacked = stack.get(object);
	      if (stacked) {
	        return stacked == other;
	      }
	      bitmask |= UNORDERED_COMPARE_FLAG;

	      // Recursively compare objects (susceptible to call stack limits).
	      stack.set(object, other);
	      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
	      stack['delete'](object);
	      return result;

	    case symbolTag:
	      if (symbolValueOf) {
	        return symbolValueOf.call(object) == symbolValueOf.call(other);
	      }
	  }
	  return false;
	}

	module.exports = equalByTag;


/***/ },

/***/ 528:
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(505);

	/** Used to compose bitmasks for comparison styles. */
	var PARTIAL_COMPARE_FLAG = 2;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
	  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	      objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isPartial) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
	      return false;
	    }
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(object);
	  if (stacked && stack.get(other)) {
	    return stacked == other;
	  }
	  var result = true;
	  stack.set(object, other);
	  stack.set(other, object);

	  var skipCtor = isPartial;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, objValue, key, other, object, stack)
	        : customizer(objValue, othValue, key, object, other, stack);
	    }
	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(compared === undefined
	          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
	          : compared
	        )) {
	      result = false;
	      break;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (result && !skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      result = false;
	    }
	  }
	  stack['delete'](object);
	  stack['delete'](other);
	  return result;
	}

	module.exports = equalObjects;


/***/ },

/***/ 537:
/***/ function(module, exports, __webpack_require__) {

	var isStrictComparable = __webpack_require__(538),
	    keys = __webpack_require__(505);

	/**
	 * Gets the property names, values, and compare flags of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the match data of `object`.
	 */
	function getMatchData(object) {
	  var result = keys(object),
	      length = result.length;

	  while (length--) {
	    var key = result[length],
	        value = object[key];

	    result[length] = [key, value, isStrictComparable(value)];
	  }
	  return result;
	}

	module.exports = getMatchData;


/***/ },

/***/ 538:
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(436);

	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject(value);
	}

	module.exports = isStrictComparable;


/***/ },

/***/ 539:
/***/ function(module, exports) {

	/**
	 * A specialized version of `matchesProperty` for source values suitable
	 * for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function matchesStrictComparable(key, srcValue) {
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    return object[key] === srcValue &&
	      (srcValue !== undefined || (key in Object(object)));
	  };
	}

	module.exports = matchesStrictComparable;


/***/ },

/***/ 540:
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqual = __webpack_require__(521),
	    get = __webpack_require__(541),
	    hasIn = __webpack_require__(552),
	    isKey = __webpack_require__(550),
	    isStrictComparable = __webpack_require__(538),
	    matchesStrictComparable = __webpack_require__(539),
	    toKey = __webpack_require__(551);

	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;

	/**
	 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatchesProperty(path, srcValue) {
	  if (isKey(path) && isStrictComparable(srcValue)) {
	    return matchesStrictComparable(toKey(path), srcValue);
	  }
	  return function(object) {
	    var objValue = get(object, path);
	    return (objValue === undefined && objValue === srcValue)
	      ? hasIn(object, path)
	      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
	  };
	}

	module.exports = baseMatchesProperty;


/***/ },

/***/ 541:
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(542);

	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined`, the `defaultValue` is returned in its place.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  var result = object == null ? undefined : baseGet(object, path);
	  return result === undefined ? defaultValue : result;
	}

	module.exports = get;


/***/ },

/***/ 542:
/***/ function(module, exports, __webpack_require__) {

	var castPath = __webpack_require__(543),
	    isKey = __webpack_require__(550),
	    toKey = __webpack_require__(551);

	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = isKey(path, object) ? [path] : castPath(path);

	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}

	module.exports = baseGet;


/***/ },

/***/ 543:
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(481),
	    stringToPath = __webpack_require__(544);

	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath(value) {
	  return isArray(value) ? value : stringToPath(value);
	}

	module.exports = castPath;


/***/ },

/***/ 544:
/***/ function(module, exports, __webpack_require__) {

	var memoizeCapped = __webpack_require__(545),
	    toString = __webpack_require__(547);

	/** Used to match property names within property paths. */
	var reLeadingDot = /^\./,
	    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath = memoizeCapped(function(string) {
	  string = toString(string);

	  var result = [];
	  if (reLeadingDot.test(string)) {
	    result.push('');
	  }
	  string.replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	module.exports = stringToPath;


/***/ },

/***/ 545:
/***/ function(module, exports, __webpack_require__) {

	var memoize = __webpack_require__(546);

	/** Used as the maximum memoize cache size. */
	var MAX_MEMOIZE_SIZE = 500;

	/**
	 * A specialized version of `_.memoize` which clears the memoized function's
	 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
	 *
	 * @private
	 * @param {Function} func The function to have its output memoized.
	 * @returns {Function} Returns the new memoized function.
	 */
	function memoizeCapped(func) {
	  var result = memoize(func, function(key) {
	    if (cache.size === MAX_MEMOIZE_SIZE) {
	      cache.clear();
	    }
	    return key;
	  });

	  var cache = result.cache;
	  return result;
	}

	module.exports = memoizeCapped;


/***/ },

/***/ 546:
/***/ function(module, exports, __webpack_require__) {

	var MapCache = __webpack_require__(428);

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided, it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is used as the map cache key. The `func`
	 * is invoked with the `this` binding of the memoized function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the
	 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `delete`, `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoized function.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': 2 };
	 * var other = { 'c': 3, 'd': 4 };
	 *
	 * var values = _.memoize(_.values);
	 * values(object);
	 * // => [1, 2]
	 *
	 * values(other);
	 * // => [3, 4]
	 *
	 * object.a = 2;
	 * values(object);
	 * // => [1, 2]
	 *
	 * // Modify the result cache.
	 * values.cache.set(object, ['a', 'b']);
	 * values(object);
	 * // => ['a', 'b']
	 *
	 * // Replace `_.memoize.Cache`.
	 * _.memoize.Cache = WeakMap;
	 */
	function memoize(func, resolver) {
	  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var memoized = function() {
	    var args = arguments,
	        key = resolver ? resolver.apply(this, args) : args[0],
	        cache = memoized.cache;

	    if (cache.has(key)) {
	      return cache.get(key);
	    }
	    var result = func.apply(this, args);
	    memoized.cache = cache.set(key, result) || cache;
	    return result;
	  };
	  memoized.cache = new (memoize.Cache || MapCache);
	  return memoized;
	}

	// Expose `MapCache`.
	memoize.Cache = MapCache;

	module.exports = memoize;


/***/ },

/***/ 547:
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(548);

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : baseToString(value);
	}

	module.exports = toString;


/***/ },

/***/ 548:
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(476),
	    isSymbol = __webpack_require__(549);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	module.exports = baseToString;


/***/ },

/***/ 550:
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(481),
	    isSymbol = __webpack_require__(549);

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  if (isArray(value)) {
	    return false;
	  }
	  var type = typeof value;
	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	      value == null || isSymbol(value)) {
	    return true;
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object));
	}

	module.exports = isKey;


/***/ },

/***/ 551:
/***/ function(module, exports, __webpack_require__) {

	var isSymbol = __webpack_require__(549);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey(value) {
	  if (typeof value == 'string' || isSymbol(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	module.exports = toKey;


/***/ },

/***/ 552:
/***/ function(module, exports, __webpack_require__) {

	var baseHasIn = __webpack_require__(553),
	    hasPath = __webpack_require__(554);

	/**
	 * Checks if `path` is a direct or inherited property of `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 * @example
	 *
	 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
	 *
	 * _.hasIn(object, 'a');
	 * // => true
	 *
	 * _.hasIn(object, 'a.b');
	 * // => true
	 *
	 * _.hasIn(object, ['a', 'b']);
	 * // => true
	 *
	 * _.hasIn(object, 'b');
	 * // => false
	 */
	function hasIn(object, path) {
	  return object != null && hasPath(object, path, baseHasIn);
	}

	module.exports = hasIn;


/***/ },

/***/ 553:
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.hasIn` without support for deep paths.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHasIn(object, key) {
	  return object != null && key in Object(object);
	}

	module.exports = baseHasIn;


/***/ },

/***/ 554:
/***/ function(module, exports, __webpack_require__) {

	var castPath = __webpack_require__(543),
	    isArguments = __webpack_require__(477),
	    isArray = __webpack_require__(481),
	    isIndex = __webpack_require__(508),
	    isKey = __webpack_require__(550),
	    isLength = __webpack_require__(480),
	    toKey = __webpack_require__(551);

	/**
	 * Checks if `path` exists on `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @param {Function} hasFunc The function to check properties.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 */
	function hasPath(object, path, hasFunc) {
	  path = isKey(path, object) ? [path] : castPath(path);

	  var index = -1,
	      length = path.length,
	      result = false;

	  while (++index < length) {
	    var key = toKey(path[index]);
	    if (!(result = object != null && hasFunc(object, key))) {
	      break;
	    }
	    object = object[key];
	  }
	  if (result || ++index != length) {
	    return result;
	  }
	  length = object ? object.length : 0;
	  return !!length && isLength(length) && isIndex(key, length) &&
	    (isArray(object) || isArguments(object));
	}

	module.exports = hasPath;


/***/ },

/***/ 555:
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(556),
	    basePropertyDeep = __webpack_require__(557),
	    isKey = __webpack_require__(550),
	    toKey = __webpack_require__(551);

	/**
	 * Creates a function that returns the value at `path` of a given object.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': 2 } },
	 *   { 'a': { 'b': 1 } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b'));
	 * // => [2, 1]
	 *
	 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
	 * // => [1, 2]
	 */
	function property(path) {
	  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
	}

	module.exports = property;


/***/ },

/***/ 556:
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	module.exports = baseProperty;


/***/ },

/***/ 557:
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(542);

	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function basePropertyDeep(path) {
	  return function(object) {
	    return baseGet(object, path);
	  };
	}

	module.exports = basePropertyDeep;


/***/ },

/***/ 558:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.default = createDevTools;

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(176);

	var _reduxDevtoolsInstrument = __webpack_require__(424);

	var _reduxDevtoolsInstrument2 = _interopRequireDefault(_reduxDevtoolsInstrument);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function createDevTools(children) {
	  var _class, _temp;

	  var monitorElement = _react.Children.only(children);
	  var monitorProps = monitorElement.props;
	  var Monitor = monitorElement.type;
	  var ConnectedMonitor = (0, _reactRedux.connect)(function (state) {
	    return state;
	  })(Monitor);

	  return _temp = _class = function (_Component) {
	    _inherits(DevTools, _Component);

	    function DevTools(props, context) {
	      _classCallCheck(this, DevTools);

	      var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

	      if (!props.store && !context.store) {
	        console.error('Redux DevTools could not render. You must pass the Redux store ' + 'to <DevTools> either as a "store" prop or by wrapping it in a ' + '<Provider store={store}>.');
	        return _possibleConstructorReturn(_this);
	      }

	      if (context.store) {
	        _this.liftedStore = context.store.liftedStore;
	      } else {
	        _this.liftedStore = props.store.liftedStore;
	      }

	      if (!_this.liftedStore) {
	        console.error('Redux DevTools could not render. Did you forget to include ' + 'DevTools.instrument() in your store enhancer chain before ' + 'using createStore()?');
	      }
	      return _this;
	    }

	    DevTools.prototype.render = function render() {
	      if (!this.liftedStore) {
	        return null;
	      }

	      return _react2.default.createElement(ConnectedMonitor, _extends({}, monitorProps, {
	        store: this.liftedStore }));
	    };

	    return DevTools;
	  }(_react.Component), _class.contextTypes = {
	    store: _react.PropTypes.object
	  }, _class.propTypes = {
	    store: _react.PropTypes.object
	  }, _class.instrument = function (options) {
	    return (0, _reduxDevtoolsInstrument2.default)(function (state, action) {
	      return Monitor.update(monitorProps, state, action);
	    }, options);
	  }, _temp;
	}

/***/ },

/***/ 559:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.default = undefined;

	var _LogMonitor = __webpack_require__(560);

	var _LogMonitor2 = _interopRequireDefault(_LogMonitor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _LogMonitor2.default;

/***/ },

/***/ 560:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.__esModule = true;

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _LogMonitorButton = __webpack_require__(561);

	var _LogMonitorButton2 = _interopRequireDefault(_LogMonitorButton);

	var _function = __webpack_require__(563);

	var _function2 = _interopRequireDefault(_function);

	var _reduxDevtoolsThemes = __webpack_require__(565);

	var themes = _interopRequireWildcard(_reduxDevtoolsThemes);

	var _reduxDevtools = __webpack_require__(423);

	var _actions = __webpack_require__(605);

	var _reducers = __webpack_require__(606);

	var _reducers2 = _interopRequireDefault(_reducers);

	var _LogMonitorEntryList = __webpack_require__(607);

	var _LogMonitorEntryList2 = _interopRequireDefault(_LogMonitorEntryList);

	var _lodash = __webpack_require__(729);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var reset = _reduxDevtools.ActionCreators.reset;
	var rollback = _reduxDevtools.ActionCreators.rollback;
	var commit = _reduxDevtools.ActionCreators.commit;
	var sweep = _reduxDevtools.ActionCreators.sweep;
	var toggleAction = _reduxDevtools.ActionCreators.toggleAction;

	var styles = {
	  container: {
	    fontFamily: 'monaco, Consolas, Lucida Console, monospace',
	    position: 'relative',
	    overflowY: 'hidden',
	    width: '100%',
	    height: '100%',
	    minWidth: 300,
	    direction: 'ltr'
	  },
	  buttonBar: {
	    textAlign: 'center',
	    borderBottomWidth: 1,
	    borderBottomStyle: 'solid',
	    borderColor: 'transparent',
	    zIndex: 1,
	    display: 'flex',
	    flexDirection: 'row'
	  },
	  elements: {
	    position: 'absolute',
	    left: 0,
	    right: 0,
	    top: 38,
	    bottom: 0,
	    overflowX: 'hidden',
	    overflowY: 'auto'
	  }
	};

	var LogMonitor = (function (_Component) {
	  _inherits(LogMonitor, _Component);

	  function LogMonitor(props) {
	    _classCallCheck(this, LogMonitor);

	    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

	    _this.shouldComponentUpdate = _function2.default;
	    _this.updateScrollTop = (0, _lodash2.default)(function () {
	      var node = _this.refs.container;
	      _this.props.dispatch((0, _actions.updateScrollTop)(node ? node.scrollTop : 0));
	    }, 500);

	    _this.handleToggleAction = _this.handleToggleAction.bind(_this);
	    _this.handleReset = _this.handleReset.bind(_this);
	    _this.handleRollback = _this.handleRollback.bind(_this);
	    _this.handleSweep = _this.handleSweep.bind(_this);
	    _this.handleCommit = _this.handleCommit.bind(_this);
	    return _this;
	  }

	  LogMonitor.prototype.scroll = function scroll() {
	    var node = this.refs.container;
	    if (!node) {
	      return;
	    }
	    if (this.scrollDown) {
	      var offsetHeight = node.offsetHeight;
	      var scrollHeight = node.scrollHeight;

	      node.scrollTop = scrollHeight - offsetHeight;
	      this.scrollDown = false;
	    }
	  };

	  LogMonitor.prototype.componentDidMount = function componentDidMount() {
	    var node = this.refs.container;
	    if (!node || !this.props.monitorState) {
	      return;
	    }

	    if (this.props.preserveScrollTop) {
	      node.scrollTop = this.props.monitorState.initialScrollTop;
	      node.addEventListener('scroll', this.updateScrollTop);
	    } else {
	      this.scrollDown = true;
	      this.scroll();
	    }
	  };

	  LogMonitor.prototype.componentWillUnmount = function componentWillUnmount() {
	    var node = this.refs.container;
	    if (node && this.props.preserveScrollTop) {
	      node.removeEventListener('scroll', this.updateScrollTop);
	    }
	  };

	  LogMonitor.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    var node = this.refs.container;
	    if (!node) {
	      this.scrollDown = true;
	    } else if (this.props.stagedActionIds.length < nextProps.stagedActionIds.length) {
	      var scrollTop = node.scrollTop;
	      var offsetHeight = node.offsetHeight;
	      var scrollHeight = node.scrollHeight;

	      this.scrollDown = Math.abs(scrollHeight - (scrollTop + offsetHeight)) < 20;
	    } else {
	      this.scrollDown = false;
	    }
	  };

	  LogMonitor.prototype.componentDidUpdate = function componentDidUpdate() {
	    this.scroll();
	  };

	  LogMonitor.prototype.handleRollback = function handleRollback() {
	    this.props.dispatch(rollback());
	  };

	  LogMonitor.prototype.handleSweep = function handleSweep() {
	    this.props.dispatch(sweep());
	  };

	  LogMonitor.prototype.handleCommit = function handleCommit() {
	    this.props.dispatch(commit());
	  };

	  LogMonitor.prototype.handleToggleAction = function handleToggleAction(id) {
	    this.props.dispatch(toggleAction(id));
	  };

	  LogMonitor.prototype.handleReset = function handleReset() {
	    this.props.dispatch(reset());
	  };

	  LogMonitor.prototype.getTheme = function getTheme() {
	    var theme = this.props.theme;

	    if (typeof theme !== 'string') {
	      return theme;
	    }

	    if (typeof themes[theme] !== 'undefined') {
	      return themes[theme];
	    }

	    console.warn('DevTools theme ' + theme + ' not found, defaulting to nicinabox');
	    return themes.nicinabox;
	  };

	  LogMonitor.prototype.render = function render() {
	    var theme = this.getTheme();
	    var _props = this.props;
	    var actionsById = _props.actionsById;
	    var skippedActionIds = _props.skippedActionIds;
	    var stagedActionIds = _props.stagedActionIds;
	    var computedStates = _props.computedStates;
	    var select = _props.select;
	    var expandActionRoot = _props.expandActionRoot;
	    var expandStateRoot = _props.expandStateRoot;

	    var entryListProps = {
	      theme: theme,
	      actionsById: actionsById,
	      skippedActionIds: skippedActionIds,
	      stagedActionIds: stagedActionIds,
	      computedStates: computedStates,
	      select: select,
	      expandActionRoot: expandActionRoot,
	      expandStateRoot: expandStateRoot,
	      onActionClick: this.handleToggleAction
	    };

	    return _react2.default.createElement(
	      'div',
	      { style: _extends({}, styles.container, { backgroundColor: theme.base00 }) },
	      _react2.default.createElement(
	        'div',
	        { style: _extends({}, styles.buttonBar, { borderColor: theme.base02 }) },
	        _react2.default.createElement(
	          _LogMonitorButton2.default,
	          {
	            theme: theme,
	            onClick: this.handleReset,
	            enabled: true },
	          'Reset'
	        ),
	        _react2.default.createElement(
	          _LogMonitorButton2.default,
	          {
	            theme: theme,
	            onClick: this.handleRollback,
	            enabled: computedStates.length > 1 },
	          'Revert'
	        ),
	        _react2.default.createElement(
	          _LogMonitorButton2.default,
	          {
	            theme: theme,
	            onClick: this.handleSweep,
	            enabled: skippedActionIds.length > 0 },
	          'Sweep'
	        ),
	        _react2.default.createElement(
	          _LogMonitorButton2.default,
	          {
	            theme: theme,
	            onClick: this.handleCommit,
	            enabled: computedStates.length > 1 },
	          'Commit'
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        { style: styles.elements, ref: 'container' },
	        _react2.default.createElement(_LogMonitorEntryList2.default, entryListProps)
	      )
	    );
	  };

	  return LogMonitor;
	})(_react.Component);

	LogMonitor.update = _reducers2.default;
	LogMonitor.propTypes = {
	  dispatch: _react.PropTypes.func,
	  computedStates: _react.PropTypes.array,
	  actionsById: _react.PropTypes.object,
	  stagedActionIds: _react.PropTypes.array,
	  skippedActionIds: _react.PropTypes.array,
	  monitorState: _react.PropTypes.shape({
	    initialScrollTop: _react.PropTypes.number
	  }),

	  preserveScrollTop: _react.PropTypes.bool,
	  select: _react.PropTypes.func.isRequired,
	  theme: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.string]),
	  expandActionRoot: _react.PropTypes.bool,
	  expandStateRoot: _react.PropTypes.bool
	};
	LogMonitor.defaultProps = {
	  select: function select(state) {
	    return state;
	  },
	  theme: 'nicinabox',
	  preserveScrollTop: true,
	  expandActionRoot: true,
	  expandStateRoot: true
	};
	exports.default = LogMonitor;

/***/ },

/***/ 561:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.__esModule = true;

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _brighten = __webpack_require__(562);

	var _brighten2 = _interopRequireDefault(_brighten);

	var _function = __webpack_require__(563);

	var _function2 = _interopRequireDefault(_function);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var styles = {
	  base: {
	    cursor: 'pointer',
	    fontWeight: 'bold',
	    borderRadius: 3,
	    padding: 4,
	    marginLeft: 3,
	    marginRight: 3,
	    marginTop: 5,
	    marginBottom: 5,
	    flexGrow: 1,
	    display: 'inline-block',
	    fontSize: '0.8em',
	    color: 'white',
	    textDecoration: 'none'
	  }
	};

	var LogMonitorButton = (function (_React$Component) {
	  _inherits(LogMonitorButton, _React$Component);

	  function LogMonitorButton(props) {
	    _classCallCheck(this, LogMonitorButton);

	    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

	    _this.shouldComponentUpdate = _function2.default;

	    _this.handleMouseEnter = _this.handleMouseEnter.bind(_this);
	    _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
	    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
	    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
	    _this.onClick = _this.onClick.bind(_this);

	    _this.state = {
	      hovered: false,
	      active: false
	    };
	    return _this;
	  }

	  LogMonitorButton.prototype.handleMouseEnter = function handleMouseEnter() {
	    this.setState({ hovered: true });
	  };

	  LogMonitorButton.prototype.handleMouseLeave = function handleMouseLeave() {
	    this.setState({ hovered: false });
	  };

	  LogMonitorButton.prototype.handleMouseDown = function handleMouseDown() {
	    this.setState({ active: true });
	  };

	  LogMonitorButton.prototype.handleMouseUp = function handleMouseUp() {
	    this.setState({ active: false });
	  };

	  LogMonitorButton.prototype.onClick = function onClick() {
	    if (!this.props.enabled) {
	      return;
	    }
	    if (this.props.onClick) {
	      this.props.onClick();
	    }
	  };

	  LogMonitorButton.prototype.render = function render() {
	    var style = _extends({}, styles.base, {
	      backgroundColor: this.props.theme.base02
	    });
	    if (this.props.enabled && this.state.hovered) {
	      style = _extends({}, style, {
	        backgroundColor: (0, _brighten2.default)(this.props.theme.base02, 0.2)
	      });
	    }
	    if (!this.props.enabled) {
	      style = _extends({}, style, {
	        opacity: 0.2,
	        cursor: 'text',
	        backgroundColor: 'transparent'
	      });
	    }
	    return _react2.default.createElement(
	      'a',
	      { onMouseEnter: this.handleMouseEnter,
	        onMouseLeave: this.handleMouseLeave,
	        onMouseDown: this.handleMouseDown,
	        onMouseUp: this.handleMouseUp,
	        onClick: this.onClick,
	        style: style },
	      this.props.children
	    );
	  };

	  return LogMonitorButton;
	})(_react2.default.Component);

	exports.default = LogMonitorButton;

/***/ },

/***/ 562:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	exports.default = function (hexColor, lightness) {
	  var hex = String(hexColor).replace(/[^0-9a-f]/gi, '');
	  if (hex.length < 6) {
	    hex = hex.replace(/(.)/g, '$1$1');
	  }
	  var lum = lightness || 0;

	  var rgb = '#';
	  var c = undefined;
	  for (var i = 0; i < 3; ++i) {
	    c = parseInt(hex.substr(i * 2, 2), 16);
	    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
	    rgb += ('00' + c).substr(c.length);
	  }
	  return rgb;
	};

/***/ },

/***/ 563:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = shouldPureComponentUpdate;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _shallowEqual = __webpack_require__(564);

	var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

	function shouldPureComponentUpdate(nextProps, nextState) {
	  return !(0, _shallowEqual2['default'])(this.props, nextProps) || !(0, _shallowEqual2['default'])(this.state, nextState);
	}

	module.exports = exports['default'];

/***/ },

/***/ 564:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = shallowEqual;

	function shallowEqual(objA, objB) {
	  if (objA === objB) {
	    return true;
	  }

	  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
	    return false;
	  }

	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);

	  if (keysA.length !== keysB.length) {
	    return false;
	  }

	  // Test for A's keys different from B.
	  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
	  for (var i = 0; i < keysA.length; i++) {
	    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
	      return false;
	    }
	  }

	  return true;
	}

	module.exports = exports['default'];

/***/ },

/***/ 565:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

	function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

	var _base16 = __webpack_require__(566);

	_defaults(exports, _interopExportWildcard(_base16, _defaults));

	var _nicinabox = __webpack_require__(604);

	exports.nicinabox = _interopRequire(_nicinabox);

/***/ },

/***/ 566:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

	var _threezerotwofour = __webpack_require__(567);

	exports.threezerotwofour = _interopRequire(_threezerotwofour);

	var _apathy = __webpack_require__(568);

	exports.apathy = _interopRequire(_apathy);

	var _ashes = __webpack_require__(569);

	exports.ashes = _interopRequire(_ashes);

	var _atelierDune = __webpack_require__(570);

	exports.atelierDune = _interopRequire(_atelierDune);

	var _atelierForest = __webpack_require__(571);

	exports.atelierForest = _interopRequire(_atelierForest);

	var _atelierHeath = __webpack_require__(572);

	exports.atelierHeath = _interopRequire(_atelierHeath);

	var _atelierLakeside = __webpack_require__(573);

	exports.atelierLakeside = _interopRequire(_atelierLakeside);

	var _atelierSeaside = __webpack_require__(574);

	exports.atelierSeaside = _interopRequire(_atelierSeaside);

	var _bespin = __webpack_require__(575);

	exports.bespin = _interopRequire(_bespin);

	var _brewer = __webpack_require__(576);

	exports.brewer = _interopRequire(_brewer);

	var _bright = __webpack_require__(577);

	exports.bright = _interopRequire(_bright);

	var _chalk = __webpack_require__(578);

	exports.chalk = _interopRequire(_chalk);

	var _codeschool = __webpack_require__(579);

	exports.codeschool = _interopRequire(_codeschool);

	var _colors = __webpack_require__(580);

	exports.colors = _interopRequire(_colors);

	var _default = __webpack_require__(581);

	exports['default'] = _interopRequire(_default);

	var _eighties = __webpack_require__(582);

	exports.eighties = _interopRequire(_eighties);

	var _embers = __webpack_require__(583);

	exports.embers = _interopRequire(_embers);

	var _flat = __webpack_require__(584);

	exports.flat = _interopRequire(_flat);

	var _google = __webpack_require__(585);

	exports.google = _interopRequire(_google);

	var _grayscale = __webpack_require__(586);

	exports.grayscale = _interopRequire(_grayscale);

	var _greenscreen = __webpack_require__(587);

	exports.greenscreen = _interopRequire(_greenscreen);

	var _harmonic = __webpack_require__(588);

	exports.harmonic = _interopRequire(_harmonic);

	var _hopscotch = __webpack_require__(589);

	exports.hopscotch = _interopRequire(_hopscotch);

	var _isotope = __webpack_require__(590);

	exports.isotope = _interopRequire(_isotope);

	var _marrakesh = __webpack_require__(591);

	exports.marrakesh = _interopRequire(_marrakesh);

	var _mocha = __webpack_require__(592);

	exports.mocha = _interopRequire(_mocha);

	var _monokai = __webpack_require__(593);

	exports.monokai = _interopRequire(_monokai);

	var _ocean = __webpack_require__(594);

	exports.ocean = _interopRequire(_ocean);

	var _paraiso = __webpack_require__(595);

	exports.paraiso = _interopRequire(_paraiso);

	var _pop = __webpack_require__(596);

	exports.pop = _interopRequire(_pop);

	var _railscasts = __webpack_require__(597);

	exports.railscasts = _interopRequire(_railscasts);

	var _shapeshifter = __webpack_require__(598);

	exports.shapeshifter = _interopRequire(_shapeshifter);

	var _solarized = __webpack_require__(599);

	exports.solarized = _interopRequire(_solarized);

	var _summerfruit = __webpack_require__(600);

	exports.summerfruit = _interopRequire(_summerfruit);

	var _tomorrow = __webpack_require__(601);

	exports.tomorrow = _interopRequire(_tomorrow);

	var _tube = __webpack_require__(602);

	exports.tube = _interopRequire(_tube);

	var _twilight = __webpack_require__(603);

	exports.twilight = _interopRequire(_twilight);

/***/ },

/***/ 567:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'threezerotwofour',
	  author: 'jan t. sott (http://github.com/idleberg)',
	  base00: '#090300',
	  base01: '#3a3432',
	  base02: '#4a4543',
	  base03: '#5c5855',
	  base04: '#807d7c',
	  base05: '#a5a2a2',
	  base06: '#d6d5d4',
	  base07: '#f7f7f7',
	  base08: '#db2d20',
	  base09: '#e8bbd0',
	  base0A: '#fded02',
	  base0B: '#01a252',
	  base0C: '#b5e4f4',
	  base0D: '#01a0e4',
	  base0E: '#a16a94',
	  base0F: '#cdab53'
	};
	module.exports = exports['default'];

/***/ },

/***/ 568:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'apathy',
	  author: 'jannik siebert (https://github.com/janniks)',
	  base00: '#031A16',
	  base01: '#0B342D',
	  base02: '#184E45',
	  base03: '#2B685E',
	  base04: '#5F9C92',
	  base05: '#81B5AC',
	  base06: '#A7CEC8',
	  base07: '#D2E7E4',
	  base08: '#3E9688',
	  base09: '#3E7996',
	  base0A: '#3E4C96',
	  base0B: '#883E96',
	  base0C: '#963E4C',
	  base0D: '#96883E',
	  base0E: '#4C963E',
	  base0F: '#3E965B'
	};
	module.exports = exports['default'];

/***/ },

/***/ 569:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'ashes',
	  author: 'jannik siebert (https://github.com/janniks)',
	  base00: '#1C2023',
	  base01: '#393F45',
	  base02: '#565E65',
	  base03: '#747C84',
	  base04: '#ADB3BA',
	  base05: '#C7CCD1',
	  base06: '#DFE2E5',
	  base07: '#F3F4F5',
	  base08: '#C7AE95',
	  base09: '#C7C795',
	  base0A: '#AEC795',
	  base0B: '#95C7AE',
	  base0C: '#95AEC7',
	  base0D: '#AE95C7',
	  base0E: '#C795AE',
	  base0F: '#C79595'
	};
	module.exports = exports['default'];

/***/ },

/***/ 570:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier dune',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/dune)',
	  base00: '#20201d',
	  base01: '#292824',
	  base02: '#6e6b5e',
	  base03: '#7d7a68',
	  base04: '#999580',
	  base05: '#a6a28c',
	  base06: '#e8e4cf',
	  base07: '#fefbec',
	  base08: '#d73737',
	  base09: '#b65611',
	  base0A: '#cfb017',
	  base0B: '#60ac39',
	  base0C: '#1fad83',
	  base0D: '#6684e1',
	  base0E: '#b854d4',
	  base0F: '#d43552'
	};
	module.exports = exports['default'];

/***/ },

/***/ 571:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier forest',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/forest)',
	  base00: '#1b1918',
	  base01: '#2c2421',
	  base02: '#68615e',
	  base03: '#766e6b',
	  base04: '#9c9491',
	  base05: '#a8a19f',
	  base06: '#e6e2e0',
	  base07: '#f1efee',
	  base08: '#f22c40',
	  base09: '#df5320',
	  base0A: '#d5911a',
	  base0B: '#5ab738',
	  base0C: '#00ad9c',
	  base0D: '#407ee7',
	  base0E: '#6666ea',
	  base0F: '#c33ff3'
	};
	module.exports = exports['default'];

/***/ },

/***/ 572:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier heath',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/heath)',
	  base00: '#1b181b',
	  base01: '#292329',
	  base02: '#695d69',
	  base03: '#776977',
	  base04: '#9e8f9e',
	  base05: '#ab9bab',
	  base06: '#d8cad8',
	  base07: '#f7f3f7',
	  base08: '#ca402b',
	  base09: '#a65926',
	  base0A: '#bb8a35',
	  base0B: '#379a37',
	  base0C: '#159393',
	  base0D: '#516aec',
	  base0E: '#7b59c0',
	  base0F: '#cc33cc'
	};
	module.exports = exports['default'];

/***/ },

/***/ 573:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier lakeside',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/lakeside/)',
	  base00: '#161b1d',
	  base01: '#1f292e',
	  base02: '#516d7b',
	  base03: '#5a7b8c',
	  base04: '#7195a8',
	  base05: '#7ea2b4',
	  base06: '#c1e4f6',
	  base07: '#ebf8ff',
	  base08: '#d22d72',
	  base09: '#935c25',
	  base0A: '#8a8a0f',
	  base0B: '#568c3b',
	  base0C: '#2d8f6f',
	  base0D: '#257fad',
	  base0E: '#5d5db1',
	  base0F: '#b72dd2'
	};
	module.exports = exports['default'];

/***/ },

/***/ 574:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier seaside',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/seaside/)',
	  base00: '#131513',
	  base01: '#242924',
	  base02: '#5e6e5e',
	  base03: '#687d68',
	  base04: '#809980',
	  base05: '#8ca68c',
	  base06: '#cfe8cf',
	  base07: '#f0fff0',
	  base08: '#e6193c',
	  base09: '#87711d',
	  base0A: '#c3c322',
	  base0B: '#29a329',
	  base0C: '#1999b3',
	  base0D: '#3d62f5',
	  base0E: '#ad2bee',
	  base0F: '#e619c3'
	};
	module.exports = exports['default'];

/***/ },

/***/ 575:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'bespin',
	  author: 'jan t. sott',
	  base00: '#28211c',
	  base01: '#36312e',
	  base02: '#5e5d5c',
	  base03: '#666666',
	  base04: '#797977',
	  base05: '#8a8986',
	  base06: '#9d9b97',
	  base07: '#baae9e',
	  base08: '#cf6a4c',
	  base09: '#cf7d34',
	  base0A: '#f9ee98',
	  base0B: '#54be0d',
	  base0C: '#afc4db',
	  base0D: '#5ea6ea',
	  base0E: '#9b859d',
	  base0F: '#937121'
	};
	module.exports = exports['default'];

/***/ },

/***/ 576:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'brewer',
	  author: 'timothée poisot (http://github.com/tpoisot)',
	  base00: '#0c0d0e',
	  base01: '#2e2f30',
	  base02: '#515253',
	  base03: '#737475',
	  base04: '#959697',
	  base05: '#b7b8b9',
	  base06: '#dadbdc',
	  base07: '#fcfdfe',
	  base08: '#e31a1c',
	  base09: '#e6550d',
	  base0A: '#dca060',
	  base0B: '#31a354',
	  base0C: '#80b1d3',
	  base0D: '#3182bd',
	  base0E: '#756bb1',
	  base0F: '#b15928'
	};
	module.exports = exports['default'];

/***/ },

/***/ 577:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'bright',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#000000',
	  base01: '#303030',
	  base02: '#505050',
	  base03: '#b0b0b0',
	  base04: '#d0d0d0',
	  base05: '#e0e0e0',
	  base06: '#f5f5f5',
	  base07: '#ffffff',
	  base08: '#fb0120',
	  base09: '#fc6d24',
	  base0A: '#fda331',
	  base0B: '#a1c659',
	  base0C: '#76c7b7',
	  base0D: '#6fb3d2',
	  base0E: '#d381c3',
	  base0F: '#be643c'
	};
	module.exports = exports['default'];

/***/ },

/***/ 578:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'chalk',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#151515',
	  base01: '#202020',
	  base02: '#303030',
	  base03: '#505050',
	  base04: '#b0b0b0',
	  base05: '#d0d0d0',
	  base06: '#e0e0e0',
	  base07: '#f5f5f5',
	  base08: '#fb9fb1',
	  base09: '#eda987',
	  base0A: '#ddb26f',
	  base0B: '#acc267',
	  base0C: '#12cfc0',
	  base0D: '#6fc2ef',
	  base0E: '#e1a3ee',
	  base0F: '#deaf8f'
	};
	module.exports = exports['default'];

/***/ },

/***/ 579:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'codeschool',
	  author: 'brettof86',
	  base00: '#232c31',
	  base01: '#1c3657',
	  base02: '#2a343a',
	  base03: '#3f4944',
	  base04: '#84898c',
	  base05: '#9ea7a6',
	  base06: '#a7cfa3',
	  base07: '#b5d8f6',
	  base08: '#2a5491',
	  base09: '#43820d',
	  base0A: '#a03b1e',
	  base0B: '#237986',
	  base0C: '#b02f30',
	  base0D: '#484d79',
	  base0E: '#c59820',
	  base0F: '#c98344'
	};
	module.exports = exports['default'];

/***/ },

/***/ 580:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'colors',
	  author: 'mrmrs (http://clrs.cc)',
	  base00: '#111111',
	  base01: '#333333',
	  base02: '#555555',
	  base03: '#777777',
	  base04: '#999999',
	  base05: '#bbbbbb',
	  base06: '#dddddd',
	  base07: '#ffffff',
	  base08: '#ff4136',
	  base09: '#ff851b',
	  base0A: '#ffdc00',
	  base0B: '#2ecc40',
	  base0C: '#7fdbff',
	  base0D: '#0074d9',
	  base0E: '#b10dc9',
	  base0F: '#85144b'
	};
	module.exports = exports['default'];

/***/ },

/***/ 581:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'default',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#181818',
	  base01: '#282828',
	  base02: '#383838',
	  base03: '#585858',
	  base04: '#b8b8b8',
	  base05: '#d8d8d8',
	  base06: '#e8e8e8',
	  base07: '#f8f8f8',
	  base08: '#ab4642',
	  base09: '#dc9656',
	  base0A: '#f7ca88',
	  base0B: '#a1b56c',
	  base0C: '#86c1b9',
	  base0D: '#7cafc2',
	  base0E: '#ba8baf',
	  base0F: '#a16946'
	};
	module.exports = exports['default'];

/***/ },

/***/ 582:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'eighties',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#2d2d2d',
	  base01: '#393939',
	  base02: '#515151',
	  base03: '#747369',
	  base04: '#a09f93',
	  base05: '#d3d0c8',
	  base06: '#e8e6df',
	  base07: '#f2f0ec',
	  base08: '#f2777a',
	  base09: '#f99157',
	  base0A: '#ffcc66',
	  base0B: '#99cc99',
	  base0C: '#66cccc',
	  base0D: '#6699cc',
	  base0E: '#cc99cc',
	  base0F: '#d27b53'
	};
	module.exports = exports['default'];

/***/ },

/***/ 583:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'embers',
	  author: 'jannik siebert (https://github.com/janniks)',
	  base00: '#16130F',
	  base01: '#2C2620',
	  base02: '#433B32',
	  base03: '#5A5047',
	  base04: '#8A8075',
	  base05: '#A39A90',
	  base06: '#BEB6AE',
	  base07: '#DBD6D1',
	  base08: '#826D57',
	  base09: '#828257',
	  base0A: '#6D8257',
	  base0B: '#57826D',
	  base0C: '#576D82',
	  base0D: '#6D5782',
	  base0E: '#82576D',
	  base0F: '#825757'
	};
	module.exports = exports['default'];

/***/ },

/***/ 584:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'flat',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#2C3E50',
	  base01: '#34495E',
	  base02: '#7F8C8D',
	  base03: '#95A5A6',
	  base04: '#BDC3C7',
	  base05: '#e0e0e0',
	  base06: '#f5f5f5',
	  base07: '#ECF0F1',
	  base08: '#E74C3C',
	  base09: '#E67E22',
	  base0A: '#F1C40F',
	  base0B: '#2ECC71',
	  base0C: '#1ABC9C',
	  base0D: '#3498DB',
	  base0E: '#9B59B6',
	  base0F: '#be643c'
	};
	module.exports = exports['default'];

/***/ },

/***/ 585:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'google',
	  author: 'seth wright (http://sethawright.com)',
	  base00: '#1d1f21',
	  base01: '#282a2e',
	  base02: '#373b41',
	  base03: '#969896',
	  base04: '#b4b7b4',
	  base05: '#c5c8c6',
	  base06: '#e0e0e0',
	  base07: '#ffffff',
	  base08: '#CC342B',
	  base09: '#F96A38',
	  base0A: '#FBA922',
	  base0B: '#198844',
	  base0C: '#3971ED',
	  base0D: '#3971ED',
	  base0E: '#A36AC7',
	  base0F: '#3971ED'
	};
	module.exports = exports['default'];

/***/ },

/***/ 586:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'grayscale',
	  author: 'alexandre gavioli (https://github.com/alexx2/)',
	  base00: '#101010',
	  base01: '#252525',
	  base02: '#464646',
	  base03: '#525252',
	  base04: '#ababab',
	  base05: '#b9b9b9',
	  base06: '#e3e3e3',
	  base07: '#f7f7f7',
	  base08: '#7c7c7c',
	  base09: '#999999',
	  base0A: '#a0a0a0',
	  base0B: '#8e8e8e',
	  base0C: '#868686',
	  base0D: '#686868',
	  base0E: '#747474',
	  base0F: '#5e5e5e'
	};
	module.exports = exports['default'];

/***/ },

/***/ 587:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'green screen',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#001100',
	  base01: '#003300',
	  base02: '#005500',
	  base03: '#007700',
	  base04: '#009900',
	  base05: '#00bb00',
	  base06: '#00dd00',
	  base07: '#00ff00',
	  base08: '#007700',
	  base09: '#009900',
	  base0A: '#007700',
	  base0B: '#00bb00',
	  base0C: '#005500',
	  base0D: '#009900',
	  base0E: '#00bb00',
	  base0F: '#005500'
	};
	module.exports = exports['default'];

/***/ },

/***/ 588:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'harmonic16',
	  author: 'jannik siebert (https://github.com/janniks)',
	  base00: '#0b1c2c',
	  base01: '#223b54',
	  base02: '#405c79',
	  base03: '#627e99',
	  base04: '#aabcce',
	  base05: '#cbd6e2',
	  base06: '#e5ebf1',
	  base07: '#f7f9fb',
	  base08: '#bf8b56',
	  base09: '#bfbf56',
	  base0A: '#8bbf56',
	  base0B: '#56bf8b',
	  base0C: '#568bbf',
	  base0D: '#8b56bf',
	  base0E: '#bf568b',
	  base0F: '#bf5656'
	};
	module.exports = exports['default'];

/***/ },

/***/ 589:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'hopscotch',
	  author: 'jan t. sott',
	  base00: '#322931',
	  base01: '#433b42',
	  base02: '#5c545b',
	  base03: '#797379',
	  base04: '#989498',
	  base05: '#b9b5b8',
	  base06: '#d5d3d5',
	  base07: '#ffffff',
	  base08: '#dd464c',
	  base09: '#fd8b19',
	  base0A: '#fdcc59',
	  base0B: '#8fc13e',
	  base0C: '#149b93',
	  base0D: '#1290bf',
	  base0E: '#c85e7c',
	  base0F: '#b33508'
	};
	module.exports = exports['default'];

/***/ },

/***/ 590:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'isotope',
	  author: 'jan t. sott',
	  base00: '#000000',
	  base01: '#404040',
	  base02: '#606060',
	  base03: '#808080',
	  base04: '#c0c0c0',
	  base05: '#d0d0d0',
	  base06: '#e0e0e0',
	  base07: '#ffffff',
	  base08: '#ff0000',
	  base09: '#ff9900',
	  base0A: '#ff0099',
	  base0B: '#33ff00',
	  base0C: '#00ffff',
	  base0D: '#0066ff',
	  base0E: '#cc00ff',
	  base0F: '#3300ff'
	};
	module.exports = exports['default'];

/***/ },

/***/ 591:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'marrakesh',
	  author: 'alexandre gavioli (http://github.com/alexx2/)',
	  base00: '#201602',
	  base01: '#302e00',
	  base02: '#5f5b17',
	  base03: '#6c6823',
	  base04: '#86813b',
	  base05: '#948e48',
	  base06: '#ccc37a',
	  base07: '#faf0a5',
	  base08: '#c35359',
	  base09: '#b36144',
	  base0A: '#a88339',
	  base0B: '#18974e',
	  base0C: '#75a738',
	  base0D: '#477ca1',
	  base0E: '#8868b3',
	  base0F: '#b3588e'
	};
	module.exports = exports['default'];

/***/ },

/***/ 592:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'mocha',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#3B3228',
	  base01: '#534636',
	  base02: '#645240',
	  base03: '#7e705a',
	  base04: '#b8afad',
	  base05: '#d0c8c6',
	  base06: '#e9e1dd',
	  base07: '#f5eeeb',
	  base08: '#cb6077',
	  base09: '#d28b71',
	  base0A: '#f4bc87',
	  base0B: '#beb55b',
	  base0C: '#7bbda4',
	  base0D: '#8ab3b5',
	  base0E: '#a89bb9',
	  base0F: '#bb9584'
	};
	module.exports = exports['default'];

/***/ },

/***/ 593:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'monokai',
	  author: 'wimer hazenberg (http://www.monokai.nl)',
	  base00: '#272822',
	  base01: '#383830',
	  base02: '#49483e',
	  base03: '#75715e',
	  base04: '#a59f85',
	  base05: '#f8f8f2',
	  base06: '#f5f4f1',
	  base07: '#f9f8f5',
	  base08: '#f92672',
	  base09: '#fd971f',
	  base0A: '#f4bf75',
	  base0B: '#a6e22e',
	  base0C: '#a1efe4',
	  base0D: '#66d9ef',
	  base0E: '#ae81ff',
	  base0F: '#cc6633'
	};
	module.exports = exports['default'];

/***/ },

/***/ 594:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'ocean',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#2b303b',
	  base01: '#343d46',
	  base02: '#4f5b66',
	  base03: '#65737e',
	  base04: '#a7adba',
	  base05: '#c0c5ce',
	  base06: '#dfe1e8',
	  base07: '#eff1f5',
	  base08: '#bf616a',
	  base09: '#d08770',
	  base0A: '#ebcb8b',
	  base0B: '#a3be8c',
	  base0C: '#96b5b4',
	  base0D: '#8fa1b3',
	  base0E: '#b48ead',
	  base0F: '#ab7967'
	};
	module.exports = exports['default'];

/***/ },

/***/ 595:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'paraiso',
	  author: 'jan t. sott',
	  base00: '#2f1e2e',
	  base01: '#41323f',
	  base02: '#4f424c',
	  base03: '#776e71',
	  base04: '#8d8687',
	  base05: '#a39e9b',
	  base06: '#b9b6b0',
	  base07: '#e7e9db',
	  base08: '#ef6155',
	  base09: '#f99b15',
	  base0A: '#fec418',
	  base0B: '#48b685',
	  base0C: '#5bc4bf',
	  base0D: '#06b6ef',
	  base0E: '#815ba4',
	  base0F: '#e96ba8'
	};
	module.exports = exports['default'];

/***/ },

/***/ 596:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'pop',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#000000',
	  base01: '#202020',
	  base02: '#303030',
	  base03: '#505050',
	  base04: '#b0b0b0',
	  base05: '#d0d0d0',
	  base06: '#e0e0e0',
	  base07: '#ffffff',
	  base08: '#eb008a',
	  base09: '#f29333',
	  base0A: '#f8ca12',
	  base0B: '#37b349',
	  base0C: '#00aabb',
	  base0D: '#0e5a94',
	  base0E: '#b31e8d',
	  base0F: '#7a2d00'
	};
	module.exports = exports['default'];

/***/ },

/***/ 597:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'railscasts',
	  author: 'ryan bates (http://railscasts.com)',
	  base00: '#2b2b2b',
	  base01: '#272935',
	  base02: '#3a4055',
	  base03: '#5a647e',
	  base04: '#d4cfc9',
	  base05: '#e6e1dc',
	  base06: '#f4f1ed',
	  base07: '#f9f7f3',
	  base08: '#da4939',
	  base09: '#cc7833',
	  base0A: '#ffc66d',
	  base0B: '#a5c261',
	  base0C: '#519f50',
	  base0D: '#6d9cbe',
	  base0E: '#b6b3eb',
	  base0F: '#bc9458'
	};
	module.exports = exports['default'];

/***/ },

/***/ 598:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'shapeshifter',
	  author: 'tyler benziger (http://tybenz.com)',
	  base00: '#000000',
	  base01: '#040404',
	  base02: '#102015',
	  base03: '#343434',
	  base04: '#555555',
	  base05: '#ababab',
	  base06: '#e0e0e0',
	  base07: '#f9f9f9',
	  base08: '#e92f2f',
	  base09: '#e09448',
	  base0A: '#dddd13',
	  base0B: '#0ed839',
	  base0C: '#23edda',
	  base0D: '#3b48e3',
	  base0E: '#f996e2',
	  base0F: '#69542d'
	};
	module.exports = exports['default'];

/***/ },

/***/ 599:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'solarized',
	  author: 'ethan schoonover (http://ethanschoonover.com/solarized)',
	  base00: '#002b36',
	  base01: '#073642',
	  base02: '#586e75',
	  base03: '#657b83',
	  base04: '#839496',
	  base05: '#93a1a1',
	  base06: '#eee8d5',
	  base07: '#fdf6e3',
	  base08: '#dc322f',
	  base09: '#cb4b16',
	  base0A: '#b58900',
	  base0B: '#859900',
	  base0C: '#2aa198',
	  base0D: '#268bd2',
	  base0E: '#6c71c4',
	  base0F: '#d33682'
	};
	module.exports = exports['default'];

/***/ },

/***/ 600:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'summerfruit',
	  author: 'christopher corley (http://cscorley.github.io/)',
	  base00: '#151515',
	  base01: '#202020',
	  base02: '#303030',
	  base03: '#505050',
	  base04: '#B0B0B0',
	  base05: '#D0D0D0',
	  base06: '#E0E0E0',
	  base07: '#FFFFFF',
	  base08: '#FF0086',
	  base09: '#FD8900',
	  base0A: '#ABA800',
	  base0B: '#00C918',
	  base0C: '#1faaaa',
	  base0D: '#3777E6',
	  base0E: '#AD00A1',
	  base0F: '#cc6633'
	};
	module.exports = exports['default'];

/***/ },

/***/ 601:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'tomorrow',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#1d1f21',
	  base01: '#282a2e',
	  base02: '#373b41',
	  base03: '#969896',
	  base04: '#b4b7b4',
	  base05: '#c5c8c6',
	  base06: '#e0e0e0',
	  base07: '#ffffff',
	  base08: '#cc6666',
	  base09: '#de935f',
	  base0A: '#f0c674',
	  base0B: '#b5bd68',
	  base0C: '#8abeb7',
	  base0D: '#81a2be',
	  base0E: '#b294bb',
	  base0F: '#a3685a'
	};
	module.exports = exports['default'];

/***/ },

/***/ 602:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'london tube',
	  author: 'jan t. sott',
	  base00: '#231f20',
	  base01: '#1c3f95',
	  base02: '#5a5758',
	  base03: '#737171',
	  base04: '#959ca1',
	  base05: '#d9d8d8',
	  base06: '#e7e7e8',
	  base07: '#ffffff',
	  base08: '#ee2e24',
	  base09: '#f386a1',
	  base0A: '#ffd204',
	  base0B: '#00853e',
	  base0C: '#85cebc',
	  base0D: '#009ddc',
	  base0E: '#98005d',
	  base0F: '#b06110'
	};
	module.exports = exports['default'];

/***/ },

/***/ 603:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'twilight',
	  author: 'david hart (http://hart-dev.com)',
	  base00: '#1e1e1e',
	  base01: '#323537',
	  base02: '#464b50',
	  base03: '#5f5a60',
	  base04: '#838184',
	  base05: '#a7a7a7',
	  base06: '#c3c3c3',
	  base07: '#ffffff',
	  base08: '#cf6a4c',
	  base09: '#cda869',
	  base0A: '#f9ee98',
	  base0B: '#8f9d6a',
	  base0C: '#afc4db',
	  base0D: '#7587a6',
	  base0E: '#9b859d',
	  base0F: '#9b703f'
	};
	module.exports = exports['default'];

/***/ },

/***/ 604:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'nicinabox',
	  author: 'nicinabox (http://github.com/nicinabox)',
	  base00: '#2A2F3A',
	  base01: '#3C444F',
	  base02: '#4F5A65',
	  base03: '#BEBEBE',
	  base04: '#b0b0b0', // based on ocean theme
	  base05: '#d0d0d0', // based on ocean theme
	  base06: '#FFFFFF',
	  base07: '#f5f5f5', // based on ocean theme
	  base08: '#fb9fb1', // based on ocean theme
	  base09: '#FC6D24',
	  base0A: '#ddb26f', // based on ocean theme
	  base0B: '#A1C659',
	  base0C: '#12cfc0', // based on ocean theme
	  base0D: '#6FB3D2',
	  base0E: '#D381C3',
	  base0F: '#deaf8f' // based on ocean theme
	};
	module.exports = exports['default'];

/***/ },

/***/ 605:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.updateScrollTop = updateScrollTop;
	var UPDATE_SCROLL_TOP = exports.UPDATE_SCROLL_TOP = '@@redux-devtools-log-monitor/UPDATE_SCROLL_TOP';
	function updateScrollTop(scrollTop) {
	  return { type: UPDATE_SCROLL_TOP, scrollTop: scrollTop };
	}

/***/ },

/***/ 606:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.default = reducer;

	var _actions = __webpack_require__(605);

	function initialScrollTop(props) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	  var action = arguments[2];

	  if (!props.preserveScrollTop) {
	    return 0;
	  }

	  return action.type === _actions.UPDATE_SCROLL_TOP ? action.scrollTop : state;
	}

	function reducer(props) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	  var action = arguments[2];

	  return {
	    initialScrollTop: initialScrollTop(props, state.initialScrollTop, action)
	  };
	}

/***/ },

/***/ 607:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _LogMonitorEntry = __webpack_require__(608);

	var _LogMonitorEntry2 = _interopRequireDefault(_LogMonitorEntry);

	var _function = __webpack_require__(563);

	var _function2 = _interopRequireDefault(_function);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var LogMonitorEntryList = (function (_Component) {
	  _inherits(LogMonitorEntryList, _Component);

	  function LogMonitorEntryList() {
	    var _temp, _this, _ret;

	    _classCallCheck(this, LogMonitorEntryList);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.shouldComponentUpdate = _function2.default, _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  LogMonitorEntryList.prototype.render = function render() {
	    var elements = [];
	    var _props = this.props;
	    var theme = _props.theme;
	    var actionsById = _props.actionsById;
	    var computedStates = _props.computedStates;
	    var select = _props.select;
	    var skippedActionIds = _props.skippedActionIds;
	    var stagedActionIds = _props.stagedActionIds;
	    var expandActionRoot = _props.expandActionRoot;
	    var expandStateRoot = _props.expandStateRoot;
	    var onActionClick = _props.onActionClick;

	    for (var i = 0; i < stagedActionIds.length; i++) {
	      var actionId = stagedActionIds[i];
	      var action = actionsById[actionId].action;
	      var _computedStates$i = computedStates[i];
	      var state = _computedStates$i.state;
	      var error = _computedStates$i.error;

	      var previousState = undefined;
	      if (i > 0) {
	        previousState = computedStates[i - 1].state;
	      }
	      elements.push(_react2.default.createElement(_LogMonitorEntry2.default, { key: actionId,
	        theme: theme,
	        select: select,
	        action: action,
	        actionId: actionId,
	        state: state,
	        previousState: previousState,
	        collapsed: skippedActionIds.indexOf(actionId) > -1,
	        error: error,
	        expandActionRoot: expandActionRoot,
	        expandStateRoot: expandStateRoot,
	        onActionClick: onActionClick }));
	    }

	    return _react2.default.createElement(
	      'div',
	      null,
	      elements
	    );
	  };

	  return LogMonitorEntryList;
	})(_react.Component);

	LogMonitorEntryList.propTypes = {
	  actionsById: _react.PropTypes.object,
	  computedStates: _react.PropTypes.array,
	  stagedActionIds: _react.PropTypes.array,
	  skippedActionIds: _react.PropTypes.array,

	  select: _react.PropTypes.func.isRequired,
	  onActionClick: _react.PropTypes.func.isRequired,
	  theme: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.string]),
	  expandActionRoot: _react.PropTypes.bool,
	  expandStateRoot: _react.PropTypes.bool
	};
	exports.default = LogMonitorEntryList;

/***/ },

/***/ 608:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.__esModule = true;

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactJsonTree = __webpack_require__(609);

	var _reactJsonTree2 = _interopRequireDefault(_reactJsonTree);

	var _LogMonitorEntryAction = __webpack_require__(728);

	var _LogMonitorEntryAction2 = _interopRequireDefault(_LogMonitorEntryAction);

	var _function = __webpack_require__(563);

	var _function2 = _interopRequireDefault(_function);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var styles = {
	  entry: {
	    display: 'block',
	    WebkitUserSelect: 'none'
	  },
	  tree: {
	    paddingLeft: 0
	  }
	};

	var LogMonitorEntry = (function (_Component) {
	  _inherits(LogMonitorEntry, _Component);

	  function LogMonitorEntry(props) {
	    _classCallCheck(this, LogMonitorEntry);

	    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

	    _this.shouldComponentUpdate = _function2.default;

	    _this.handleActionClick = _this.handleActionClick.bind(_this);
	    _this.shouldExpandNode = _this.shouldExpandNode.bind(_this);
	    return _this;
	  }

	  LogMonitorEntry.prototype.printState = function printState(state, error) {
	    var errorText = error;
	    if (!errorText) {
	      try {
	        return _react2.default.createElement(_reactJsonTree2.default, {
	          theme: this.props.theme,
	          keyPath: ['state'],
	          data: this.props.select(state),
	          previousData: typeof this.props.previousState !== 'undefined' ? this.props.select(this.props.previousState) : undefined,
	          shouldExpandNode: this.shouldExpandNode,
	          style: styles.tree });
	      } catch (err) {
	        errorText = 'Error selecting state.';
	      }
	    }

	    return _react2.default.createElement(
	      'div',
	      { style: {
	          color: this.props.theme.base08,
	          paddingTop: 20,
	          paddingLeft: 30,
	          paddingRight: 30,
	          paddingBottom: 35
	        } },
	      errorText
	    );
	  };

	  LogMonitorEntry.prototype.handleActionClick = function handleActionClick() {
	    var _props = this.props;
	    var actionId = _props.actionId;
	    var onActionClick = _props.onActionClick;

	    if (actionId > 0) {
	      onActionClick(actionId);
	    }
	  };

	  LogMonitorEntry.prototype.shouldExpandNode = function shouldExpandNode() {
	    return this.props.expandStateRoot;
	  };

	  LogMonitorEntry.prototype.render = function render() {
	    var _props2 = this.props;
	    var actionId = _props2.actionId;
	    var error = _props2.error;
	    var action = _props2.action;
	    var state = _props2.state;
	    var collapsed = _props2.collapsed;

	    var styleEntry = {
	      opacity: collapsed ? 0.5 : 1,
	      cursor: actionId > 0 ? 'pointer' : 'default'
	    };

	    return _react2.default.createElement(
	      'div',
	      { style: {
	          textDecoration: collapsed ? 'line-through' : 'none',
	          color: this.props.theme.base06
	        } },
	      _react2.default.createElement(_LogMonitorEntryAction2.default, {
	        theme: this.props.theme,
	        collapsed: collapsed,
	        action: action,
	        expandActionRoot: this.props.expandActionRoot,
	        onClick: this.handleActionClick,
	        style: _extends({}, styles.entry, styleEntry) }),
	      !collapsed && _react2.default.createElement(
	        'div',
	        null,
	        this.printState(state, error)
	      )
	    );
	  };

	  return LogMonitorEntry;
	})(_react.Component);

	LogMonitorEntry.propTypes = {
	  state: _react.PropTypes.object.isRequired,
	  action: _react.PropTypes.object.isRequired,
	  actionId: _react.PropTypes.number.isRequired,
	  select: _react.PropTypes.func.isRequired,
	  error: _react.PropTypes.string,
	  onActionClick: _react.PropTypes.func.isRequired,
	  collapsed: _react.PropTypes.bool,
	  expandActionRoot: _react.PropTypes.bool,
	  expandStateRoot: _react.PropTypes.bool
	};
	exports.default = LogMonitorEntry;

/***/ },

/***/ 609:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = undefined;

	var _extends2 = __webpack_require__(610);

	var _extends3 = _interopRequireDefault(_extends2);

	var _objectWithoutProperties2 = __webpack_require__(648);

	var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

	var _classCallCheck2 = __webpack_require__(649);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(650);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(686);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _class, _temp; // ES6 + inline style port of JSONViewer https://bitbucket.org/davevedder/react-json-viewer/
	// all credits and original code to the author
	// Dave Vedder <veddermatic@gmail.com> http://www.eskimospy.com/
	// port by Daniele Zannotti http://www.github.com/dzannotti <dzannotti@me.com>

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _grabNode = __webpack_require__(694);

	var _grabNode2 = _interopRequireDefault(_grabNode);

	var _solarized = __webpack_require__(727);

	var _solarized2 = _interopRequireDefault(_solarized);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var styles = {
	  tree: {
	    border: 0,
	    padding: 0,
	    marginTop: 8,
	    marginBottom: 8,
	    marginLeft: 2,
	    marginRight: 0,
	    fontSize: '0.90em',
	    listStyle: 'none',
	    MozUserSelect: 'none',
	    WebkitUserSelect: 'none'
	  }
	};

	var getEmptyStyle = function getEmptyStyle() {
	  return {};
	};
	var identity = function identity(value) {
	  return value;
	};

	var JSONTree = (_temp = _class = function (_React$Component) {
	  (0, _inherits3.default)(JSONTree, _React$Component);

	  function JSONTree(props) {
	    (0, _classCallCheck3.default)(this, JSONTree);
	    return (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));
	  }

	  JSONTree.prototype.render = function render() {
	    var getStyles = {
	      getArrowStyle: this.props.getArrowStyle,
	      getListStyle: this.props.getListStyle,
	      getItemStringStyle: this.props.getItemStringStyle,
	      getLabelStyle: this.props.getLabelStyle,
	      getValueStyle: this.props.getValueStyle
	    };

	    var _props = this.props;
	    var value = _props.data;
	    var initialExpanded = _props.expandRoot;
	    var allExpanded = _props.expandAll;
	    var style = _props.style;
	    var keyPath = _props.keyPath;
	    var postprocessValue = _props.postprocessValue;
	    var hideRoot = _props.hideRoot;
	    var rest = (0, _objectWithoutProperties3.default)(_props, ['data', 'expandRoot', 'expandAll', 'style', 'keyPath', 'postprocessValue', 'hideRoot']);


	    var nodeToRender = undefined;

	    nodeToRender = (0, _grabNode2.default)((0, _extends3.default)({
	      initialExpanded: initialExpanded,
	      allExpanded: allExpanded,
	      keyPath: hideRoot ? [] : keyPath,
	      styles: getStyles,
	      value: postprocessValue(value),
	      postprocessValue: postprocessValue,
	      hideRoot: hideRoot
	    }, rest));

	    return _react2.default.createElement(
	      'ul',
	      { style: (0, _extends3.default)({}, styles.tree, style) },
	      nodeToRender
	    );
	  };

	  return JSONTree;
	}(_react2.default.Component), _class.propTypes = {
	  data: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.object]).isRequired,
	  hideRoot: _react2.default.PropTypes.bool
	}, _class.defaultProps = {
	  expandRoot: true,
	  expandAll: false,
	  hideRoot: false,
	  keyPath: ['root'],
	  theme: _solarized2.default,
	  getArrowStyle: getEmptyStyle,
	  getListStyle: getEmptyStyle,
	  getItemStringStyle: getEmptyStyle,
	  getLabelStyle: getEmptyStyle,
	  getValueStyle: getEmptyStyle,
	  getItemString: function getItemString(type, data, itemType, itemString) {
	    return _react2.default.createElement(
	      'span',
	      null,
	      itemType,
	      ' ',
	      itemString
	    );
	  },
	  labelRenderer: identity,
	  valueRenderer: identity,
	  postprocessValue: identity,
	  isCustomNode: function isCustomNode() {
	    return false;
	  },
	  collectionLimit: 50
	}, _temp);
	exports['default'] = JSONTree;

/***/ },

/***/ 694:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends2 = __webpack_require__(610);

	var _extends3 = _interopRequireDefault(_extends2);

	var _objectWithoutProperties2 = __webpack_require__(648);

	var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

	exports['default'] = function (_ref) {
	  var getItemString = _ref.getItemString;
	  var _ref$initialExpanded = _ref.initialExpanded;
	  var initialExpanded = _ref$initialExpanded === undefined ? false : _ref$initialExpanded;
	  var keyPath = _ref.keyPath;
	  var labelRenderer = _ref.labelRenderer;
	  var previousData = _ref.previousData;
	  var styles = _ref.styles;
	  var theme = _ref.theme;
	  var value = _ref.value;
	  var valueRenderer = _ref.valueRenderer;
	  var isCustomNode = _ref.isCustomNode;
	  var rest = (0, _objectWithoutProperties3['default'])(_ref, ['getItemString', 'initialExpanded', 'keyPath', 'labelRenderer', 'previousData', 'styles', 'theme', 'value', 'valueRenderer', 'isCustomNode']);

	  var nodeType = isCustomNode(value) ? 'Custom' : (0, _objType2['default'])(value);

	  var simpleNodeProps = {
	    getItemString: getItemString,
	    initialExpanded: initialExpanded,
	    key: keyPath[0],
	    keyPath: keyPath,
	    labelRenderer: labelRenderer,
	    nodeType: nodeType,
	    previousData: previousData,
	    styles: styles,
	    theme: theme,
	    value: value,
	    valueRenderer: valueRenderer
	  };

	  var nestedNodeProps = (0, _extends3['default'])({}, rest, simpleNodeProps, {
	    data: value,
	    isCustomNode: isCustomNode
	  });

	  switch (nodeType) {
	    case 'Object':
	    case 'Error':
	      return _react2['default'].createElement(_JSONObjectNode2['default'], nestedNodeProps);
	    case 'Array':
	      return _react2['default'].createElement(_JSONArrayNode2['default'], nestedNodeProps);
	    case 'Iterable':
	      return _react2['default'].createElement(_JSONIterableNode2['default'], nestedNodeProps);
	    case 'String':
	      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueColor: theme.base0B, valueGetter: function valueGetter(raw) {
	          return '"' + raw + '"';
	        } }));
	    case 'Number':
	      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueColor: theme.base09 }));
	    case 'Boolean':
	      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueColor: theme.base09, valueGetter: function valueGetter(raw) {
	          return raw ? 'true' : 'false';
	        } }));
	    case 'Date':
	      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueColor: theme.base0B, valueGetter: function valueGetter(raw) {
	          return raw.toISOString();
	        } }));
	    case 'Null':
	      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueColor: theme.base08, valueGetter: function valueGetter() {
	          return 'null';
	        } }));
	    case 'Undefined':
	      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueColor: theme.base08, valueGetter: function valueGetter() {
	          return 'undefined';
	        } }));
	    case 'Function':
	    case 'Symbol':
	      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueColor: theme.base08, valueGetter: function valueGetter(raw) {
	          return raw.toString();
	        } }));
	    case 'Custom':
	      return _react2['default'].createElement(_JSONValueNode2['default'], simpleNodeProps);
	    default:
	      return false;
	  }
	};

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _objType = __webpack_require__(695);

	var _objType2 = _interopRequireDefault(_objType);

	var _JSONObjectNode = __webpack_require__(696);

	var _JSONObjectNode2 = _interopRequireDefault(_JSONObjectNode);

	var _JSONArrayNode = __webpack_require__(719);

	var _JSONArrayNode2 = _interopRequireDefault(_JSONArrayNode);

	var _JSONIterableNode = __webpack_require__(720);

	var _JSONIterableNode2 = _interopRequireDefault(_JSONIterableNode);

	var _JSONValueNode = __webpack_require__(725);

	var _JSONValueNode2 = _interopRequireDefault(_JSONValueNode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/***/ },

/***/ 695:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _iterator = __webpack_require__(652);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _typeof2 = __webpack_require__(651);

	var _typeof3 = _interopRequireDefault(_typeof2);

	exports['default'] = function (obj) {
	  if (obj !== null && (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3['default'])(obj)) === 'object' && !Array.isArray(obj) && typeof obj[_iterator2['default']] === 'function') {
	    return 'Iterable';
	  }
	  return Object.prototype.toString.call(obj).slice(8, -1);
	};

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/***/ },

/***/ 696:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends2 = __webpack_require__(610);

	var _extends3 = _interopRequireDefault(_extends2);

	var _objectWithoutProperties2 = __webpack_require__(648);

	var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

	var _getOwnPropertyNames = __webpack_require__(697);

	var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

	exports['default'] = function (_ref) {
	  var props = (0, _objectWithoutProperties3['default'])(_ref, []);

	  return _react2['default'].createElement(_JSONNestedNode2['default'], (0, _extends3['default'])({}, props, {
	    nodeType: 'Object',
	    nodeTypeIndicator: '{}',
	    createItemString: createItemString
	  }));
	};

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _JSONNestedNode = __webpack_require__(701);

	var _JSONNestedNode2 = _interopRequireDefault(_JSONNestedNode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	// Returns the "n Items" string for this node, generating and caching it if it hasn't been created yet.
	function createItemString(data) {
	  var len = (0, _getOwnPropertyNames2.default)(data).length;
	  return len + ' ' + (len !== 1 ? 'keys' : 'key');
	}

	// Configures <JSONNestedNode> to render an Object

/***/ },

/***/ 697:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(698), __esModule: true };

/***/ },

/***/ 698:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(699);
	var $Object = __webpack_require__(616).Object;
	module.exports = function getOwnPropertyNames(it){
	  return $Object.getOwnPropertyNames(it);
	};

/***/ },

/***/ 699:
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 Object.getOwnPropertyNames(O)
	__webpack_require__(700)('getOwnPropertyNames', function(){
	  return __webpack_require__(680).f;
	});

/***/ },

/***/ 701:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = undefined;

	var _classCallCheck2 = __webpack_require__(649);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(650);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(686);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _extends2 = __webpack_require__(610);

	var _extends3 = _interopRequireDefault(_extends2);

	var _dec, _class, _class2, _temp;

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactMixin = __webpack_require__(702);

	var _reactMixin2 = _interopRequireDefault(_reactMixin);

	var _mixins = __webpack_require__(705);

	var _JSONArrow = __webpack_require__(708);

	var _JSONArrow2 = _interopRequireDefault(_JSONArrow);

	var _getCollectionEntries = __webpack_require__(709);

	var _getCollectionEntries2 = _interopRequireDefault(_getCollectionEntries);

	var _grabNode = __webpack_require__(694);

	var _grabNode2 = _interopRequireDefault(_grabNode);

	var _ItemRange = __webpack_require__(718);

	var _ItemRange2 = _interopRequireDefault(_ItemRange);

	var _function = __webpack_require__(563);

	var _function2 = _interopRequireDefault(_function);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * Renders nested values (eg. objects, arrays, lists, etc.)
	 */

	function getChildNodes(props, from, to) {
	  var nodeType = props.nodeType;
	  var data = props.data;
	  var collectionLimit = props.collectionLimit;
	  var previousData = props.previousData;
	  var circularCache = props.circularCache;
	  var keyPath = props.keyPath;
	  var postprocessValue = props.postprocessValue;
	  var allExpanded = props.allExpanded;

	  var childNodes = [];

	  (0, _getCollectionEntries2.default)(nodeType, data, collectionLimit, from, to).forEach(function (entry) {
	    if (entry.to) {
	      childNodes.push(_react2.default.createElement(_ItemRange2.default, (0, _extends3.default)({}, props, {
	        key: 'ItemRange' + entry.from + '-' + entry.to,
	        from: entry.from,
	        to: entry.to,
	        getChildNodes: getChildNodes })));
	    } else {
	      var key = entry.key;
	      var value = entry.value;

	      var previousDataValue = undefined;
	      if (typeof previousData !== 'undefined' && previousData !== null) {
	        previousDataValue = previousData[key];
	      }
	      var isCircular = circularCache.indexOf(value) !== -1;

	      var node = (0, _grabNode2.default)((0, _extends3.default)({}, props, {
	        keyPath: [key].concat(keyPath),
	        previousData: previousDataValue,
	        value: postprocessValue(value),
	        postprocessValue: postprocessValue,
	        collectionLimit: collectionLimit,
	        circularCache: [].concat(circularCache, [value]),
	        initialExpanded: false,
	        allExpanded: isCircular ? false : allExpanded,
	        hideRoot: false
	      }));

	      if (node !== false) {
	        childNodes.push(node);
	      }
	    }
	  });

	  return childNodes;
	}

	var STYLES = {
	  base: {
	    position: 'relative',
	    paddingTop: 3,
	    paddingBottom: 3,
	    marginLeft: 14
	  },
	  label: {
	    margin: 0,
	    padding: 0,
	    display: 'inline-block',
	    cursor: 'pointer'
	  },
	  span: {
	    cursor: 'default'
	  },
	  spanType: {
	    marginLeft: 5,
	    marginRight: 5
	  }
	};

	var JSONNestedNode = (_dec = _reactMixin2.default.decorate(_mixins.ExpandedStateHandlerMixin), _dec(_class = (_temp = _class2 = function (_React$Component) {
	  (0, _inherits3.default)(JSONNestedNode, _React$Component);

	  function JSONNestedNode(props) {
	    (0, _classCallCheck3.default)(this, JSONNestedNode);

	    var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));

	    _this.shouldComponentUpdate = _function2.default;

	    _this.state = {
	      expanded: _this.props.initialExpanded || _this.props.allExpanded,
	      createdChildNodes: false
	    };
	    return _this;
	  }

	  JSONNestedNode.prototype.render = function render() {
	    var _props = this.props;
	    var getItemString = _props.getItemString;
	    var nodeTypeIndicator = _props.nodeTypeIndicator;
	    var nodeType = _props.nodeType;
	    var data = _props.data;
	    var hideRoot = _props.hideRoot;
	    var styles = _props.styles;
	    var createItemString = _props.createItemString;
	    var theme = _props.theme;
	    var collectionLimit = _props.collectionLimit;
	    var keyPath = _props.keyPath;
	    var labelRenderer = _props.labelRenderer;

	    var expanded = this.state.expanded;
	    var childListStyle = {
	      padding: 0,
	      margin: 0,
	      listStyle: 'none',
	      display: expanded ? 'block' : 'none'
	    };
	    var spanStyle = (0, _extends3.default)({}, STYLES.span, {
	      color: theme.base0B
	    });
	    var containerStyle = (0, _extends3.default)({}, STYLES.base);

	    if (expanded) {
	      spanStyle = (0, _extends3.default)({}, spanStyle, {
	        color: theme.base03
	      });
	    }

	    var renderedChildren = expanded ? getChildNodes(this.props) : null;

	    var itemType = _react2.default.createElement(
	      'span',
	      { style: STYLES.spanType },
	      nodeTypeIndicator
	    );
	    var renderedItemString = getItemString(nodeType, data, itemType, createItemString(data, collectionLimit));

	    return hideRoot ? _react2.default.createElement(
	      'div',
	      null,
	      renderedChildren
	    ) : _react2.default.createElement(
	      'li',
	      { style: containerStyle },
	      _react2.default.createElement(_JSONArrow2.default, {
	        theme: theme,
	        open: expanded,
	        onClick: this.handleClick.bind(this),
	        style: styles.getArrowStyle(expanded) }),
	      _react2.default.createElement(
	        'label',
	        {
	          style: (0, _extends3.default)({}, STYLES.label, {
	            color: theme.base0D
	          }, styles.getLabelStyle(nodeType, expanded)),
	          onClick: this.handleClick.bind(this) },
	        labelRenderer.apply(undefined, keyPath),
	        ':'
	      ),
	      _react2.default.createElement(
	        'span',
	        {
	          style: (0, _extends3.default)({}, spanStyle, styles.getItemStringStyle(nodeType, expanded)),
	          onClick: this.handleClick.bind(this) },
	        renderedItemString
	      ),
	      _react2.default.createElement(
	        'ul',
	        { style: (0, _extends3.default)({}, childListStyle, styles.getListStyle(nodeType, expanded)) },
	        renderedChildren
	      )
	    );
	  };

	  return JSONNestedNode;
	}(_react2.default.Component), _class2.defaultProps = {
	  data: [],
	  initialExpanded: false,
	  allExpanded: false,
	  circularCache: []
	}, _temp)) || _class);
	exports['default'] = JSONNestedNode;

/***/ },

/***/ 702:
/***/ function(module, exports, __webpack_require__) {

	var mixin = __webpack_require__(703);
	var assign = __webpack_require__(704);

	var mixinProto = mixin({
	  // lifecycle stuff is as you'd expect
	  componentDidMount: mixin.MANY,
	  componentWillMount: mixin.MANY,
	  componentWillReceiveProps: mixin.MANY,
	  shouldComponentUpdate: mixin.ONCE,
	  componentWillUpdate: mixin.MANY,
	  componentDidUpdate: mixin.MANY,
	  componentWillUnmount: mixin.MANY,
	  getChildContext: mixin.MANY_MERGED
	});

	function setDefaultProps(reactMixin) {
	  var getDefaultProps = reactMixin.getDefaultProps;

	  if (getDefaultProps) {
	    reactMixin.defaultProps = getDefaultProps();

	    delete reactMixin.getDefaultProps;
	  }
	}

	function setInitialState(reactMixin) {
	  var getInitialState = reactMixin.getInitialState;
	  var componentWillMount = reactMixin.componentWillMount;

	  function applyInitialState(instance) {
	    var state = instance.state || {};
	    assign(state, getInitialState.call(instance));
	    instance.state = state;
	  }

	  if (getInitialState) {
	    if (!componentWillMount) {
	      reactMixin.componentWillMount = function() {
	        applyInitialState(this);
	      };
	    } else {
	      reactMixin.componentWillMount = function() {
	        applyInitialState(this);
	        componentWillMount.call(this);
	      };
	    }

	    delete reactMixin.getInitialState;
	  }
	}

	function mixinClass(reactClass, reactMixin) {
	  setDefaultProps(reactMixin);
	  setInitialState(reactMixin);

	  var prototypeMethods = {};
	  var staticProps = {};

	  Object.keys(reactMixin).forEach(function(key) {
	    if (key === 'mixins') {
	      return; // Handled below to ensure proper order regardless of property iteration order
	    }
	    if (key === 'statics') {
	      return; // gets special handling
	    } else if (typeof reactMixin[key] === 'function') {
	      prototypeMethods[key] = reactMixin[key];
	    } else {
	      staticProps[key] = reactMixin[key];
	    }
	  });

	  mixinProto(reactClass.prototype, prototypeMethods);

	  var mergePropTypes = function(left, right, key) {
	    if (!left) return right;
	    if (!right) return left;

	    var result = {};
	    Object.keys(left).forEach(function(leftKey) {
	      if (!right[leftKey]) {
	        result[leftKey] = left[leftKey];
	      }
	    });

	    Object.keys(right).forEach(function(rightKey) {
	      if (left[rightKey]) {
	        result[rightKey] = function checkBothContextTypes() {
	          return right[rightKey].apply(this, arguments) && left[rightKey].apply(this, arguments);
	        };
	      } else {
	        result[rightKey] = right[rightKey];
	      }
	    });

	    return result;
	  };

	  mixin({
	    childContextTypes: mergePropTypes,
	    contextTypes: mergePropTypes,
	    propTypes: mixin.MANY_MERGED_LOOSE,
	    defaultProps: mixin.MANY_MERGED_LOOSE
	  })(reactClass, staticProps);

	  // statics is a special case because it merges directly onto the class
	  if (reactMixin.statics) {
	    Object.getOwnPropertyNames(reactMixin.statics).forEach(function(key) {
	      var left = reactClass[key];
	      var right = reactMixin.statics[key];

	      if (left !== undefined && right !== undefined) {
	        throw new TypeError('Cannot mixin statics because statics.' + key + ' and Component.' + key + ' are defined.');
	      }

	      reactClass[key] = left !== undefined ? left : right;
	    });
	  }

	  // If more mixins are defined, they need to run. This emulate's react's behavior.
	  // See behavior in code at:
	  // https://github.com/facebook/react/blob/41aa3496aa632634f650edbe10d617799922d265/src/isomorphic/classic/class/ReactClass.js#L468
	  // Note the .reverse(). In React, a fresh constructor is created, then all mixins are mixed in recursively,
	  // then the actual spec is mixed in last.
	  //
	  // With ES6 classes, the properties are already there, so smart-mixin mixes functions (a, b) -> b()a(), which is
	  // the opposite of how React does it. If we reverse this array, we basically do the whole logic in reverse,
	  // which makes the result the same. See the test for more.
	  // See also:
	  // https://github.com/facebook/react/blob/41aa3496aa632634f650edbe10d617799922d265/src/isomorphic/classic/class/ReactClass.js#L853
	  if (reactMixin.mixins) {
	    reactMixin.mixins.reverse().forEach(mixinClass.bind(null, reactClass));
	  }

	  return reactClass;
	}

	module.exports = (function() {
	  var reactMixin = mixinProto;

	  reactMixin.onClass = function(reactClass, mixin) {
	    return mixinClass(reactClass, mixin);
	  };

	  reactMixin.decorate = function(mixin) {
	    return function(reactClass) {
	      return reactMixin.onClass(reactClass, mixin);
	    };
	  };

	  return reactMixin;
	})();


/***/ },

/***/ 703:
/***/ function(module, exports) {

	var objToStr = function(x){ return Object.prototype.toString.call(x); };

	var thrower = function(error){
	    throw error;
	};

	var mixins = module.exports = function makeMixinFunction(rules, _opts){
	    var opts = _opts || {};
	    if (!opts.unknownFunction) {
	        opts.unknownFunction = mixins.ONCE;
	    }

	    if (!opts.nonFunctionProperty) {
	        opts.nonFunctionProperty = function(left, right, key){
	            if (left !== undefined && right !== undefined) {
	                var getTypeName = function(obj){
	                    if (obj && obj.constructor && obj.constructor.name) {
	                        return obj.constructor.name;
	                    }
	                    else {
	                        return objToStr(obj).slice(8, -1);
	                    }
	                };
	                throw new TypeError('Cannot mixin key ' + key + ' because it is provided by multiple sources, '
	                        + 'and the types are ' + getTypeName(left) + ' and ' + getTypeName(right));
	            }
	            return left === undefined ? right : left;
	        };
	    }

	    function setNonEnumerable(target, key, value){
	        if (key in target){
	            target[key] = value;
	        }
	        else {
	            Object.defineProperty(target, key, {
	                value: value,
	                writable: true,
	                configurable: true
	            });
	        }
	    }

	    return function applyMixin(source, mixin){
	        Object.keys(mixin).forEach(function(key){
	            var left = source[key], right = mixin[key], rule = rules[key];

	            // this is just a weird case where the key was defined, but there's no value
	            // behave like the key wasn't defined
	            if (left === undefined && right === undefined) return;

	            var wrapIfFunction = function(thing){
	                return typeof thing !== "function" ? thing
	                : function(){
	                    return thing.call(this, arguments);
	                };
	            };

	            // do we have a rule for this key?
	            if (rule) {
	                // may throw here
	                var fn = rule(left, right, key);
	                setNonEnumerable(source, key, wrapIfFunction(fn));
	                return;
	            }

	            var leftIsFn = typeof left === "function";
	            var rightIsFn = typeof right === "function";

	            // check to see if they're some combination of functions or undefined
	            // we already know there's no rule, so use the unknown function behavior
	            if (leftIsFn && right === undefined
	             || rightIsFn && left === undefined
	             || leftIsFn && rightIsFn) {
	                // may throw, the default is ONCE so if both are functions
	                // the default is to throw
	                setNonEnumerable(source, key, wrapIfFunction(opts.unknownFunction(left, right, key)));
	                return;
	            }

	            // we have no rule for them, one may be a function but one or both aren't
	            // our default is MANY_MERGED_LOOSE which will merge objects, concat arrays
	            // and throw if there's a type mismatch or both are primitives (how do you merge 3, and "foo"?)
	            source[key] = opts.nonFunctionProperty(left, right, key);
	        });
	    };
	};

	mixins._mergeObjects = function(obj1, obj2) {
	    var assertObject = function(obj, obj2){
	        var type = objToStr(obj);
	        if (type !== '[object Object]') {
	            var displayType = obj.constructor ? obj.constructor.name : 'Unknown';
	            var displayType2 = obj2.constructor ? obj2.constructor.name : 'Unknown';
	            thrower('cannot merge returned value of type ' + displayType + ' with an ' + displayType2);
	        }
	    };

	    if (Array.isArray(obj1) && Array.isArray(obj2)) {
	        return obj1.concat(obj2);
	    }

	    assertObject(obj1, obj2);
	    assertObject(obj2, obj1);

	    var result = {};
	    Object.keys(obj1).forEach(function(k){
	        if (Object.prototype.hasOwnProperty.call(obj2, k)) {
	            thrower('cannot merge returns because both have the ' + JSON.stringify(k) + ' key');
	        }
	        result[k] = obj1[k];
	    });

	    Object.keys(obj2).forEach(function(k){
	        // we can skip the conflict check because all conflicts would already be found
	        result[k] = obj2[k];
	    });
	    return result;

	}

	// define our built-in mixin types
	mixins.ONCE = function(left, right, key){
	    if (left && right) {
	        throw new TypeError('Cannot mixin ' + key + ' because it has a unique constraint.');
	    }

	    var fn = left || right;

	    return function(args){
	        return fn.apply(this, args);
	    };
	};

	mixins.MANY = function(left, right, key){
	    return function(args){
	        if (right) right.apply(this, args);
	        return left ? left.apply(this, args) : undefined;
	    };
	};

	mixins.MANY_MERGED_LOOSE = function(left, right, key) {
	    if(left && right) {
	        return mixins._mergeObjects(left, right);
	    }

	    return left || right;
	}

	mixins.MANY_MERGED = function(left, right, key){
	    return function(args){
	        var res1 = right && right.apply(this, args);
	        var res2 = left && left.apply(this, args);
	        if (res1 && res2) {
	            return mixins._mergeObjects(res1, res2)
	        }
	        return res2 || res1;
	    };
	};


	mixins.REDUCE_LEFT = function(_left, _right, key){
	    var left = _left || function(x){ return x };
	    var right = _right || function(x){ return x };
	    return function(args){
	        return right.call(this, left.apply(this, args));
	    };
	};

	mixins.REDUCE_RIGHT = function(_left, _right, key){
	    var left = _left || function(x){ return x };
	    var right = _right || function(x){ return x };
	    return function(args){
	        return left.call(this, right.apply(this, args));
	    };
	};



/***/ },

/***/ 704:
/***/ function(module, exports) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },

/***/ 705:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _squashClickEvent = __webpack_require__(706);

	Object.defineProperty(exports, 'SquashClickEventMixin', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_squashClickEvent)['default'];
	  }
	});

	var _expandedStateHandler = __webpack_require__(707);

	Object.defineProperty(exports, 'ExpandedStateHandlerMixin', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_expandedStateHandler)['default'];
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/***/ },

/***/ 706:
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports.default = {
	  handleClick: function handleClick(e) {
	    e.stopPropagation();
	  }
	};

/***/ },

/***/ 707:
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports.default = {
	  handleClick: function handleClick(e) {
	    e.stopPropagation();
	    this.setState({
	      expanded: !this.state.expanded
	    });
	  },
	  componentWillReceiveProps: function componentWillReceiveProps() {
	    // resets our caches and flags we need to build child nodes again
	    this.renderedChildren = [];
	    this.itemString = false;
	    this.needsChildNodes = true;
	  }
	};

/***/ },

/***/ 708:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = undefined;

	var _extends2 = __webpack_require__(610);

	var _extends3 = _interopRequireDefault(_extends2);

	var _classCallCheck2 = __webpack_require__(649);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(650);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(686);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var styles = {
	  base: {
	    display: 'inline-block',
	    marginLeft: 0,
	    marginTop: 8,
	    'float': 'left',
	    transition: '150ms',
	    WebkitTransition: '150ms',
	    MozTransition: '150ms',
	    WebkitTransform: 'rotateZ(-90deg)',
	    MozTransform: 'rotateZ(-90deg)',
	    transform: 'rotateZ(-90deg)',
	    position: 'relative'
	  },
	  container: {
	    display: 'inline-block',
	    paddingTop: 2,
	    paddingBottom: 2,
	    paddingRight: 5,
	    paddingLeft: 5,
	    cursor: 'pointer'
	  },
	  containerDouble: {
	    paddingTop: 2,
	    paddingBottom: 2,
	    paddingRight: 10,
	    paddingLeft: 10
	  },
	  arrow: {
	    borderLeft: '5px solid transparent',
	    borderRight: '5px solid transparent',
	    borderTopWidth: 5,
	    borderTopStyle: 'solid'
	  },
	  open: {
	    WebkitTransform: 'rotateZ(0deg)',
	    MozTransform: 'rotateZ(0deg)',
	    transform: 'rotateZ(0deg)'
	  },
	  inner: {
	    position: 'absolute',
	    top: 0,
	    left: -5
	  }
	};

	var JSONArrow = function (_React$Component) {
	  (0, _inherits3.default)(JSONArrow, _React$Component);

	  function JSONArrow() {
	    (0, _classCallCheck3.default)(this, JSONArrow);
	    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
	  }

	  JSONArrow.prototype.render = function render() {
	    var containerStyle = (0, _extends3.default)({}, styles.container);
	    var style = (0, _extends3.default)({}, styles.base, styles.arrow);
	    var color = {
	      borderTopColor: this.props.theme.base0D
	    };
	    if (this.props.open) {
	      style = (0, _extends3.default)({}, style, styles.open);
	    }
	    if (this.props.double) {
	      containerStyle = (0, _extends3.default)({}, containerStyle, styles.containerDouble);
	    }
	    style = (0, _extends3.default)({}, style, this.props.style);
	    return _react2.default.createElement(
	      'div',
	      { style: containerStyle, onClick: this.props.onClick },
	      _react2.default.createElement(
	        'div',
	        { style: (0, _extends3.default)({}, color, style) },
	        this.props.double && _react2.default.createElement('div', { style: (0, _extends3.default)({}, color, styles.inner, styles.arrow) })
	      )
	    );
	  };

	  return JSONArrow;
	}(_react2.default.Component);

	exports['default'] = JSONArrow;

/***/ },

/***/ 709:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _getIterator2 = __webpack_require__(710);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	var _getOwnPropertyNames = __webpack_require__(697);

	var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

	var _keys = __webpack_require__(715);

	var _keys2 = _interopRequireDefault(_keys);

	exports['default'] = getCollectionEntries;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function getLength(type, collection) {
	  if (type === 'Object') {
	    return (0, _keys2.default)(collection).length;
	  } else if (type === 'Array') {
	    return collection.length;
	  }

	  return Infinity;
	}

	function isIterableMap(collection) {
	  return typeof collection.set === 'function';
	}

	function getEntries(type, collection) {
	  var from = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	  var to = arguments.length <= 3 || arguments[3] === undefined ? Infinity : arguments[3];

	  var res = undefined;

	  if (type === 'Object') {
	    var keys = (0, _getOwnPropertyNames2.default)(collection).slice(from, to + 1);

	    res = {
	      entries: keys.map(function (key) {
	        return { key: key, value: collection[key] };
	      })
	    };
	  } else if (type === 'Array') {
	    res = {
	      entries: collection.slice(from, to + 1).map(function (val, idx) {
	        return { key: idx + from, value: val };
	      })
	    };
	  } else {
	    var idx = 0;
	    var entries = [];
	    var done = true;

	    var isMap = isIterableMap(collection);

	    for (var _iterator = collection, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
	      var _ref;

	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }

	      var item = _ref;

	      if (idx > to) {
	        done = false;
	        break;
	      }if (from <= idx) {
	        if (isMap && Array.isArray(item)) {
	          entries.push({ key: item[0], value: item[1] });
	        } else {
	          entries.push({ key: idx, value: item });
	        }
	      }
	      idx++;
	    }

	    res = {
	      hasMore: !done,
	      entries: entries
	    };
	  }

	  return res;
	}

	function getRanges(from, to, limit) {
	  var ranges = [];
	  while (to - from > limit * limit) {
	    limit = limit * limit;
	  }
	  for (var i = from; i <= to; i += limit) {
	    ranges.push({ from: i, to: Math.min(to, i + limit - 1) });
	  }

	  return ranges;
	}

	function getCollectionEntries(type, collection, limit) {
	  var from = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
	  var to = arguments.length <= 4 || arguments[4] === undefined ? Infinity : arguments[4];

	  if (!limit) {
	    return getEntries(type, collection).entries;
	  }
	  var isSubset = to < Infinity;
	  var length = Math.min(to - from, getLength(type, collection));

	  if (type !== 'Iterable') {
	    if (length <= limit || limit < 7) {
	      return getEntries(type, collection, from, to).entries;
	    }
	  } else {
	    if (length <= limit && !isSubset) {
	      return getEntries(type, collection, from, to).entries;
	    }
	  }

	  var limitedEntries = undefined;
	  if (type === 'Iterable') {
	    var _getEntries = getEntries(type, collection, from, from + limit - 1);

	    var hasMore = _getEntries.hasMore;
	    var entries = _getEntries.entries;


	    limitedEntries = hasMore ? [].concat(entries, getRanges(from + limit, from + 2 * limit - 1, limit)) : entries;
	  } else {
	    limitedEntries = isSubset ? getRanges(from, to, limit) : [].concat(getEntries(type, collection, 0, limit - 5).entries, getRanges(limit - 4, length - 5, limit), getEntries(type, collection, length - 4, length - 1).entries);
	  }

	  return limitedEntries;
	}

/***/ },

/***/ 710:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(711), __esModule: true };

/***/ },

/***/ 711:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(667);
	__webpack_require__(654);
	module.exports = __webpack_require__(712);

/***/ },

/***/ 712:
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(621)
	  , get      = __webpack_require__(713);
	module.exports = __webpack_require__(616).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },

/***/ 718:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = undefined;

	var _extends2 = __webpack_require__(610);

	var _extends3 = _interopRequireDefault(_extends2);

	var _classCallCheck2 = __webpack_require__(649);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(650);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(686);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _class, _temp;

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _function = __webpack_require__(563);

	var _function2 = _interopRequireDefault(_function);

	var _JSONArrow = __webpack_require__(708);

	var _JSONArrow2 = _interopRequireDefault(_JSONArrow);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var STYLES = {
	  itemRange: {
	    margin: '8px 0 8px 14px',
	    cursor: 'pointer'
	  }
	};

	var ItemRange = (_temp = _class = function (_Component) {
	  (0, _inherits3.default)(ItemRange, _Component);

	  function ItemRange(props) {
	    (0, _classCallCheck3.default)(this, ItemRange);

	    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

	    _this.shouldComponentUpdate = _function2.default;

	    _this.state = { expanded: false };

	    _this.handleClick = _this.handleClick.bind(_this);
	    return _this;
	  }

	  ItemRange.prototype.render = function render() {
	    var _props = this.props;
	    var theme = _props.theme;
	    var styles = _props.styles;
	    var from = _props.from;
	    var to = _props.to;
	    var getChildNodes = _props.getChildNodes;


	    return this.state.expanded ? _react2.default.createElement(
	      'div',
	      { style: (0, _extends3.default)({ color: theme.base0D }, styles.label) },
	      getChildNodes(this.props, from, to)
	    ) : _react2.default.createElement(
	      'div',
	      { style: (0, _extends3.default)({ color: theme.base0D }, STYLES.itemRange, styles.label),
	        onClick: this.handleClick },
	      _react2.default.createElement(_JSONArrow2.default, {
	        theme: theme,
	        open: false,
	        onClick: this.handleClick,
	        style: styles.getArrowStyle(false),
	        double: true }),
	      from + ' ... ' + to
	    );
	  };

	  ItemRange.prototype.handleClick = function handleClick() {
	    this.setState({ expanded: !this.state.expanded });
	  };

	  return ItemRange;
	}(_react.Component), _class.propTypes = {}, _temp);
	exports['default'] = ItemRange;

/***/ },

/***/ 719:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends2 = __webpack_require__(610);

	var _extends3 = _interopRequireDefault(_extends2);

	var _objectWithoutProperties2 = __webpack_require__(648);

	var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

	exports['default'] = JSONArrayNode;

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _JSONNestedNode = __webpack_require__(701);

	var _JSONNestedNode2 = _interopRequireDefault(_JSONNestedNode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	// Returns the "n Items" string for this node, generating and caching it if it hasn't been created yet.
	function createItemString(data) {
	  return data.length + ' ' + (data.length !== 1 ? 'items' : 'item');
	}

	// Configures <JSONNestedNode> to render an Array
	function JSONArrayNode(_ref) {
	  var props = (0, _objectWithoutProperties3.default)(_ref, []);

	  return _react2.default.createElement(_JSONNestedNode2.default, (0, _extends3.default)({}, props, {
	    nodeType: 'Array',
	    nodeTypeIndicator: '[]',
	    createItemString: createItemString
	  }));
	}

/***/ },

/***/ 720:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends2 = __webpack_require__(610);

	var _extends3 = _interopRequireDefault(_extends2);

	var _objectWithoutProperties2 = __webpack_require__(648);

	var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

	var _getIterator2 = __webpack_require__(710);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	var _isSafeInteger = __webpack_require__(721);

	var _isSafeInteger2 = _interopRequireDefault(_isSafeInteger);

	exports['default'] = function (_ref2) {
	  var props = (0, _objectWithoutProperties3['default'])(_ref2, []);

	  return _react2['default'].createElement(_JSONNestedNode2['default'], (0, _extends3['default'])({}, props, {
	    nodeType: 'Iterable',
	    nodeTypeIndicator: '()',
	    createItemString: createItemString
	  }));
	};

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _JSONNestedNode = __webpack_require__(701);

	var _JSONNestedNode2 = _interopRequireDefault(_JSONNestedNode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	// Returns the "n Items" string for this node, generating and caching it if it hasn't been created yet.
	function createItemString(data, limit) {
	  var count = 0;
	  var hasMore = false;
	  if ((0, _isSafeInteger2.default)(data.size)) {
	    count = data.size;
	  } else {
	    for (var _iterator = data, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
	      var _ref;

	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }

	      var entry = _ref;
	      // eslint-disable-line no-unused-vars
	      if (limit && count + 1 > limit) {
	        hasMore = true;
	        break;
	      }
	      count += 1;
	    }
	  }
	  return '' + (hasMore ? '>' : '') + count + ' ' + (count !== 1 ? 'entries' : 'entry');
	}

	// Configures <JSONNestedNode> to render an iterable

/***/ },

/***/ 721:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(722), __esModule: true };

/***/ },

/***/ 722:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(723);
	module.exports = __webpack_require__(616).Number.isSafeInteger;

/***/ },

/***/ 723:
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.5 Number.isSafeInteger(number)
	var $export   = __webpack_require__(614)
	  , isInteger = __webpack_require__(724)
	  , abs       = Math.abs;

	$export($export.S, 'Number', {
	  isSafeInteger: function isSafeInteger(number){
	    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
	  }
	});

/***/ },

/***/ 724:
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var isObject = __webpack_require__(622)
	  , floor    = Math.floor;
	module.exports = function isInteger(it){
	  return !isObject(it) && isFinite(it) && floor(it) === it;
	};

/***/ },

/***/ 725:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = undefined;

	var _extends2 = __webpack_require__(610);

	var _extends3 = _interopRequireDefault(_extends2);

	var _classCallCheck2 = __webpack_require__(649);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(650);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(686);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _dec, _class, _class2, _temp;

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactMixin = __webpack_require__(702);

	var _reactMixin2 = _interopRequireDefault(_reactMixin);

	var _mixins = __webpack_require__(705);

	var _hexToRgb = __webpack_require__(726);

	var _hexToRgb2 = _interopRequireDefault(_hexToRgb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * Renders simple values (eg. strings, numbers, booleans, etc)
	 */

	var styles = {
	  base: {
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14,
	    WebkitUserSelect: 'text',
	    MozUserSelect: 'text'
	  },
	  label: {
	    display: 'inline-block',
	    marginRight: 5
	  }
	};

	var JSONValueNode = (_dec = _reactMixin2.default.decorate(_mixins.SquashClickEventMixin), _dec(_class = (_temp = _class2 = function (_React$Component) {
	  (0, _inherits3.default)(JSONValueNode, _React$Component);

	  function JSONValueNode() {
	    (0, _classCallCheck3.default)(this, JSONValueNode);
	    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
	  }

	  JSONValueNode.prototype.render = function render() {
	    var _props;

	    var backgroundColor = 'transparent';
	    if (this.props.previousValue !== this.props.value) {
	      var bgColor = (0, _hexToRgb2.default)(this.props.theme.base06);
	      backgroundColor = 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', 0.1)';
	    }

	    return _react2.default.createElement(
	      'li',
	      { style: (0, _extends3.default)({}, styles.base, { backgroundColor: backgroundColor }), onClick: this.handleClick.bind(this) },
	      _react2.default.createElement(
	        'label',
	        { style: (0, _extends3.default)({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle(this.props.nodeType, true)) },
	        (_props = this.props).labelRenderer.apply(_props, this.props.keyPath),
	        ':'
	      ),
	      _react2.default.createElement(
	        'span',
	        { style: (0, _extends3.default)({
	            color: this.props.valueColor
	          }, this.props.styles.getValueStyle(this.props.nodeType, true)) },
	        this.props.valueRenderer(this.props.valueGetter(this.props.value), this.props.value)
	      )
	    );
	  };

	  return JSONValueNode;
	}(_react2.default.Component), _class2.defaultProps = {
	  valueGetter: function valueGetter(value) {
	    return value;
	  }
	}, _temp)) || _class);
	exports['default'] = JSONValueNode;

/***/ },

/***/ 726:
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports["default"] = function (hex) {
	  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	  return result ? {
	    r: parseInt(result[1], 16),
	    g: parseInt(result[2], 16),
	    b: parseInt(result[3], 16)
	  } : null;
	};

/***/ },

/***/ 727:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  scheme: 'solarized',
	  author: 'ethan schoonover (http://ethanschoonover.com/solarized)',
	  base00: '#002b36',
	  base01: '#073642',
	  base02: '#586e75',
	  base03: '#657b83',
	  base04: '#839496',
	  base05: '#93a1a1',
	  base06: '#eee8d5',
	  base07: '#fdf6e3',
	  base08: '#dc322f',
	  base09: '#cb4b16',
	  base0A: '#b58900',
	  base0B: '#859900',
	  base0C: '#2aa198',
	  base0D: '#268bd2',
	  base0E: '#6c71c4',
	  base0F: '#d33682'
	};

/***/ },

/***/ 728:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.__esModule = true;

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactJsonTree = __webpack_require__(609);

	var _reactJsonTree2 = _interopRequireDefault(_reactJsonTree);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var styles = {
	  actionBar: {
	    paddingTop: 8,
	    paddingBottom: 7,
	    paddingLeft: 16
	  },
	  payload: {
	    margin: 0,
	    overflow: 'auto'
	  }
	};

	var LogMonitorAction = (function (_Component) {
	  _inherits(LogMonitorAction, _Component);

	  function LogMonitorAction(props) {
	    _classCallCheck(this, LogMonitorAction);

	    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

	    _this.shouldExpandNode = _this.shouldExpandNode.bind(_this);
	    return _this;
	  }

	  LogMonitorAction.prototype.renderPayload = function renderPayload(payload) {
	    return _react2.default.createElement(
	      'div',
	      { style: _extends({}, styles.payload, {
	          backgroundColor: this.props.theme.base00
	        }) },
	      Object.keys(payload).length > 0 ? _react2.default.createElement(_reactJsonTree2.default, { theme: this.props.theme,
	        keyPath: ['action'],
	        data: payload,
	        shouldExpandNode: this.shouldExpandNode }) : ''
	    );
	  };

	  LogMonitorAction.prototype.shouldExpandNode = function shouldExpandNode() {
	    return this.props.expandActionRoot;
	  };

	  LogMonitorAction.prototype.render = function render() {
	    var _props$action = this.props.action;
	    var type = _props$action.type;

	    var payload = _objectWithoutProperties(_props$action, ['type']);

	    return _react2.default.createElement(
	      'div',
	      { style: _extends({
	          backgroundColor: this.props.theme.base02,
	          color: this.props.theme.base06
	        }, this.props.style) },
	      _react2.default.createElement(
	        'div',
	        { style: styles.actionBar,
	          onClick: this.props.onClick },
	        type.toString()
	      ),
	      !this.props.collapsed ? this.renderPayload(payload) : ''
	    );
	  };

	  return LogMonitorAction;
	})(_react.Component);

	exports.default = LogMonitorAction;

/***/ },

/***/ 729:
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeMin = Math.min;

	/**
	 * Gets the timestamp of the number of milliseconds that have elapsed since
	 * the Unix epoch (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Date
	 * @returns {number} Returns the timestamp.
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => Logs the number of milliseconds it took for the deferred invocation.
	 */
	var now = function() {
	  return root.Date.now();
	};

	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed `func` invocations and a `flush` method to immediately invoke them.
	 * Provide `options` to indicate whether `func` should be invoked on the
	 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	 * with the last arguments provided to the debounced function. Subsequent
	 * calls to the debounced function return the result of the last `func`
	 * invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the debounced function
	 * is invoked more than once during the `wait` timeout.
	 *
	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=false]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {number} [options.maxWait]
	 *  The maximum time `func` is allowed to be delayed before it's invoked.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // Avoid costly calculations while the window size is in flux.
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
	 * jQuery(element).on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
	 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', debounced);
	 *
	 * // Cancel the trailing debounced invocation.
	 * jQuery(window).on('popstate', debounced.cancel);
	 */
	function debounce(func, wait, options) {
	  var lastArgs,
	      lastThis,
	      maxWait,
	      result,
	      timerId,
	      lastCallTime,
	      lastInvokeTime = 0,
	      leading = false,
	      maxing = false,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = toNumber(wait) || 0;
	  if (isObject(options)) {
	    leading = !!options.leading;
	    maxing = 'maxWait' in options;
	    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }

	  function invokeFunc(time) {
	    var args = lastArgs,
	        thisArg = lastThis;

	    lastArgs = lastThis = undefined;
	    lastInvokeTime = time;
	    result = func.apply(thisArg, args);
	    return result;
	  }

	  function leadingEdge(time) {
	    // Reset any `maxWait` timer.
	    lastInvokeTime = time;
	    // Start the timer for the trailing edge.
	    timerId = setTimeout(timerExpired, wait);
	    // Invoke the leading edge.
	    return leading ? invokeFunc(time) : result;
	  }

	  function remainingWait(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime,
	        result = wait - timeSinceLastCall;

	    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
	  }

	  function shouldInvoke(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime;

	    // Either this is the first call, activity has stopped and we're at the
	    // trailing edge, the system time has gone backwards and we're treating
	    // it as the trailing edge, or we've hit the `maxWait` limit.
	    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
	      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
	  }

	  function timerExpired() {
	    var time = now();
	    if (shouldInvoke(time)) {
	      return trailingEdge(time);
	    }
	    // Restart the timer.
	    timerId = setTimeout(timerExpired, remainingWait(time));
	  }

	  function trailingEdge(time) {
	    timerId = undefined;

	    // Only invoke if we have `lastArgs` which means `func` has been
	    // debounced at least once.
	    if (trailing && lastArgs) {
	      return invokeFunc(time);
	    }
	    lastArgs = lastThis = undefined;
	    return result;
	  }

	  function cancel() {
	    if (timerId !== undefined) {
	      clearTimeout(timerId);
	    }
	    lastInvokeTime = 0;
	    lastArgs = lastCallTime = lastThis = timerId = undefined;
	  }

	  function flush() {
	    return timerId === undefined ? result : trailingEdge(now());
	  }

	  function debounced() {
	    var time = now(),
	        isInvoking = shouldInvoke(time);

	    lastArgs = arguments;
	    lastThis = this;
	    lastCallTime = time;

	    if (isInvoking) {
	      if (timerId === undefined) {
	        return leadingEdge(lastCallTime);
	      }
	      if (maxing) {
	        // Handle invocations in a tight loop.
	        timerId = setTimeout(timerExpired, wait);
	        return invokeFunc(lastCallTime);
	      }
	    }
	    if (timerId === undefined) {
	      timerId = setTimeout(timerExpired, wait);
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  debounced.flush = flush;
	  return debounced;
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}

	module.exports = debounce;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 730:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.default = undefined;

	var _DockMonitor = __webpack_require__(731);

	var _DockMonitor2 = _interopRequireDefault(_DockMonitor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _DockMonitor2.default;

/***/ },

/***/ 731:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactDock = __webpack_require__(732);

	var _reactDock2 = _interopRequireDefault(_reactDock);

	var _constants = __webpack_require__(761);

	var _actions = __webpack_require__(762);

	var _reducers = __webpack_require__(763);

	var _reducers2 = _interopRequireDefault(_reducers);

	var _parseKey = __webpack_require__(764);

	var _parseKey2 = _interopRequireDefault(_parseKey);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var DockMonitor = function (_Component) {
	  _inherits(DockMonitor, _Component);

	  function DockMonitor(props) {
	    _classCallCheck(this, DockMonitor);

	    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

	    _this.handleKeyDown = _this.handleKeyDown.bind(_this);
	    _this.handleSizeChange = _this.handleSizeChange.bind(_this);

	    var childrenCount = _react.Children.count(props.children);
	    if (childrenCount === 0) {
	      console.error('<DockMonitor> requires at least one monitor inside. ' + 'Why don’t you try <LogMonitor>? You can get it at ' + 'https://github.com/gaearon/redux-devtools-log-monitor.');
	    } else if (childrenCount > 1 && !props.changeMonitorKey) {
	      console.error('You specified multiple monitors inside <DockMonitor> ' + 'but did not provide `changeMonitorKey` prop to change them. ' + 'Try specifying <DockMonitor changeMonitorKey="ctrl-m" /> ' + 'and then press Ctrl-M.');
	    }
	    return _this;
	  }

	  DockMonitor.prototype.componentDidMount = function componentDidMount() {
	    window.addEventListener('keydown', this.handleKeyDown);
	  };

	  DockMonitor.prototype.componentWillUnmount = function componentWillUnmount() {
	    window.removeEventListener('keydown', this.handleKeyDown);
	  };

	  DockMonitor.prototype.matchesKey = function matchesKey(key, event) {
	    if (!key) {
	      return false;
	    }

	    var charCode = event.keyCode || event.which;
	    var char = String.fromCharCode(charCode);
	    return key.name.toUpperCase() === char.toUpperCase() && key.alt === event.altKey && key.ctrl === event.ctrlKey && key.meta === event.metaKey && key.shift === event.shiftKey;
	  };

	  DockMonitor.prototype.handleKeyDown = function handleKeyDown(e) {
	    // Ignore regular keys when focused on a field
	    // and no modifiers are active.
	    if (!e.ctrlKey && !e.metaKey && !e.altKey && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
	      return;
	    }

	    var visibilityKey = (0, _parseKey2.default)(this.props.toggleVisibilityKey);
	    var positionKey = (0, _parseKey2.default)(this.props.changePositionKey);

	    var monitorKey = void 0;
	    if (this.props.changeMonitorKey) {
	      monitorKey = (0, _parseKey2.default)(this.props.changeMonitorKey);
	    }

	    if (this.matchesKey(visibilityKey, e)) {
	      e.preventDefault();
	      this.props.dispatch((0, _actions.toggleVisibility)());
	    } else if (this.matchesKey(positionKey, e)) {
	      e.preventDefault();
	      this.props.dispatch((0, _actions.changePosition)());
	    } else if (this.matchesKey(monitorKey, e)) {
	      e.preventDefault();
	      this.props.dispatch((0, _actions.changeMonitor)());
	    }
	  };

	  DockMonitor.prototype.handleSizeChange = function handleSizeChange(requestedSize) {
	    this.props.dispatch((0, _actions.changeSize)(requestedSize));
	  };

	  DockMonitor.prototype.renderChild = function renderChild(child, index, otherProps) {
	    var monitorState = this.props.monitorState;
	    var childMonitorIndex = monitorState.childMonitorIndex;
	    var childMonitorStates = monitorState.childMonitorStates;


	    if (index !== childMonitorIndex) {
	      return null;
	    }

	    return (0, _react.cloneElement)(child, _extends({
	      monitorState: childMonitorStates[index]
	    }, otherProps));
	  };

	  DockMonitor.prototype.render = function render() {
	    var _this2 = this;

	    var _props = this.props;
	    var monitorState = _props.monitorState;
	    var children = _props.children;
	    var fluid = _props.fluid;

	    var rest = _objectWithoutProperties(_props, ['monitorState', 'children', 'fluid']);

	    var position = monitorState.position;
	    var isVisible = monitorState.isVisible;
	    var size = monitorState.size;


	    return _react2.default.createElement(
	      _reactDock2.default,
	      { position: position,
	        isVisible: isVisible,
	        size: size,
	        fluid: fluid,
	        onSizeChange: this.handleSizeChange,
	        dimMode: 'none' },
	      _react.Children.map(children, function (child, index) {
	        return _this2.renderChild(child, index, rest);
	      })
	    );
	  };

	  return DockMonitor;
	}(_react.Component);

	DockMonitor.update = _reducers2.default;
	DockMonitor.propTypes = {
	  defaultPosition: _react.PropTypes.oneOf(_constants.POSITIONS).isRequired,
	  defaultIsVisible: _react.PropTypes.bool.isRequired,
	  defaultSize: _react.PropTypes.number.isRequired,
	  toggleVisibilityKey: _react.PropTypes.string.isRequired,
	  changePositionKey: _react.PropTypes.string.isRequired,
	  changeMonitorKey: _react.PropTypes.string,
	  fluid: _react.PropTypes.bool,

	  dispatch: _react.PropTypes.func,
	  monitorState: _react.PropTypes.shape({
	    position: _react.PropTypes.oneOf(_constants.POSITIONS).isRequired,
	    size: _react.PropTypes.number.isRequired,
	    isVisible: _react.PropTypes.bool.isRequired,
	    childMonitorState: _react.PropTypes.any
	  })
	};
	DockMonitor.defaultProps = {
	  defaultIsVisible: true,
	  defaultPosition: 'right',
	  defaultSize: 0.3,
	  fluid: true
	};
	exports.default = DockMonitor;

/***/ },

/***/ 732:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(733)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _Dock = __webpack_require__(735);

	var _Dock2 = _interopRequireDefault(_Dock);

	exports['default'] = _Dock2['default'];
	module.exports = exports['default'];

/***/ },

/***/ 735:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _get = __webpack_require__(736)['default'];

	var _inherits = __webpack_require__(686)['default'];

	var _createClass = __webpack_require__(743)['default'];

	var _classCallCheck = __webpack_require__(748)['default'];

	var _extends = __webpack_require__(610)['default'];

	var _toConsumableArray = __webpack_require__(749)['default'];

	var _Object$keys = __webpack_require__(715)['default'];

	var _interopRequireDefault = __webpack_require__(733)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _lodashDebounce = __webpack_require__(758);

	var _lodashDebounce2 = _interopRequireDefault(_lodashDebounce);

	var _objectAssign = __webpack_require__(7);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _autoprefix = __webpack_require__(760);

	var _autoprefix2 = _interopRequireDefault(_autoprefix);

	function autoprefixes(styles) {
	  return _Object$keys(styles).reduce(function (obj, key) {
	    return (obj[key] = (0, _autoprefix2['default'])(styles[key]), obj);
	  }, {});
	}

	var styles = autoprefixes({
	  wrapper: {
	    position: 'fixed',
	    width: 0,
	    height: 0,
	    top: 0,
	    left: 0
	  },

	  dim: {
	    position: 'fixed',
	    left: 0,
	    right: 0,
	    top: 0,
	    bottom: 0,
	    zIndex: 0,
	    background: 'rgba(0, 0, 0, 0.2)',
	    opacity: 1
	  },

	  dimAppear: {
	    opacity: 0
	  },

	  dimTransparent: {
	    pointerEvents: 'none'
	  },

	  dimHidden: {
	    opacity: 0
	  },

	  dock: {
	    position: 'fixed',
	    zIndex: 1,
	    boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)',
	    background: 'white',
	    left: 0,
	    top: 0,
	    width: '100%',
	    height: '100%'
	  },

	  dockHidden: {
	    opacity: 0
	  },

	  dockResizing: {
	    transition: 'none'
	  },

	  dockContent: {
	    width: '100%',
	    height: '100%',
	    overflow: 'auto'
	  },

	  resizer: {
	    position: 'absolute',
	    zIndex: 2,
	    opacity: 0
	  }
	});

	function getTransitions(duration) {
	  return ['left', 'top', 'width', 'height'].map(function (p) {
	    return p + ' ' + duration / 1000 + 's ease-out';
	  });
	}

	function getDockStyles(_ref, _ref2) {
	  var fluid = _ref.fluid;
	  var dockStyle = _ref.dockStyle;
	  var dockHiddenStyle = _ref.dockHiddenStyle;
	  var duration = _ref.duration;
	  var position = _ref.position;
	  var isVisible = _ref.isVisible;
	  var size = _ref2.size;
	  var isResizing = _ref2.isResizing;
	  var fullWidth = _ref2.fullWidth;
	  var fullHeight = _ref2.fullHeight;

	  var posStyle = undefined;
	  var absSize = fluid ? size * 100 + '%' : size + 'px';

	  function getRestSize(fullSize) {
	    return fluid ? 100 - size * 100 + '%' : fullSize - size + 'px';
	  }

	  switch (position) {
	    case 'left':
	      posStyle = {
	        width: absSize,
	        left: isVisible ? 0 : '-' + absSize
	      };
	      break;
	    case 'right':
	      posStyle = {
	        left: isVisible ? getRestSize(fullWidth) : fullWidth,
	        width: absSize
	      };
	      break;
	    case 'top':
	      posStyle = {
	        top: isVisible ? 0 : '-' + absSize,
	        height: absSize
	      };
	      break;
	    case 'bottom':
	      posStyle = {
	        top: isVisible ? getRestSize(fullHeight) : fullHeight,
	        height: absSize
	      };
	      break;
	  }

	  var transitions = getTransitions(duration);

	  return [styles.dock, (0, _autoprefix2['default'])({
	    transition: [].concat(_toConsumableArray(transitions), [!isVisible && 'opacity 0.01s linear ' + duration / 1000 + 's']).filter(function (t) {
	      return t;
	    }).join(',')
	  }), dockStyle, (0, _autoprefix2['default'])(posStyle), isResizing && styles.dockResizing, !isVisible && styles.dockHidden, !isVisible && dockHiddenStyle];
	}

	function getDimStyles(_ref3, _ref4) {
	  var dimMode = _ref3.dimMode;
	  var dimStyle = _ref3.dimStyle;
	  var duration = _ref3.duration;
	  var isVisible = _ref3.isVisible;
	  var isTransitionStarted = _ref4.isTransitionStarted;

	  return [styles.dim, (0, _autoprefix2['default'])({
	    transition: 'opacity ' + duration / 1000 + 's ease-out'
	  }), dimStyle, dimMode === 'transparent' && styles.dimTransparent, !isVisible && styles.dimHidden, isTransitionStarted && isVisible && styles.dimAppear, isTransitionStarted && !isVisible && styles.dimDisappear];
	}

	function getResizerStyles(position) {
	  var resizerStyle = undefined;
	  var size = 10;

	  switch (position) {
	    case 'left':
	      resizerStyle = {
	        right: -size / 2,
	        width: size,
	        top: 0,
	        height: '100%',
	        cursor: 'col-resize'
	      };
	      break;
	    case 'right':
	      resizerStyle = {
	        left: -size / 2,
	        width: size,
	        top: 0,
	        height: '100%',
	        cursor: 'col-resize'
	      };
	      break;
	    case 'top':
	      resizerStyle = {
	        bottom: -size / 2,
	        height: size,
	        left: 0,
	        width: '100%',
	        cursor: 'row-resize'
	      };
	      break;
	    case 'bottom':
	      resizerStyle = {
	        top: -size / 2,
	        height: size,
	        left: 0,
	        width: '100%',
	        cursor: 'row-resize'
	      };
	      break;
	  }

	  return [styles.resizer, (0, _autoprefix2['default'])(resizerStyle)];
	}

	function getFullSize(position, fullWidth, fullHeight) {
	  return position === 'left' || position === 'right' ? fullWidth : fullHeight;
	}

	var Dock = (function (_Component) {
	  _inherits(Dock, _Component);

	  function Dock(props) {
	    var _this = this;

	    _classCallCheck(this, Dock);

	    _get(Object.getPrototypeOf(Dock.prototype), 'constructor', this).call(this, props);

	    this.transitionEnd = function () {
	      _this.setState({ isTransitionStarted: false });
	    };

	    this.hideDim = function () {
	      if (!_this.props.isVisible) {
	        _this.setState({ isDimHidden: true });
	      }
	    };

	    this.handleDimClick = function () {
	      if (_this.props.dimMode === 'opaque') {
	        _this.props.onVisibleChange && _this.props.onVisibleChange(false);
	      }
	    };

	    this.handleResize = function () {
	      if (window.requestAnimationFrame) {
	        window.requestAnimationFrame(_this.updateWindowSize.bind(_this, true));
	      } else {
	        _this.updateWindowSize(true);
	      }
	    };

	    this.updateWindowSize = function (windowResize) {
	      var sizeState = {
	        fullWidth: window.innerWidth,
	        fullHeight: window.innerHeight
	      };

	      if (windowResize) {
	        _this.setState(_extends({}, sizeState, {
	          isResizing: true,
	          isWindowResizing: windowResize
	        }));

	        _this.debouncedUpdateWindowSizeEnd();
	      } else {
	        _this.setState(sizeState);
	      }
	    };

	    this.updateWindowSizeEnd = function () {
	      _this.setState({
	        isResizing: false,
	        isWindowResizing: false
	      });
	    };

	    this.debouncedUpdateWindowSizeEnd = (0, _lodashDebounce2['default'])(this.updateWindowSizeEnd, 30);

	    this.handleWrapperLeave = function () {
	      _this.setState({ isResizing: false });
	    };

	    this.handleMouseDown = function () {
	      _this.setState({ isResizing: true });
	    };

	    this.handleMouseUp = function () {
	      _this.setState({ isResizing: false });
	    };

	    this.handleMouseMove = function (e) {
	      if (!_this.state.isResizing || _this.state.isWindowResizing) return;
	      e.preventDefault();

	      var _props = _this.props;
	      var position = _props.position;
	      var fluid = _props.fluid;
	      var _state = _this.state;
	      var fullWidth = _state.fullWidth;
	      var fullHeight = _state.fullHeight;
	      var isControlled = _state.isControlled;
	      var x = e.clientX;
	      var y = e.clientY;

	      var size = undefined;

	      switch (position) {
	        case 'left':
	          size = fluid ? x / fullWidth : x;
	          break;
	        case 'right':
	          size = fluid ? (fullWidth - x) / fullWidth : fullWidth - x;
	          break;
	        case 'top':
	          size = fluid ? y / fullHeight : y;
	          break;
	        case 'bottom':
	          size = fluid ? (fullHeight - y) / fullHeight : fullHeight - y;
	          break;
	      }

	      _this.props.onSizeChange && _this.props.onSizeChange(size);

	      if (!isControlled) {
	        _this.setState({ size: size });
	      }
	    };

	    this.state = {
	      isControlled: typeof props.size !== 'undefined',
	      size: props.size || props.defaultSize,
	      isDimHidden: !props.isVisible,
	      fullWidth: typeof window !== 'undefined' && window.innerWidth,
	      fullHeight: typeof window !== 'undefined' && window.innerHeight,
	      isTransitionStarted: false,
	      isWindowResizing: false
	    };
	  }

	  _createClass(Dock, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      window.addEventListener('mouseup', this.handleMouseUp);
	      window.addEventListener('mousemove', this.handleMouseMove);
	      window.addEventListener('resize', this.handleResize);

	      if (!window.fullWidth) {
	        this.updateWindowSize();
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      window.removeEventListener('mouseup', this.handleMouseUp);
	      window.removeEventListener('mousemove', this.handleMouseMove);
	      window.removeEventListener('resize', this.handleResize);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var isControlled = typeof nextProps.size !== 'undefined';

	      this.setState({ isControlled: isControlled });

	      if (isControlled && this.props.size !== nextProps.size) {
	        this.setState({ size: nextProps.size });
	      } else if (this.props.fluid !== nextProps.fluid) {
	        this.updateSize(nextProps);
	      }

	      if (this.props.isVisible !== nextProps.isVisible) {
	        this.setState({
	          isTransitionStarted: true
	        });
	      }
	    }
	  }, {
	    key: 'updateSize',
	    value: function updateSize(props) {
	      var _state2 = this.state;
	      var fullWidth = _state2.fullWidth;
	      var fullHeight = _state2.fullHeight;

	      this.setState({
	        size: props.fluid ? this.state.size / getFullSize(props.position, fullWidth, fullHeight) : getFullSize(props.position, fullWidth, fullHeight) * this.state.size
	      });
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps) {
	      var _this2 = this;

	      if (this.props.isVisible !== prevProps.isVisible) {
	        if (!this.props.isVisible) {
	          window.setTimeout(function () {
	            return _this2.hideDim();
	          }, this.props.duration);
	        } else {
	          this.setState({ isDimHidden: false });
	        }

	        window.setTimeout(function () {
	          return _this2.setState({ isTransitionStarted: false });
	        }, 0);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props2 = this.props;
	      var children = _props2.children;
	      var zIndex = _props2.zIndex;
	      var dimMode = _props2.dimMode;
	      var position = _props2.position;
	      var isVisible = _props2.isVisible;
	      var _state3 = this.state;
	      var isResizing = _state3.isResizing;
	      var size = _state3.size;
	      var isDimHidden = _state3.isDimHidden;

	      var dimStyles = _objectAssign2['default'].apply(undefined, [{}].concat(_toConsumableArray(getDimStyles(this.props, this.state))));
	      var dockStyles = _objectAssign2['default'].apply(undefined, [{}].concat(_toConsumableArray(getDockStyles(this.props, this.state))));
	      var resizerStyles = _objectAssign2['default'].apply(undefined, [{}].concat(_toConsumableArray(getResizerStyles(position))));

	      return _react2['default'].createElement(
	        'div',
	        { style: (0, _objectAssign2['default'])({}, styles.wrapper, { zIndex: zIndex }) },
	        dimMode !== 'none' && !isDimHidden && _react2['default'].createElement('div', { style: dimStyles, onClick: this.handleDimClick }),
	        _react2['default'].createElement(
	          'div',
	          { style: dockStyles },
	          _react2['default'].createElement('div', { style: resizerStyles,
	            onMouseDown: this.handleMouseDown }),
	          _react2['default'].createElement(
	            'div',
	            { style: styles.dockContent },
	            typeof children === 'function' ? children({
	              position: position,
	              isResizing: isResizing,
	              size: size,
	              isVisible: isVisible
	            }) : children
	          )
	        )
	      );
	    }
	  }], [{
	    key: 'propTypes',
	    value: {
	      position: _react.PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
	      zIndex: _react.PropTypes.number,
	      fluid: _react.PropTypes.bool,
	      size: _react.PropTypes.number,
	      defaultSize: _react.PropTypes.number,
	      dimMode: _react.PropTypes.oneOf(['none', 'transparent', 'opaque']),
	      isVisible: _react.PropTypes.bool,
	      onVisibleChange: _react.PropTypes.func,
	      onSizeChange: _react.PropTypes.func,
	      dimStyle: _react.PropTypes.object,
	      dockStyle: _react.PropTypes.object,
	      duration: _react.PropTypes.number
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      position: 'left',
	      zIndex: 99999999,
	      fluid: true,
	      defaultSize: 0.3,
	      dimMode: 'opaque',
	      duration: 200
	    },
	    enumerable: true
	  }]);

	  return Dock;
	})(_react.Component);

	exports['default'] = Dock;
	module.exports = exports['default'];

/***/ },

/***/ 749:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(750);

/***/ },

/***/ 750:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _from = __webpack_require__(751);

	var _from2 = _interopRequireDefault(_from);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }

	    return arr2;
	  } else {
	    return (0, _from2.default)(arr);
	  }
	};

/***/ },

/***/ 758:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var getNative = __webpack_require__(759);

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeNow = getNative(Date, 'now');

	/**
	 * Gets the number of milliseconds that have elapsed since the Unix epoch
	 * (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @category Date
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => logs the number of milliseconds it took for the deferred function to be invoked
	 */
	var now = nativeNow || function() {
	  return new Date().getTime();
	};

	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed invocations. Provide an options object to indicate that `func`
	 * should be invoked on the leading and/or trailing edge of the `wait` timeout.
	 * Subsequent calls to the debounced function return the result of the last
	 * `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	 * on the trailing edge of the timeout only if the the debounced function is
	 * invoked more than once during the `wait` timeout.
	 *
	 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options] The options object.
	 * @param {boolean} [options.leading=false] Specify invoking on the leading
	 *  edge of the timeout.
	 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
	 *  delayed before it is invoked.
	 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	 *  edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // avoid costly calculations while the window size is in flux
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
	 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // ensure `batchLog` is invoked once after 1 second of debounced calls
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', _.debounce(batchLog, 250, {
	 *   'maxWait': 1000
	 * }));
	 *
	 * // cancel a debounced call
	 * var todoChanges = _.debounce(batchLog, 1000);
	 * Object.observe(models.todo, todoChanges);
	 *
	 * Object.observe(models, function(changes) {
	 *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
	 *     todoChanges.cancel();
	 *   }
	 * }, ['delete']);
	 *
	 * // ...at some point `models.todo` is changed
	 * models.todo.completed = true;
	 *
	 * // ...before 1 second has passed `models.todo` is deleted
	 * // which cancels the debounced `todoChanges` call
	 * delete models.todo;
	 */
	function debounce(func, wait, options) {
	  var args,
	      maxTimeoutId,
	      result,
	      stamp,
	      thisArg,
	      timeoutId,
	      trailingCall,
	      lastCalled = 0,
	      maxWait = false,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = wait < 0 ? 0 : (+wait || 0);
	  if (options === true) {
	    var leading = true;
	    trailing = false;
	  } else if (isObject(options)) {
	    leading = !!options.leading;
	    maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }

	  function cancel() {
	    if (timeoutId) {
	      clearTimeout(timeoutId);
	    }
	    if (maxTimeoutId) {
	      clearTimeout(maxTimeoutId);
	    }
	    lastCalled = 0;
	    maxTimeoutId = timeoutId = trailingCall = undefined;
	  }

	  function complete(isCalled, id) {
	    if (id) {
	      clearTimeout(id);
	    }
	    maxTimeoutId = timeoutId = trailingCall = undefined;
	    if (isCalled) {
	      lastCalled = now();
	      result = func.apply(thisArg, args);
	      if (!timeoutId && !maxTimeoutId) {
	        args = thisArg = undefined;
	      }
	    }
	  }

	  function delayed() {
	    var remaining = wait - (now() - stamp);
	    if (remaining <= 0 || remaining > wait) {
	      complete(trailingCall, maxTimeoutId);
	    } else {
	      timeoutId = setTimeout(delayed, remaining);
	    }
	  }

	  function maxDelayed() {
	    complete(trailing, timeoutId);
	  }

	  function debounced() {
	    args = arguments;
	    stamp = now();
	    thisArg = this;
	    trailingCall = trailing && (timeoutId || !leading);

	    if (maxWait === false) {
	      var leadingCall = leading && !timeoutId;
	    } else {
	      if (!maxTimeoutId && !leading) {
	        lastCalled = stamp;
	      }
	      var remaining = maxWait - (stamp - lastCalled),
	          isCalled = remaining <= 0 || remaining > maxWait;

	      if (isCalled) {
	        if (maxTimeoutId) {
	          maxTimeoutId = clearTimeout(maxTimeoutId);
	        }
	        lastCalled = stamp;
	        result = func.apply(thisArg, args);
	      }
	      else if (!maxTimeoutId) {
	        maxTimeoutId = setTimeout(maxDelayed, remaining);
	      }
	    }
	    if (isCalled && timeoutId) {
	      timeoutId = clearTimeout(timeoutId);
	    }
	    else if (!timeoutId && wait !== maxWait) {
	      timeoutId = setTimeout(delayed, wait);
	    }
	    if (leadingCall) {
	      isCalled = true;
	      result = func.apply(thisArg, args);
	    }
	    if (isCalled && !timeoutId && !maxTimeoutId) {
	      args = thisArg = undefined;
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  return debounced;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = debounce;


/***/ },

/***/ 759:
/***/ function(module, exports) {

	/**
	 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = getNative;


/***/ },

/***/ 760:
/***/ function(module, exports, __webpack_require__) {

	// Same as https://github.com/SimenB/react-vendor-prefixes/blob/master/src/index.js,
	// but dumber

	'use strict';

	var _extends = __webpack_require__(610)['default'];

	var _Object$keys = __webpack_require__(715)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = autoprefix;
	var vendorSpecificProperties = ['animation', 'animationDelay', 'animationDirection', 'animationDuration', 'animationFillMode', 'animationIterationCount', 'animationName', 'animationPlayState', 'animationTimingFunction', 'appearance', 'backfaceVisibility', 'backgroundClip', 'borderImage', 'borderImageSlice', 'boxSizing', 'boxShadow', 'contentColumns', 'transform', 'transformOrigin', 'transformStyle', 'transition', 'transitionDelay', 'transitionDuration', 'transitionProperty', 'transitionTimingFunction', 'perspective', 'perspectiveOrigin', 'userSelect'];

	var prefixes = ['Moz', 'Webkit', 'ms', 'O'];

	function prefixProp(key, value) {
	  return prefixes.reduce(function (obj, pre) {
	    return (obj[pre + key[0].toUpperCase() + key.substr(1)] = value, obj);
	  }, {});
	}

	function autoprefix(style) {
	  return _Object$keys(style).reduce(function (obj, key) {
	    return vendorSpecificProperties.indexOf(key) !== -1 ? _extends({}, obj, prefixProp(key, style[key])) : obj;
	  }, style);
	}

	module.exports = exports['default'];

/***/ },

/***/ 761:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	var POSITIONS = exports.POSITIONS = ['left', 'top', 'right', 'bottom'];

/***/ },

/***/ 762:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.toggleVisibility = toggleVisibility;
	exports.changePosition = changePosition;
	exports.changeSize = changeSize;
	exports.changeMonitor = changeMonitor;
	var TOGGLE_VISIBILITY = exports.TOGGLE_VISIBILITY = '@@redux-devtools-log-monitor/TOGGLE_VISIBILITY';
	function toggleVisibility() {
	  return { type: TOGGLE_VISIBILITY };
	}

	var CHANGE_POSITION = exports.CHANGE_POSITION = '@@redux-devtools-log-monitor/CHANGE_POSITION';
	function changePosition() {
	  return { type: CHANGE_POSITION };
	}

	var CHANGE_SIZE = exports.CHANGE_SIZE = '@@redux-devtools-log-monitor/CHANGE_SIZE';
	function changeSize(size) {
	  return { type: CHANGE_SIZE, size: size };
	}

	var CHANGE_MONITOR = exports.CHANGE_MONITOR = '@@redux-devtools-log-monitor/CHANGE_MONITOR';
	function changeMonitor() {
	  return { type: CHANGE_MONITOR };
	}

/***/ },

/***/ 763:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.default = reducer;

	var _actions = __webpack_require__(762);

	var _constants = __webpack_require__(761);

	var _react = __webpack_require__(4);

	function position(props) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? props.defaultPosition : arguments[1];
	  var action = arguments[2];

	  return action.type === _actions.CHANGE_POSITION ? _constants.POSITIONS[(_constants.POSITIONS.indexOf(state) + 1) % _constants.POSITIONS.length] : state;
	}

	function size(props) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? props.defaultSize : arguments[1];
	  var action = arguments[2];

	  return action.type === _actions.CHANGE_SIZE ? action.size : state;
	}

	function isVisible(props) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? props.defaultIsVisible : arguments[1];
	  var action = arguments[2];

	  return action.type === _actions.TOGGLE_VISIBILITY ? !state : state;
	}

	function childMonitorStates(props) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	  var action = arguments[2];

	  return _react.Children.map(props.children, function (child, index) {
	    return child.type.update(child.props, state[index], action);
	  });
	}

	function childMonitorIndex(props) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	  var action = arguments[2];

	  switch (action.type) {
	    case _actions.CHANGE_MONITOR:
	      return (state + 1) % _react.Children.count(props.children);
	    default:
	      return state;
	  }
	}

	function reducer(props) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	  var action = arguments[2];

	  if (!state.childMonitorStates) {
	    _react.Children.forEach(props.children, function (child, index) {
	      if (typeof child.type.update !== 'function') {
	        console.error('Child of <DockMonitor> with the index ' + index + ' ' + ('(' + (child.type.displayName || child.type.name || child.type) + ') ') + 'does not appear to be a valid Redux DevTools monitor.');
	      }
	    });
	  }

	  return {
	    position: position(props, state.position, action),
	    isVisible: isVisible(props, state.isVisible, action),
	    size: size(props, state.size, action),
	    childMonitorIndex: childMonitorIndex(props, state.childMonitorIndex, action),
	    childMonitorStates: childMonitorStates(props, state.childMonitorStates, action)
	  };
	}

/***/ },

/***/ 764:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keycodes = __webpack_require__(765);

	function assertKeyString(s) {
	  if (!/^(ctrl-|shift-|alt-|meta-){0,4}\w+$/.test(s))
	    throw new Error('The string to parse needs to be of the format "c", "ctrl-c", "shift-ctrl-c".');
	}

	module.exports = function parse(s) {
	  var keyString = s.trim().toLowerCase();

	  assertKeyString(keyString);

	  var key = {
	      name     :  undefined
	    , ctrl     :  false
	    , meta     :  false
	    , shift    :  false
	    , alt      :  false
	    , sequence :  undefined
	  }
	  , parts = keyString.split('-')
	  , c;

	  key.name = parts.pop();
	  while((c = parts.pop())) key[c] = true;
	  key.sequence = key.ctrl 
	    ? keycodes.ctrl[key.name] || key.name
	    : keycodes.nomod[key.name] || key.name;

	  // uppercase sequence for single chars when shift was pressed
	  if (key.shift && key.sequence && key.sequence.length === 1)
	    key.sequence = key.sequence.toUpperCase();

	  return key;
	};


/***/ },

/***/ 765:
/***/ function(module, exports) {

	// Most of these are according to this table: http://www.ssicom.org/js/x171166.htm
	// However where nodejs readline diverges, they are adjusted to conform to it
	module.exports = {
	  nomod: {
	      escape: '\u001b'
	    , space: ' ' // actually '\u0020'
	    }
	  , ctrl: {
	        ' ': '\u0000'
	      , 'a': '\u0001'
	      , 'b': '\u0002'
	      , 'c': '\u0003'
	      , 'd': '\u0004'
	      , 'e': '\u0005'
	      , 'f': '\u0006'
	      , 'g': '\u0007'
	      , 'h': '\u0008'
	      , 'i': '\u0009'
	      , 'j': '\u000a'
	      , 'k': '\u000b'
	      , 'm': '\u000c'
	      , 'n': '\u000d'
	      , 'l': '\u000e'
	      , 'o': '\u000f'
	      , 'p': '\u0010'
	      , 'q': '\u0011'
	      , 'r': '\u0012'
	      , 's': '\u0013'
	      , 't': '\u0014'
	      , 'u': '\u0015'
	      , 'v': '\u0016'
	      , 'w': '\u0017'
	      , 'x': '\u0018'
	      , 'y': '\u0019'
	      , 'z': '\u001a'
	      , '[': '\u001b'
	      , '\\':'\u001c'
	      , ']': '\u001d'
	      , '^': '\u001e'
	      , '_': '\u001f'

	      , 'space': '\u0000'
	    }
	};


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
	                        { to: '/export_generator' },
	                        'Export Generator'
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
	      var fields = _props.fields;
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
	        null,
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
	          function () {
	            if (edit) return _react2.default.createElement(
	              'td',
	              null,
	              _react2.default.createElement(
	                'button',
	                { className: 'btn btn-link', onClick: onClickEdit.bind(_this4, entity) },
	                editText
	              )
	            );
	          }()
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

	//import { getInputProcessors, setInputProcessor } from '../../actions/inputProcessorActions';


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
	        pathname: 'input_processor',
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

	      dispatch((0, _inputProcessorActions.clearInputProcessor)());
	      if (action !== "new") dispatch((0, _inputProcessorActions.getProcessorSettings)(file_type));
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
	      };
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
	    key: 'removeField',
	    value: function removeField(index, e) {
	      this.props.onRemoveField.call(this, index);
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
	      var onAddField = _props.onAddField;


	      var selectDelimiterHTML = _react2.default.createElement(
	        'div',
	        { className: 'form-group' },
	        _react2.default.createElement(
	          'div',
	          { className: 'col-lg-3' },
	          _react2.default.createElement(
	            'label',
	            { htmlFor: 'delimiter' },
	            'Delimiter'
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
	            { className: 'col-lg-5' },
	            _react2.default.createElement(
	              'div',
	              { className: 'input-group' },
	              _react2.default.createElement(
	                'div',
	                { className: 'input-group-addon' },
	                _react2.default.createElement('input', { type: 'radio', name: 'delimiter-type',
	                  value: 'separator',
	                  disabled: !settings.get('file_type'),
	                  onChange: onSetDelimiterType,
	                  checked: settings.get('delimiter_type') === "separator" }),
	                'By delimiter'
	              ),
	              _react2.default.createElement('input', { id: 'separator',
	                className: 'form-control',
	                type: 'text',
	                maxLength: '1',
	                disabled: !settings.get('file_type') || settings.get('delimiter_type') !== "separator",
	                style: { width: 35 },
	                onChange: onChangeDelimiter,
	                value: settings.get('delimiter') })
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-3', style: { marginTop: 10 } },
	            _react2.default.createElement('input', { type: 'radio', name: 'delimiter-type',
	              value: 'fixed',
	              disabled: !settings.get('file_type'),
	              onChange: onSetDelimiterType,
	              checked: settings.get('delimiter_type') === "fixed" }),
	            'Fixed width'
	          )
	        )
	      );

	      var fieldsHTML = settings.get('delimiter_type') === "fixed" ? settings.get('fields').map(function (field, key) {
	        return _react2.default.createElement(
	          'div',
	          { className: 'form-group', key: key },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-3' },
	            _react2.default.createElement(
	              'button',
	              { type: 'button',
	                className: 'btn btn-danger btn-circle',
	                disabled: !settings.get('file_type'),
	                onClick: _this2.removeField.bind(_this2, key) },
	              _react2.default.createElement('i', { className: 'fa fa-minus' })
	            ),
	            field
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-2' },
	            _react2.default.createElement('input', { type: 'number',
	              className: 'form-control',
	              'data-field': field,
	              style: { width: 70 },
	              onChange: onSetFieldWidth,
	              value: settings.getIn(['field_widths', field]) })
	          )
	        );
	      }) : settings.get('fields').map(function (field, key) {
	        return _react2.default.createElement(
	          'div',
	          { className: 'form-group', key: key },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-2' },
	            _react2.default.createElement(
	              'button',
	              { type: 'button',
	                className: 'btn btn-danger btn-circle',
	                disabled: !settings.get('file_type'),
	                onClick: _this2.removeField.bind(_this2, key) },
	              _react2.default.createElement('i', { className: 'fa fa-minus' })
	            ),
	            field
	          )
	        );
	      });

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
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-lg-3' },
	            _react2.default.createElement(
	              'label',
	              { htmlFor: 'sample_csv' },
	              'Select Sample CSV'
	            ),
	            _react2.default.createElement(
	              'p',
	              { className: 'help-block' },
	              'Notice: Spaces will be convereted to underscores'
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
	              _react2.default.createElement('input', { type: 'file', id: 'sample_csv',
	                onChange: onSelectSampleCSV,
	                disabled: !settings.get('file_type') || !settings.get('delimiter_type') || settings.get('delimiter_type') !== "separator" })
	            )
	          )
	        ),
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
	        { disabled: true, value: '-1', key: -1 },
	        'Select Field'
	      )].concat(_toConsumableArray(settings.get('fields').map(function (field, key) {
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
	                  value: settings.getIn(['processor', 'date_field']),
	                  defaultValue: '-1' },
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
	                  value: settings.getIn(['processor', 'volume_field']),
	                  defaultValue: '-1' },
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
	                checked: settings.get('usaget_type') === "static",
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
	                value: settings.getIn(['processor', 'default_usaget']),
	                disabled: settings.get('usaget_type') !== "static",
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
	                checked: settings.get('usaget_type') === "dynamic",
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
	                  value: settings.getIn(['processor', 'src_field']),
	                  disabled: settings.get('usaget_type') !== "dynamic",
	                  defaultValue: '-1' },
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
	        settings.getIn(['processor', 'usaget_mapping']).map(function (usage_t, key) {
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
	                  usage_t.get('pattern')
	                ),
	                _react2.default.createElement(
	                  'div',
	                  { className: 'col-lg-5' },
	                  usage_t.get('usaget')
	                ),
	                _react2.default.createElement(
	                  'div',
	                  { className: 'col-lg-2' },
	                  _react2.default.createElement(
	                    'button',
	                    { type: 'button',
	                      className: 'btn btn-danger btn-circle',
	                      disabled: settings.get('usaget_type') !== "dynamic",
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
	                  disabled: settings.get('usaget_type') !== "dynamic",
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
	                  disabled: settings.get('usaget_type') !== "dynamic",
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
	                    disabled: settings.get('usaget_type') !== "dynamic",
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
	                checked: settings.get('delete_received'),
	                defaultChecked: false,
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
	                checked: settings.get('passive'),
	                defaultChecked: false,
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

/***/ }

})