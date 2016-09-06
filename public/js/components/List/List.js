import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Table} from 'material-ui/Table';
import TableHeader from 'material-ui/Table/TableHeader';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import TableFooter from 'material-ui/Table/TableFooter';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import DownwardIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import UpwardIcon from 'material-ui/svg-icons/navigation/arrow-drop-up';
import ForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import LinearProgress from 'material-ui/LinearProgress';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import theme from '../../theme'
import _ from 'lodash';
import aja from 'aja';
import $ from 'jquery';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';
import * as actions from '../../actions';
import ListFilters from './ListFilters';

import { Link, browserHistory } from 'react-router';

const errorMessages = {
  serverApiTimeout : 'Server timeout, please try again leter.',
  serverApiNetworkError : 'Server error, please try again leter.',
  serverApiDefaultError : 'Error loading data, try again later..',
  tooManyRows : 'Too many rows, please update selected filter',
  noData : 'No Data',
  selectionActionAtLeastOne : 'Please select at least one item.',
  selectionActionOnlyOne : 'Please select only one item.',
  selectionActionatNoItems : 'No item selected.'
}

const styles = {
  listTopBar : {backgroundColor:'white'},
  listActions : {margin:'5px'},
  listActionsLabel : {color:'#fff'},
  noDataMessage : {textAlign: 'center', /*marginBottom: '-12px',*/ marginTop: '5px', display: 'block'},
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
  filterDatePicker: {
    margin : '10px',
    display: 'inline-block'
  },
  tableCell : {
    textOverflow : 'clip',
    wordWrap: 'break-word',
    whiteSpace: 'normal',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  createNewButton : {
    margin : '10px'
  }
};

const SortTypes = {
  ASC: 1,
  DESC: -1,
};

/**
  * Wrapper for table header TH because material-ui table doesn't support onClick event on table header
  */
class SortableTableHeaderColumn extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this.state = {
      label : props.data.label,
      sort : props.sort || '',
    }
  }

  _onClick(event){
    event.stopPropagation();
    if (this.props.onClick){
      this.props.onClick(event, this.props.data, this.props.sort)
    };
  };

  render() {
    let style = { verticalAlign: 'middle' } ;
    let sort = ' ';
    if(this.props.sort == SortTypes.ASC) {
      sort = <DownwardIcon style={style}/>;
    } else if (this.props.sort == SortTypes.DESC){
      sort = <UpwardIcon style={style}/>;
    }
    return (<div style={{cursor: 'pointer'}} onClick={ this._onClick }>{sort} {this.state.label}</div>);
  }
}

class List extends Component {
  constructor(props) {
    super(props);
    //Helpers
    this._updateTableData = this._updateTableData.bind(this);
    this._getData = _.debounce(this._getData.bind(this), 2000);
    this._filterData = this._filterData.bind(this);
    this._sortData = this._sortData.bind(this);
    this._parseResults = this._parseResults.bind(this);
    this._buildSearchQueryArg = this._buildSearchQueryArg.bind(this);
    //Handlers
    this.validateOnlyOneRowIsSelected = this.validateOnlyOneRowIsSelected.bind(this);
    this.validateAlLeastOneRowIsSelected = this.validateAlLeastOneRowIsSelected.bind(this);
    //Actions
    this.onPagintionClick = this.onPagintionClick.bind(this);
    this.onClickRow = this.onClickRow.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.onChangeAdvFilter = _.debounce(this.onChangeAdvFilter.bind(this), 2000);
    this.onRemoveAdvFilter = this.onRemoveAdvFilter.bind(this);
    this.onChangeFilterDate = this.onChangeFilterDate.bind(this);
    this.onClickTableHeader = this.onClickTableHeader.bind(this);
    this.onClickExport = this.onClickExport.bind(this);
    this._onRowSelection = this._onRowSelection.bind(this);
    this._onAggregate = this._onAggregate.bind(this);
    this._onClearAggregate = this._onClearAggregate.bind(this);

    this.onClickCloneItem = this.onClickCloneItem.bind(this);
    this.onClickNewItem = this.onClickNewItem.bind(this);
    this.onClickEditItem = this.onClickEditItem.bind(this);
    this.onClickDeleteItem = this.onClickDeleteItem.bind(this);
    this.onAcceptRemoveItems = this.onAcceptRemoveItems.bind(this);
    this.onClickCloseandnewItem = this.onClickCloseandnewItem.bind(this);

    //Assign filter default value if exist
    let filters = this._getFilterDefaultValues(props.settings.fields);
    let storedFilters = this._getFilterStoredValues(props.page, props.settings.fields);
    Object.assign(filters, storedFilters);
    this.state = {
      height : (props.settings.defaults && props.settings.defaults.tableHeight) || '500px',
      rows : [],
      sortField : '',
      sortType : '',
      filters: filters,
      advFilters: [],
      currentPage : 1,
      totalPages : 1,
      settings: props.settings,
      fields: props.settings.fields,
      loadingData : '',
      progress: false
    };
  }

  componentWillMount() {
    let { settings } = this.props;
    this.setState({settings}, this._updateTableData);
  }

  componentWillReceiveProps(nextProps) {
    let { settings } = nextProps;
    let filters = this._getFilterDefaultValues(settings.fields);
    let storedFilters = this._getFilterStoredValues(nextProps.page, settings.fields);
    Object.assign(filters, storedFilters);
    this.setState({
      rows : [],
      sortField : '',
      sortType : '',
      fields: settings.fields,
      filters: filters,
      advFilters: [],
      currentPage : 1,
      totalPages : 1,
      settings
    }, this._updateTableData);

  }

  validateOnlyOneRowIsSelected(){
    if(!_.isUndefined(this.refs.listBoby.state.selectedRows)) {
      if (this.refs.listBoby.state.selectedRows.length == 1) {
        let selectedRowNum = _.head(this.refs.listBoby.state.selectedRows);
        let selectedItemId = this.state.rows[selectedRowNum];
        return this.state.rows[selectedRowNum]._id['$id']
      } else if(this.refs.listBoby.state.selectedRows.length > 1){
        this.props.showStatusMessage(errorMessages.selectionActionOnlyOne, 'error');
      } else {
        let message = errorMessages.selectionActionatNoItems + ' ' + errorMessages.selectionActionOnlyOne;
        this.props.showStatusMessage(message, 'error');
      }
    }
    return null;
  }

  validateAlLeastOneRowIsSelected(){
    if(!_.isUndefined(this.refs.listBoby.state.selectedRows)) {
      if (this.refs.listBoby.state.selectedRows.length > 0) {
        let selectedRowIds = this.refs.listBoby.state.selectedRows.map(
          (selectedRowNum, i) => {
            return this.state.rows[selectedRowNum]._id['$id'];
          }
        );
        return selectedRowIds
      } else {
        let message = errorMessages.selectionActionatNoItems + ' ' + errorMessages.selectionActionAtLeastOne;
        this.props.showStatusMessage(message, 'error');
      }
    }
    return null;
  }

  /* ON Actions */

  onClickCloneItem(e) {
    let itemId =  this.validateOnlyOneRowIsSelected();
    if(itemId){
      let { page, collection } = this.props;
      let url = `/${page}/${collection}/clone/${itemId}`;
      this.context.router.push(url);
    }
  }

  onClickCloseandnewItem(e) {
    let itemId = this.validateOnlyOneRowIsSelected();
    if(itemId){
      let { page, collection } = this.props;
      let url = `/${page}/${collection}/close_and_new/${itemId}`;
      this.context.router.push(url);
    }
  }

  onClickEditItem(e) {
    let itemsIds = this.validateAlLeastOneRowIsSelected();
    if(itemsIds){
      let { page, collection } = this.props;
      let url = `/${page}/${collection}/`;
      url += (itemsIds.length == 1) ? `edit/${itemsIds.pop()}` : `edit_multiple/${_.join(itemsIds, ',')}`;
      this.context.router.push(url);
    }
  }

  onClickDeleteItem(e) {
    if (this.validateAlLeastOneRowIsSelected()) {
      this.setState({
        modalTitle: "Remove Items",
        modalMessage: "Are you sure you want to remove selected items?",
        modalOpen: true
      });
      /* HACK! */
      this.setState({selectedRow: this.refs.listBoby.state.selectedRows});
    }
  }

  onAcceptRemoveItems() {
    this.setState({modalOpen: false});
    let selectedRowNums = this.state.selectedRow;
    if (selectedRowNums.length) {
      let item_ids = _.reduce(selectedRowNums, (acc, idx) => {
        acc.push(this.state.rows[idx]._id['$id']);
        return acc;
      }, []);
      let data = {
        ids: JSON.stringify(item_ids),
        coll: this.props.collection,
        type: "remove"
      };
      $.ajax({
        type: 'POST',
        url: `${globalSetting.serverUrl}/admin/remove`,
        data: data,
        dataType: 'jsonp'
      }).always(resp => {
        /* TODO rerender list withtout removed items on sucess */
        this._updateTableData();
      });
    }
  }

  onClickNewItem(e) {
    let { page, collection } = this.props;
    this.context.router.push(`/${page}/${collection}/new`);
  }


  _onRowSelection(selectedRows) {
    // console.log(this.refs.listBoby.state.selectedRows);

      // let newSelectedRows = [1,0];
      // switch (selectedRows) {
      //   case 'none': newSelectedRows = [];
      //     break;
      //   case 'all': newSelectedRows = _.range(0, 0 + this.state.rows.length)
      //     break;
      //
      //     default: newSelectedRows = selectedRows.slice();
      //     break;
      //
      // }
      // setTimeout is HACK to fix ui checked last iten when toggling select all to none
      // setTimeout(() => {
      //   this.setState({
      //       selectedRows : this.refs.listBoby.state.selectedRows
      //   });
      //  }, 1000);
  }

  onClickRow(row, column, e) {
    let { page, collection } = this.props;
    let rawData = this.state.rows[row];
    if(column !== -1 && rawData && rawData._id && rawData._id.$id && this.state.settings.onItemClick){
      let id = rawData._id.$id;
      let url = `/${page}/${collection}/${this.state.settings.onItemClick}/${id}`;
      this.context.router.push(url);
      e.stopPropagation();
    }
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

  onChangeAdvFilter(filter){
    let existingAdvFilters = this.state.advFilters || [];
    existingAdvFilters[filter.index] = {op: filter.op, field: filter.field, value: filter.value}
    this.setState({
      advFilters: existingAdvFilters,
      currentPage: 1
    }, this._updateTableData);
  }

  onRemoveAdvFilter(index){
    this.setState({
      advFilters: this.state.advFilters.filter((advFilter, i) => index !== i),
      currentPage: 1
    }, this._updateTableData);
  }

  onChangeFilter(e, value){
    let key = e.target.name;
    this._filterData(key, value);
  }

  onChangeFilterDate(key ,nullEvent, value) {
    this._filterData(key, value);
  }

  formatDate(date){
    return (moment(date).format(globalSetting.dateFormat)) ;
  }

onClickExport() {
  let debugParam = globalSetting.serverApiDebug ? '&'+globalSetting.serverApiDebugQueryString : '';
  let { serverUrl } = globalSetting;
  let query = this._buildSearchQuery();
  var iframe = document.createElement('iframe');
  iframe.src = `${globalSetting.serverUrl}/admin/csvExport?collection=lines${debugParam}&${query}`;
  iframe.onload = function () {
    $(iframe).remove();
  }
  $(document.body).append(iframe);
}
  onClickTableHeader(e, value, sort){
    let newSort = SortTypes.ASC; //default
    if (this.state.sortField == value.key) {
      newSort = (this.state.sortType === SortTypes.ASC) ? SortTypes.DESC : SortTypes.ASC ;
    }
    this._sortData(value.key, newSort);
  }

  /* Handlers */

  handleError(data){
    this.setState({
      loadingData : '',
      progress : false
    });
    let errorMessage = (data && data.desc && data.desc.length) ? data.desc : errorMessages.serverApiDefaultError ;
    this.props.showStatusMessage(errorMessage, 'error');
    this.props.hideProgressBar();
  }

  _calcPagesAmount(itemsCount, itemPerPage){
    let currentAmount = this.state.totalPages;
    if(this.state.currentPage < this.state.totalPages){
      return currentAmount;
    }
    if(parseInt(itemsCount) > 0 && parseInt(itemPerPage) == parseInt(itemsCount)){
      currentAmount++;
    }
    return currentAmount;
  }

  _sortData(key, value) {
    this.setState({
      sortField : key,
      sortType : value,
      currentPage : 1
    }, this._updateTableData);
  }

  _filterData(key, value) {
    //Store Input value
    localStorage.setItem(this.props.page + "-" + key, value);

    let filters = Object.assign({}, this.state.filters);
    filters[key] = value;
    this.setState({
      filters: filters,
      currentPage: 1
    });
  }

  _updateTableData(){
    this.props.showProgressBar();
    this.setState({
          loadingData : '',
          progress: true
     });
    this._getData(this._buildSearchQuery());
  }

  _isFilterParamEmpty(data) {
    if(typeof(data) == 'number' || typeof(data) == 'boolean') {
      return false;
    }
    if(typeof(data) == 'undefined' || data === null) {
      return true;
    }
    if(typeof(data.length) != 'undefined') {
      return data.length == 0;
    }
    if(data instanceof Date){
      return false;
    }
    for(var i in data) {
      if(data.hasOwnProperty(i)) {
        return false;
      }
    }
    return true;
  }

  _buildSearchQueryArg(){
    let queryArgs = {};

    for ( let key in this.state.filters ) {
      if(this.state.filters[key]){
        let filterSetting = this._getFieldSettings(key);
        if(filterSetting){
          if(filterSetting.filter.wildcard && filterSetting.filter.wildcard.length > 0){
            queryArgs['$or'] = [];
            filterSetting.filter.wildcard.map((replacment, i) => {
              let wildcardkey =  key.replace("*", replacment);
              queryArgs['$or'].push(
                {[wildcardkey] : {
                "$regex" : this.state.filters[key],
                "$options" : "i"
                }}
              );
            });
          } else if(filterSetting['filter'] && filterSetting['filter']['query']) {
            let self = this;
            if(!this._isFilterParamEmpty(this.state.filters[key])){
              queryArgs = function rec(qArgs,path ) {
                  if(path == null ) {
                     return self.state.filters[key];
                  }
                  for(let i in path) {
                    if(!qArgs[i]) {
                      qArgs[i] = {};
                    }
                    qArgs[i] = rec( queryArgs[i],path[i] );
                  }
                  return qArgs;
              }(queryArgs,filterSetting['filter']['valuePath']);
            }
          } else if(filterSetting.type == 'number') {
            queryArgs[key] = parseFloat(this.state.filters[key]);
          } else {
            queryArgs[key] = {
              "$regex" : this.state.filters[key],
              "$options" : "i"
            };
          }
        }
      }
    }

    this.state.advFilters.map( (advFilter, index) => {
        let value = advFilter.value;
        if(advFilter.op == '$in'){
          value = [value];
        }
        queryArgs[advFilter.field] = {[advFilter.op]: value};
      }
    );

    return queryArgs;
  }

  _buildSearchQuery(){
    let queryString = '';
    let queryArgs = this._buildSearchQueryArg();

    var filters = {};
    if(this.state.settings.project){
      this.state.settings.project.map((field, i) => { filters[field]=1});
    } else {
      this.state.fields.map((field, i) => { filters[field.key]=1});
    }
    queryString += '&project=' +  JSON.stringify(filters);

    if(!_.isEmpty(queryArgs)){
      queryString += '&query=' +  JSON.stringify(queryArgs);
    }

    let itemsPerPage = (this.state.settings.pagination && this.state.settings.pagination.itemsPerPage) ? this.state.settings.pagination.itemsPerPage : globalSetting.list.maxItems;
    queryString += '&size=' + itemsPerPage + '&page=' + parseInt(this.state.currentPage);

    if(!_.isEmpty(this.state.sortField)){
      let sortType = (this.state.sortType) ? this.state.sortType : SortTypes.ASC ;
      queryString += '&sort=' +  JSON.stringify({ [this.state.sortField] : sortType });
    }

    if(globalSetting.serverApiDebug && globalSetting.serverApiDebug == true){
        queryString += '&' + globalSetting.serverApiDebugQueryString;
    }

    return queryString;
  }

  _parseResults(collection, response){
    let rows = [];
    if(collection == 'rates'){
      for(let rates in response.details){
      let baseRateData =  Object.assign({}, response.details[rates]);
        if(baseRateData.hasOwnProperty('rates')){
          let rateRates = Object.assign({}, baseRateData['rates']);
          delete baseRateData['rates']
          for(let rate in rateRates){
            let newRate = Object.assign({}, baseRateData, rateRates[rate], {usaget:rate});
            rows.push(newRate);
          }
        } else {
          rows.push(baseRateData);
        }
      }
    } else {
      rows = _.values(response.details);
    }
    // if(rows.length > globalSetting.list.maxItems){
    //   this.props.showStatusMessage(errorMessages.tooManyRows, 'info');
    // }
    // rows = rows.slice(0, Math.min(rows.length, globalSetting.list.maxItems));
    return rows;
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
           let rows = this._parseResults(this.props.collection, response);
           let itemsPerPage = (this.state.settings.pagination && this.state.settings.pagination.itemsPerPage) ? this.state.settings.pagination.itemsPerPage : globalSetting.list.maxItems;
           this.setState({
              totalPages : this._calcPagesAmount(Object.keys(response.details).length, itemsPerPage),
              rows : rows,
              progress : false,
              loadingData : (rows.length > 0) ? '' : (<Toolbar style={styles.noDataMessage}> <ToolbarTitle text={errorMessages.noData} /></Toolbar>),
           }, this.props.hideProgressBar);
         } else {
           this.handleError(response);
         }
       })
       .on('timeout', (response) => {
         response['desc'] = errorMessages.serverApiTimeout;
          this.handleError(response);
        })
       .on('error', (response) => {
         response['desc'] = errorMessages.serverApiNetworkError;
          this.handleError(response);
        })
       .go();
  }

  _formatField(row, field, i){
    let output = '';
    let value = _.result(row, field.key);
    switch (field.type) {
      case 'boolean':
        output = value ? 'Yes' : 'No' ;
        break;
      case 'price':
          let price = parseFloat(value);
          output = (price) ? price.toFixed(2).toString().replace(".", ",") : '0';
          output += ' ' + globalSetting.currency;
        break;
      case 'mongoid':
        output = value.$id;
        break;
      case 'urt':
        output = (value.sec) ? (moment(value.sec * 1000).format(globalSetting.datetimeFormat)) : '';
        break;
      case 'timestamp':
        output = (value) ? (moment(value * 1000).format(globalSetting.datetimeFormat)) : '';
        break;
      case 'interval':
        switch (row.usaget) {
          case 'forwarded_call':
          case 'call':
            output =  moment(0).second(value).format('mm:ss');
            break;
          case 'data': output = Math.ceil(value / 1024) + " KB";
            break;
          default: output = value;
        }
        break;
      default:
        output = (typeof value === "undefined") ? "-" : value;
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
        if(field.filter.system){
          filters[field.key] = field.filter.system;
        }
        if(field.filter.defaultValue && typeof field.filter.defaultValue !== "undefined"){
          filters[field.key] = field.filter.defaultValue;
        }
      }
    });
    return filters;
  }

  _getFilterStoredValues(pageKey, fields){
    let filters = {};
    fields.map((field, i) => {
      if(field.filter){
        if(typeof field.filter.system === 'undefined'){
          let filterKey = pageKey + "-" + field.key;
          let filterVal = localStorage.getItem(filterKey);
          if(filterVal && filterVal.length > 0){
            if(field.type == 'multiselect') {
              filterVal = filterVal.split(",");
            }
            if(field.type == 'urt') {
              filterVal = new Date(filterVal);
            }
            filters[field.key] = filterVal;
          }
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
  /* ~Helpers */


 _onAggregate(response) {
   let rows = this._parseResults(this.props.collection, response);
   let itemsPerPage = (this.state.settings.pagination && this.state.settings.pagination.itemsPerPage) ? this.state.settings.pagination.itemsPerPage : globalSetting.list.maxItems;

   let aggregate_settings = this.state.settings.aggregate;
   let fields = _.reduce(_.keys(rows[0]), (acc, key) => {
     let groupByFound = _.find(aggregate_settings.groupBy, def => { return def.key === key; });
     if (groupByFound) { acc.push(groupByFound); return acc; }
     let fieldsFound = _.find(aggregate_settings.fields, def => { return def.key === key; });
     if (fieldsFound) { acc.push(fieldsFound); return acc; }
     let methodsFound = _.find(aggregate_settings.methods, def => { return def.key === key; });
     if (methodsFound) { acc.push(methodsFound); return acc; }
     return acc;
   }, []);

   let settings = Object.assign({}, this.state.settings, {advancedFilter:null});//remove advenced filters in aggrigate mode
   this.setState({
     fields: fields,
     totalPages : 1,
     rows : rows,
     settings,
     loadingData : (rows.length > 0) ? '' : (<Toolbar style={styles.noDataMessage}> <ToolbarTitle text="No Data" /></Toolbar>),
   });
 }

  _onClearAggregate() {
    let { settings } = this.props;
    let { fields } = settings;

    let storedFilters = this._getFilterStoredValues(this.props.page, this.props.settings.fields);

    this.setState({settings, fields, filters: storedFilters, advFilters: [], rows: []}, this._updateTableData);
  }

  render() {
    let { settings } = this.state;
    let { page, collection } = this.props;
    let header = (
      <TableRow>
        {<TableHeaderColumn style={{ width: 5}}>#</TableHeaderColumn>}
        {this.state.fields.map((field, i) => {
          if( !(field.hidden  && field.hidden == true) ){
            if(field.sortable  && field.sortable == true){
              return <TableHeaderColumn key={i}><SortableTableHeaderColumn style={styles.tableCell} data={field} sort={(this.state.sortField == field.key) ? this.state.sortType : ''} onClick={this.onClickTableHeader} /></TableHeaderColumn>
            } else {
              return <TableHeaderColumn key={i} style={styles.tableCell}>{field.label}</TableHeaderColumn>
            }
          }
        })}
      </TableRow>
    );

    let rows = this.state.rows.map( (row, index) => {
      let itemsPerPage = (this.state.settings.pagination && this.state.settings.pagination.itemsPerPage) ? this.state.settings.pagination.itemsPerPage : globalSetting.list.maxItems;
      return (
      <TableRow key={index}>
        {<TableRowColumn style={{ width: 5}}>{index + 1 + ( (this.state.currentPage > 1) ? ((this.state.currentPage-1) * itemsPerPage) : 0)}</TableRowColumn>}
        { this.state.fields.map((field, i) => {
          if( !(field.hidden  && field.hidden == true) ){
            return <TableRowColumn style={styles.tableCell} key={i}>{this._formatField(row, field, i)}</TableRowColumn>
          }
        })}
      </TableRow>
    )});

    const getActions = () => {
      let actions = [];

      if(this.state.settings.controllers && !_.isEmpty(this.state.settings.controllers)) {

        Object.keys(this.state.settings.controllers).map((name, key) => {
          let controller = this.state.settings.controllers[name];
          let callback = (controller.callback) ?  controller.callback : 'onClick' +  _.capitalize(name) + 'Item';
          actions.push(
            <RaisedButton
              key={"action_" + controller.label}
              backgroundColor={controller.color || theme.palette.primary1Color}
              onTouchTap={this[callback]}
              label={controller.label}
              style={styles.listActions}
              labelStyle={styles.listActionsLabel}
              disabled={false}
            />
          );
        });

        return (<div>{actions}</div>);
      }
      return ('');
    }

    const getPager = () => {
      let pages = [];
      let dots = <svg width="25px" height="10px">
        <line x1="3" x2="24" y1="5" y2="5" stroke={theme.palette.primary1Color} strokeWidth="5" strokeLinecap="round" strokeDasharray="1, 8"></line>
      </svg>;
      if(this.state.totalPages > 1) {
        if(this.state.progress){
          pages.push(
            <RefreshIndicator key='loading'
              style={{position: 'relative', margin: '0 auto'}}
              size={30} left={0} top={0} status="loading"
            />
        );
        } else {
          pages.push(
            <FloatingActionButton
              key='back'
              mini={true}
              style={styles.pagination.paginationButton}
              onClick={this.onPagintionClick}
              value='back'
              secondary={false}
              disabled={this.state.currentPage == 1}
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
                  disabled={this.state.currentPage == i}
                >
                <spam>{i}</spam>
              </FloatingActionButton>)
            } else {
              if( !pages[pages.length-1].key.startsWith("placeholder")){
                pages.push(<span key={"placeholder_" + i}>{dots}</span>);
              }
            }
          }
          if(this.state.totalPages > 1 && this.state.currentPage < this.state.totalPages) {
            pages.push(<span key='not-last'>{dots}</span>);
          }
          pages.push(
            <FloatingActionButton
              key='forward'
              mini={true}
              style={styles.pagination.paginationButton}
              onClick={this.onPagintionClick}
              value='forward'
              secondary={false}
              disabled={this.state.currentPage == this.state.totalPages}
            >
            <ForwardIcon />
            </FloatingActionButton>
          );
        }

        return (
          <div>
            <div style={styles.pagination.paginationBar}>{pages}</div>
          </div>
        )
      }
      return (null);
    }

    let footer = (
      <TableRow>
        <TableRowColumn colSpan={this.props.settings.fields.length} style={{textAlign: 'center'}}>
          {getPager()}
        </TableRowColumn>
      </TableRow>
    );

    let closeModal = () => {
      this.setState({modalOpen: false});
    }
    const modalActions = [
      <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={closeModal}
      />,
      <FlatButton
          label="Accept"
          primary={true}
          onTouchTap={this.onAcceptRemoveItems}
      />
    ];
    return (
      <div>
        <Toolbar style={styles.listTopBar}>
           <ToolbarGroup>
             <ToolbarTitle text={this.props.settings.title} />
           </ToolbarGroup>
           <ToolbarGroup>
             {getActions()}
           </ToolbarGroup>
         </Toolbar>

        <Divider />
        <div>
          <ListFilters
            page={this.props.page}
            progress={this.state.progress}
            filterApply={this._updateTableData}
            fields={this.state.fields}
            filters={this.state.filters}
            aggregate={this.state.settings.aggregate}
            advancedFilter={this.state.settings.advancedFilter}
            formatDate={this.formatDate}
            buildSearchQueryArg={this._buildSearchQueryArg}
            onChangeFilter={this.onChangeFilter}
            onChangeFilterDate={this.onChangeFilterDate}
            onChangeAdvFilter={this.onChangeAdvFilter}
            onRemoveAdvFilter={this.onRemoveAdvFilter}
            onClearAggregate={this._onClearAggregate}
            onChangeAggregate={this._onAggregate}
            />
        </div>
        <div>
            {this.state.loadingData}
        </div>
        <Table
          height = { this.state.height }
          allRowsSelected = {false}
          fixedHeader = {true}
          fixedFooter = { true }
          selectable = { this.state.rows.length > 0 }
          multiSelectable = { this.state.rows.length > 0 }
          className="braasList"
          onCellClick={this.onClickRow}
          onRowSelection={this._onRowSelection}
        >
          <TableHeader enableSelectAll = { true }>
            {header}
          </TableHeader>

          <TableBody
            preScanRows = { false }
            deselectOnClickaway = { false }
            showRowHover = { true }
            stripedRows = { true }
            ref="listBoby"
          >
            {rows}
          </TableBody>
          <TableFooter>
            {footer}
          </TableFooter>
        </Table>
          <Dialog
              title={this.state.modalTitle}
              actions={modalActions}
              modal={true}
              open={this.state.modalOpen || false}
          >
            <div>{this.state.modalMessage}</div>
          </Dialog>
      </div>
    );
  }
}

List.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    list: state.pages.list
  };
}

export default connect(mapStateToProps, actions)(List);
