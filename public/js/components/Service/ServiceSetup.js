import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import { Row, Col, Panel, Tabs, Tab, Button } from 'react-bootstrap';
import ServiceDetails from './ServiceDetails';
import { getItem, clearItem, updateItem, saveItem } from '../../actions/serviceActions';
import { showDanger } from '../../actions/alertsActions';


class ServiceSetup extends Component {

  static defaultProps = {
    item : Immutable.Map()
  };

  static propTypes = {
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired
    }).isRequired,
    params: React.PropTypes.object.isRequired,
    item: React.PropTypes.instanceOf(Immutable.Map),
    getItem: React.PropTypes.func.isRequired,
    updateItem: React.PropTypes.func.isRequired,
    saveItem: React.PropTypes.func.isRequired,
    clearItem: React.PropTypes.func.isRequired,
    showDanger: React.PropTypes.func.isRequired,
  }

  state = {
    activeTab : 1
  };


  componentWillMount() {
    const { itemId } = this.props.params;
    if ((typeof itemId !== 'undefined') ) {
      this.props.getItem(itemId).then(
        response => {
          if(response !== true){
            this.handleResponseError(response);
          }
        },
      );
    }
  }

  componentWillUnmount() {
    this.props.clearItem();
  }

  handleResponseError = (response) => {
    let errorMessage = 'Error, please try again...';
    try {
      errorMessage = response.error[0].error.data.message;
    } catch (e) {
      console.log("unknown error response: ", response);
    }
    this.props.showDanger(errorMessage);
  }


  updateItem = (path, value) => {
    this.props.updateItem(path, value)
  }

  handleSelectTab = (activeTab) => {
    this.setState({activeTab});
  }

  handleBack = () => {
    this.props.router.push('/services');
  }

  handleSave = () => {
    const { item } = this.props;
    this.props.saveItem(item).then(
      response => {
        if(response !== true){
          this.handleResponseError(response);
        } else {
          this.props.router.push('/services');
        }
      }
    );
  }

  render() {
    const { item } = this.props;
    const action = (typeof this.props.params.itemId === 'undefined') ? 'new' : 'update';

    //in update mode wait for item before render edit screen
    if(action === 'update' && typeof item.getIn(['_id', '$id']) === 'undefined'){
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
            <Panel style={{borderTop: 'none'}}>
              <ServiceDetails item={item} mode={action} updateItem={this.updateItem}/>
            </Panel>
          </Tab>

          {/*
          <Tab title="Service Includes" eventKey={3}>
            <Panel style={{borderTop: 'none'}}>
              Groups
            </Panel>
          </Tab>
          */}

        </Tabs>
        <div style={{marginTop: 12}}>
          <Button onClick={this.handleSave} bsStyle="primary" style={{marginRight: 10}}>Save</Button>
          <Button onClick={this.handleBack} bsStyle="default">Cancel</Button>
        </div>
      </Col>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getItem,
    clearItem,
    updateItem,
    saveItem,
    showDanger }, dispatch);
}
function mapStateToProps(state, props) {
  return { item: state.services.service }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ServiceSetup));
