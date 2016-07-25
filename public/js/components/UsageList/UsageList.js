import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody, TableFooter } from 'material-ui/Table';
import Pager from '../Pager';
import Filter from '../Filter';

import { getUsages } from '../../actions/usageActions';
import { showProgressBar, hideProgressBar } from '../../actions/progressbarActions.js';

class UsageList extends Component {
  constructor(props) {
    super(props);

    this.buildQuery = this.buildQuery.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onChangeSort = this.onChangeSort.bind(this);
    
    this.state = {
      page: 1,
      size: 10,
      filter: ""
    };
  }

  componentDidMount() {
    this.props.dispatch(getUsages(this.buildQuery()));
  }

  buildQuery() {
    const { page, size, filter } = this.state;
    return { page, size, filter };
  }

  onFilter(filter) {
    this.setState({filter}, () => {
      this.props.dispatch(getUsages(this.buildQuery()))
    });
  }

  handlePageClick(page) {
    this.setState({page}, () => {
      this.props.dispatch(getUsages(this.buildQuery()))
    });
  }
  
  onChangeSort(e) {
    const { value } = e.target;
    this.setState({sort: value}, () => {
      this.props.dispatch(getUsages(this.buildQuery()))
    });
  }

  render() {
    let { usages } = this.props;

    const fields = [
      {id: "aid", placeholder: "Customer", type: "number"},
      {id: "sid", placeholder: "Subscription", type: "number"},
      {id: "plan", placeholder: "Plan"}
    ];

    const sort_fields = [(<option disabled value="-1" key={-1}>Sort</option>),
                         ...fields.map((field, idx) => (
                           <option value={field.id} key={idx}>{field.placeholder}</option>
                         ))];

    const base = this.props.location.query.base ? JSON.parse(this.props.location.query.base) : {};
    return (
      <div className="UsagesList">
        <div className="row" style={{marginBottom: 10}}>
          <div className="col-md-5">
            <Filter fields={fields} onFilter={this.onFilter} base={base} />
          </div>
        </div>
        <Table selectable={false}
               height={'500px'}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Customer</TableHeaderColumn>
              <TableHeaderColumn>Subscription</TableHeaderColumn>
              <TableHeaderColumn>Plan</TableHeaderColumn>
              <TableHeaderColumn>Charge</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true}>
            {usages.valueSeq().map((row, index) => (
               <TableRow key={index}>
                 <TableRowColumn>{row.get('aid')}</TableRowColumn>
                 <TableRowColumn>{row.get('sid')}</TableRowColumn>
                 <TableRowColumn>{row.get('plan')}</TableRowColumn>
                 <TableRowColumn>{row.get('aprice')}</TableRowColumn>
               </TableRow>
             ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableRowColumn style={{textAlign: 'center'}}>
                <Pager onClick={this.handlePageClick} />
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return state;
}

export default connect(mapStateToProps)(UsageList);
