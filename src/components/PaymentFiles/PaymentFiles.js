import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
// import moment from 'moment';
import { titleCase } from 'change-case';
import { Form, FormGroup, ControlLabel, Col, Panel } from 'react-bootstrap';
import { WithTooltip } from '@/components/Elements';
import EntityList from '@/components/EntityList';
import Field from '@/components/Field';
import GeneratePaymentFile from '@/components/PaymentFiles/GeneratePaymentFile';
import PaymentFileDetails from '@/components/PaymentFiles/PaymentFileDetails';
import {
  paymentFilesSelector,
  paymentGatewayOptionsSelector,
  fileTypeOptionsOptionsSelector,
  isRunningPaymentFilesSelector,
} from '@/selectors/paymentFilesSelectors';
import { getSettings } from '@/actions/settingsActions';
import { showFormModal } from '@/actions/guiStateActions/pageActions';
import {
  getRunningPaymentFiles,
  cleanRunningPaymentFiles,
  cleanPaymentFilesTable,
} from '@/actions/paymentFilesActions';
import { getFieldName } from '@/common/Util';

class PaymentFiles extends Component {
  static propTypes = {
    paymentFiles: PropTypes.instanceOf(List),
    paymentGatewayOptions: PropTypes.array,
    fileTypeOptionsOptions: PropTypes.instanceOf(Map),
    isRunningPaymentFiles: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    paymentFiles: List(),
    paymentGatewayOptions: [],
    fileTypeOptionsOptions: Map(),
    isRunningPaymentFiles: 0,
  };

  state = {
    paymentGateway: '',
    fileType: '',
    refreshString: '',
  };

  componentDidMount() {
    this.props.dispatch(getSettings('payment_gateways'));
  }

  componentDidUpdate(prevProps, prevState) { // eslint-disable-line no-unused-vars
    const { paymentGateway, fileType } = this.state;
    // const { isRunningPaymentFiles } = this.props;
    const isRequiredSelected = paymentGateway !== '' && fileType !== '';
    const fileTypeChanged = fileType !== prevState.fileType;
    if (isRequiredSelected && fileTypeChanged) {
      this.props.dispatch(cleanPaymentFilesTable());
      this.fetchRunningPaymentFiles(paymentGateway, fileType);
      // clearTimeout(this.reloadTableTimeout);
      // if (isRunningPaymentFiles > 0) {
      //     this.reloadTableTimeout = setTimeout(this.startAutoReload, 2000);
      // }
    }
  }

  componentWillUnmount() {
    this.props.dispatch(cleanRunningPaymentFiles());
    // clearTimeout(this.reloadTableTimeout);
  }

  // startAutoReload = () => {
  //   const { paymentGateway, fileType } = this.state;
  //   const { isRunningPaymentFiles } = this.props;
  //   clearTimeout(this.reloadTableTimeout);
  //   this.setState(() => ({ refreshString: moment().format() }));
  //   this.fetchRunningPaymentFiles(paymentGateway, fileType);
  //   if (isRunningPaymentFiles > 0) {
  //     this.reloadTableTimeout = setTimeout(this.startAutoReload, 2000);
  //   }
  // }

  fetchRunningPaymentFiles = (paymentGateway, fileType) => {
    this.props.dispatch(getRunningPaymentFiles(paymentGateway, fileType));
  };

  onChangePaymentGatewayValue = (value) => {
    const paymentGateway = value && value.length ? value : '';
    this.setState(() => ({ paymentGateway, fileType: '' }));
    this.props.dispatch(cleanRunningPaymentFiles());
  };

  onChangeFileTypeValue = (value) => {
    const fileType = value && value.length ? value : '';
    this.setState(() => ({ fileType }));
  };

  onGenerateNewFile = (data) => {
    console.log('onGenerateNewFile data:', data);
  };

  onShowDetails = (data) => {
    const config = {
      title: `Details of ${this.getLabel('stamp').toLowerCase()} ${data.get('stamp', '')}`,
      labelCancel: 'Hide',
      showOnOk: false,
      skipConfirmOnClose: true,
    };
    return this.props.dispatch(showFormModal(data, PaymentFileDetails, config));
  };

  getListActions = () => [
    { type: 'refresh' },
  ];

  getRowActions = () => [
    { type: 'view', onClick: this.onShowDetails, helpText: 'Details', onClickColumn: 'stamp' },
  ];

  getFilterFields = () => [
    { id: 'creation_time', placeholder: this.getLabel('creation_time') },
  ];

  getLabel = (key) => getFieldName(key, 'payment_files', titleCase(key));

  isRunning = (item) =>
    item.get('start_process_time', '') !== '' &&
    item.get('process_time', '') === '';

  isFinished = (item) =>
    item.get('start_process_time', '') !== '' &&
    item.get('process_time', '') !== '';

  isFailed = (item) =>
    item.get('start_process_time', '') === '' &&
    item.get('process_time', '') === '' &&
    item.get('errors', '') !== '';

  parserStatus = (item) => {
    if (this.isRunning(item)) {
      return (
        <i className="fa fa-spinner fa-pulse" title={this.getLabel('status_running_files')} />
      );
    }
    if (this.isFinished(item)) {
      return (
        <i className="fa fa-check-circle success-green" title={this.getLabel('status_finished_files')} />
      );
    }
    if (this.isFailed(item)) {
      return (
        <i className="fa fa-exclamation-circle danger-red" title={this.getLabel('status_failed_files')} />
      );
    }
    return '-';
  };

  getTableFields = () => [
    { id: 'status', title: this.getLabel('status'), parser: this.parserStatus, cssClass: 'state text-center' },
    { id: 'stamp', title: this.getLabel('stamp') },
    { id: 'file_name', title: this.getLabel('file_name') },
    { id: 'transactions', title: this.getLabel('transactions') },
    { id: 'creation_time', title: this.getLabel('creation_time'), type: 'datetime', cssClass: 'long-date' },
    { id: 'start_process_time', title: this.getLabel('start_process_time'), type: 'mongodatetime', cssClass: 'long-date' },
    { id: 'process_time', title: this.getLabel('process_time'), type: 'mongodatetime', cssClass: 'long-date' },
    // { id: "parameters_string", title: this.getLabel("parameters_string") },
    // { id: "created_by", title: this.getLabel("created_by") },
    // { id: "errors", title: this.getLabel("errors") },
  ];

  getProjectFields = () => ({
    creation_time: 1,
    parameters_string: 1,
    transactions: 1,
    start_process_time: 1,
    process_time: 1,
    file_name: 1,
    stamp: 1,
    created_by: 1,
    errors: 1,
  });

  getDefaultSort = () => Map({
      creation_time: -1,
  });

  getGeneratePaymentFileTooltipText = () => {
    const { paymentGateway, fileType } = this.state;
    const { isRunningPaymentFiles } = this.props;
    if (paymentGateway === '') {
      return `Please select ${this.getLabel('payment_gateway')}`;
    }
    if (fileType === '') {
      return `Please select ${this.getLabel('file_type')}`;
    }
    if (isRunningPaymentFiles > 0) {
      return `${isRunningPaymentFiles} files is running...`;
    }
    return 'Generate Payment File';
  };

  renderPanelHeader = () => {
    const { paymentFiles, isRunningPaymentFiles } = this.props;
    const { paymentGateway, fileType } = this.state;
    const showGeneratePaymentFile = isRunningPaymentFiles === 0 && paymentGateway !== '' && fileType !== '';
    const fields = !showGeneratePaymentFile ? List() : paymentFiles
      .find((paymentFile) => paymentFile.get('name', '') === paymentGateway, null, Map())
      .get('transactions_request', List())
      .find((transactionsRequest) => transactionsRequest.get('file_type', '') === fileType, null, Map())
      .get('parameters', List());
    return (
      <div>
        &nbsp;
        <div className="pull-right">
          {
            <WithTooltip helpText={this.getGeneratePaymentFileTooltipText()}>
              <GeneratePaymentFile
                onGenerate={this.onGenerateNewFile}
                data={fields}
                disabled={!showGeneratePaymentFile}
              />
            </WithTooltip>
          }
        </div>
      </div>
    );
  };

  render() {
    const { paymentGatewayOptions, fileTypeOptionsOptions } = this.props;
    const { paymentGateway, fileType, refreshString } = this.state;
    const fileTypeOptions = fileTypeOptionsOptions.get(paymentGateway, []);
    const disabledFileType = paymentGateway === '';
    const showTable = paymentGateway !== '' && fileType !== '';
    console.log("refreshString: ", refreshString);
    
    return (
      <Panel header={this.renderPanelHeader()}>
        <Col lg={12}>
          <Form horizontal>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                {this.getLabel('payment_gateway')}
              </Col>
              <Col sm={5} lg={4}>
                <Field
                  fieldType="select"
                  value={paymentGateway}
                  options={paymentGatewayOptions}
                  onChange={this.onChangePaymentGatewayValue}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                {this.getLabel('file_type')}
              </Col>
              <Col sm={5} lg={4}>
                <Field
                  fieldType="select"
                  value={fileType}
                  options={fileTypeOptions}
                  onChange={this.onChangeFileTypeValue}
                  disabled={disabledFileType}
                />
              </Col>
            </FormGroup>
          </Form>
        </Col>
        {showTable && (
          <Col lg={12}>
            <EntityList
              entityKey="paymentsFiles"
              api="get"
              showRevisionBy={false}
              baseFilter={{
                source: 'custom_payment_files',
                cpg_name: paymentGateway,
                cpg_file_type: fileType,
              }}
              // filterFields={this.getFilterFields()}
              tableFields={this.getTableFields()}
              projectFields={this.getProjectFields()}
              listActions={this.getListActions()}
              actions={this.getRowActions()}
              defaultSort={this.getDefaultSort()}
              refreshString={refreshString}
            />
          </Col>
        )}
      </Panel>
    );
  }
}

const mapStateToProps = (state, props) => ({
  paymentFiles: paymentFilesSelector(state, props) || undefined,
  paymentGatewayOptions: paymentGatewayOptionsSelector(state, props) || undefined,
  fileTypeOptionsOptions: fileTypeOptionsOptionsSelector(state, props) || undefined,
  isRunningPaymentFiles: isRunningPaymentFilesSelector(state, props) || undefined,
});

export default connect(mapStateToProps)(PaymentFiles);
