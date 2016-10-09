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

export default class PlanIncludesTab extends Component {

  static propTypes = {
    includeGroups: React.PropTypes.instanceOf(Immutable.Map),
    onChangeFieldValue: React.PropTypes.func.isRequired,
    onRemoveGroup: React.PropTypes.func.isRequired,
    addGroup: React.PropTypes.func.isRequired,
    addGroupProducts: React.PropTypes.func.isRequired,
    removeGroupProducts: React.PropTypes.func.isRequired,
    getGroupProducts: React.PropTypes.func.isRequired,
  }

  state = {
    existingGroups: []
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   return true;
  //   // return !Immutable.is(nextProps.plan.get('include'), this.props.plan.get('include'));
  // }

  componentDidMount() {
    getAllGroup().then( (response) => {
      var groups = new Set();
      _.values(response.data[0].data.details).forEach( (plan) => {
        Object.keys(plan.include.groups).forEach( (groupName) => {
          groups.add(groupName);
        })
      });

      this.setState({ existingGroups: Array.from(groups) });
    });
  }

  renderGroups = () => {
    const { includeGroups } = this.props;

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
              onChangeFieldValue={this.props.onChangeFieldValue}
              onGroupRemove={this.props.onRemoveGroup}
              addGroupProducts={this.props.addGroupProducts}
              getGroupProducts={this.props.getGroupProducts}
              removeGroupProducts={this.props.removeGroupProducts}
          />
        );
        groups.push(<hr key={`${groupName}_${usaget}_sep`}/>)
      });
    });

    return groups;
  }

  render() {
    const { existingGroups } = this.state;
    const { includeGroups } = this.props;
    const planGroupsNames = includeGroups.keySeq().toArray();
    const existinGrousNames = [...new Set([...existingGroups, ...planGroupsNames])];


    return (
      <Row>
        <Col lg={8}>
            <Panel header={<h3>Groups <Help contents={PlanDescription.include_groups} /></h3>}>
              {this.renderGroups()}
              <PlanIncludeGroupCreate
                  existinGrousNames={existinGrousNames}
                  addGroup={this.props.addGroup}
                  addGroupProducts={this.props.addGroupProducts}
              />
            </Panel>
        </Col>
      </Row>
    );
  }

}
