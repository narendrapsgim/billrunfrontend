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
    this.setState({filter}, () => {
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
      {id: "aid", placeholder: "Customer ID", type: "number"},
      {id: "sid", placeholder: "Subscription ID", type: "number"},
      {id: "plan", placeholder: "Plan"}
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
                <div className="row">
                  <div className="col-lg-9">
                    <Filter fields={fields} onFilter={this.onFilter} base={base} />
                  </div>
                </div>
                <List items={usages} fields={fields} />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <div className="dataTables_info" role="status" aria-live="polite">Showing 1 to 10</div>
          </div>
          <div className="col-lg-6 dataTables_pagination">
            <Pager onClick={this.handlePageClick}
                   size={this.state.size}
                   count={usages.size || 0} />  
          </div>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return { usages: state.list.get('usages') || [] };
}

export default connect(mapStateToProps)(UsageList);
