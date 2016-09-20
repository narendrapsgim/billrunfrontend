import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

  constructor(props) {
    super(props);
    this.onIncludeChange = this.onIncludeChange.bind(this);
    this.onGroupRemove = this.onGroupRemove.bind(this);
    this.renderGroups = this.renderGroups.bind(this);

    this.state = { existingGroups: [] };
  }

  componentDidMount() {
    getAllGroup().then( (response) => {
      var groups = [];
      _.values(response.data[0].data.details).forEach( (plan) => { groups.push( ...Object.keys(plan.include.groups) )} );
      this.setState({ existingGroups: groups });
    })
  }

  shouldComponentUpdate(nextProps, nextState){
    return true;
    // return !Immutable.is(nextProps.plan.get('include'), this.props.plan.get('include'));
  }

  onGroupRemove(groupName, usaget){
    this.props.removePlanInclude(groupName, usaget);
  }

  onIncludeChange(groupName, usaget, value){
    this.props.changePlanInclude(groupName, usaget, value);
  }

  renderGroups(){
    const { plan } = this.props;
    const includeGroups =  plan.getIn(['include', 'groups']);
    if(typeof includeGroups === 'undefined'){
      return null;
    }
    let groups = [];
    includeGroups.forEach((include, groupName) => {
      include.forEach( (value, usaget) => {
          groups.push(
            <div key={`${groupName}_${usaget}`}>
              <hr />
              <PlanIncludeGroupEdit
                name={groupName}
                value={value}
                usaget={usaget}
                onIncludeChange={this.onIncludeChange}
                onGroupRemove={this.onGroupRemove}
              />
          </div>
        )
      });
    });

    return groups;
  }

  render() {
    const { existingGroups } = this.state;
    return (
      <div>
        <h4>Groups <Help contents={PlanDescription.include_groups} /></h4>
        <div className="edit-includes">
          {this.renderGroups()}
        </div>
        <div className="add-include">
          <hr />
          <PlanIncludeGroupCreate existingGroups={existingGroups}/>
          <hr />
        </div>
      </div>
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
