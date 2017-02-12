import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import { Col, Panel, Tabs, Tab } from 'react-bootstrap';
import ServiceDetails from './ServiceDetails';
import PlanIncludesTab from '../Plan/PlanIncludesTab';
import { ActionButtons, LoadingItemPlaceholder } from '../Elements';
import { addGroup, removeGroup, getService, clearService, updateService, saveService } from '../../actions/serviceActions';
import { showSuccess } from '../../actions/alertsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { clearItems } from '../../actions/entityListActions';


class ServiceSetup extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    item: PropTypes.instanceOf(Immutable.Map),
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
    activeTab: 1,
  };

  state = {
    activeTab: parseInt(this.props.activeTab),
  };

  componentDidMount() {
    const { itemId, mode } = this.props;
    if (itemId) {
      this.props.dispatch(getService(itemId));
    }
    if (mode === 'create') {
      this.props.dispatch(setPageTitle('Create New Service'));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { item, mode } = nextProps;
    const { item: oldItem } = this.props;
    if (mode !== 'create' && oldItem.get('name') !== item.get('name')) {
      this.props.dispatch(setPageTitle(`Edit service - ${item.get('name')}`));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.props.item, nextState.item) || this.props.itemId !== nextState.itemId;
  }

  componentWillUnmount() {
    this.props.dispatch(clearService());
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
    const { mode } = this.props;
    if (response.status) {
      this.props.dispatch(clearItems('services')); // refetch items list because item was (changed in / added to) list
      const action = (mode === 'create') ? 'created' : 'updated';
      this.props.dispatch(showSuccess(`The service was ${action}`));
      this.handleBack();
    }
  }

  handleSelectTab = (activeTab) => {
    this.setState({ activeTab });
  }

  handleBack = () => {
    this.props.router.push('/services');
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(saveService(item, mode)).then(this.afterSave);
  }

  render() {
    const { item, mode } = this.props;
    // in update mode wait for item before render edit screen
    if (mode !== 'create' && typeof item.getIn(['_id', '$id']) === 'undefined') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const planIncludes = item.getIn(['include', 'groups'], Immutable.Map());
    return (
      <Col lg={12}>

        <Tabs defaultActiveKey={this.state.activeTab} animation={false} id="SettingsTab" onSelect={this.handleSelectTab}>

          <Tab title="Details" eventKey={1}>
            <Panel style={{ borderTop: 'none' }}>
              <ServiceDetails item={item} mode={mode} updateItem={this.onUpdateItem} />
            </Panel>
          </Tab>

          <Tab title="Service Includes" eventKey={2}>
            <Panel style={{ borderTop: 'none' }}>
              <PlanIncludesTab
                planIncludes={planIncludes}
                onChangeFieldValue={this.onUpdateItem}
                onGroupAdd={this.onGroupAdd}
                onGroupRemove={this.onGroupRemove}
              />
            </Panel>
          </Tab>

        </Tabs>
        <ActionButtons onClickCancel={this.handleBack} onClickSave={this.handleSave} />
      </Col>
    );
  }

}


const mapStateToProps = (state, props) => {
  const { tab: activeTab, action } = props.location.query;
  const { itemId } = props.params;
  const mode = action || ((itemId) ? 'closeandnew' : 'create');
  const { service: item } = state;
  return { itemId, item, mode, activeTab };
};
export default withRouter(connect(mapStateToProps)(ServiceSetup));
