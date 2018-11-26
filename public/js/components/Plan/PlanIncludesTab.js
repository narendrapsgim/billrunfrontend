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
import {
  getUnitLabel,
  getGroupUsaget,
  getGroupUnit,
  getGroupUsages,
  getGroupValue,
  getGroupUsageTypes,
} from '../../common/Util';
import {
  usageTypeSelector,
  propertyTypeSelector,
  usageTypesDataSelector,
} from '../../selectors/settingsSelector';


class PlanIncludesTab extends Component {

  static propTypes = {
    includeGroups: PropTypes.instanceOf(Immutable.Map),
    usageTypes: PropTypes.instanceOf(Immutable.List),
    usageTypesData: PropTypes.instanceOf(Immutable.List),
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    onChangeFieldValue: PropTypes.func.isRequired,
    onGroupAdd: PropTypes.func.isRequired,
    onGroupRemove: PropTypes.func.isRequired,
    mode: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    includeGroups: Immutable.Map(),
    usageTypes: Immutable.List(),
    usageTypesData: Immutable.List(),
    propertyTypes: Immutable.List(),
    mode: 'create',
  };

  constructor(props) {
    super(props);

    const usedProducts = Immutable.Set().withMutations((productsWithMutations) => {
      props.includeGroups.forEach((group) => {
        productsWithMutations.union(group.get('rates', Immutable.List()));
      });
    }).toList();

    this.state = {
      existingGroups: Immutable.List(),
      usedProducts,
    };
  }

  componentDidMount() {
    const { usageTypes } = this.props;
    if (usageTypes.isEmpty()) {
      this.props.dispatch(getSettings('usage_types'));
    }
    getAllGroup().then((responses) => {
      const existingGroups = Immutable.Set().withMutations((groupsWithMutations) => {
        responses.data.forEach((response) => {
          response.data.details.forEach((item) => {
            if (item.include && item.include.groups) {
              groupsWithMutations.union(Object.keys(item.include.groups));
            }
          });
        });
      }).toList();
      this.setState({ existingGroups });
    });
  }

  onGroupAdd = (groupName, usages, unit, include, shared, pooled, quantityEffected, products) => {
    const { usedProducts, existingGroups } = this.state;
    this.setState({
      usedProducts: usedProducts.push(...products),
      existingGroups: existingGroups.push(groupName),
    });
    this.props.onGroupAdd(groupName, usages, unit, include, shared, pooled, quantityEffected, products);
  }

  onGroupRemove = (groupName, groupProducts) => {
    const { usedProducts, existingGroups } = this.state;
    this.setState({
      usedProducts: usedProducts.filter(key => !groupProducts.includes(key)),
      existingGroups: existingGroups.filter(key => key !== groupName),
    });
    this.props.onGroupRemove(groupName);
  }

  onChangeGroupProducts = (groupName, productKeys) => {
    const { usedProducts } = this.state;
    this.setState({
      usedProducts: usedProducts.push(...productKeys),
    });
    const path = ['include', 'groups', groupName, 'rates'];
    this.props.onChangeFieldValue(path, productKeys);
  }

  renderGroups = () => {
    const { usedProducts } = this.state;
    const { includeGroups, mode, usageTypesData, propertyTypes } = this.props;

    if (includeGroups.isEmpty()) {
      return (<tr><td colSpan="6" className="text-center">No Groups</td></tr>);
    }

    return includeGroups.map((include, groupName) => {
      const shared = include.get('account_shared', false);
      const pooled = include.get('account_pool', false);
      const quantityEffected = include.get('quantity_effected', false);
      const products = include.get('rates', Immutable.List());
      const usages = getGroupUsages(include);
      const unit =
        getUnitLabel(propertyTypes, usageTypesData, getGroupUsaget(include), getGroupUnit(include));
      const value = getGroupValue(include);
      const usageTypes = getGroupUsageTypes(include);
      const usaget = getGroupUsaget(include);
      return (
        <PlanIncludeGroupEdit
          key={groupName}
          mode={mode}
          name={groupName}
          value={value}
          usages={usages}
          unit={unit}
          shared={shared}
          pooled={pooled}
          quantityEffected={quantityEffected}
          products={products}
          usedProducts={usedProducts.toList()}
          onChangeFieldValue={this.props.onChangeFieldValue}
          onGroupRemove={this.onGroupRemove}
          onChangeGroupProducts={this.onChangeGroupProducts}
          usaget={usaget}
          usageTypes={usageTypes}
        />
      );
    }).toArray();
  }

  renderHeader = () => (
    <tr>
      <th style={{ width: 150 }}>Name</th>
      <th style={{ width: 100 }}>Unit Type/s</th>
      <th style={{ width: 100 }}>Include</th>
      <th style={{ width: 100 }}>Unit</th>
      <th>Products</th>
      <th className="text-center" style={{ width: 80 }}>Shared</th>
      <th className="text-center" style={{ width: 80 }}>Pooled</th>
      <th style={{ width: 60 }} />
    </tr>
  );

  render() {
    const { mode } = this.props;
    const { existingGroups, usedProducts } = this.state;
    const allowCreate = mode !== 'view';

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
          { allowCreate &&
            <PlanIncludeGroupCreate
              existinGrousNames={existingGroups}
              usedProducts={usedProducts}
              addGroup={this.onGroupAdd}
            />
          }
        </Col>
      </Row>
    );
  }

}

const mapStateToProps = (state, props) => ({
  includeGroups: props.includeGroups || undefined,
  usageTypes: usageTypeSelector(state, props),
  propertyTypes: propertyTypeSelector(state, props),
  usageTypesData: usageTypesDataSelector(state, props),
});
export default connect(mapStateToProps)(PlanIncludesTab);
