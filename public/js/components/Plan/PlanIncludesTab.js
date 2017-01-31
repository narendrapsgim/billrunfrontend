import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Panel, Col, Row, Table } from 'react-bootstrap';
import Immutable from 'immutable';
import Help from '../Help';
import { PlanDescription } from '../../FieldDescriptions';
import PlanIncludeGroupEdit from './components/PlanIncludeGroupEdit';
import PlanIncludeGroupCreate from './components/PlanIncludeGroupCreate';
import { getAllGroup } from '../../actions/planActions';
import { getSettings } from '../../actions/settingsActions';


class PlanIncludesTab extends Component {

  static propTypes = {
    planIncludes: PropTypes.instanceOf(Immutable.Map),
    usageTypes: PropTypes.instanceOf(Immutable.List),
    onChangeFieldValue: PropTypes.func.isRequired,
    onGroupAdd: PropTypes.func.isRequired,
    onGroupRemove: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    planIncludes: Immutable.Map(),
  };

  constructor(props) {
    super(props);

    const usedProducts = Immutable.Set().withMutations((productsWithMutations) => {
      props.planIncludes.forEach((group) => {
        productsWithMutations.union(group.get('rates', Immutable.List()));
      });
    }).toList();

    this.state = {
      existingGroups: Immutable.List(),
      usedProducts,
    };
  }


  componentDidMount() {
    this.props.dispatch(getSettings('usage_types'));
    getAllGroup().then((responses) => {
      const existingGroups = Immutable.Set().withMutations((groupsWithMutations) => {
        responses.data.forEach((response) => {
          response.data.details.forEach((item) => {
            groupsWithMutations.union(Object.keys(item.include.groups));
          });
        });
      }).toList();
      this.setState({ existingGroups });
    });
  }

  onGroupAdd = (groupName, usage, include, shared, products) => {
    const { usedProducts, existingGroups } = this.state;
    this.setState({
      usedProducts: usedProducts.push(...products),
      existingGroups: existingGroups.push(groupName),
    });
    this.props.onGroupAdd(groupName, usage, include, shared, products);
  }

  onGroupRemove = (groupName, groupProducts) => {
    const { usedProducts, existingGroups } = this.state;
    this.setState({
      usedProducts: usedProducts.filter(key => !groupProducts.includes(key)),
      existingGroups: existingGroups.filter(key => key !== groupName),
    });
    this.props.onGroupRemove(groupName);
  }

  onGroupProductsAdd = (groupName, usaget, productKey) => {
    const { planIncludes } = this.props;
    const { usedProducts } = this.state;
    this.setState({
      usedProducts: usedProducts.push(productKey),
    });
    const path = ['include', 'groups', groupName, 'rates'];
    const products = planIncludes.getIn([groupName, 'rates'], Immutable.List()).push(productKey);
    this.props.onChangeFieldValue(path, products);
  }

  onGroupProductsRemove = (groupName, usaget, productKey) => {
    const { planIncludes } = this.props;
    const { usedProducts } = this.state;
    this.setState({
      usedProducts: usedProducts.filter(key => key !== productKey),
    });
    const path = ['include', 'groups', groupName, 'rates'];
    const products = planIncludes.getIn([groupName, 'rates'], Immutable.List()).filter(key => key !== productKey);
    this.props.onChangeFieldValue(path, products);
  }

  renderGroups = () => {
    const { usedProducts } = this.state;
    const { planIncludes } = this.props;

    if (typeof planIncludes === 'undefined' || planIncludes.size === 0) {
      return (<tr><td colSpan="6" className="text-center">No Groups</td></tr>);
    }

    return planIncludes.map((include, groupName) => {
      const shared = include.get('account_shared', false);
      const products = include.get('rates', Immutable.List());
      const usaget = include.findKey(prop => (prop !== 'account_shared' && prop !== 'rates'), '');
      const value = include.get(usaget, '');
      return (
        <PlanIncludeGroupEdit
          key={`${groupName}_${usaget}`}
          name={groupName}
          value={value}
          usaget={usaget}
          shared={shared}
          products={products}
          usedProducts={usedProducts.toList()}
          onChangeFieldValue={this.props.onChangeFieldValue}
          onGroupRemove={this.onGroupRemove}
          addGroupProducts={this.onGroupProductsAdd}
          removeGroupProducts={this.onGroupProductsRemove}
        />
      );
    }).toArray();
  }

  renderHeader = () => (
    <tr>
      <th style={{ width: 150 }}>Name</th>
      <th style={{ width: 100 }}>Unit Type</th>
      <th style={{ width: 100 }}>Include</th>
      <th>Products</th>
      <th className="text-center" style={{ width: 100 }}>Shared</th>
      <th style={{ width: 180 }} />
    </tr>
  );

  render() {
    const { usageTypes } = this.props;
    const { existingGroups, usedProducts } = this.state;

    return (
      <Row>
        <Col lg={12}>
          <Panel header={<h3>Groups <Help contents={PlanDescription.include_groups} /></h3>}>
            <Table style={{ tableLayout: 'fixed' }}>
              <thead>
                { this.renderHeader() }
              </thead>
              <tbody>
                { this.renderGroups() }
              </tbody>
            </Table>

          </Panel>
          <PlanIncludeGroupCreate
            usageTypes={usageTypes}
            existinGrousNames={existingGroups}
            usedProducts={usedProducts}
            addGroup={this.onGroupAdd}
          />
        </Col>
      </Row>
    );
  }

}
const mapStateToProps = (state) => {
  const usageTypes = state.settings.get('usage_types', Immutable.List());
  return { usageTypes };
};
export default connect(mapStateToProps)(PlanIncludesTab);
