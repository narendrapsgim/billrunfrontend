import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import Field from '../../Field';
import {
  formatSelectOptions,
} from '../../../common/Util';


class FormatterValue extends Component {

  static propTypes = {
    field: PropTypes.instanceOf(Immutable.Map),
    config: PropTypes.instanceOf(Immutable.Map),
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    field: Immutable.Map(),
    config: Immutable.Map(),
    disabled: false,
    onChange: () => {},
  }

  componentWillReceiveProps(nextProps) {
    const { field } = this.props;
    // by default set first value if no value selected
    if (nextProps.config.has('options', '') && field.get('value', '') === '') {
      const value = nextProps.config.get('options', Immutable.List()).map(formatSelectOptions).first().value || '';
      this.props.onChange(value);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { field, config, disabled } = this.props;
    return (
      !Immutable.is(field, nextProps.field)
      || !Immutable.is(config, nextProps.config)
      || disabled !== nextProps.disabled
    );
  }

  onChangeText = (e) => {
    const { value } = e.target;
    this.props.onChange(value);
  };

  onChangeSelect = (value) => {
    this.props.onChange(value);
  };

  render() {
    const { field, disabled, config } = this.props;
    const disabledInput = disabled || config.isEmpty();

    if (config.has('options')) {
      // Not Input value
      if (config.get('options', '') === false) {
        return null;
      }
      // Select
      const valueOptions = config
        .get('options', Immutable.List())
        .map(formatSelectOptions)
        .toArray();
      return (
        <Select
          clearable={false}
          options={valueOptions}
          value={field.get('value', '')}
          onChange={this.onChangeSelect}
          disabled={disabledInput}
        />
      );
    }

    // String or Number or Default when Op not selected
    return (
      <Field
        value={field.get('value', '')}
        onChange={this.onChangeText}
        disabled={disabledInput}
      />
    );
  }

}

export default FormatterValue;
