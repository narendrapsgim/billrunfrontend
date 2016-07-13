import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody } from 'material-ui/Table';
import Filter from '../Filter';
import Field from '../Field';

import { getCustomers } from '../../actions/customerActions';

class SubscribersList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
    this.buildQuery = this.buildQuery.bind(this);
    this.onFilter = this.onFilter.bind(this);

    this.state = {
      filter: ""
    };
  }

  componentWillMount() {
    this.props.dispatch(getCustomers());
  }
  
  onClickCell(cell_idx, col_idx, e) {
    let { subscriber } = this.props;
    let aid = subscriber.valueSeq().get(cell_idx).get('aid');
    this.context.router.push({
      pathname: 'subscriber',
      query: {aid}
    });
  }

  buildQuery() {
    const { page, size, filter } = this.state;
    return { page, size, filter };
  }

  onFilter(filter) {
    this.setState({filter}, () => {
      this.props.dispatch(getCustomers(this.buildQuery()))
    });
  }
  
  render() {
    const { subscriber } = this.props;

    const fields = [
      {id: "first_name", placeholder: "First Name"}
    ];

    const table_header = fields.map((field, idx) => (
      <TableHeaderColumn tooltip={field.placeholder} key={idx}>{field.placeholder}</TableHeaderColumn>
    ));
    
    const rows = subscriber.map((row, key) => (
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
          <div className="col-md-5">
            <Filter fields={fields} onFilter={this.onFilter} />
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
