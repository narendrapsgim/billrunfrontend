import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Button, Panel, FormGroup, Col, Row } from 'react-bootstrap';

export default class CalculatorMapping extends Component {
  static propTypes = {
    settings: React.PropTypes.instanceOf(Immutable.List).isRequired,
    onAddRating: React.PropTypes.func.isRequired,
    onSetRating: React.PropTypes.func.isRequired,
    onRemoveRating: React.PropTypes.func.isRequired,
    onSetLineKey: React.PropTypes.func.isRequired,
    onSetCustomerMapping: React.PropTypes.func.isRequired,
  }

  componentDidMount = () => {
    const { settings, onAddRating } = this.props;
    this.availableUsagetypes().forEach((usaget) => {
      const calcs = settings.getIn(['rate_calculators', usaget], Immutable.List());
      if (calcs.size === 0) {
        onAddRating({ target: { dataset: { usaget } } });
      }
    });
  }

  getRateCalculators(usaget) {
    const { onSetLineKey, onSetRating, onRemoveRating } = this.props;
    return this.rateCalculatorsForUsaget(usaget).map((calc, calcKey) => (
      <Row style={{ marginBottom: 10 }}>
        <Col lg={3} md={3} style={{ paddingRight: 0 }}>
          <FormGroup style={{ margin: 0 }}>
            <select
              className="form-control"
              id={usaget}
              onChange={onSetLineKey}
              data-usaget={usaget}
              data-index={calcKey}
              value={calc.get('line_key', '')}
            >
              { this.availableFields(true) }
            </select>
          </FormGroup>
        </Col>

        <Col lg={2} md={2} style={{ paddingRight: 0, lineHeight: '43px' }}>
          <FormGroup style={{ margin: 0 }}>
            <input
              type="radio"
              name={`${usaget}-${calcKey}-type`}
              id={`${usaget}-${calcKey}-by-rate-key`}
              value="match"
              data-usaget={usaget}
              data-rate_key="key"
              data-index={calcKey}
              checked={calc.get('type', '') === 'match'}
              onChange={onSetRating}
            />&nbsp;
            <label htmlFor={`${usaget}-${calcKey}-by-rate-key`} style={{ verticalAlign: 'middle' }}>By product key</label>
          </FormGroup>
        </Col>

        <Col lg={2} md={2} style={{ paddingRight: 0, lineHeight: '43px' }}>
          <FormGroup style={{ margin: 0 }}>
            <input
              type="radio"
              name={`${usaget}-${calcKey}-type`}
              id={`${usaget}-${calcKey}-longest-prefix`}
              value="longestPrefix"
              data-usaget={usaget}
              checked={calc.get('type', '') === 'longestPrefix'}
              data-rate_key="params.prefix"
              data-index={calcKey}
              onChange={onSetRating}
            />&nbsp;
            <label htmlFor={`${usaget}-${calcKey}-longest-prefix`} style={{ verticalAlign: 'middle' }}>By longest prefix</label>
          </FormGroup>
        </Col>

        <Col lg={2} md={2} sm={2} xs={2}>
          { calcKey > 0 &&
            <FormGroup style={{ margin: 0 }}>
              <div style={{ width: '100%', height: 39 }}>
                <Button onClick={onRemoveRating} data-usaget={usaget} data-index={calcKey} bsSize="small" className="pull-left" ><i className="fa fa-trash-o danger-red" />&nbsp;Remove</Button>
              </div>
            </FormGroup>
          }
        </Col>
      </Row>
    ));
  }

  getAddRatingButton = usaget => (<Button bsSize="xsmall" className="btn-primary" data-usaget={usaget} onClick={this.props.onAddRating}><i className="fa fa-plus" />&nbsp;Add</Button>);

  rateCalculatorsForUsaget = usaget => (this.props.settings.getIn(['rate_calculators', usaget], Immutable.List()));

  availableUsagetypes = () => (this.props.settings.get('rate_calculators', {}).keySeq().map(usaget => (usaget)));

  availableFields = (addBillrunFields) => {
    const billrunFields = Immutable.fromJS(addBillrunFields ? ['type', 'usaget'] : []);
    return [
      (<option disabled value="" key={-3}>Select Field</option>),
      ...(billrunFields.push(...this.props.settings.get('fields', []))).map((field, key) => (
        <option value={field} key={key}>{field}</option>
      )),
    ];
  };

  render() {
    const { settings,
            type,
            format,
            onSetCustomerMapping,
            onSetLineKey,
            onSetRating } = this.props;
    const available_fields = [(<option disabled value="" key={-1}>Select Field</option>),
                              ...settings.get('fields', []).map((field, key) => (
                                <option value={field} key={key}>{field}</option>
                              ))];
    const available_target_fields = [(<option disabled value="-1" key={-1}>Select Field</option>),
                                     ...['sid', 'aid'].map((field, key) => (
                                       <option value={field} key={key}>{field}</option>
                                     ))];
    const available_usagetypes = settings.get('rate_calculators', {}).keySeq().map(usaget => {
      return usaget;
    });

    return (
      <form className="form-horizontal CalculatorMapping">
        <div className="form-group">
          <div className="col-lg-3">
            <label htmlFor="src_key">Customer identification</label>
            <p className="help-block">Map customer identification field in record to Billrun field</p>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{ marginTop: 8 }}>
              <i className="fa fa-long-arrow-right" />
            </div>
            <div className="col-lg-9">
              <div className="col-lg-6">
                <select
                  id="src_key"
                  className="form-control"
                  onChange={onSetCustomerMapping}
                  value={settings.getIn(['customer_identification_fields', 0, 'src_key'], '')}
                >
                  { this.availableFields(false) }
                </select>
              </div>
              <div className="col-lg-6">
                <select
                  id="target_key"
                  className="form-control"
                  onChange={onSetCustomerMapping}
                  value={settings.getIn(['customer_identification_fields', 0, 'target_key'], 'sid')}
                >
                  { availableTargetFields }
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="separator" />
        <div className="form-group">
          <div className="col-lg-3">
            <h4>Rate by</h4>
          </div>
        </div>
        {this.availableUsagetypes().map((usaget, key) => (
          <div key={key}>
            <div className="form-group">
              <div className="col-lg-1">
                <label htmlFor={usaget}>
                  { usaget }
                </label>
              </div>
              <div className="col-lg-11">
                <div className="col-lg-1" style={{ marginTop: 8 }}>
                  <i className="fa fa-long-arrow-right" />
                </div>
                <div className="col-lg-11">
                  <Panel>
                    { this.getRateCalculators(usaget) }
                    <br />
                    { this.getAddRatingButton(usaget) }
                  </Panel>
                </div>
              </div>
            </div>
          </div>
         ))}
      </form>
    );
  }
}
