import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import moment from 'moment';
import { Form, FormGroup, Col, Button, ControlLabel, Row } from 'react-bootstrap';
import Select from 'react-select';
import { getSymbolFromCurrency } from 'currency-symbol-map';
import classNames from 'classnames';
import Field from '../Field';
import { rebalanceAccount, getCollectionDebt } from '../../actions/customerActions';
import ConfirmModal from '../../components/ConfirmModal';
import { currencySelector } from '../../selectors/settingsSelector';
import OfflinePayment from '../Payments/OfflinePayment';
import CyclesSelector from '../Cycle/CyclesSelector';

class Customer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    customer: PropTypes.instanceOf(Immutable.Map),
    supportedGateways: PropTypes.instanceOf(Immutable.List),
    onChangePaymentGateway: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    action: PropTypes.string,
    currency: PropTypes.string,
    fields: PropTypes.instanceOf(Immutable.List),
  };

  static defaultProps = {
    action: 'create',
    currency: '',
    customer: Immutable.Map(),
    fields: Immutable.List(),
    supportedGateways: Immutable.List(),
  };

  state = {
    showRebalanceConfirmation: false,
    showOfflinePayement: false,
    debt: null,
    selectedCyclesNames: '',
  };

  componentDidMount() {
    const { action } = this.props;
    if (action === 'create') {
      this.initDefaultValues();
    }
    this.initDebt();
  }

  initDefaultValues = () => {
    const { fields } = this.props;
    fields.forEach((field) => {
      if (field.has('default_value')) {
        const e = { target: {
          id: field.get('field_name', ''),
          value: field.get('default_value', ''),
        } };
        this.props.onChange(e);
      }
    });
  }

  initDebt = () => {
    const { customer } = this.props;
    const aid = customer.get('aid', null);
    this.props.dispatch(getCollectionDebt(aid))
      .then((response) => {
        if (response.status && response.data && response.data.balance) {
          this.setState({ debt: response.data.balance.total });
        }
      });
  }

  onSelect = (value, field) => {
    const e = { target: { id: field[0].field, value } };
    this.props.onChange(e);
  };

  onChangePaymentGateway = () => {
    const { customer } = this.props;
    const aid = customer.get('aid', null);
    this.props.onChangePaymentGateway(aid);
  }

  filterPrinableFields = field => (field.get('display') !== false && field.get('editable') !== false);

  renderPaymentGatewayLabel = () => {
    const { customer, supportedGateways } = this.props;
    const customerPgName = customer.getIn(['payment_gateway', 'active', 'name'], '');
    const pg = supportedGateways.filter(item => customerPgName === item.get('name'));
    return (!pg.isEmpty() && pg.get(0).get('image_url', '').length > 0)
      ? <img src={`${globalSetting.serverUrl}/${pg.get(0).get('image_url', '')}`} height="30" alt={pg.get(0).get('name', '')} />
      : customerPgName;
  }

  renderChangePaymentGateway = () => {
    const { customer } = this.props;
    const hasPaymentGateway = !(customer.getIn(['payment_gateway', 'active'], Immutable.Map()).isEmpty());
    const label = hasPaymentGateway ? this.renderPaymentGatewayLabel() : 'None';
    return (
      <FormGroup>
        <Row>
          <Col componentClass={ControlLabel} md={2}>
            Payment Gateway
          </Col>
          <Col sm={7}>
            {label}
            <Button onClick={this.onChangePaymentGateway} bsSize="xsmall" style={{ marginLeft: 10, minWidth: 80 }}>
              <i className="fa fa-pencil" />
              &nbsp;{hasPaymentGateway ? 'Change' : 'Add'}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col componentClass={ControlLabel} md={2} />
          <Col sm={7}>
            { this.renderOfflinePaymentsButton() }
          </Col>
        </Row>
      </FormGroup>
    );
  }

  renderDebt = () => {
    const { currency } = this.props;
    const { debt } = this.state;
    const debtClass = classNames('non-editable-field', {
      'danger-red': debt < 0,
    });
    return debt !== null &&
      (<FormGroup>
        <Col componentClass={ControlLabel} md={2}>
          Total Debt
        </Col>
        <Col sm={7}>
          <div className={debtClass}>{debt}{getSymbolFromCurrency(currency)}</div>
        </Col>
      </FormGroup>);
  }

  renderInCollection = () => {
    const { customer } = this.props;
    if (customer.get('in_collection', false) === true || customer.get('in_collection', 0) === 1) {
      const fromDate = moment(customer.get('in_collection_from', '')).format(globalSetting.dateFormat);
      return (<p className="danger-red">In collection from {fromDate}</p>);
    }
    return null;
  }

  renderSelectInput = (field) => {
    const { customer } = this.props;
    const fieldName = field.get('field_name');
    const options = field.get('select_options', '')
      .split(',')
      .map(val => ({
        field: field.get('field_name'),
        value: val,
        label: val,
      }));
    return (
      <Select id={fieldName} onChange={this.onSelect} options={options} value={customer.get(fieldName, '')} />
    );
  }

  renderField = (field, key) => {
    const { customer, onChange } = this.props;
    const fieldName = field.get('field_name');
    return (
      <FormGroup controlId={fieldName} key={key} >
        <Col componentClass={ControlLabel} md={2}>
          { field.get('title', fieldName) }
        </Col>
        <Col sm={7}>
          { field.get('select_list', false)
            ? this.renderSelectInput(field)
            : <Field onChange={onChange} id={fieldName} value={customer.get(fieldName, '')} />
          }
        </Col>
      </FormGroup>
    );
  }

  renderFields = () => {
    const { fields } = this.props;
    return fields
      .filter(this.filterPrinableFields)
      .map(this.renderField);
  }

  onClickRebalance = () => {
    this.setState({ showRebalanceConfirmation: true });
  }

  onRebalanceConfirmationClose = () => {
    this.setState({ showRebalanceConfirmation: false, selectedCyclesNames: '' });
  }

  onRebalanceConfirmationOk = () => {
    const { customer } = this.props;
    const { selectedCyclesNames } = this.state;
    this.props.dispatch(rebalanceAccount(customer.get('aid'), selectedCyclesNames));
    this.onRebalanceConfirmationClose();
  }

  onClickOfflinePayment = () => {
    this.setState({ showOfflinePayement: true });
  }

  onCloseOfflinePayment = () => {
    this.setState({ showOfflinePayement: false });
    this.initDebt();
  }

  onChangeSelectedCycle = (selectedCyclesNames) => {
    this.setState({ selectedCyclesNames });
  }

  renderRebalanceButton = () => {
    const { customer } = this.props;
    const { showRebalanceConfirmation, selectedCyclesNames } = this.state;
    const confirmationTitle = `Are you sure you want to rebalance account ${customer.get('aid')}?`;
    return (
      <div>
        <Button bsSize="xsmall" className="btn-primary" onClick={this.onClickRebalance}>Rebalance</Button>
        <ConfirmModal onOk={this.onRebalanceConfirmationOk} onCancel={this.onRebalanceConfirmationClose} show={showRebalanceConfirmation} message={confirmationTitle} labelOk="Yes">
          <FormGroup>
            <Row>
              <Col sm={12} lg={12}>
                Rebalance operation will send all customer billing lines
                for recalculation price and bundles options.
                It can take few hours to finish the recalculations.
                Meanwhile lines pricing properties will be empty.
                <br />
                This operation is useful when an update is required with reference data
                (plans, products, services, etc) that raised non-desired pricing results.
                After fixing the reference data, the operation will recalculate the billing lines.
                <br /><br />
              </Col>
            </Row>
            <Row>
              <Col sm={3} lg={2} componentClass={ControlLabel} className={'non-editable-field'}>Select cycle/s</Col>
              <Col sm={9} lg={8}>
                <CyclesSelector
                  onChange={this.onChangeSelectedCycle}
                  statusesToDisplay={Immutable.List(['current', 'to_run'])}
                  selectedCycles={selectedCyclesNames}
                  multi={true}
                />
              </Col>
            </Row>
          </FormGroup>
        </ConfirmModal>
      </div>
    );
  }

  renderOfflinePaymentsButton = () => {
    const { customer } = this.props;
    const { showOfflinePayement, debt } = this.state;
    const payerName = `${customer.get('firstname', '')} ${customer.get('lastname', '')}`;
    return (
      <div>
        <Button bsSize="xsmall" className="btn-primary" style={{ marginTop: 12 }} onClick={this.onClickOfflinePayment}>Offline Payment</Button>
        { showOfflinePayement &&
          (<OfflinePayment
            aid={customer.get('aid')}
            payerName={payerName}
            debt={debt}
            onClose={this.onCloseOfflinePayment}
          />)
        }
      </div>
    );
  }

  render() {
    const { customer, action } = this.props;
    // in update mode wait for item before render edit screen
    if (action !== 'create' && typeof customer.getIn(['_id', '$id']) === 'undefined') {
      return (<div> <p>Loading...</p> </div>);
    }

    return (
      <div className="Customer">
        <Form horizontal>
          { this.renderFields() }
          { (action !== 'create') && this.renderChangePaymentGateway() }
          { (action !== 'create') && this.renderDebt() }
        </Form>
        {(action !== 'create') &&
          <div>
            <hr />
            { this.renderInCollection() }
            <p>See Customer <Link to={`/usage?base={"aid": ${customer.get('aid')}}`}>Usage</Link></p>
            <p>See Customer <Link to={`/invoices?base={"aid": ${customer.get('aid')}}`}>Invoices</Link></p>
            { this.renderRebalanceButton() }
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  currency: currencySelector(state, props),
});

export default connect(mapStateToProps)(Customer);
