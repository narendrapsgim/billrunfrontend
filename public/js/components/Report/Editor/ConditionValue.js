import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import moment from 'moment';
import Select from 'react-select';
import { HelpBlock } from 'react-bootstrap';
import Field from '../../Field';
import {
  formatSelectOptions,
} from '../../../common/Util';
import {
  productsOptionsSelector,
  cyclesOptionsSelector,
  plansOptionsSelector,
  groupsOptionsSelector,
} from '../../../selectors/listSelectors';
import {
  usageTypeSelector,
} from '../../../selectors/settingsSelector';
import {
  getCyclesOptions,
  getProductsOptions,
  getPlansOptions,
  getServicesOptions,
  getGroupsOptions,
  getUsageTypesOptions,
} from '../../../actions/reportsActions';


class ConditionValue extends Component {

  static propTypes = {
    filed: PropTypes.instanceOf(Immutable.Map),
    config: PropTypes.instanceOf(Immutable.Map),
    selectOptions: PropTypes.instanceOf(Immutable.Map),
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    filed: Immutable.Map(),
    config: Immutable.Map(),
    selectOptions: Immutable.Map(),
    disabled: false,
    onChange: () => {},
  }

  componentDidMount() {
    const { config, selectOptions } = this.props;
    this.initFieldOptions(config, selectOptions);
  }

  componentWillReceiveProps(nextProps) {
    const { config } = this.props;
    if (!Immutable.is(config, nextProps.config)) {
      this.initFieldOptions(nextProps.config, nextProps.selectOptions);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { filed, config, selectOptions, disabled } = this.props;
    return (
      !Immutable.is(filed, nextProps.filed)
      || !Immutable.is(config, nextProps.config)
      || !Immutable.is(selectOptions, nextProps.selectOptions)
      || disabled !== nextProps.disabled
    );
  }

  initFieldOptions = (config, selectOptions) => {
    if (config.hasIn(['inputConfig', 'callback']) && selectOptions.get(config.getIn(['inputConfig', 'callback']), Immutable.List()).isEmpty()) {
      const callback = config.getIn(['inputConfig', 'callback']);
      switch (callback) {
        case 'getCyclesOptions': this.props.dispatch(getCyclesOptions());
          break;
        case 'getPlansOptions': this.props.dispatch(getPlansOptions());
          break;
        case 'getProductsOptions': this.props.dispatch(getProductsOptions());
          break;
        case 'getServicesOptions': this.props.dispatch(getServicesOptions());
          break;
        case 'getGroupsOptions': this.props.dispatch(getGroupsOptions());
          break;
        case 'getUsageTypesOptions': this.props.dispatch(getUsageTypesOptions());
          break;
        default: console.log('unsuported select options callback');
          break;
      }
    }
  }

  onChangeText = (e) => {
    const { value } = e.target;
    this.props.onChange(value);
  };

  onChangeSelect = (value) => {
    this.props.onChange(value);
  };

  onChangeBoolean = (value) => {
    const bool = value === '' ? '' : value === 'yes';
    this.props.onChange(bool);
  };

  onChangeNumber = (e) => {
    const { value } = e.target;
    const number = Number(value);
    if (!isNaN(number)) {
      this.props.onChange(number);
    } else {
      this.props.onChange(value);
    }
  };

  onChangeDate = (date) => {
    if (moment.isMoment(date) && date.isValid()) {
      this.props.onChange(date.toISOString());
    } else {
      this.props.onChange(null);
    }
  };

  render() {
    const { filed, disabled, config, selectOptions } = this.props;

    //  operator 'EXIST' boolean
    if (filed.get('op', null) === 'exists') {
      let value = '';
      if (filed.get('value', false) === true) {
        value = 'yes';
      } else if (!filed.get('value', true) === false) {
        value = 'no';
      }
      const options = ['yes', 'no'].map(formatSelectOptions);
      return (
        <Select
          clearable={false}
          options={options}
          value={value}
          onChange={this.onChangeBoolean}
          disabled={disabled}
        />
      );
    }
    // operator 'IN'
    if (config.get('type', 'string') === 'string' && config.getIn(['inputConfig', 'inputType']) === 'select') {
      const options = config.hasIn(['inputConfig', 'callback'])
        ? selectOptions.get(config.getIn(['inputConfig', 'callback'], ''), Immutable.List())
        : config.getIn(['inputConfig', 'options'], Immutable.List());

      const formatedOptions = options
        .map(formatSelectOptions)
        .toArray();

      const multi = ['nin', 'in'].includes(filed.get('op', ''));
      return (
        <Select
          clearable={false}
          multi={multi}
          options={formatedOptions}
          value={filed.get('value', '')}
          onChange={this.onChangeSelect}
          disabled={disabled}
        />
      );
    }
    // 'Number'
    if (config.get('type', '') === 'number' && !['nin', 'in'].includes(filed.get('op', ''))) {
      return (
        <Field
          fieldType="number"
          value={filed.get('value', '')}
          onChange={this.onChangeNumber}
          disabled={disabled}
        />
      );
    }

    // 'Date'
    if (config.get('type', '') === 'date') {
      const value = moment(filed.get('value', null));
      return (
        <Field
          fieldType="date"
          value={value}
          onChange={this.onChangeDate}
          disabled={disabled}
        />
      );
    }

    // 'String'
    return (
      <div>
        <Field
          value={filed.get('value', '')}
          onChange={this.onChangeText}
          disabled={disabled}
        />
        {['nin', 'in'].includes(filed.get('op', null)) && (
          <HelpBlock>comma separated values</HelpBlock>
        )}
      </div>
    );
  }

}

const mapStateToProps = (state, props) => ({
  selectOptions: Immutable.Map({
    getCyclesOptions: cyclesOptionsSelector(state, props) || Immutable.List(),
    getProductsOptions: productsOptionsSelector(state, props) || Immutable.List(),
    getPlansOptions: plansOptionsSelector(state, props) || Immutable.List(),
    getGroupsOptions: groupsOptionsSelector(state, props) || Immutable.List(),
    getUsageTypesOptions: usageTypeSelector(state, props) || Immutable.List(),
  }),
});

export default connect(mapStateToProps)(ConditionValue);
