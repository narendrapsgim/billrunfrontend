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
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {blue500} from 'material-ui/styles/colors';
import Aggregate from '../Aggregate/Aggregate';
import _ from 'lodash';
import aja from 'aja';
import $ from 'jquery';
import moment from 'moment';

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
  noDataMessage : {textAlign: 'center', /*marginBottom: '-12px',*/ display: 'block'},
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
    this._getData = _.debounce(this._getData.bind(this),1000);
    this._filterData = this._filterData.bind(this);
    this._sortData = this._sortData.bind(this);
    this._parseResults = this._parseResults.bind(this);
    this.showSnackbar = this.showSnackbar.bind(this);
    //Handlers
    this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    this.validateAtLeastOneSelectedRow = this.validateAtLeastOneSelectedRow.bind(this);
    //Actions
    this.onPagintionClick = this.onPagintionClick.bind(this);
    this.onClickRow = this.onClickRow.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.onChangeFilterDate = this.onChangeFilterDate.bind(this);
    this.onClickTableHeader = this.onClickTableHeader.bind(this);
    this._onRowSelection = this._onRowSelection.bind(this);

    this.onClickCloneItem = this.onClickCloneItem.bind(this);
    this.onClickNewItem = this.onClickNewItem.bind(this);
    this.onClickEditItem = this.onClickEditItem.bind(this);
    this.onClickDeleteItem = this.onClickDeleteItem.bind(this);
    this.onAcceptRemoveItems = this.onAcceptRemoveItems.bind(this);
    this.onClickCloseandnewItem = this.onClickCloseandnewItem.bind(this);

    //Assign filter default value if exist
    let filters = this._getFilterDefaultValues(props.settings.fields);

    this.state = {
      height : (props.settings.defaults && props.settings.defaults.tableHeight) || '500px',
      rows : [],
      sortField : '',
      sortType : '',
      filters : filters,
      snackbarOpen : false,
      snackbarMessage : '',
      currentPage : 1,
      totalPages : 1,
      settings: props.settings,
      loadingData : <LinearProgress mode="indeterminate"/>
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
      sortField : '',
      sortType : '',
      filters : filters,
      currentPage : 1,
      totalPages : 1,
      settings
    }, this._updateTableData);

  }

  validateAtLeastOneSelectedRow(){
    if(!_.isUndefined(this.refs.listBoby.state.selectedRows)) {
      if (this.refs.listBoby.state.selectedRows.length == 1) {
        let selectedRowNum = _.head(this.refs.listBoby.state.selectedRows);
        let selectedItemId = this.state.rows[selectedRowNum];
        return this.state.rows[selectedRowNum]
      } else if(this.refs.listBoby.state.selectedRows.length > 1){
        this.showSnackbar(errorMessages.selectionActionOnlyOne);
        return this.refs.listBoby.state.selectedRows.length;
      } else {
        let message = errorMessages.selectionActionatNoItems + ' ' + errorMessages.selectionActionAtLeastOne;
        this.showSnackbar(message);
        return false;
      }
    }
    return false;
  }
  /* ON Actions */
  onClickCloneItem(e) {
    let item =  this.validateAtLeastOneSelectedRow();
    if(item){
      let { page, collection } = this.props;
      let url = `/${page}/${collection}/clone/${item._id['$id']}`;
      this.context.router.push(url);
    }
  }

  onClickCloseandnewItem(e) {
    let item = this.validateAtLeastOneSelectedRow();
    if(item){
      let { page, collection } = this.props;
      let url = `/${page}/${collection}/close_and_new/${item._id['$id']}`;
      this.context.router.push(url);
    }
  }

  onClickEditItem(e) { console.log('Edit Item - ', e);}

  onClickDeleteItem(e) {
    if (this.refs.listBoby.state.selectedRows.length) {
      this.setState({modalTitle: "Remove Items"});
      this.setState({modalMessage: "Are you sure you want to remove selected items?"});
      this.setState({modalOpen: true});
      /* HACK! */
      this.setState({selectedRow: this.refs.listBoby.state.selectedRows});
    } else {
      let message = errorMessages.selectionActionatNoItems + ' ' + errorMessages.selectionActionAtLeastOne;
      this.showSnackbar(message);
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

  onClickTableHeader(e, value, sort){
    let newSort = SortTypes.ASC; //default
    if (this.state.sortField == value.key) {
      newSort = (this.state.sortType === SortTypes.ASC) ? SortTypes.DESC : SortTypes.ASC ;
    }
    this._sortData(value.key, newSort);
  }

  /* Handlers */

  handleCloseSnackbar(){
    this.setState({
      snackbarOpen: false,
      snackbarMessage: '',
    });
  };

  showSnackbar(message){
    this.setState({
      snackbarOpen: true,
      snackbarMessage: message,
    });
  };

  handleError(data){
    let errorMessage = (data && data.desc && data.desc.length) ? data.desc : errorMessages.serverApiDefaultError ;
    this.showSnackbar(errorMessage);
    this.setState({
      loadingData : ''
    });
  }

  _setPagesAmount(itemsCount, itemPerPage){
    if(parseInt(itemsCount) > 0 && parseInt(itemPerPage) > 0){
      return  Math.ceil(itemsCount / itemPerPage);
    }
    return 1;
  }

  _sortData(key, value) {
    this.setState({
      sortField : key,
      sortType : value,
      currentPage : 1
    }, this._updateTableData);
  }

  _filterData(key, value) {
    let filters = Object.assign({}, this.state.filters);
    filters[key] = value;
    this.setState({
      filters : filters,
      currentPage : 1
    }, this._updateTableData);
  }

  _updateTableData(){
    this.setState({
          loadingData : <LinearProgress mode="indeterminate"/>
     });
    this._getData(this._buildSearchQuery());
  }

  _buildSearchQuery(){
    let queryString = '';
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
          } else {
          queryArgs[key] = {
            "$regex" : this.state.filters[key],
            "$options" : "i"
          };
        }
      }
    }
    }

    var filters = {};
    if(this.state.settings.project){
      this.state.settings.project.map((field, i) => { filters[field]=1});
    } else {
      this.state.settings.fields.map((field, i) => { filters[field.key]=1});
    }
    queryString += '&project=' +  JSON.stringify(filters);

    if(!_.isEmpty(queryArgs)){
      queryString += '&query=' +  JSON.stringify(queryArgs);
    }

    if(_.isObject(this.state.settings.pagination) && _.isInteger(this.state.settings.pagination.itemsPerPage ) && this.state.settings.pagination.itemsPerPage > -1){
      queryString += '&size=' + this.state.settings.pagination.itemsPerPage + '&page=' + parseInt(this.state.currentPage);
    }

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
    if(rows.length > globalSetting.list.maxItems){
      this.showSnackbar(errorMessages.tooManyRows);
    }
    rows = rows.slice(0, Math.min(rows.length, globalSetting.list.maxItems));
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
           let itemsPerPage = (this.state.settings.pagination && this.state.settings.pagination.itemsPerPage) ? this.state.settings.pagination.itemsPerPage : '';
           this.setState({
              totalPages : this._setPagesAmount((response.count || 100), itemsPerPage),
              rows : rows,
              loadingData : (rows.length > 0) ? '' : (<Toolbar style={styles.noDataMessage}> <ToolbarTitle text={errorMessages.noData} /></Toolbar>),
           });
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
          output = ( price) ? price.toFixed(2).toString().replace(".", ",") : '0';
          output += ' ' + globalSetting.currency;
        break;
      case 'mongoid':
        output = value.$id;
        break;
      case 'urt':
        output = (value.sec) ? (moment(value.sec*1000).format(globalSetting.datetimeFormat)) : '';
        break;
      case 'timestamp':
        output = (value) ? (moment(value*1000).format(globalSetting.datetimeFormat)) : '';
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
  /* ~Helpers */


 _onAggregate(response) {
   let rows = this._parseResults(this.props.collection, response);
   let itemsPerPage = (this.state.settings.pagination && this.state.settings.pagination.itemsPerPage) ? this.state.settings.pagination.itemsPerPage : '';
   this.setState({
      totalPages : this._setPagesAmount((response.count || 100), itemsPerPage),
      rows : rows,
      loadingData : (rows.length > 0) ? '' : (<Toolbar style={styles.noDataMessage}> <ToolbarTitle text="No Data" /></Toolbar>),
   });
 }

  render() {
    let { settings } = this.state;
    let { page, collection } = this.props;
    let aggregate = (<div />);
    if(this.state.settings.aggregate) {
      aggregate = (<Aggregate fields={this.state.settings.aggregate.fields}
                              methods={this.state.settings.aggregate.methods}
                              groupBy={this.state.settings.aggregate.groupBy}
                              url='http://billrun/api/queryaggregate'
                              onDataChange={this._onAggregate} />);
    }
    let filters = (
      this.state.settings.fields.map((field, i) => {
        if(field.filter && !field.filter.system){
          let ret =

           <TextField
            style={styles.filterInput}
            key={i} name={field.key}
            hintText={"enter " + field.label + "..."}
            floatingLabelText={"Search by " + field.label}
            errorText=""
            defaultValue={(field.filter.defaultValue) ? field.filter.defaultValue : ''}
            onChange={this.onChangeFilter} />;
          if(field.type == 'urt') {
            ret =  <DatePicker hintText={"enter " + field.label + "..."} container="inline" mode="landscape"
                                floatingLabelText={"Search by " + field.label} style={styles.filterInput}
                                key={i} name={field.key}  defaultDate={(field.filter.defaultValue) ? new Date(field.filter.defaultValue) : null}
                                onChange={this.onChangeFilterDate.bind(null, field.key)} autoOk={true}
                                formatDate={this.formatDate}/>

          }
          return ret;
        }
      })
    );

    let header = (
      <TableRow>
        {<TableHeaderColumn style={{ width: 5}}>#</TableHeaderColumn>}
        {this.state.settings.fields.map((field, i) => {
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
      return (
      <TableRow key={index}>
        {<TableRowColumn style={{ width: 5}}>{index + 1 + ( (this.state.currentPage > 1) ? ((this.state.currentPage-1) * this.state.settings.pagination.itemsPerPage) : 0)}</TableRowColumn>}
        { this.state.settings.fields.map((field, i) => {
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
              backgroundColor={controller.color || blue500}
              onTouchTap={this[callback]}
              label={controller.label}
              style={styles.listActions}
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
      if(this.state.settings.pagination && this.state.totalPages > 1) {
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
            disabled={this.state.currentPage == this.state.totalPages}
          >
          <ForwardIcon />
          </FloatingActionButton>
        );

        return (
          <div>
            <div style={styles.pagination.paginationBar}>{pages}</div>
          </div>
        )
      }
      return ('');
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
            {filters}
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
           actions={<FlatButton
                      label="Ok"
                      primary={true}
                      onTouchTap={this.handleCloseSnackbar}
                    />}
           modal={false}
           open={this.state.snackbarOpen}
           onRequestClose={this.handleCloseSnackbar}
         >
         <div>{this.state.snackbarMessage}</div>
          </Dialog>
          <Dialog
              title={this.state.modalTitle}
              actions={modalActions}
              modal={true}
              open={this.state.modalOpen}
          >
            <div>{this.state.modalMessage}</div>
          </Dialog>
      {/*<Snackbar
          color='red'
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleCloseSnackbar}
        />*/}

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

export default connect(mapStateToProps)(List);
