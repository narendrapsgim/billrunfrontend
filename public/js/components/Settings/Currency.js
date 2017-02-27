import React, { Component } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';


export default class Currency extends Component {

  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    data: React.PropTypes.instanceOf(Immutable.Map),
    currencies: React.PropTypes.arrayOf(React.PropTypes.object),
  };

  static defaultProps = {
    currencies: [],
  };

  onChangeCurrency = (value) => {
    this.props.onChange('pricing', 'currency', value);
  }

  render() {
    const { data, currencies } = this.props;

    return (
      <div className="CurrencyTax">
        <Form horizontal>
          <FormGroup controlId="currency" key="currency">
            <Col componentClass={ControlLabel} md={2}>
              Currency
            </Col>
            <Col sm={6}>
              <Select options={currencies} value={data} onChange={this.onChangeCurrency} />
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}
