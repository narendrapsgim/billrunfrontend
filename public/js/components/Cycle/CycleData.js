import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Label, Button, FormGroup, HelpBlock } from 'react-bootstrap';
import { List, Map } from 'immutable';
import { getSymbolFromCurrency } from 'currency-symbol-map';
import moment from 'moment';
import { getAllInvoicesQuery } from '../../common/ApiQueries';
import EntityList from '../EntityList';
import { getList } from '../../actions/listActions';
import { getConfig } from '../../common/Util';
import { confirmCycleInvoice, confirmCycle, getConfirmationAllStatus, getConfirmationInvoicesStatus } from '../../actions/cycleActions';
import ConfirmModal from '../../components/ConfirmModal';
import { currencySelector } from '../../selectors/settingsSelector';
import { getDateToDisplay } from './CycleUtil';

class CycleData extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    selectedCycle: PropTypes.instanceOf(Map).isRequired,
    billrunKey: PropTypes.string.isRequired,
    baseFilter: PropTypes.object,
    reloadCycleData: PropTypes.func,
    showConfirmAllButton: PropTypes.bool,
    isCycleConfirmed: PropTypes.bool,
    currency: PropTypes.string,
    invoicesNum: PropTypes.number,
  };

  static defaultProps = {
    reloadCycleData: () => {},
    baseFilter: {},
    showConfirmAllButton: true,
    isCycleConfirmed:false,
    currency: '',
    invoicesNum: 0,
  };

  constructor(props) {
    super(props);
    this.autoRefreshConfirmationStatusHandler = null;
  }

  state = {
    confirmationModalData: {
      show: false,
      title: '',
      message: '',
      warningMessage: 'This action is irreversible',
      onClick: () => {},
      refreshString: '',
    },
    confirmingInvoices: List(),
    confirmingAll: false,
  }

  componentDidMount() {
    const { billrunKey } = this.props;
    this.updateInvoicesNum(billrunKey);
  }

  componentWillReceiveProps(nextProps) {
    const { billrunKey } = this.props;
    if (nextProps.billrunKey !== billrunKey) {
      this.updateInvoicesNum(nextProps.billrunKey);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.autoRefreshConfirmationStatusHandler);
  }

  updateInvoicesNum = (billrunKey) => {
    this.props.dispatch(getList('billrunInvoices', getAllInvoicesQuery(billrunKey)));
  }

  parseCycleDataFirstName = entity => entity.getIn(['attributes', 'firstname'], '');
  parseCycleDataLastName = entity => entity.getIn(['attributes', 'lastname'], '');
  parseCycleDataInvoiceTotal = entity => entity.getIn(['totals', 'after_vat_rounded'], '');
  parseCycleDataSubscriptionNum = entity => entity.get('subs', List()).size;

  downloadURL = (aid, billrunKey, invoiceId) =>
    `${getConfig('serverUrl')}/api/accountinvoices?action=download&aid=${aid}&billrun_key=${billrunKey}&iid=${invoiceId}`;

  parseCycleDataDownload = (entity) => {
    const downloadUrl = this.downloadURL(entity.get('aid'), entity.get('billrun_key'), entity.get('invoice_id'));
    return (
      <form method="post" action={downloadUrl} target="_blank">
        <button className="btn btn-link" type="submit">
          <i className="fa fa-download" /> Download
        </button>
      </form>
    );
  };

  autoRefreshConfirmationStatus = () => {
    clearTimeout(this.autoRefreshConfirmationStatusHandler);
    const { confirmingAll, confirmingInvoices } = this.state;
    if (confirmingAll) {
      this.autoRefreshConfirmationAllStatus();
    } else if (confirmingInvoices.size) {
      this.autoRefreshConfirmationInvoicesStatus(confirmingInvoices);
    }
  }

  autoRefreshConfirmationAllStatus = () => {
    this.props.dispatch(getConfirmationAllStatus())
      .then(
        (response) => {
          if (response.status) {
            const startDate = response.data[0].start_date;
            if (startDate) { // operation is still running
              this.autoRefreshConfirmationStatusHandler = setTimeout(
                this.autoRefreshConfirmationStatus, 10000);
            } else {
              this.setState({ confirmingAll: false });
            }
          }
        },
      );
  }

  autoRefreshConfirmationInvoicesStatus = (invoiceIds) => {
    this.props.dispatch(getConfirmationInvoicesStatus(invoiceIds))
      .then(
        (response) => {
          if (response.status) {
            let newConfirmingInvoices = List();
            invoiceIds.forEach((invoiceId, i) => {
              const invoice = response.data[i];
              if (invoice.data.details[0].start_date) {
                newConfirmingInvoices = newConfirmingInvoices.push(invoiceId);
              }
            });
            this.setState({ confirmingInvoices: newConfirmingInvoices });
            if (newConfirmingInvoices.size > 0) {
              this.autoRefreshConfirmationStatusHandler = setTimeout(
              this.autoRefreshConfirmationStatus, 10000);
            }
          }
        },
      );
  }

  onClickInvoiceConfirm = (entity) => {
    const { billrunKey } = this.props;
    const { confirmingInvoices } = this.state;
    this.props.dispatch(confirmCycleInvoice(billrunKey, entity.get('invoice_id', '')))
      .then(
        (response) => {
          if (response.status) {
            this.closeConfirmationModal();
            this.setState({
              refreshString: moment().format(),
              confirmingInvoices: confirmingInvoices.push(entity.get('invoice_id')),
            });
            setTimeout(this.props.reloadCycleData, 1000);
            setTimeout(this.autoRefreshConfirmationStatus, 1000);
          }
        },
      );
  }

  onClickConfirmAll = () => {
    const { selectedCycle, invoicesNum } = this.props;
    const { confirmationModalData } = this.state;
    confirmationModalData.show = true;
    confirmationModalData.title = 'Confirm all invoices';
    confirmationModalData.message = `Are you sure you want to confirm all the invoices for the cycle of
      ${getDateToDisplay(selectedCycle.get('start_date', ''))} - ${getDateToDisplay(selectedCycle.get('end_date', ''))}?
      ${invoicesNum} invoices will be confirmed after this action`;
    confirmationModalData.onClick = this.onClickConfirmAllConfirm;
    this.setState({ confirmationModalData });
  }

  onClickConfirmAllConfirm = () => {
    const { billrunKey } = this.props;
    this.props.dispatch(confirmCycle(billrunKey))
      .then(
        (response) => {
          if (response.status) {
            this.closeConfirmationModal();
            this.setState({
              refreshString: moment().format(),
              confirmingInvoices: List(),
              confirmingAll: true,
            });
            setTimeout(this.props.reloadCycleData, 1000);
            setTimeout(this.autoRefreshConfirmationStatus, 1000);
          }
        },
      );
  }

  parseCycleDataConfirm = (entity) => {
    const { confirmingInvoices, confirmingAll } = this.state;

    const onConfirm = () => {
      this.onClickInvoiceConfirm(entity);
    };

    const onClick = () => {
      const { confirmationModalData } = this.state;
      const { currency } = this.props;
      confirmationModalData.show = true;
      confirmationModalData.title = 'Confirm Invoice';
      confirmationModalData.message = `Are you sure you want to confirm invoice #${entity.get('invoice_id')} for
        customer #${entity.get('aid')} (${this.parseCycleDataFirstName(entity)} ${this.parseCycleDataLastName(entity)})
        with a total due of ${this.parseCycleDataInvoiceTotal(entity)}${getSymbolFromCurrency(currency)}?`;
      confirmationModalData.onClick = onConfirm;
      this.setState({ confirmationModalData });
    };

    if (entity.get('billed', false)) {
      return (<Label bsStyle={'success'} className={'non-editable-field'}>CONFIRMED</Label>);
    }

    if (confirmingAll || confirmingInvoices.includes(entity.get('invoice_id'))) {
      return (<Label bsStyle={'info'} className={'non-editable-field'}>CONFIRMING...</Label>);
    }

    return (<Button onClick={onClick}>confirm</Button>);
  };

  downloadTaxURL = (billrunKey) =>
    `${getConfig('serverUrl')}/api/report?action=taxationReport&report={"billrun_key":"${billrunKey}"}&type=csv`;

  parseTaxDownload = (entity) => {
    const { billrunKey } =  this.props
    const downloadUrl = this.downloadTaxURL( billrunKey );
    return (
      <form method="post" action={downloadUrl} target="_blank">
        <Button className={entity.actionClass} bsStyle={entity.actionStyle} bsSize={entity.actionSize} type="submit">
            {entity.label}
        </Button>
      </form>
    );
  };

  getListActions = () => {
    const { showConfirmAllButton, isCycleConfirmed } = this.props;
    return [{
 	label: 'Confirm All',
        actionStyle: 'default',
        show :showConfirmAllButton,
        showIcon: false,
        onClick: this.onClickConfirmAll,
        actionSize: 'xsmall',
        actionClass: 'btn-primary',
      },
      {
        label: 'Download Taxation complience report',
        actionStyle: 'default',
        show : isCycleConfirmed,
        showIcon: false,
        renderFunc : this.parseTaxDownload,
        actionSize: 'xsmall',
        actionClass: 'btn-primary',
      }
    ];
  }

  onCloseConfirmationModal = () => {
    this.closeConfirmationModal();
  }

  closeConfirmationModal = () => {
    const { confirmationModalData } = this.state;
    confirmationModalData.show = false;
    confirmationModalData.title = '';
    confirmationModalData.message = '';
    confirmationModalData.onClick = () => {};
    this.setState({ confirmationModalData });
  }

  renderConfirmationModal = () => {
    const { confirmationModalData } = this.state;
    return (
      <ConfirmModal onOk={confirmationModalData.onClick} onCancel={this.onCloseConfirmationModal} show={confirmationModalData.show} message={confirmationModalData.title} labelOk="Yes">
        <FormGroup validationState="error">
          {confirmationModalData.message}
          <HelpBlock>{confirmationModalData.warningMessage}</HelpBlock>
        </FormGroup>
      </ConfirmModal>
    );
  }

  render() {
    const { baseFilter } = this.props;
    const { refreshString } = this.state;

    const filterFields = [
      { id: 'aid', placeholder: 'Customer Number', type: 'number' },
      { id: 'attributes.firstname', placeholder: 'Customer First Name' },
      { id: 'attributes.lastname', placeholder: 'Customer Last Name' },
    ];

    const tableFields = [
      { id: 'aid', title: 'Customer Number', sort: true },
      { id: 'attributes.firstname', title: 'Customer First Name', sort: true, parser: this.parseCycleDataFirstName },
      { id: 'attributes.lastname', title: 'Customer Last Name', sort: true, parser: this.parseCycleDataLastName },
      { id: 'totals.after_vat_rounded', title: 'Invoice Total', parser: this.parseCycleDataInvoiceTotal },
      { id: 'subss', title: '# of Subscriptions', parser: this.parseCycleDataSubscriptionNum },
      { id: 'download', title: 'Invoice', parser: this.parseCycleDataDownload },
      { id: 'confirm', title: 'Confirm', parser: this.parseCycleDataConfirm },
    ];

    return (
      <div>
        <EntityList
          collection="billrun"
          api="get"
          itemType="billrun"
          itemsType="billruns"
          filterFields={filterFields}
          baseFilter={baseFilter}
          tableFields={tableFields}
          showAddButton={false}
          listActions={this.getListActions()}
          refreshString={refreshString}
        />

        {this.renderConfirmationModal()}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  currency: currencySelector(state, props),
  invoicesNum: state.list.get('billrunInvoices', List()).size,
});

export default connect(mapStateToProps)(CycleData);
