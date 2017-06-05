import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { Panel, Col, Button } from 'react-bootstrap';
import { ActionButtons, LoadingItemPlaceholder } from '../Elements';
import ReportDetails from './ReportDetails';
import List from '../List';
import Pager from '../EntityList/Pager';
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
  getReport,
  clearReport,
  updateReport,
  deleteReportValue,
  setCloneReport,
  getReportData,
  clearReportData,
  setReportDataListPage,
  setReportDataListSize,
} from '../../actions/reportsActions';
import { clearItems } from '../../actions/entityListActions';
import { getSettings } from '../../actions/settingsActions';
import { modeSimpleSelector, itemSelector, idSelector } from '../../selectors/entitySelector';
import { linesFiledsSelector } from '../../selectors/settingsSelector';


class ReportSetup extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    item: PropTypes.instanceOf(Immutable.Map),
    linesFileds: PropTypes.instanceOf(Immutable.List),
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
    linesFileds: Immutable.List(),
    reportData: Immutable.List(),
    userName: 'Unknown',
    page: 0,
    size: getConfig(['list', 'defaultItems'], 10),
    nextPage: false,
  }

  state = {
    progress: false,
  }

  componentWillMount() {
    this.fetchItem();
    this.props.dispatch(getSettings('file_types'));
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
    if (mode === 'create') {
      const defaultCreatedValue = moment().toISOString();
      this.onChangeFieldValue(['user'], userName);
      this.onChangeFieldValue(['created'], defaultCreatedValue);
      this.onChangeFieldValue(['modified'], defaultCreatedValue);
    }
    if (mode === 'update') {
      const nowDateValue = moment().toISOString();
      this.onChangeFieldValue(['modified'], nowDateValue);
    }
    if (mode === 'clone') {
      this.props.dispatch(setCloneReport());
    }
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
    const { size, page } = this.props;
    const query = this.buildReportQuery();
    this.props.dispatch(getReportData({ query, page, size }));
  }

  onChangeFieldValue = (path, value) => {
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

  afterSave = (response) => {
    this.setState({ progress: false });
    const { mode } = this.props;
    if (response.status) {
      const action = (['clone', 'create'].includes(mode)) ? 'created' : 'updated';
      this.props.dispatch(showSuccess(`The report was ${action}`));
    }
  }

  handleSave = () => {
    const { item, mode } = this.props;
    if (this.validate()) {
      this.setState({ progress: true });
      this.props.dispatch(saveReport(item, mode)).then(this.afterSave);
      const itemsType = getConfig(['systemItems', 'report', 'itemsType'], '');
      const itemType = getConfig(['systemItems', 'report', 'itemType'], '');
      this.props.dispatch(clearItems(itemsType)); // refetch items list because item was (changed in / added to) list
      const itemId = item.getIn(['_id', '$id']);
      this.props.router.push(`${itemsType}/${itemType}/${itemId}?action=view`);
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

  validate = () => {
    const { item } = this.props;
    if (item.get('key', '') === '') {
      this.props.dispatch(showDanger('Please enter name'));
      return false;
    }

    return true;
  }

  filterQuery = val => [
    val.get('op', ''),
    val.get('field', ''),
    val.get('value', ''),
  ].every(param => param !== '');

  filterGroupBy = val => [
    val.get('op', ''),
    val.get('field', ''),
  ].every(param => param !== '');

  buildQuery = (acc, val) => acc.push(Immutable.Map({
    [val.get('field', '')]: Immutable.Map({
      [`${val.get('op', '')}`]: val.get('value', ''),
    }),
  }));

  buildGroupByQuery = (acc, val) => {
    const op = val.get('op');
    const field = val.get('field');
    const value = Immutable.Map({
      [`${op}`]: field,
    });
    return acc.set(`${field}_${op}`, value);
  }

  buildReportQuery = () => {
    const { item } = this.props;
    const entityType = item.get('entity', '');
    const query = {
      collection: getConfig(['systemItems', entityType, 'collection'], entityType),
      project: item.get('display', Immutable.List()).reduce((acc, val) => acc.set(val, 1), Immutable.Map()),
      query: item.get('filters', Immutable.List())
        .filter(this.filterQuery)
        .reduce(this.buildQuery, Immutable.List()),
      groupByFields: item.get('group_by_fields', Immutable.List()),
      groupBy: item.get('group_by', Immutable.List())
        .filter(this.filterGroupBy)
        .reduce(this.buildGroupByQuery, Immutable.Map()),
    };
    return query;
  }

  applyFilter = () => {
    this.getReportData();
  }

  onClickExportCSV =() => {
    const { item } = this.props;
    const args = {
      query: this.buildReportQuery(),
      page: 0,
      size: -1,
    };
    const downloadURL = `${buildRequestUrl(getReportQuery(args))}&file_name=${item.get('key', 'report')}&type=csv`;
    window.open(downloadURL);
  }

  getTableFields = () => {
    const { item, linesFileds } = this.props;
    const selectedFields = item.get('display', Immutable.List());
    const isGroupBy = !item.get('group_by_fields', Immutable.List()).isEmpty();
    const configFields = linesFileds;
    const groupByOperators = getConfig(['reports', 'groupByOperators'], Immutable.List());


    const allFieldsConfig = Immutable.List().withMutations((listWithMutations) => {
      configFields.forEach((configField) => {
        listWithMutations.push(configField);
      });
      if (isGroupBy) {
        item.get('group_by', Immutable.List()).forEach((groupBy) => {
          const field = configFields.find(conf => conf.get('id', '') === groupBy.get('field', ''), null, Immutable.Map());
          const operator = groupByOperators.find(op => op.get('id', '') === groupBy.get('op', ''), null, Immutable.Map());
          listWithMutations.push(Immutable.Map({
            id: `${groupBy.get('field', '')}_${groupBy.get('op', '')}`,
            title: `${field.get('title', '')} (${operator.get('title', groupBy.get('op', ''))})`,
          }));
        });
      }
    });

    return Immutable.List().withMutations((listWithMutations) => {
      selectedFields.forEach((selectedField) => {
        const field = allFieldsConfig.find(
          configField => configField.get('id', '') === selectedField,
        );
        if (field) {
          listWithMutations.push(field);
        }
      });
    })
    .toJS();
  }

  onPageChange = (page) => {
    this.props.dispatch(setReportDataListPage(page));
  }

  onSizeChange = (size) => {
    this.props.dispatch(setReportDataListPage(0));
    this.props.dispatch(setReportDataListSize(size));
  }

  onReset = () => {
    this.fetchItem();
  }

  renderPanelHeader = () => {
    const { mode } = this.props;
    if (mode === 'view') {
      return (
        <div>
          Report
          <div className="pull-right">
            <Button bsSize="xsmall" className="btn-primary" onClick={this.onClickExportCSV}>
              <i className="fa fa-file-excel-o" />&nbsp;Export CSV
            </Button>
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    const { progress } = this.state;
    const { item, mode, linesFileds, reportData, size, page, nextPage } = this.props;
    if (mode === 'loading') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const allowEdit = mode !== 'view';
    const tableFields = this.getTableFields();
    return (
      <div className="report-setup">
        <Panel header={this.renderPanelHeader()}>
          { allowEdit &&
            <ReportDetails
              report={item}
              linesFileds={linesFileds}
              mode={mode}
              onUpdate={this.onChangeFieldValue}
              onReset={this.fetchItem}
              onFilter={this.applyFilter}
            />
          }

          <List items={reportData} fields={tableFields} className="report-list" />
          <Pager
            page={page}
            size={size}
            count={reportData.size}
            nextPage={nextPage}
            onChangePage={this.onPageChange}
            onChangeSize={this.onSizeChange}
          />

          <div className="clearfix" />
          <hr className="mb0" />
          <Col sm={12} className="pl0 pr0">
            <Col sm={6} className="text-left pl0">
              <ActionButtons
                onClickCancel={this.handleBack}
                onClickSave={this.handleSave}
                hideSave={!allowEdit}
                cancelLabel="Back to list"
                progress={progress}
                disableCancel={progress}
              />
            </Col>
            <Col sm={6} className="text-right pr0">
              { allowEdit
                ? <ActionButtons
                  cancelLabel="Reset"
                  onClickCancel={this.onReset}
                  disableCancel={progress}
                  hideSave={true}
                />
                : <ActionButtons
                  saveLabel="Edit"
                  onClickSave={this.handleEdit}
                  hideCancel={true}
                />
              }
            </Col>
          </Col>
        </Panel>
      </div>
    );
  }
}


const mapStateToProps = (state, props) => ({
  userName: state.user.get('name'),
  itemId: idSelector(state, props, 'reports'),
  item: itemSelector(state, props, 'reports'),
  mode: modeSimpleSelector(state, props, 'reports'),
  linesFileds: linesFiledsSelector(state, props, 'reports'),
  reportData: state.entityList.items.get('reportData'),
  page: state.entityList.page.get('reportData'),
  nextPage: state.entityList.nextPage.get('reportData'),
  size: state.entityList.size.get('reportData'),
});

export default withRouter(connect(mapStateToProps)(ReportSetup));
