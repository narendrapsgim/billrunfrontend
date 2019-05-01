import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { sentenceCase, titleCase } from 'change-case';
import { Form, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Field from '@/components/Field';
import { getList, clearList } from '@/actions/listActions';
import { getEntitesQuery } from '@/common/ApiQueries';
import {
  getFieldName,
  getFieldNameType,
  parseConfigSelectOptions,
  getConfig,
} from '@/common/Util';


class EntityTaxDetails extends PureComponent {

  static propTypes = {
    tax: PropTypes.instanceOf(Map),
    mode: PropTypes.string,
    itemName: PropTypes.string,
    typeOptions: PropTypes.instanceOf(List),
    taxRateOptions: PropTypes.instanceOf(List),
    onFieldUpdate: PropTypes.func.isRequired,
    onFieldRemove: PropTypes.func.isRequired,
    loadRates: PropTypes.func.isRequired,
    clearRates: PropTypes.func.isRequired,
  }

  static defaultProps = {
    tax: Map(),
    mode: '',
    itemName: '',
    typeOptions: List([Map({ id:'vat', title: 'Vat'})]),
    taxRateOptions: List(),
  };

  componentWillMount() {
    this.props.loadRates();
    this.initDefaultValues();
  }

  componentWillUnmount() {
    this.props.clearRates();
  }

  initDefaultValues = () => {
    const { tax } = this.props;
    console.log("tax:", tax);
    if (tax.get('type', '') === '') {
      this.props.onFieldUpdate(['tax', 'type'], 'vat');
    }
    if (tax.get('taxation', '') === '') {
      this.props.onFieldUpdate(['tax', 'taxation'], 'global');
    }
    if (tax.get('taxation', '') === 'custom' && tax.get('custom_logic', '') === '') {
      this.props.onFieldUpdate(['tax', 'custom_logic'], 'override');
    }
  }

  onChengeType = (value) => {
    this.props.onFieldUpdate(['tax', 'type'], value)
  }

  onChengeTaxation = (e) => {
    const { tax } = this.props;
    const { value } = e.target;
    // if Taxation set to custom and custom_logic is not set, set the default
    if (value === 'custom' && tax.get('custom_logic', '') === '') {
      this.props.onFieldUpdate(['tax', 'custom_logic'], 'override');
    }
    this.props.onFieldUpdate(['tax', 'taxation'], value);
  }

  onChengeCustomLogic = (e) => {
    const { value } = e.target;
    this.props.onFieldUpdate(['tax', 'custom_logic'], value);
  }
  render () {
    const { tax, mode, itemName, typeOptions, taxRateOptions } = this.props;
    const typeSelecOptions = typeOptions
      .map(parseConfigSelectOptions)
      .toArray()
    const taxRateSelectOptions = taxRateOptions
      .map(option => ({label: option.get('description', ''), value: option.get('key', '')}))
      .toArray()
    const disabled = (mode === 'view');

    const entityLabel = getConfig(['systemItems', itemName, 'itemName'], '');
    return (
      <Form horizontal>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} lg={2}>
            { getFieldName('type', getFieldNameType(itemName), sentenceCase('type'))}
          </Col>
          <Col sm={8} lg={9}>
            <Field
              fieldType="select"
              value={tax.get('type', '')}
              onChange={this.onChengeType}
              options={typeSelecOptions}
              disabled={disabled}
              editable={false}
            />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} lg={2}>

          </Col>
          <Col sm={8} lg={9}>
            <Field
              fieldType="radio"
              onChange={this.onChengeTaxation}
              checked={tax.get('taxation', '') === 'no'}
              value="no"
              label={`${titleCase(entityLabel)} isn't subject to taxation`}
              disabled={disabled}
            />
            <Field
              fieldType="radio"
              onChange={this.onChengeTaxation}
              checked={tax.get('taxation', '') === 'global'}
              value="global"
              label="Use global mapping rules"
              disabled={disabled}
            />

            <div className="clearfix">
              <Field
                fieldType="radio"
                onChange={this.onChengeTaxation}
                checked={tax.get('taxation', '') === 'custom'}
                value="custom"
                label={`${titleCase(entityLabel)} implies a specific tax rate:`}
                className="pull-left mr5"
                disabled={disabled}
              />
              <Field
                fieldType="select"
                value={tax.get('type', '')}
                onChange={this.onChengeType}
                options={taxRateSelectOptions}
                disabled={disabled}
                editable={tax.get('taxation', '') === 'custom'}
              />
            </div>

            {tax.get('taxation', '') === 'custom' && (
              <FormGroup className="mb0">
                <Col smOffset={2} xsOffset={1}>
                  <Field
                    fieldType="radio"
                    onChange={this.onChengeCustomLogic}
                    checked={tax.get('custom_logic', '') === 'override'}
                    value="override"
                    label="Override global mapping rules"
                    disabled={disabled}
                  />
                  <Field
                    fieldType="radio"
                    onChange={this.onChengeCustomLogic}
                    checked={tax.get('custom_logic', '') === 'fallback'}
                    value="fallback"
                    label={`Apply if tax rate not found via global mapping rules`}
                    disabled={disabled}
                  />
                </Col>
              </FormGroup>
            )}

            <Field
              fieldType="radio"
              onChange={this.onChengeTaxation}
              checked={tax.get('taxation', '') === 'default'}
              value="default"
              label={`Use default tax rate`}
              disabled={disabled}
            />
          </Col>
        </FormGroup>

      </Form>
    );
  }
}


const mapStateToProps = (state, props) => ({
  taxRateOptions: state.list.get('available_taxRates'),
});

const mapDispatchToProps = dispatch => ({
  loadRates: () => dispatch(getList('available_taxRates', getEntitesQuery('taxes', { key: 1, description: 1 }))),
  clearRates: () => dispatch(clearList('available_taxRates')),
});

export default connect(mapStateToProps, mapDispatchToProps)(EntityTaxDetails);
