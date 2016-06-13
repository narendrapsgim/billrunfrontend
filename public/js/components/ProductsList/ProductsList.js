import React, { Component } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class ProductsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataList: [
        {key: "UNRATED"},
        {key: "NUMEROS_SPECIAUX_T33_FIX"},
        {key: "FIX_GP_FRANCE_FIX"}
      ]
    };
  }

  render() {
    let { dataList } = this.state;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn tooltip="Key">Key</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataList.map((row, index) => (
             <TableRow key={index}>
               <TableRowColumn>{row.key}</TableRowColumn>
             </TableRow>
           ))}
        </TableBody>
      </Table>
    );
  }
}
