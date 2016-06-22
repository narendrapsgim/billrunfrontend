import React, { Component } from 'react';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody } from 'material-ui/Table';

export default class SubscribersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [
        {
          _id: {
            "$id": "123abc4"
          },
          first_name: "Lewis",
          last_name: "Nitzberg",
          plan: "Fish o' the Month"
        }
      ]
    };
    this.onClickCell = this.onClickCell.bind(this);
  }

  onClickCell(cell_idx, col_idx, e) {
    let selected = this.state.dataList[cell_idx];
    this.context.router.push({
      pathname: 'subscriber',
      query: {subscriber_id: selected._id.$id}
    });
  }
  
  render() {
    let dataList = this.state.dataList;

    return (
      <Table onCellClick={this.onClickCell}>
        <TableHeader displaySelectAll={true} fixedHeader={true}>
          <TableRow>
            <TableHeaderColumn tooltip="First Name">First Name</TableHeaderColumn>
            <TableHeaderColumn tooltip="Last Name">Last Name</TableHeaderColumn>
            <TableHeaderColumn tooltip="Plan">Plan</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataList.map((row, index) => (
             <TableRow key={index}>
               <TableRowColumn>{row.first_name}</TableRowColumn>
               <TableRowColumn>{row.last_name}</TableRowColumn>
               <TableRowColumn>{row.plan}</TableRowColumn>
             </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

SubscribersList.contextTypes = {
  router: React.PropTypes.object.isRequired
};
