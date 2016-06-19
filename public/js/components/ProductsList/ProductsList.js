import React, { Component } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class ProductsList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
    
    this.state = {
      dataList: [
        {key: "UNRATED", "_id" : {"$id": "57557eec36b4dc66eb54a580"}},
        {key: "NUMEROS_SPECIAUX_T33_FIX", "_id" : {"$id": "57557eec36b4dc66eb54a580"}},
        {key: "FIX_GP_FRANCE_FIX", "_id" : {"$id": "57557eec36b4dc66eb54a580"}}
      ]
    };
  }

  onClickCell(cell_idx, col_idx, e) {
    let selected = this.state.dataList[cell_idx];
    this.context.router.push(`product_setup/${selected._id.$id}`);
  }
  
  render() {
    let { dataList } = this.state;

    return (
      <Table onCellClick={this.onClickCell}>
        <TableHeader displaySelectAll={true}>
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

ProductsList.contextTypes = {
  router: React.PropTypes.object.isRequired
};
