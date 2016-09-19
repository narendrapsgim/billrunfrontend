import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

/* COMPONENTS */
import Pager from '../Pager';
import Filter from '../Filter';
import List from '../List';

/* ACTIONS */
import { getList } from '../../actions/listActions';

class UsageList extends Component {
  constructor(props) {
    super(props);

    this.buildQuery = this.buildQuery.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onFilter = this.onFilter.bind(this);
    
    this.state = {
      page: 0,
      size: 10,
      filter: ""
    };
  }

  buildQuery() {
    const { page, size, filter } = this.state;
    return {
      api: "find",
      params: [
        { collection: "lines" },
        { size },
        { page },
        { query: filter }
      ]
    };
  }

  onFilter(filter) {
    this.setState({filter, page: 0}, () => {
      this.props.dispatch(getList('usages', this.buildQuery()))
    });
  }

  handlePageClick(page) {
    this.setState({page}, () => {
      this.props.dispatch(getList('usages', this.buildQuery()))
    });
  }

  render() {
    const { usages } = this.props;

    const fields = [
      {id: "type", placeholder: "Type"},
      {id: "aid", placeholder: "Customer ID", type: "number"},
      {id: "sid", placeholder: "Subscription ID", type: "number"},
      {id: "plan", placeholder: "Plan"},
      {id: "urt", placeholder: "Time", type: "datetime"}
    ];

    const base = this.props.location.query.base ? JSON.parse(this.props.location.query.base) : {};

    return (
      <div>

        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <span>
                  List of all usages
                </span>
              </div>
              <div className="panel-body">
                <Filter fields={fields} onFilter={this.onFilter} base={base} />
                <List items={usages} fields={fields} />
              </div>
            </div>
          </div>
        </div>

        <Pager onClick={this.handlePageClick}
               size={this.state.size}
               count={usages.size || 0} />  

      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return { usages: state.list.get('usages') || [] };
}

export default connect(mapStateToProps)(UsageList);
