import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Panel, Form, FormGroup, Col, Row } from 'react-bootstrap';
import Immutable from 'immutable';

import {
  removePlanInclude,
  changePlanInclude } from '../../actions/planActions';
import { getAllGroup } from '../../actions/planGroupsActions';

import Help from '../Help';
import { PlanDescription } from '../../FieldDescriptions';
import PlanIncludeGroupEdit from './components/PlanIncludeGroupEdit';
import PlanIncludeGroupCreate from './components/PlanIncludeGroupCreate';

class PlanIncludesTab extends Component {

  state = {
    existingGroups: []
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   return true;
  //   // return !Immutable.is(nextProps.plan.get('include'), this.props.plan.get('include'));
  // }

  componentDidMount() {
    getAllGroup().then( (response) => {
      var groups = [];
      _.values(response.data[0].data.details).forEach( (plan) => { groups.push( ...Object.keys(plan.include.groups) )} );
      this.setState({ existingGroups: groups });
    })
  }



  onGroupRemove = (groupName, usaget) => {
    this.props.removePlanInclude(groupName, usaget);
  }

  onIncludeChange = (groupName, usaget, value) => {
    this.props.changePlanInclude(groupName, usaget, value);
  }

  renderGroups = () => {
    const { plan } = this.props;
    const includeGroups =  plan.getIn(['include', 'groups']);

    if(typeof includeGroups === 'undefined'){
      return null;
    }

    let groups = [];
    includeGroups.forEach((include, groupName) => {
      include.forEach( (value, usaget) => {
          groups.push(
              <PlanIncludeGroupEdit key={`${groupName}_${usaget}`}
                name={groupName}
                value={value}
                usaget={usaget}
                onIncludeChange={this.onIncludeChange}
                onGroupRemove={this.onGroupRemove}
              />
        );
        groups.push(<hr />)
      });
    });

    return groups;
  }

  render() {

    const { existingGroups } = this.state;
    return (
      <Row>
        <Col lg={8}>
            <Panel header={<h3>Groups <Help contents={PlanDescription.include_groups} /></h3>}>
              {this.renderGroups()}
              <PlanIncludeGroupCreate existingGroups={existingGroups}/>
            </Panel>
        </Col>
      </Row>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changePlanInclude,
    removePlanInclude }, dispatch);
}

function mapStateToProps(state, props) {
  return  { plan: state.plan };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanIncludesTab);
