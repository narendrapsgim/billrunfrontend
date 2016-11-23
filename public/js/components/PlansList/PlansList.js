import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { capitalize } from 'lodash';
import List from '../List';
import Pager from '../Pager';
import Filter from '../Filter';
/* ACTIONS */
import { getList, clearList } from '../../actions/listActions';

class PlansList extends Component {

  static defaultProps = {
    items: Immutable.List(),
  }

  static propTypes = {
    items: React.PropTypes.instanceOf(Immutable.List),
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired,
    }).isRequired,
    getList: React.PropTypes.func.isRequired,
    clearList: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.itemsType = 'plans';
    this.itemType = 'plan';
    this.state = {
      size: 10,
      page: 0,
      sort: '',
      filter: {},
    };
  }

  componentWillUnmount() {
    this.props.clearList(this.itemsType);
  }

  onClickNew = () => {
    this.props.router.push(`/${this.itemType}`);
  }

  onSort = (sort) => {
    this.setState({ sort }, () => {
      this.props.getList(this.itemsType, this.buildQuery());
    });
  }

  onClickItem = (item) => {
    const itemId = item.getIn(['_id', '$id']);
    this.props.router.push(`/${this.itemType}/${itemId}`);
  }

  onFilter = (filter) => {
    this.setState(
      { filter, page: 0 },
      this.fetchItems
    );
  }

  buildQuery = () => ({
    api: 'find',
    params: [
      { collection: this.itemsType },
      { size: this.state.size },
      { page: this.state.page },
      { sort: this.state.sort },
      { query: this.state.filter },
    ],
  });

  fetchItems = () => {
    this.props.getList(this.itemsType, this.buildQuery());
  }

  handlePageClick = (page) => {
    this.setState(
      { page },
      this.fetchItems
    );
  }

  trialParser = (item) => {
    if (item.getIn(['price', 0, 'trial'])) {
      return `${item.getIn(['price', 0, 'to'])} ${item.getIn(['recurrence', 'periodicity'])}`;
    }
    return '';
  };

  recuringChargesParser = (item) => {
    const sub = item.getIn(['price', 0, 'trial']) ? 1 : 0;
    const cycles = item.get('price', Immutable.List()).size - sub;
    return `${cycles} cycles`;
  };

  billingFrequencyParser = (item) => {
    const periodicity = item.getIn(['recurrence', 'periodicity'], '');
    return (!periodicity) ? '' : `${capitalize(periodicity)}ly`;
  };

  chargingModeParser = item => (item.get('upfront') ? 'Upfront' : 'Arrears');

  getFilterFields = () => ([
    { id: 'description', title: 'Title', sort: true },
    { id: 'name', title: 'Key', sort: true },
    { id: 'code', title: 'External Code', sort: true },
    { title: 'Trial', parser: this.trialParser },
    { id: 'recurrence_charges', title: 'Recurring Charges', parser: this.recuringChargesParser },
    { id: 'recurrence_frequency', title: 'Billing Frequency', parser: this.billingFrequencyParser },
    { id: 'charging_mode', title: 'Charging Mode', parser: this.chargingModeParser },
  ])

  getTableFields = () => ([
    { id: 'description', placeholder: 'Title' },
    { id: 'name', placeholder: 'Key' },
    { id: 'to', display: false, type: 'datetime', showFilter: false },
  ])

  render() {
    const { items } = this.props;
    const baseFilter = { to: { $gt: moment().toISOString() } };
    const filterFields = this.getTableFields();
    const tableFields = this.getFilterFields();

    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                List of all available plans
                <div className="pull-right">
                  <Button bsSize="xsmall" className="btn-primary" onClick={this.onClickNew}><i className="fa fa-plus" />&nbsp;Add New</Button>
                </div>
              </div>
              <div className="panel-body">
                <Filter fields={filterFields} onFilter={this.onFilter} base={baseFilter} />
                <List items={items} fields={tableFields} onSort={this.onSort} editField="description" edit={true} onClickEdit={this.onClickItem} />
              </div>
            </div>
            <Pager onClick={this.handlePageClick} size={this.state.size} count={items.size} />
          </div>
        </div>

      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  clearList,
  getList,
}, dispatch);

const mapStateToProps = state => ({
  items: state.list.get('plans'),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlansList));
