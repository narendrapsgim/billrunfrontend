import React from 'react';
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

const styles = {
  plusButton : {
    margin : '10px',
  },
  table : {
    tableLayout : 'auto',
  },
  summaryTitle : {
    display : 'inline',
    marginRight : '10px'
  },
  filterInput : {
    margin : '10px',
  }
};


export default class List extends React.Component {

  constructor(props) {
    super(props);
    this.buttonClick = this.buttonClick.bind(this);
    this.getData = _.debounce(this.getData.bind(this),1000);
    this.filterData = this.filterData.bind(this);

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
      rows : []
    };
  }

  buttonClick(e) {
    console.log(e);
  }

  filterData(e, value) {
    this.getData(this.buildSearchQuery(value, e.target.name));
  }

  buildSearchQuery(value, key){
    let query = '';
    query = '?query={"' + key + '":{"$regex":"'+value+'", "$options" : "i" }}';
    return query;
  }

  getData(query) {
    var url = this.props.settings.url;
    if(query && query.length){
      url += query;
    }
    console.log(url);
    this.serverRequest = aja()
       .method('get')
       .url(url)
       .on('200',
           (response) => {
             this.setState({
               rows : response.details.slice(),
             });
           })
       .go();
  }

  componentDidMount() {
      this.getData()
  }

  formatField(row, field){
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

  render() {

    let filters = (
        this.props.settings.fields.map((field, i) => {
          if(field.filter && field.filter == true){
            return <TextField style={styles.filterInput} ref={"listFilter_"+ i} key={i} name={field.key} hintText={"enter " + field.label + "..."} floatingLabelText={"Search by " + field.label} onChange={this.filterData} />
          }
        })
    );

    let header = (
                  <TableHeader enableSelectAll = {this.state.enableSelectAll}>
                    <TableRow>
                      {this.props.settings.fields.map(function(field, i) {
                          return <TableHeaderColumn tooltip={ field.label } key={i}>{field.label}</TableHeaderColumn>
                      })}
                    </TableRow>
                  </TableHeader>
    );

    let rows = this.state.rows.map( (row, index) => (
              <TableRow key={index} selected={row.selected}>
                { this.props.settings.fields.map((field, i) => {
                  return <TableRowColumn key={i}>{this.formatField(row, field)}</TableRowColumn>
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
          {filters}
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
