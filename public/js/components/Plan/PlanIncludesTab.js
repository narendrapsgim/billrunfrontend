import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Panel, Form, FormGroup, Col, Row, Table } from 'react-bootstrap';
import Immutable from 'immutable';
import { getAllGroup } from '../../actions/planGroupsActions';
import Help from '../Help';
import { PlanDescription } from '../../FieldDescriptions';
import PlanIncludeGroupEdit from './components/PlanIncludeGroupEdit';
import PlanIncludeGroupCreate from './components/PlanIncludeGroupCreate';


class PlanIncludesTab extends Component {

  static propTypes = {
    allGroupsProductsKeys: React.PropTypes.instanceOf(Immutable.Set),
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

  componentDidMount() {
    getAllGroup().then( (responses) => {
      var groups = new Set();
      responses.data.forEach( (response) => {
        _.values(response.data.details).forEach( (plan) => {
          Object.keys(plan.include.groups).forEach( (groupName) => {
            groups.add(groupName);
          })
        });
      });

      this.setState({ existingGroups: Array.from(groups) });
    });
  }

  renderGroups = () => {
    const { includeGroups, allGroupsProductsKeys } = this.props;

    if(typeof includeGroups === 'undefined'){
      return null;
    }

    let rows = [];
    includeGroups.forEach((include, groupName) => {
      let shared = include.get('account_shared', false);
      include.forEach( (value, usaget) => {
        if(usaget !== 'account_shared'){
          let row = (
            <PlanIncludeGroupEdit key={`${groupName}_${usaget}`}
                name={groupName}
                value={value}
                usaget={usaget}
                shared={shared}
              	allGroupsProductsKeys={allGroupsProductsKeys}
                onChangeFieldValue={this.props.onChangeFieldValue}
                onGroupRemove={this.props.onRemoveGroup}
                addGroupProducts={this.props.addGroupProducts}
                getGroupProducts={this.props.getGroupProducts}
                removeGroupProducts={this.props.removeGroupProducts}
            />
          );
          rows.push(row);
        }
      });
    });

    const header = (
      <tr>
        <th style={{ width: 150 }}>Name</th>
        <th style={{ width: 100 }}>Unit Type</th>
        <th style={{ width: 100 }}>Include</th>
        <th>Products</th>
        <th className="text-center" style={{ width: 100 }}>Shared</th>
        <th style={{ width:180 }}/>
      </tr>
    );
    const groupsTable = (
      <Table style={{ tableLayout: 'fixed' }}>
        <thead>{header}</thead>
        <tbody>{rows}</tbody>
      </Table>
    );
    return groupsTable;
  }

  render() {
    const { existingGroups } = this.state;
    const { includeGroups, allGroupsProductsKeys } = this.props;
    const planGroupsNames = includeGroups.keySeq().toArray();
    const existinGrousNames = Immutable.Set([...existingGroups, ...planGroupsNames]);

    return (
      <Row>
        <Col lg={12}>
            <Panel header={<h3>Groups <Help contents={PlanDescription.include_groups} /></h3>}>
              {this.renderGroups()}
            </Panel>
            <PlanIncludeGroupCreate
                existinGrousNames={existinGrousNames}
                allGroupsProductsKeys={allGroupsProductsKeys}
                addGroup={this.props.addGroup}
                addGroupProducts={this.props.addGroupProducts}
            />
        </Col>
      </Row>
    );
  }

}

function mapStateToProps(state, props) {
  let allGroupsProductsKeys = Immutable.Set();
  state.planProducts.productIncludeGroup.forEach( (group) => {
    group.forEach( (usage) => {
      usage.forEach( (productKey) => {
        allGroupsProductsKeys = allGroupsProductsKeys.add(productKey);
      })
    })
  });
  return  {
    allGroupsProductsKeys,
 };
}
export default connect(mapStateToProps)(PlanIncludesTab);
