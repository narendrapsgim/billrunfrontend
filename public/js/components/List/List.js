import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import BackIcon from 'material-ui/lib/svg-icons/navigation/arrow-back';
import ForwardIcon from 'material-ui/lib/svg-icons/navigation/arrow-forward';
import Divider from 'material-ui/lib/divider';
import Snackbar from 'material-ui/lib/snackbar';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';
import _ from 'lodash';
import aja from 'aja';
import { getList } from '../../actions';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

import { Link, browserHistory } from 'react-router';

const styles = {
  pagination : {
    paginationBar : {
      margin : '10px',
    },
    paginationButton : {
      margin : '10px',
    },
  },
  table : {
    tableLayout : 'auto',
  },
  filterInput : {
    margin : '10px',
  },
  tableCell : {
    textOverflow : 'clip',
  },
  createNewButton : {
    margin : '10px'
  }
};

class List extends Component {
  constructor(props) {
    super(props);
    //Helpers
    this._updateTableData = this._updateTableData.bind(this);
    this._getData = _.debounce(this._getData.bind(this),1000);
    this._filterData = this._filterData.bind(this);
    //Handlers
    this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    //Actions
    this.onClickCreateNewItem = this.onClickCreateNewItem.bind(this);
    this.onPagintionClick = this.onPagintionClick.bind(this);
    this.onClickRow = this.onClickRow.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);

    //Assign filter default value if exist
    let filters = this._getFilterDefaultValues(props.settings.fields);

    this.state = {
      height : props.settings.defaults.tableHeight || '300px',
      rows : [],
      filters : filters,
      snackbarOpen : false,
      snackbarMessage : '',
      currentPage : 1,
      totalPages : 1,
      settings: {}
    };
  }

  componentWillMount() {
    let { settings } = this.props;
    this.setState({settings}, this._updateTableData);
  }

  componentWillReceiveProps(nextProps) {
    let { settings } = nextProps;
    let filters = this._getFilterDefaultValues(settings.fields);
    this.setState({
      rows : [],
      filters : filters,
      currentPage : 1,
      totalPages : 1,
      settings
    }, this._updateTableData);

  }

  /* ON Actions */

  onClickCreateNewItem(e) {
    let { page, collection } = this.props;
    this.context.router.push(`/${page}/${collection}/new`);
  }

  onClickRow(e) {
    let { page, collection } = this.props;
    return browserHistory.push(`#/${page}/${collection}/edit/${e.target.id}`);
  }

  onPagintionClick(e){
    let page = this.state.currentPage;
    let value = e.currentTarget.value;

    if(_.isInteger(parseInt(value))){
      page = parseInt(value);
    } else if(value == 'back' && page > 1){
      page --;
    } else if(value == 'forward' && page < this.state.totalPages){
      page++;
    }

    this.setState({
      currentPage : page
    }, this._updateTableData);
  }

  onChangeFilter(e, value){
    let key = e.target.name;
    this._filterData(key, value);
  }

  /* Handlers */

  handleCloseSnackbar(){
    this.setState({
      snackbarOpen: false,
      snackbarMessage: '',
    });
  };

  handleError(data){
    let errorMessage = (data && data.desc && data.desc.length) ? data.desc : 'Error loading data, try again later..';
    this.setState({
      snackbarOpen: true,
      snackbarMessage: errorMessage,
    });
  }

  /* Helpers */

  _filterData(key, value) {
    let filters = Object.assign({}, this.state.filters);
    filters[key] = value;
    this.setState({
      filters : filters,
      currentPage : 1
    }, this._updateTableData);
  }

  _updateTableData(){
    this._getData(this._buildSearchQuery());
  }

  _buildSearchQuery(){
    let queryString = '';
    let queryArgs = {};

    for ( let key in this.state.filters ) {
      if(this.state.filters[key].length){
        let filterSetting = this._getFieldSettings(key);
        if(filterSetting){
          if(filterSetting.filter && filterSetting.filter.filterType && filterSetting.filter.filterType == 'query' ){
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

  _getData(query) {
    let url = this.state.settings.url;
    if (!url) return;
    if(query && query.length){
      url += query;
    }
    this.serverRequest = aja()
       .method('get')
       .url(url)
       .on('success', (response) => {
         if(response && response.status){
           let demoPageNums = Math.floor(Math.random() * (10 - parseInt(this.state.currentPage) + 1)) + parseInt(this.state.currentPage);
           this.setState({
              totalPages :  demoPageNums, // TEMP only for demonstration, need API to get or calculate page numbers
              rows : response.details.slice(0, this.state.settings.defaultItems),
           });
         } else {
           this.handleError(response);
         }
       })
       .on('timeout', (response) => {
          this.handleError(response);
        })
       .on('error', (response) => {
          this.handleError(response);
        })
       .go();
  }

  _formatField(row, field, i){
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
        output = (row[field.key].sec) ? new Date(row[field.key].sec*1000).toLocaleString() : '';
        break;
      default:
        output = row[field.key];
    }
    return output;
  }

  _setVisiblePages(totalPages, currentPage){
    let visiblePgaes = [1,currentPage,totalPages]; // always show first current and last
    let more = _.range(parseInt(currentPage), parseInt(currentPage)+3); // show 2 item after
    let less = _.range(parseInt(currentPage), Math.max(parseInt(currentPage)-3,0) , -1);  // show 2 item before
    return _.uniq([...visiblePgaes, ...more, ...less]);
  }

  _getFilterDefaultValues(fields){
    let filters = {};
    fields.map((field, i) => {
      if(field.filter){
        if(field.filter.defaultValue && field.filter.defaultValue.length > 0){
          filters[field.key] = field.filter.defaultValue;
        }
      }
    });
    return filters;
  }

  _getFieldSettings(key){
    var matchFields = this.props.settings.fields.filter((field,index) => {
      if(field.key == key){
        return field;
      }
    })
    return (matchFields.length) ? matchFields[0] : false ;
  }

  render() {
    let { settings } = this.state;
    let { page, collection } = this.props;
    let filters = (
      this.props.settings.fields.map((field, i) => {
        if(field.filter){
          return <TextField
            style={styles.filterInput}
            key={i} name={field.key}
            hintText={"enter " + field.label + "..."}
            floatingLabelText={"Search by " + field.label}
            errorText=""
            defaultValue={(field.filter.defaultValue) ? field.filter.defaultValue : ''}
            onChange={this.onChangeFilter} />
        }
      })
    );

    let header = (
      <TableRow>
        {/*<TableHeaderColumn>#</TableHeaderColumn>*/}
        {this.props.settings.fields.map(function(field, i) {
          if( !(field.hidden  && field.hidden == true) ){
            return <TableHeaderColumn tooltip={ field.label } key={i}>{field.label}</TableHeaderColumn>
          }
        })}
      </TableRow>
    );

    let rows = this.state.rows.map( (row, index) => (
      <TableRow key={index} selected={row.selected}>
        {/*<TableRowColumn><Link to={`/${page}/${collection}/edit/${row._id.$id}`}>{index + 1}</Link></TableRowColumn>*/}
        { this.props.settings.fields.map((field, i) => {
          if( !(field.hidden  && field.hidden == true) ){
            return <TableRowColumn style={styles.tableCell} key={i}>{this._formatField(row, field, i)}</TableRowColumn>
          }
        })}
      </TableRow>
    ));

    const getPager = () => {
      let pages = [];
      if(this.state.totalPages > 1) {
        pages.push(
          <FloatingActionButton
            key='back'
            mini={true}
            style={styles.pagination.paginationButton}
            onClick={this.onPagintionClick}
            value='back'
            secondary={false}
          >
          <BackIcon />
          </FloatingActionButton>
        );
        let pagesToDisplay = this._setVisiblePages(this.state.totalPages, this.state.currentPage);
        for (var i = 1; i <= this.state.totalPages; i++) {
          if(pagesToDisplay.includes(i)){
            pages.push(
              <FloatingActionButton
                key={i}
                mini={true}
                style={styles.pagination.paginationButton}
                onClick={this.onPagintionClick}
                value={i}
                secondary={this.state.currentPage == i}
              >
              {i}
            </FloatingActionButton>)
          } else {
            if(pages[pages.length-1] !== "..."){
              pages.push('...');
            }
          }
        }
        pages.push(
          <FloatingActionButton
            key='forward'
            mini={true}
            style={styles.pagination.paginationButton}
            onClick={this.onPagintionClick}
            value='forward'
            secondary={false}
          >
          <ForwardIcon />
          </FloatingActionButton>
        );

        return (
          <div>
            <div style={styles.pagination.paginationBar}>{pages}</div>
            <Divider />
          </div>
        )
      }
      return ('');
    }

    let footer = (
      <TableRow>
        <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
          {getPager()}
          <FloatingActionButton style={styles.createNewButton} onMouseUp={this.onClickCreateNewItem}>
            <ContentAdd />
          </FloatingActionButton>
        </TableRowColumn>
      </TableRow>
    );

    return (
      <div>
        <Divider />
        <div>
            {filters}
        </div>
        <Table
          height = { this.state.height }
          allRowsSelected = {false}
          fixedHeader = {true}
          fixedFooter = { true }
          selectable = { true }
          multiSelectable = { true }
          className="braasList"
        >
          <TableHeader enableSelectAll = { true }>
            {header}
          </TableHeader>

          <TableBody
            deselectOnClickaway = { false }
            showRowHover = { true }
            stripedRows = { true }
          >
            {rows}
          </TableBody>
          <TableFooter>
            {footer}
          </TableFooter>
        </Table>

        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleCloseSnackbar}
        />

      </div>
    );
  }
}

List.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    list: state.list
  };
}

export default connect(mapStateToProps)(List);
