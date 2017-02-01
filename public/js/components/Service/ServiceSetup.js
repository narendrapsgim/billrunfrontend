import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import { Col, Panel, Tabs, Tab, Button } from 'react-bootstrap';
import ServiceDetails from './ServiceDetails';
import PlanIncludesTab from '../Plan/PlanIncludesTab';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
import { onGroupAdd, onGroupRemove, getItem, clearItem, updateItem, saveItem } from '../../actions/serviceActions';
import { showSuccess } from '../../actions/alertsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';


class ServiceSetup extends Component {

  static defaultProps = {
    item: Immutable.Map(),
  };

  static propTypes = {
    itemId: PropTypes.string,
    item: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  state = {
    activeTab: 1,
  };

  componentDidMount() {
    const { itemId, mode } = this.props;
    if (typeof itemId !== 'undefined' && itemId !== null && itemId !== '') {
      this.props.dispatch(getItem(itemId));
    }
    if (mode === 'new') {
      this.props.dispatch(setPageTitle('Create New Service'));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { item, mode } = nextProps;
    const { item: oldItem } = this.props;
    if (mode === 'update' && oldItem.get('name') !== item.get('name')) {
      this.props.dispatch(setPageTitle(`Edit service - ${item.get('name')}`));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.props.item, nextState.item) || this.props.itemId !== nextState.itemId;
  }

  componentWillUnmount() {
    this.props.dispatch(clearItem());
  }


  onGroupAdd = (groupName, usage, value, shared, products) => {
    this.props.dispatch(onGroupAdd(groupName, usage, value, shared, products));
  }

  onGroupRemove = (groupName) => {
    this.props.dispatch(onGroupRemove(groupName));
  }


  onUpdateItem = (path, value) => {
    this.props.dispatch(updateItem(path, value));
  }

  handleSelectTab = (activeTab) => {
    this.setState({ activeTab });
  }

  handleBack = () => {
    this.props.router.push('/services');
  }

  handleSave = () => {
    const { item, mode } = this.props;
    const action = (mode === 'new') ? 'created' : 'updated';

    this.props.dispatch(saveItem(item)).then(
      (response) => {
        if (response === true) {
          this.props.dispatch(showSuccess(`The service was ${action}`));
          this.handleBack();
        }
      }
    );
  }

  render() {
    const { item, mode } = this.props;
    // in update mode wait for item before render edit screen
    if (mode === 'update' && typeof item.getIn(['_id', '$id']) === 'undefined') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const includeGroups = item.getIn(['include', 'groups'], Immutable.Map());

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
                includeGroups={includeGroups}
                onChangeFieldValue={this.onUpdateItem}
                onGroupAdd={this.onGroupAdd}
                onGroupRemove={this.onGroupRemove}
              />
            </Panel>
          </Tab>
        </Tabs>

        <div style={{ marginTop: 12 }}>
          <Button onClick={this.handleSave} bsStyle="primary" style={{ minWidth: 90, marginRight: 10 }}>Save</Button>
          <Button onClick={this.handleBack} bsStyle="default" style={{ minWidth: 90 }}>Cancel</Button>
        </div>

      </Col>
    );
  }

}

const mapStateToProps = (state, props) => {
  const { service: item } = state;
  const { itemId, action: mode = (itemId) ? 'update' : 'new' } = props.params;
  return { itemId, mode, item };
};
export default withRouter(connect(mapStateToProps)(ServiceSetup));
