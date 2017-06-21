import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { Panel } from 'react-bootstrap';
import { ActionButtons, Actions, LoadingItemPlaceholder, ConfirmModal } from '../Elements';
import ReportEditor from './ReportEditor';
import ReportList from './ReportList';
import {
  buildPageTitle,
  getConfig,
  getItemId,
} from '../../common/Util';
import {
  buildRequestUrl,
} from '../../common/Api';
import {
  getReportQuery,
 } from '../../common/ApiQueries';
import { showSuccess, showDanger } from '../../actions/alertsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import {
  saveReport,
  deleteReport,
  getReport,
  clearReport,
  updateReport,
  deleteReportValue,
  setCloneReport,
  getReportData,
  clearReportData,
  setReportDataListPage,
  setReportDataListSize,
  reportTypes,
} from '../../actions/reportsActions';
import { clearItems } from '../../actions/entityListActions';
import { getSettings } from '../../actions/settingsActions';
import { modeSimpleSelector, itemSelector, idSelector } from '../../selectors/entitySelector';
import { reportFieldsSelector } from '../../selectors/settingsSelector';
import { itemsSelector, pageSelector, nextPageSelector, sizeSelector } from '../../selectors/entityListSelectors';

class ReportSetup extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    item: PropTypes.instanceOf(Immutable.Map),
    reportFileds: PropTypes.instanceOf(Immutable.Map),
    reportData: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    userName: PropTypes.string,
    page: PropTypes.number,
    nextPage: PropTypes.bool,
    size: PropTypes.number,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
      query: PropTypes.object,
    }),
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    item: Immutable.Map(),
    reportFileds: Immutable.Map(),
    reportData: Immutable.List(),
    userName: 'Unknown',
    mode: 'loading',
    page: 0,
    size: getConfig(['list', 'defaultItems'], 10),
    nextPage: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      progress: false,
      showConfirmReset: false,
      showConfirmDelete: false,
      listActions: this.getListActions(),
      editActions: this.getEditActions(),
    };
  }

  componentWillMount() {
    this.fetchItem();
    this.props.dispatch(getSettings(['file_types', 'subscribers.subscriber', 'subscribers.account']));
  }

  componentDidMount() {
    const { mode } = this.props;
    if (mode === 'create') {
      const pageTitle = buildPageTitle(mode, 'report');
      this.props.dispatch(setPageTitle(pageTitle));
    }
    this.initDefaultValues();
  }

  componentWillReceiveProps(nextProps) {
    const { item, mode, itemId } = nextProps;
    const { item: oldItem, itemId: oldItemId, mode: oldMode } = this.props;
    if (mode !== oldMode || getItemId(item) !== getItemId(oldItem)) {
      const pageTitle = buildPageTitle(mode, 'report', item);
      this.props.dispatch(setPageTitle(pageTitle));
    }
    if (itemId !== oldItemId || (mode !== oldMode && mode === 'clone')) {
      this.fetchItem(itemId);
    }
  }

  componentDidUpdate(prevProps) {
    const { page, size, mode } = this.props;
    const { page: oldPage, size: oldiSize, mode: oldMode } = prevProps;
    if (page !== oldPage || size !== oldiSize || (mode !== oldMode && mode === 'view')) {
      this.getReportData();
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearReport());
  }

  initDefaultValues = () => {
    const { mode, userName } = this.props;
    const now = moment().toISOString();
    if (mode === 'create') {
      this.onChangeReportValue(['type'], reportTypes.SIMPLE);
    }
    if (mode === 'update') {
      // Set update default values
    }
    if (mode === 'clone') {
      this.props.dispatch(setCloneReport());
    }
    this.onChangeReportValue(['user'], userName);
    this.onChangeReportValue(['from'], now);
  }

  fetchItem = (itemId = this.props.itemId) => {
    if (itemId) {
      this.setState({ progress: true });
      this.props.dispatch(getReport(itemId)).then(this.afterItemReceived);
    }
  }

  afterItemReceived = (response) => {
    const { mode } = this.props;
    this.setState({ progress: false });
    if (response.status) {
      this.initDefaultValues();
      if (mode === 'view') {
        this.getReportData();
      }
    } else {
      this.handleBack();
    }
  }

  getReportData = () => {
    const { item, size, page } = this.props;
    const report = this.preperReport(item);
    this.props.dispatch(getReportData({ report, page, size }));
  }

  onChangeReportValue = (path, value) => {
    this.props.dispatch(setReportDataListPage(0));
    this.props.dispatch(clearReportData());
    const stringPath = Array.isArray(path) ? path.join('.') : path;
    const deletePathOnEmptyValue = [];
    const deletePathOnNullValue = [];
    if (value === '' && deletePathOnEmptyValue.includes(stringPath)) {
      this.props.dispatch(deleteReportValue(path));
    } else if (value === null && deletePathOnNullValue.includes(stringPath)) {
      this.props.dispatch(deleteReportValue(path));
    } else {
      this.props.dispatch(updateReport(path, value));
    }
  }

  handleDelete = () => {
    const { item } = this.props;
    this.setState({ progress: true });
    this.props.dispatch(deleteReport(item)).then(this.afterDelete);
  }

  afterDelete = (response) => {
    this.setState({ progress: false });
    if (response.status) {
      const itemsType = getConfig(['systemItems', 'report', 'itemsType'], '');
      this.props.dispatch(showSuccess('The report was deleted'));
      this.props.dispatch(clearItems(itemsType)); // refetch items list because item was (changed in / added to) list
      this.handleBack();
    }
  }

  afterSave = (response) => {
    const { item, mode } = this.props;
    this.setState({ progress: false });
    if (response.status) {
      const action = (['clone', 'create'].includes(mode)) ? 'created' : 'updated';
      const itemsType = getConfig(['systemItems', 'report', 'itemsType'], '');
      this.props.dispatch(showSuccess(`The report was ${action}`));
      this.props.dispatch(clearItems(itemsType)); // refetch items list because item was (changed in / added to) list
      if (mode === 'update') {
        const itemId = item.getIn(['_id', '$id']);
        const itemType = getConfig(['systemItems', 'report', 'itemType'], '');
        this.fetchItem();
        this.props.router.push(`${itemsType}/${itemType}/${itemId}?action=view`);
      } else {
        this.handleBack();
      }
    }
  }

  handleSave = () => {
    const { item, mode } = this.props;
    if (this.validate()) {
      this.setState({ progress: true });
      const filteredItem = this.preperReport(item);
      this.props.dispatch(saveReport(filteredItem, mode)).then(this.afterSave);
    }
  }

  handleEdit = () => {
    const { pathname, query } = this.props.location;
    this.props.router.push({
      pathname,
      query: Object.assign({}, query, { action: 'update' }),
    });
  }

  handleBack = () => {
    const itemsType = getConfig(['systemItems', 'report', 'itemsType'], '');
    this.props.router.push(`/${itemsType}`);
  }

  validateEmptyAggregateOp = column => (
    column.get('field_name', '') !== ''
    && column.get('op', '') === ''
  )

  validate = () => {
    const { item } = this.props;
    if (item.get('key', '') === '') {
      this.props.dispatch(showDanger('Please enter name'));
      return false;
    }
    if (item.get('entity', '') === '') {
      this.props.dispatch(showDanger('Please select entity'));
      return false;
    }
    if (item.get('type', reportTypes.SIMPLE) === reportTypes.GROPPED
      && item.get('columns', Immutable.List()).some(this.validateEmptyAggregateOp)
    ) {
      this.props.dispatch(showDanger('Please select column function'));
      return false;
    }
    return true;
  }

  preperReport = (report = Immutable.Map()) =>
    report.withMutations((mapWithMutations) => {
      mapWithMutations
        .set('conditions', report.get('conditions', Immutable.List())
          .filter(this.filterConditionsEmptyRows),
        )
        .set('columns', report.get('columns', Immutable.List())
          .filter(this.filterColumnsEmptyRows)
          // Remove OP (aggregate function) if reoprt is simple
          .update(columns => (report.get('type', reportTypes.SIMPLE) === reportTypes.SIMPLE
            ? columns.map(column => column.set('op', ''))
            : columns
          )),
        )
        .set('sorts', report.get('sorts', Immutable.List())
          .filter(this.filterSortEmptyRows),
        );
    });

  filterConditionsEmptyRows = row => [
    row.get('field', ''),
    row.get('op', ''),
    row.get('value', ''),
  ].every(param => param !== '');

  filterSortEmptyRows = row => [
    row.get('op', ''),
    row.get('field', ''),
  ].every(param => param !== '');

  filterColumnsEmptyRows = row => [
    row.get('field_name', ''),
  ].every(param => param !== '');

  applyFilter = () => {
    if (this.validate()) {
      this.getReportData();
    }
  }

  onClickExportCSV =() => {
    const { item } = this.props;
    const headers = item.get('columns', Immutable.List()).reduce(
      (acc, column) => acc.set(column.get('key', ''), column.get('label', column.get('field_name', ''))),
      Immutable.Map(),
    );
    const csvParams = [
      { headers: JSON.stringify(headers) },
      { type: 'csv' },
      { file_name: item.get('key', 'report') },
    ];
    const reportParams = {
      report: this.preperReport(item),
      page: 0,
      size: -1,
    };
    const csvQuery = getReportQuery(reportParams);
    csvQuery.params.push(...csvParams);
    window.open(buildRequestUrl(csvQuery));
  }

  onPageChange = (page) => {
    this.props.dispatch(setReportDataListPage(page));
  }

  onSizeChange = (size) => {
    this.props.dispatch(setReportDataListPage(0));
    this.props.dispatch(setReportDataListSize(size));
  }


  onAskDelete = () => {
    this.setState({ showConfirmDelete: true });
  }

  onDeleteClose = () => {
    this.setState({ showConfirmDelete: false });
  }

  onDeleteOk = () => {
    this.onDeleteClose();
    this.handleDelete();
  }

  onAskReset = () => {
    this.setState({ showConfirmReset: true });
  }

  onResetClose = () => {
    this.setState({ showConfirmReset: false });
  }

  onResetOk = () => {
    const { mode } = this.props;
    this.onResetClose();
    if (mode === 'create') {
      this.props.dispatch(clearReport());
      this.initDefaultValues();
    } else {
      this.fetchItem();
    }
  }

  getTableFields = () => Immutable.List().withMutations((columnsWithMutations) => {
    const { item } = this.props;
    item.get('columns', Immutable.List())
      .filter(this.filterColumnsEmptyRows)
      .forEach((column) => {
        columnsWithMutations.push(Immutable.Map({
          id: column.get('key', ''),
          title: column.get('label', ''),
        }));
      });
  });

  getListActions = () => [{
    type: 'export_csv',
    label: 'Export to CSV',
    showIcon: true,
    onClick: this.onClickExportCSV,
    actionStyle: 'primary',
    actionSize: 'xsmall',
  }, {
    type: 'remove',
    label: 'Delete Report',
    showIcon: true,
    onClick: this.onAskDelete,
    actionStyle: 'danger',
    actionSize: 'xsmall',
  }, {
    type: 'edit',
    label: 'Edit Report',
    showIcon: true,
    onClick: this.handleEdit,
    actionStyle: 'primary',
    actionSize: 'xsmall',
  }];

  getEditActions = () => [{
    type: 'reset',
    label: 'Reset',
    actionStyle: 'primary',
    showIcon: false,
    onClick: this.onAskReset,
    actionSize: 'xsmall',
  }];

  renderPanelHeader = () => {
    const { listActions, editActions } = this.state;
    const { mode } = this.props;
    return (
      <div>&nbsp;
        <div className="pull-right">
          <Actions actions={(mode === 'view') ? listActions : editActions} />
        </div>
      </div>
    );
  }

  render() {
    const { progress, showConfirmReset, showConfirmDelete } = this.state;
    const { item, mode, reportFileds, reportData, size, page, nextPage } = this.props;
    if (mode === 'loading') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const confirmResetMessage = 'Are you sure you want to reset report ?';
    const confirmDeleteMessage = `Are you sure you want to delete "${item.get('key', '')}" report ?`;
    const allowEdit = mode !== 'view';
    const tableFields = this.getTableFields();
    return (
      <div className="report-setup">
        <Panel header={this.renderPanelHeader()}>
          { allowEdit &&
            <ReportEditor
              report={item}
              reportFileds={reportFileds}
              mode={mode}
              onUpdate={this.onChangeReportValue}
              onFilter={this.applyFilter}
            />
          }

          <ReportList
            items={reportData}
            fields={tableFields}
            page={page}
            size={size}
            nextPage={nextPage}
            onChangePage={this.onPageChange}
            onChangeSize={this.onSizeChange}
          />

          <div className="clearfix" />
          <hr className="mb0" />

          <ActionButtons
            onClickCancel={this.handleBack}
            onClickSave={this.handleSave}
            hideSave={!allowEdit}
            progress={progress}
            disableCancel={progress}
          />

        </Panel>
        <ConfirmModal
          onOk={this.onResetOk}
          onCancel={this.onResetClose}
          show={showConfirmReset}
          message={confirmResetMessage}
          labelOk="Yes"
        />
        <ConfirmModal
          onOk={this.onDeleteOk}
          onCancel={this.onDeleteClose}
          show={showConfirmDelete}
          message={confirmDeleteMessage}
          labelOk="Yes"
        />
      </div>
    );
  }
}


const mapStateToProps = (state, props) => ({
  userName: state.user.get('name'),
  itemId: idSelector(state, props, 'reports'),
  item: itemSelector(state, props, 'reports'),
  mode: modeSimpleSelector(state, props, 'reports'),
  reportFileds: reportFieldsSelector(state, props, 'reports'),
  reportData: itemsSelector(state, props, 'reportData'),
  page: pageSelector(state, props, 'reportData'),
  nextPage: nextPageSelector(state, props, 'reportData'),
  size: sizeSelector(state, props, 'reportData'),
});

export default withRouter(connect(mapStateToProps)(ReportSetup));
