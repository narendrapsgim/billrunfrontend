import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, Col, ControlLabel, Panel } from 'react-bootstrap';
import { inputProssesorCsiOptionsSelector } from '../../selectors/settingsSelector';
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

  state = {
    showTax: false,
    showCsi: false,
  }

  componentDidMount() {
    const type = this.props.data.getIn(['taxation', 'tax_type'], '');
    this.switchPanels(type);
  }

  componentWillReceiveProps(nextProps) {
    const newType = nextProps.data.getIn(['taxation', 'tax_type'], '');
    const oldType = this.props.data.getIn(['taxation', 'tax_type'], '');
    if (newType !== oldType) {
      this.switchPanels(newType);
    }
  }

  onChangeTaxType = (e) => {
    const { value } = e.target;
    this.props.onChange('taxation', 'tax_type', value);
  }

  switchPanels = (active) => {
    if (active === 'CSI') {
      this.setState({ showCsi: true });
      this.setState({ showTax: false });
    } else if (active === 'vat') {
      this.setState({ showTax: true });
      this.setState({ showCsi: false });
    }
  }

  onChangeVat = (e) => {
    const { value } = e.target;
    this.props.onChange('pricing', 'vat', value);
  }

  onChangeCsi = (csi) => {
    this.props.onChange('taxation', 'CSI', csi);
  }

  onClickCsiPanle = () => {
    const { showCsi } = this.state;
    this.setState({ showCsi: !showCsi });
  }

  onClickVatPanle = () => {
    const { showTax } = this.state;
    this.setState({ showTax: !showTax });
  }

  render() {
    const { data } = this.props;
    const { showTax, showCsi } = this.state;
    const isSimpleVat = data.getIn(['taxation', 'tax_type'], '') === 'vat';
    const csiOptions = inputProssesorCsiOptionsSelector(data);
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

          <Panel header={<span onClick={this.onClickVatPanle} className="clickable">VAT</span>} collapsible expanded={showTax} >
            <Vat vat={data.getIn(['pricing', 'vat'], '')} onChange={this.onChangeVat} disabled={!isSimpleVat} />
          </Panel>

          <Panel header={<span onClick={this.onClickCsiPanle} className="clickable">CSI</span>} collapsible expanded={showCsi} >
            <Csi
              csi={data.getIn(['taxation', 'CSI'], Immutable.Map())}
              onChange={this.onChangeCsi}
              disabled={isSimpleVat}
              fileTypes={csiOptions}
            />
          </Panel>
        </Form>
      </div>
    );
  }
}

export default Tax;
