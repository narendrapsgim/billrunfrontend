import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, Col, ControlLabel, Panel } from 'react-bootstrap';
import Field from '../Field';
import Vat from './Tax/Vat';
import Csi from './Tax/Csi';


class Tax extends Component {

  static propTypes = {
    data: PropTypes.instanceOf(Immutable.Map),
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    data: Immutable.Map(),
  };

  onChangeTaxType = (e) => {
    const { value } = e.target;
    this.props.onChange('taxation', 'tax_type', value);
  }

  onChangeVat = (e) => {
    const { value } = e.target;
    this.props.onChange('pricing', 'vat', value);
  }

  onChangeCsi = (csi) => {
    this.props.onChange('taxation', 'CSI', csi);
  }

  render() {
    const { data } = this.props;
    const isSimpleVat = data.getIn(['taxation', 'tax_type'], '') === 'vat';
    return (
      <div className="tax">
        <Form horizontal>
          <FormGroup >
            <Col componentClass={ControlLabel} md={2}>
              Tax Type
            </Col>
            <Col sm={6}>
              <span style={{ display: 'inline-block', marginRight: 20 }}>
                <Field fieldType="radio" onChange={this.onChangeTaxType} name="tax_type" value="vat" label="Vat" checked={isSimpleVat} />
              </span>
              <span style={{ display: 'inline-block' }}>
                <Field fieldType="radio" onChange={this.onChangeTaxType} name="tax_type" value="CSI" label="CSI" checked={!isSimpleVat} />
              </span>
            </Col>
          </FormGroup>

          <Panel header="VAT">
            <Vat vat={data.getIn(['pricing', 'vat'], '')} onChange={this.onChangeVat} disabled={!isSimpleVat} />
          </Panel>

          <Panel header="CSI">
            <Csi
              csi={data.getIn(['taxation', 'CSI'], Immutable.Map())}
              onChange={this.onChangeCsi}
              disabled={isSimpleVat}
              fileTypes={data.get('file_types', Immutable.List())}
            />
          </Panel>
        </Form>
      </div>
    );
  }
}

export default Tax;
