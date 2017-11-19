import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Field from '../../Field';
import Help from '../../Help';

export default class PricingMapping extends Component {
  static propTypes = {
    settings: PropTypes.instanceOf(Immutable.Map),
    usaget: PropTypes.string.isRequired,
    mapping: PropTypes.instanceOf(Immutable.Map).isRequired,
    onSetPricingMapping: PropTypes.func.isRequired,
  }

  static defaultProps = {
    settings: Immutable.Map(),
  };

  onSetPricingMapping = (e) => {
    const { usaget } = this.props;
    const { value, id } = e.target;
    this.props.onSetPricingMapping(id, value, usaget);
  }

  getVolumeOptions = () => this.props.settings.get('fields', Immutable.List()).sortBy(field => field).map(field => ({
    label: field,
    value: field,
  })).toArray();

  onChangeApriceField = (value) => {
    const e = {
      target: {
        value,
        id: 'aprice_field',
      },
    };
    this.onSetPricingMapping(e);
  }

  onChangeApriceExists = () => {
    this.onChangeApriceField(undefined);
    this.onChangeApriceMultExists();
  }

  onChangeApriceMult = (e) => {
    this.onSetPricingMapping(e);
  }

  onChangeApriceMultExists = () => {
    const e = {
      target: {
        value: undefined,
        id: 'aprice_mult',
      },
    };
    this.onChangeApriceMult(e);
  }

  renderPrice = () => {
    const { mapping } = this.props;
    const aprice = mapping.getIn(['aprice_field'], null);
    const apriceInputProps = {
      fieldType: 'select',
      placeholder: 'Select price field...',
      options: this.getVolumeOptions(),
      onChange: this.onChangeApriceField,
    };
    const apriceMult = mapping.getIn(['aprice_mult']) || '';
    const apriceMultInputProps = {
      fieldType: 'number',
      id: 'aprice_mult',
      onChange: this.onChangeApriceMult,
    };
    return (
      <div>
        <div className="form-group">
          <div className="col-lg-11">
            <div className="col-lg-10 form-inner-edit-row">
              <Field
                fieldType="toggeledInput"
                value={aprice}
                onChange={this.onChangeApriceExists}
                label="Pre priced"
                inputProps={apriceInputProps}
              />
            </div>

            <div className="col-lg-10 col-lg form-inner-edit-row">
              <Field
                fieldType="toggeledInput"
                value={apriceMult}
                disabledValue=""
                disabled={aprice === null || aprice === undefined}
                onChange={this.onChangeApriceMultExists}
                label="Multiply by constant"
                inputProps={apriceMultInputProps}
              />
            </div>
            <div className="col-lg-1">
              <Help contents="When checked, the price taken will be multiply by the constant entered" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="col-lg-12">
          { this.renderPrice() }
        </div>
      </div>
    );
  }
}
