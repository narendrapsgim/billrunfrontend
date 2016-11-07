import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import { Col, Panel, Tabs, Tab, Button } from 'react-bootstrap';
import ServiceDetails from './ServiceDetails';
import PlanIncludesTab from '../Plan/PlanIncludesTab';
import {
  onGroupAdd,
  onGroupRemove,
  getItem,
  clearItem,
  updateItem,
  saveItem } from '../../actions/serviceActions';
import {
 addGroupProducts,
 getGroupProducts,
 removeGroupProducts } from '../../actions/planGroupsActions';
import { savePlanRates, planProductsClear } from '../../actions/planProductsActions';
import { showDanger, showSuccess } from '../../actions/alertsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';


class ServiceSetup extends Component {

  static defaultProps = {
    item: Immutable.Map(),
  };

  static propTypes = {
    itemId: React.PropTypes.string,
    item: React.PropTypes.instanceOf(Immutable.Map),
    includeGroups: React.PropTypes.instanceOf(Immutable.Map),
    mode: React.PropTypes.string,
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired,
    }).isRequired,
    addGroupProducts: React.PropTypes.func.isRequired,
    clearItem: React.PropTypes.func.isRequired,
    getGroupProducts: React.PropTypes.func.isRequired,
    getItem: React.PropTypes.func.isRequired,
    onGroupAdd: React.PropTypes.func.isRequired,
    onGroupRemove: React.PropTypes.func.isRequired,
    planProductsClear: React.PropTypes.func.isRequired,
    removeGroupProducts: React.PropTypes.func.isRequired,
    saveItem: React.PropTypes.func.isRequired,
    savePlanRates: React.PropTypes.func.isRequired,
    setPageTitle: React.PropTypes.func.isRequired,
    showDanger: React.PropTypes.func.isRequired,
    showSuccess: React.PropTypes.func.isRequired,
    updateItem: React.PropTypes.func.isRequired,
  }

  state = {
    activeTab: 1,
  };

  componentDidMount() {
    const { itemId, mode, item } = this.props;
    if (typeof itemId !== 'undefined' && itemId !== null && itemId !== '') {
      this.props.getItem(itemId).then(
        (response) => {
          if (response !== true) {
            this.handleResponseError(response);
          }
        }
      );
    }
    if (mode === 'new') {
      this.props.setPageTitle('Create New Service');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { item, mode } = nextProps;
    const { item: oldItem } = this.props;
    if (mode === 'update' && oldItem.get('name') !== item.get('name')) {
      this.props.setPageTitle(`Edit service - ${item.get('name')}`);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.props.item, nextState.item) || this.props.itemId !== nextState.itemId;
  }

  componentWillUnmount() {
    this.props.clearItem();
    this.props.planProductsClear();
  }

  handleResponseError = (response) => {
    let errorMessage = 'Error, please try again...';
    try {
      errorMessage = response.error[0].error.data.message;
    } catch (e1) {
      try {
        errorMessage = response.error[0].error.message;
      } catch (e2) {
        console.log('unknown error response: ', response);
      }
    }
    this.props.showDanger(errorMessage);
  }

  updateItem = (path, value) => {
    this.props.updateItem(path, value);
  }

  handleSelectTab = (activeTab) => {
    this.setState({ activeTab });
  }

  handleBack = () => {
    this.props.router.push('/services');
  }

  handleSave = () => {
    this.saveRates();
  }

  saveRates = () => {
    this.props.savePlanRates(this.saveItem);
  }

  saveItem = () => {
    const { item, mode } = this.props;
    const action = (mode === 'new') ? 'created' : 'updated';

    this.props.saveItem(item).then(
      (response) => {
        if (response !== true) {
          this.handleResponseError(response);
        } else {
          this.props.showSuccess(`The service was ${action}`);
          this.props.router.push('/services');
        }
      }
    );
  }

  render() {
    const { item, mode, includeGroups } = this.props;

    // in update mode wait for item before render edit screen
    if (mode === 'update' && typeof item.getIn(['_id', '$id']) === 'undefined') {
      return (
        <div>
          <p>Loading...</p>
          <Button onClick={this.handleBack} bsStyle="default">Back</Button>
        </div>
      );
    }

    return (
      <Col lg={12}>

        <Tabs defaultActiveKey={this.state.activeTab} animation={false} id="SettingsTab" onSelect={this.handleSelectTab}>

          <Tab title="Details" eventKey={1}>
            <Panel style={{ borderTop: 'none' }}>
              <ServiceDetails item={item} mode={mode} updateItem={this.updateItem} />
            </Panel>
          </Tab>

          <Tab title="Service Includes" eventKey={2}>
            <Panel style={{ borderTop: 'none' }}>
              <PlanIncludesTab
                includeGroups={includeGroups}
                onChangeFieldValue={this.props.updateItem}
                onRemoveGroup={this.props.onGroupRemove}
                addGroup={this.props.onGroupAdd}
                addGroupProducts={this.props.addGroupProducts}
                getGroupProducts={this.props.getGroupProducts}
                removeGroupProducts={this.props.removeGroupProducts}
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

const mapDispatchToProps = dispatch => bindActionCreators({
  addGroupProducts,
  clearItem,
  getGroupProducts,
  getItem,
  onGroupAdd,
  onGroupRemove,
  planProductsClear,
  removeGroupProducts,
  saveItem,
  savePlanRates,
  setPageTitle,
  showDanger,
  showSuccess,
  updateItem,
}, dispatch);

const mapStateToProps = (state, props) => {
  const item = state.service;
  const itemId = props.params.itemId || null;
  const mode = (itemId) ? 'update' : 'new';
  const includeGroups = item.getIn(['include', 'groups'], Immutable.Map());
  return { includeGroups, itemId, mode, item };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ServiceSetup));
