import React, { Component } from 'react';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import TableFooter from 'material-ui/lib/table/table-footer';
import TextField from 'material-ui/lib/text-field';
import Toggle from 'material-ui/lib/toggle';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import Divider from 'material-ui/lib/divider';
import _ from 'lodash';
import aja from 'aja';

import { Link, browserHistory } from 'react-router';

const styles = {
  plusButton : {
    margin : '10px',
  },
  table : {
    tableLayout : 'auto',
  },
  summaryTitle : {
    display : 'inline',
    marginRight : '20px'
  }
};

class List extends Component {
  constructor(props) {
    super(props);
    this.buttonClick = this.buttonClick.bind(this);
    this.getData = this.getData.bind(this);
    this.filterData = _.debounce(this.filterData.bind(this),1000);
    this.onClickRow = this.onClickRow.bind(this);

    this.state = {
      fixedHeader : true,
      fixedFooter : true,
      stripedRows : true,
      showRowHover : true,
      selectable : true,
      multiSelectable : true,
      enableSelectAll : true,
      deselectOnClickaway : false,
      height : '300px',
      rows : [],
      settings: {}
    };
  }

  componentWillMount() {
    let { settings } = this.props;
    this.setState({settings});
    this.getData();
  }
  componentWillReceiveProps(nextProps) {
    let { settings } = nextProps;
    this.setState({settings});
    this.getData();
  }

  buttonClick(e) {
    //this.getData();
    this.context.router.push("/plans/plans/new");
  }

  filterData(e, value) { this.getData(value); }
  
  getData(value) {
    //    var url = this.props.settings.url;
    let url = this.state.settings.url;
    if (!url) return;
    if(value && value.length){
      url += '?query={"invoice_label":{"$regex":"'+value+'", "$options" : "i" }}';
    }
    this.serverRequest = aja()
       .method('get')
       .url(url)
       .on('200',
           (response) => {
             this.setState({
               rows : response.details.slice(0,20),
             });
           })
       .go();
  }

  formatField(row, field, i){
    let output = '';
    switch (field.type) {
      case 'boolean':
        output = row[field.key] ? 'Yes' : 'No' ;
        break;
      case 'price':
        output = parseFloat(row[field.key]).toFixed(2).toString().replace(".", ",") + ' €';
        break;
      default:
        output = row[field.key];
    }
    return output;
  }

  onClickRow(e) {
    return browserHistory.push(`#/plans/plans/edit/${e.target.id}`);
  }
  
  render() {
    let { settings } = this.state;
    let header = (
                  <TableHeader enableSelectAll = {this.state.enableSelectAll}>
                    <TableRow>
                      {/*<TableHeaderColumn>#</TableHeaderColumn>*/}
                      {settings.fields.map(function(field, i) {
                          return <TableHeaderColumn tooltip={ field.label } key={i}>{field.label}</TableHeaderColumn>
                      })}
                    </TableRow>
                  </TableHeader>
    );

    let rows = this.state.rows.map( (row, index) => (
              <TableRow key={index} selected={row.selected}>
                {/*<TableRowColumn><Link to={`/plans/plans/edit/${row._id.$id}`}>{index + 1}</Link></TableRowColumn>*/}
                { settings.fields.map((field, i) => {
                    return <TableRowColumn key={i}>{this.formatField(row, field, i)}</TableRowColumn>
                })}
              </TableRow>
    ));

    let footer = (
                <TableFooter>
                  <TableRow>
                    <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                      <FloatingActionButton style={styles.plusButton} onMouseUp={this.buttonClick}>
                        <ContentAdd />
                      </FloatingActionButton>
                    </TableRowColumn>
                  </TableRow>
                </TableFooter>
    );

    return (
      <div>
        <Divider />
        <div>
          <h4 style={styles.summaryTitle}>Plans Summary</h4>
          <TextField
            hintText="Search"
            floatingLabelText="Search"
            onChange={this.filterData}
          />
        </div>
        <Table
          bodyStyle={{width: '-fit-content'}}
          height = { this.state.height }
          fixedHeader = {this.state.fixedHeader}
          fixedFooter = { this.state.fixedFooter }
          selectable = { this.state.selectable }
          multiSelectable = { this.state.multiSelectable }
          onRowSelection = {this._onRowSelection}
        >
        {header}
        <TableBody
          deselectOnClickaway = { this.state.deselectOnClickaway }
          showRowHover = { this.state.showRowHover }
          stripedRows = {this.state.stripedRows}
        >
          {rows}
        </TableBody>
          {footer}
        </Table>
      </div>
    );
  }
}

List.contextTypes = {
  router: React.PropTypes.object.isRequired
};
export default List;
