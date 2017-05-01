import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { Panel } from 'react-bootstrap';
import { ActionButtons, LoadingItemPlaceholder } from '../Elements';
import { CustomFilter } from '../EntityList/Filter';
import ReportDetails from './ReportDetails';
import {
  buildPageTitle,
  getConfig,
  getItemId,
} from '../../common/Util';
import { showSuccess, showDanger } from '../../actions/alertsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import {
  saveReport,
  getReport,
  clearReport,
  updateReport,
  deleteReportValue,
  setCloneReport,
} from '../../actions/reportsActions';
import { clearItems } from '../../actions/entityListActions';
import { modeSimpleSelector, itemSelector, idSelector } from '../../selectors/entitySelector';


class ReportSetup extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    item: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string,
    userName: PropTypes.string,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    item: Immutable.Map(),
    userName: 'Unknown',
  }

  state = {
    progress: false,
  }

  componentWillMount() {
    this.fetchItem();
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
      this.props.dispatch(getReport(itemId)).then(this.afterItemReceived);
    }
  }

  afterItemReceived = (response) => {
    if (response.status) {
      this.initDefaultValues();
    } else {
      this.handleBack();
    }
  }

  onChangeFieldValue = (path, value) => {
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
      this.handleBack(true);
    }
  }

  handleSave = () => {
    const { item, mode } = this.props;
    if (this.validate()) {
      this.setState({ progress: true });
      this.props.dispatch(saveReport(item, mode)).then(this.afterSave);
    }
  }

  handleBack = (itemWasChanged = false) => {
    const itemsType = getConfig(['systemItems', 'report', 'itemsType'], '');
    if (itemWasChanged) {
      this.props.dispatch(clearItems(itemsType)); // refetch items list because item was (changed in / added to) list
    }
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

  render() {
    const { progress } = this.state;
    const { item, mode } = this.props;
    if (mode === 'loading') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const allowEdit = mode !== 'view';
    return (
      <div className="report-setup">
        <Panel>
          <CustomFilter
            filters={item.get('filters', Immutable.List())}
            entity={item.get('entity', '')}
            onChangefilter={this.onChangeFieldValue}
          />
          <ReportDetails
            report={item}
            mode={mode}
            onChangeFieldValue={this.onChangeFieldValue}
          />
          <ActionButtons
            onClickCancel={this.handleBack}
            onClickSave={this.handleSave}
            hideSave={!allowEdit}
            cancelLabel={allowEdit ? undefined : 'Back'}
            progress={progress}
          />
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
});

export default withRouter(connect(mapStateToProps)(ReportSetup));
