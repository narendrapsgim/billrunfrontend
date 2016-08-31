import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody, TableFooter } from 'material-ui/Table';
import Filter from '../Filter';
import Field from '../Field';
import RaisedButton from 'material-ui/RaisedButton';
import Pager from '../Pager';
import moment from 'moment';

import { getCustomers } from '../../actions/customerActions';

class SubscribersList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
    this.buildQuery = this.buildQuery.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onNewSubscriber = this.onNewSubscriber.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);

    this.state = {
      page: 0,
      size: 10,
      filter: ""
    };
  }

  onClickCell(cell_idx, col_idx, e) {
    let { subscriber } = this.props;
    let aid = subscriber.valueSeq().get(cell_idx).get('aid');
    this.context.router.push({
      pathname: 'subscriber',
      query: {
        aid,
        action: "update"
      }
    });
  }

  buildQuery() {
    const { page, size, filter } = this.state;
    return { page, size, filter };
  }

  handlePageClick(page) {
    this.setState({page}, () => {
      this.props.dispatch(getCustomers(this.buildQuery()))
    });
  }

  onFilter(filter) {
    this.setState({filter}, () => {
      this.props.dispatch(getCustomers(this.buildQuery()))
    });
  }

  onNewSubscriber() {
    this.context.router.push({
      pathname: "subscriber",
      query: { action: "new" }
    });
  }
  
  render() {
    const { subscriber } = this.props;

    const fields = [
      { id: "aid", placeholder: "Account ID" },
      { id: "firstname", placeholder: "First Name" },
      { id: "lastname", placeholder: "Last Name" },
      { id: "address", placeholder: "Address" },
      { id: "email", placeholder: "Email" },
      { id: "to", placeholder: "To", display: false, type: "datetime" }
    ];

    const table_header = fields.map((field, idx) => (
      <TableHeaderColumn tooltip={field.placeholder} key={idx}>{field.placeholder}</TableHeaderColumn>
    ));

    const real_subscriber = subscriber.size > this.state.size ? subscriber.pop() : subscriber;
    const rows = real_subscriber.map((row, key) => (
      <TableRow key={key}>
        {fields.map((field, idx) => (
           <TableRowColumn key={idx}>
             <Field id={field.id} value={row.get(field.id)} editable={false} />
           </TableRowColumn>
         ))}
      </TableRow>
    ));

    return (
      <div className="SubscribersList">
        <div className="row" style={{marginBottom: 10}}>
          <div className="col-xs-9">
            <Filter fields={fields} onFilter={this.onFilter} base={{type: "account", to: {$gt: moment().toISOString()}}} />
          </div>
          <div className="col-xs-3">
            <div style={{float: "right"}}>
              <RaisedButton primary={true} label="New" onMouseUp={this.onNewSubscriber} />
            </div>
          </div>
        </div>
        <Table onCellClick={this.onClickCell}>
          <TableHeader displaySelectAll={true} fixedHeader={true}>
            <TableRow>
              { table_header }
            </TableRow>
          </TableHeader>
          <TableBody>
            { rows }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableRowColumn style={{textAlign: 'center'}}>
                <Pager onClick={this.handlePageClick}
                       size={this.state.size}
                       count={subscriber.size} />
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
}

SubscribersList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return {subscriber: state.subscriber};
}

export default connect(mapStateToProps)(SubscribersList);
