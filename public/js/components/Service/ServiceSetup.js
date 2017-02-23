import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { Col, Panel, Tabs, Tab } from 'react-bootstrap';
import ServiceDetails from './ServiceDetails';
import PlanIncludesTab from '../Plan/PlanIncludesTab';
import { EntityRevisionDetails } from '../Entity';
import { ActionButtons, LoadingItemPlaceholder } from '../Elements';
import { buildPageTitle, getItemDateValue } from '../../common/Util';
import { addGroup, removeGroup, getService, clearService, updateService, saveService } from '../../actions/serviceActions';
import { showSuccess } from '../../actions/alertsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { clearItems, getRevisions, clearRevisions } from '../../actions/entityListActions';
import { modeSelector, itemSelector, idSelector, tabSelector, revisionsSelector } from '../../selectors/entitySelector';


class ServiceSetup extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    item: PropTypes.instanceOf(Immutable.Map),
    revisions: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    activeTab: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    item: Immutable.Map(),
    revisions: Immutable.List(),
    activeTab: 1,
  };

  state = {
    activeTab: parseInt(this.props.activeTab),
  };

  componentDidMount() {
    const { itemId, mode } = this.props;
    if (itemId) {
      this.props.dispatch(getService(itemId)).then(this.afterItemReceived);
    }
    if (mode === 'create') {
      const pageTitle = buildPageTitle(mode, 'service');
      this.props.dispatch(setPageTitle(pageTitle));
    }
    this.initDefaultValues();
  }

  componentWillReceiveProps(nextProps) {
    const { item, mode, itemId } = nextProps;
    const { item: oldItem, itemId: oldItemId, mode: oldMode } = this.props;
    if (mode !== oldMode || oldItem.get('name') !== item.get('name')) {
      const pageTitle = buildPageTitle(mode, 'service', item);
      this.props.dispatch(setPageTitle(pageTitle));
    }
    if (itemId !== oldItemId) {
      this.props.dispatch(getService(itemId)).then(this.initDefaultValues);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.props.item, nextState.item)
      || this.props.itemId !== nextProps.itemId
      || this.props.mode !== nextProps.mode;
  }

  componentWillUnmount() {
    this.props.dispatch(clearService());
  }

  initDefaultValues = () => {
    const { mode, item } = this.props;
    if (mode === 'create' || (mode === 'closeandnew' && getItemDateValue(item, 'from').isBefore(moment()))) {
      const defaultFromValue = moment().add(1, 'days').toISOString();
      this.props.dispatch(updateService(['from'], defaultFromValue));
    }
  }

  initRevisions = () => {
    const { item, revisions } = this.props;
    if (revisions.isEmpty() && item.getIn(['_id', '$id'], false)) {
      const key = item.get('name', '');
      this.props.dispatch(getRevisions('services', 'name', key));
    }
  }

  afterItemReceived = (response) => {
    if (response.status) {
      this.initRevisions();
      this.initDefaultValues();
    } else {
      this.handleBack();
    }
  }

  onGroupAdd = (groupName, usage, value, shared, products) => {
    this.props.dispatch(addGroup(groupName, usage, value, shared, products));
  }

  onGroupRemove = (groupName) => {
    this.props.dispatch(removeGroup(groupName));
  }

  onUpdateItem = (path, value) => {
    this.props.dispatch(updateService(path, value));
  }

  afterSave = (response) => {
    const { mode, item } = this.props;
    if (response.status) {
      const key = item.get('name', '');
      this.props.dispatch(clearRevisions('services', key)); // refetch items list because item was (changed in / added to) list
      const action = (mode === 'create') ? 'created' : 'updated';
      this.props.dispatch(showSuccess(`The service was ${action}`));
      this.handleBack();
    }
  }

  handleSelectTab = (activeTab) => {
    this.setState({ activeTab });
  }

  handleBack = (itemWasChanged = false) => {
    if (itemWasChanged) {
      this.props.dispatch(clearItems('services')); // refetch items list because item was (changed in / added to) list
    }
    const listUrl = globalSetting.systemItems.service.itemsType;
    this.props.router.push(`/${listUrl}`);
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(saveService(item, mode)).then(this.afterSave);
  }

  render() {
    const { item, mode, revisions } = this.props;
    if (mode === 'loading') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const allowEdit = mode !== 'view';
    const includeGroups = item.getIn(['include', 'groups'], Immutable.Map());
    return (
      <Col lg={12}>
        <Panel>
          <EntityRevisionDetails
            revisions={revisions}
            item={item}
            mode={mode}
            onChangeFrom={this.onUpdateItem}
            itemName="service"
            backToList={this.handleBack}
          />
        </Panel>

        <Tabs defaultActiveKey={this.state.activeTab} animation={false} id="SettingsTab" onSelect={this.handleSelectTab}>

          <Tab title="Details" eventKey={1}>
            <Panel style={{ borderTop: 'none' }}>
              <ServiceDetails item={item} mode={mode} updateItem={this.onUpdateItem} />
            </Panel>
          </Tab>

          <Tab title="Service Includes" eventKey={2}>
            <Panel style={{ borderTop: 'none' }}>
              <PlanIncludesTab
                includeGroups={includeGroups}
                onChangeFieldValue={this.onUpdateItem}
                onGroupAdd={this.onGroupAdd}
                onGroupRemove={this.onGroupRemove}
                mode={mode}
              />
            </Panel>
          </Tab>

        </Tabs>
        <ActionButtons
          onClickCancel={this.handleBack}
          onClickSave={this.handleSave}
          hideSave={!allowEdit}
          cancelLabel={allowEdit ? undefined : 'Back'}
        />
      </Col>
    );
  }

}


const mapStateToProps = (state, props) => ({
  itemId: idSelector(state, props, 'service'),
  item: itemSelector(state, props, 'service'),
  mode: modeSelector(state, props, 'service'),
  activeTab: tabSelector(state, props, 'service'),
  revisions: revisionsSelector(state, props, 'service'),
});

export default withRouter(connect(mapStateToProps)(ServiceSetup));
