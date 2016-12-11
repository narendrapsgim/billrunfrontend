import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import moment from 'moment';
import ChangeCase from 'change-case';

import { getList } from '../../actions/listActions';

import Filter from '../Filter';
import List from '../List';
import Pager from '../Pager';

class PrepaidBalances extends Component {

  static propTypes = {
    balances: React.PropTypes.instanceOf(Immutable.List).isRequired,
    aid: React.PropTypes.number.isRequired,
    dispatch: React.PropTypes.func,
  };

  static defaultProps = {
    balances: Immutable.List(),
    aid: null,
    dispatch: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      aid: props.aid,
      size: 10,
      page: 0,
      sort: '',
      filter: '',
    };
  }

  onFilter = (filter) => {
    this.setState({ filter, page: 0 }, this.getBalances);
  }

  onSort = (sort) => {
    this.setState({ sort }, this.getBalances);
  }

  getBalances = () => {
    this.props.dispatch(getList('balances', this.buildQuery()));
  }

  handlePageClick = (page) => {
    this.setState({ page }, this.getBalances);
  }

  buildQuery = () => {
    const { size, page, sort, filter } = this.state;
    /** TODO: Will probably change **/
    return {
      api: 'find',
      params: [
        { collection: 'billing' },
        { size },
        { page },
        { sort },
        { query: filter },
      ],
    };
  }

  usageTypeValueParser = (ent) => {
    const usaget = ent.get('charging_by_usaget');
    const chargingBy = ent.get('charging_by');
    const balanceKey = (usaget === 'total_cost' ? ['cost'] : ['totals', usaget, chargingBy]);
    return ent.getIn(['balance', ...balanceKey], '');
  }

  render() {
    const { aid, balances } = this.props;
    const baseFilter = { to: { $gt: moment().toISOString() }, aid };
    const fields = [
      { id: 'aid', placeholder: 'Account', type: 'number', sort: true, showFilter: false, display: false },
      { id: 'sid', placeholder: 'Subscription', type: 'number', sort: true },
      { id: 'pp_includes_name', placeholder: 'Bucket', sort: true },
      { id: 'charging_by_usaget', placeholder: 'Usage Type Name', sort: true, showFilter: false, parser: ent => ChangeCase.titleCase(ent.get('charging_by_usaget', '')) },
      { id: 'usaget_type_value', placeholder: 'Usage Type Value', sort: true, showFilter: false, parser: this.usageTypeValueParser },
      { id: 'from', placeholder: 'From', showFilter: false, type: 'datetime' },
      { id: 'to', placeholder: 'To', showFilter: false, type: 'datetime' },
    ];
    return (
      <div className="PrepaidBalances">
        <div className="row">
          <div className="col-lg-12">
            <Filter fields={fields} onFilter={this.onFilter} base={baseFilter} />
            <List items={balances} fields={fields} onSort={this.onSort} />
          </div>
        </div>

        <Pager
          onClick={this.handlePageClick}
          size={this.state.size}
          count={balances.size || 0}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    balances: state.list.get('balances'),
  };
}

export default connect(mapStateToProps)(PrepaidBalances);
