import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import moment from 'moment';

import { getSettings } from '../../actions/settingsActions';
import { getList } from '../../actions/listActions';

import Filter from '../Filter';
import List from '../List';
import Pager from '../Pager';

class PostpaidBalances extends Component {
  static propTypes = {
    balances: React.PropTypes.instanceOf(Immutable.List).isRequired,
    usage_types: React.PropTypes.instanceOf(Immutable.List).isRequired,
    aid: React.PropTypes.number.isRequired
  };

  static defaultProps = {
    balances: Immutable.List(),
    usage_types: Immutable.List(),
    aid: null
  };

  constructor(props) {
    super(props);

    this.state = {
      aid: props.aid,
      size: 10,
      page: 0,
      sort: '',
      filter: ''
    };
  }

  componentDidMount() {
    this.props.dispatch(getSettings(["usage_types"]));
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
        { query: filter }
      ]
    };
  }

  getBalances = () => {
    this.props.dispatch(getList("balances", this.buildQuery()));
  }
  
  handlePageClick = (page) => {
    this.setState({page}, this.getBalances);
  }
  
  onFilter = (filter) => {
    this.setState({filter, page: 0}, this.getBalances);
  }

  onSort = (sort) => {
    this.setState({sort}, this.getBalances);
  }
  
  render() {
    const { usage_types, balances } = this.props;
    const { aid } = this.state;

    const usage_fields = usage_types.map((usaget, key) => {
      return {
        id: usaget,
        placeholder: usaget,
        showFilter: false,
        parser: (ent) => ent.getIn(['balance', 'totals', usaget], '')
      };
    }).toJS();
    const fields = [
      { id: 'aid', placeholder: 'Account', type: 'number', sort: true, showFilter: false, display: false },
      { id: 'sid', placeholder: 'Subscription', type: 'number', sort: true },
      { id: 'current_plan', placeholder: 'Plan' },
      ...usage_fields,
      { id: "from", placeholder: "From", showFilter: false, type: "datetime" },
      { id: "to", placeholder: "To", showFilter: false, type: "datetime" },
    ];
    
    return (
      <div className="PostpaidBalances">
        
        <div className="row">
          <div className="col-lg-12">
            <Filter fields={fields} onFilter={this.onFilter} base={{to: {$gt: moment().toISOString()}, aid: aid}} />
            <List items={balances} fields={fields} onSort={this.onSort} />
          </div>
        </div>

        <Pager onClick={this.handlePageClick}
               size={this.state.size}
               count={balances.size || 0} />  
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    balances: state.list.get('balances'),
    usage_types: state.settings.get('usage_types')
  };
}

export default connect(mapStateToProps)(PostpaidBalances);

