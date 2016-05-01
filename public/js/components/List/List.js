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
import IconBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import IconForward from 'material-ui/lib/svg-icons/navigation/arrow-forward';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import Divider from 'material-ui/lib/divider';
import Snackbar from 'material-ui/lib/snackbar';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';
import _ from 'lodash';
import aja from 'aja';

import { Link, browserHistory } from 'react-router';

const styles = {
  paginationButton : {
    margin : '10px',
  },
  paginationArrow : {
    margin : '5px',
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
  },
  tableCell : {
    textOverflow : 'clip',
  }
};

class List extends Component {
  constructor(props) {
    super(props);
    this.buttonClick = this.buttonClick.bind(this);
    this.paginationButton = this.paginationButton.bind(this);
    this.updateTableData = this.updateTableData.bind(this);
    this.getData = _.debounce(this.getData.bind(this),1000);
    this.filterData = this.filterData.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
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
      height : props.settings.defaults.tableHeight || '300px',
      rows : [],
      filters : {},
      snackbarOpen : false,
      snackbarMessage : '',
      currentPage : 1,
      totalPages : 1
    };
  }

  getFieldSettings(key){
    var matchFields = this.props.settings.fields.filter((field,index) => {
      if(field.key == key){
        return field;
      }
    })
    return (matchFields.length) ? matchFields[0] : false ;
  }

  buttonClick(e) {
    //this.getData();
    this.context.router.push("/plans/plans/new");
  }
  updateTableData(){
    this.getData(this.buildSearchQuery());
  }

  paginationButton(e) {
    console.log("e.currentTarget.value : ", e.currentTarget.value);
    let page = this.state.currentPage;
    let value = e.currentTarget.value;

    if(_.isInteger(parseInt(value))){
      page = parseInt(value);
    } else if(value == 'back' && page > 0){
      page --;
    } else if(value == 'forward' && page < 9){
      page++;
    }

    this.setState({
      currentPage: page,
    }, this.updateTableData);
  }

  filterData(e, value) {
    let filters = Object.assign({}, this.state.filters);
    filters[e.target.name] = value;
    this.setState({
      filters : filters,
    }, this.updateTableData);

  }

  buildSearchQuery(){
    //5000000429,5000000986
    let queryString = '';
    let queryArgs = {};

    for ( const key in this.state.filters ) {
      if(this.state.filters[key].length){
        let filterSetting = this.getFieldSettings(key);
        if(filterSetting){
          if(filterSetting.filterType && filterSetting.filterType == 'query' ){
              queryArgs[key] = {
                "$regex" : this.state.filters[key],
                "$options" : "i"
              };
          } else {
            queryString += '&' + key + "=" + this.state.filters[key];
          }
        }
      }
    }

    if(!_.isEmpty(queryArgs)){
      queryString += '&query=' +  JSON.stringify(queryArgs);
    }

    if(_.isObject(this.props.settings.pagination) && _.isInteger(this.props.settings.pagination.itemsPerPage ) && this.props.settings.pagination.itemsPerPage > -1){
      queryString += '&size=' + this.props.settings.pagination.itemsPerPage + '&page=' + parseInt(this.state.currentPage);
    }

    if(queryString.startsWith('&')){
      queryString = queryString.replace('&','?');
    } else {
      queryString = '?' + queryString;
    }
    return queryString;
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
           if(response && response.status){
             this.setState({
               rows : response.details.slice(),
               totalPages : 10
             });
           } else {
             this.handleError(response);
           }
           })
       .go();
  }

  componentDidMount() {
      this.getData()
  }

  handleError(data){
    let errorMessage = (data && data.desc && data.desc.length) ? data.desc : 'Error';
    this.setState({
      snackbarOpen: true,
      snackbarMessage: errorMessage,
    });
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
      case 'mongoid':
        output = row[field.key].$id;
        break;
      case 'urt':
        output = new Date(row[field.key].sec*1000).toLocaleString();
        break;
      default:
        output = row[field.key];
    }
    return output;
  }

  onClickRow(e) {
    return browserHistory.push(`#/plans/plans/edit/${e.target.id}`);
  }

  handleRequestClose(){
    this.setState({
      snackbarOpen: false,
      snackbarMessage: '',
    });
  };

  render() {

    let filters = (
        this.props.settings.fields.map((field, i) => {
          if(field.filter && field.filter == true){
            return <TextField
              style={styles.filterInput}
              key={i} name={field.key}
              hintText={"enter " + field.label + "..."}
              floatingLabelText={"Search by " + field.label}
              errorText=""
              onChange={this.filterData} />
          }
        })
    );

    let header = (
                  <TableHeader enableSelectAll = {this.state.enableSelectAll}>
                    <TableRow>
                      {this.props.settings.fields.map(function(field, i) {
                        if( !(field.hidden  && field.hidden == true) ){
                          return <TableHeaderColumn tooltip={ field.label } key={i}>{field.label}</TableHeaderColumn>
                        }
                      })}
                    </TableRow>
                  </TableHeader>
    );

    let rows = this.state.rows.map( (row, index) => (
              <TableRow key={index} selected={row.selected}>
                {/*}<TableRowColumn><Link to={`/plans/plans/edit/${row._id.$id}`}>{index + 1}</Link></TableRowColumn>*/}
                { this.props.settings.fields.map((field, i) => {
                  if( !(field.hidden  && field.hidden == true) ){
                    return <TableRowColumn style={styles.tableCell} key={i}>{this.formatField(row, field, i)}</TableRowColumn>
                  }
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
          allRowsSelected = {false}
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

        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />

      </div>
    );
  }
}

List.contextTypes = {
  router: React.PropTypes.object.isRequired
};
export default List;
