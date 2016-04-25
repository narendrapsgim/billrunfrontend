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
import IconBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import IconForward from 'material-ui/lib/svg-icons/navigation/arrow-forward';
import Divider from 'material-ui/lib/divider';
import Snackbar from 'material-ui/lib/snackbar';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';
import _ from 'lodash';
import aja from 'aja';

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
  }
};


export default class List extends React.Component {

  constructor(props) {
    super(props);
    this.paginationButton = this.paginationButton.bind(this);
    this.updateTableData = this.updateTableData.bind(this);
    this.getData = _.debounce(this.getData.bind(this),1000);
    this.filterData = this.filterData.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);

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
    let query = '?';
    let filters = {};

    for ( const key in this.state.filters ) {
      if(this.state.filters[key].length){
        query += key + "=" + this.state.filters[key];
      }
    }

    // switch (key) {
    //   case 'name':
    //   filters[key] = {
    //     "$regex" : value,
    //     "$options" : "i"
    //   };
    //   query = 'query=' +  JSON.stringify(filters);
    //     break;
    //   default: query = key + '=' + value;
    // }

    if(_.isObject(this.props.settings.pagination) && _.isInteger(this.props.settings.pagination.itemsPerPage ) && this.props.settings.pagination.itemsPerPage > -1){
      query += '&size=' + this.props.settings.pagination.itemsPerPage + '&page=' + parseInt(this.state.currentPage);
    }

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
    this.setState({
      snackbarOpen: true,
      snackbarMessage: data.desc,
    });
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
              ref={"listFilter_"+ i}
              key={i} name={field.key}
              hintText={"enter " + field.label + "..."}
              floatingLabelText={"Search by " + field.label}
              onChange={this.filterData} />
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

    let pagination = '';
    if (this.state.totalPages > 1){
      let pagination = (
        <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
          <FloatingActionButton
            value='back'
            mini={false}
            key={0}
            style={styles.paginationArrow}
            onMouseUp={this.paginationButton}>
             <IconBack />
          </FloatingActionButton>

          {[...Array(this.setState.totalPages)].map((x, i) =>
            <FloatingActionButton
              onClick={this.paginationButton}
              secondary={this.state.currentPage == (i+1)}
              value={i+1}
              mini={true}
              key={i}
              style={styles.paginationButton}>
              {i+1}
            </FloatingActionButton>
          )}

          <FloatingActionButton
            value='forward'
            mini={false}
            key={11}
            style={styles.paginationArrow}
            onMouseUp={this.paginationButton}>
             <IconForward />
          </FloatingActionButton>
        </TableRowColumn>
    );
  }


    let footer = (
                <TableFooter>
                  <TableRow>
                    {pagination}
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
