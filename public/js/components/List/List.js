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
import {blue500} from 'material-ui/styles/colors';

import _ from 'lodash';
import aja from 'aja';

import { Link, browserHistory } from 'react-router';

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
    //Handlers
    this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    //Actions
    this.onClickNewItem = this.onClickNewItem.bind(this);
    this.onPagintionClick = this.onPagintionClick.bind(this);
    this.onClickRow = this.onClickRow.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.onClickTableHeader = this.onClickTableHeader.bind(this);

    this.onClickCloneItem = this.onClickCloneItem.bind(this);
    this.onClickNewItem = this.onClickNewItem.bind(this);
    this.onClickEditItem = this.onClickEditItem.bind(this);
    this.onClickDeleteItem = this.onClickDeleteItem.bind(this);

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

  /* ON Actions */
  onClickCloneItem(e) { console.log('Clone Item - ', e);}
  onClickEditItem(e) { console.log('Edit Item - ', e);}
  onClickDeleteItem(e) { console.log('Delete Item - ', e);}

  onClickNewItem(e) {
    let { page, collection } = this.props;
    this.context.router.push(`/${page}/${collection}/new`);
  }

  onClickRow(row, column, e) {
    let { page, collection } = this.props;
    let rawData = this.state.rows[row];
    if(column !== -1 && rawData && rawData._id && rawData._id.$id && this.state.settings.onItemClick){
      let id = rawData._id.$id;
      let url = `/${page}/${collection}/${this.state.settings.onItemClick}/${id}`;
      this.context.router.push(url);
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

  handleError(data){
    let errorMessage = (data && data.desc && data.desc.length) ? data.desc : 'Error loading data, try again later..';
    this.setState({
      snackbarOpen: true,
      snackbarMessage: errorMessage,
      loadingData : ''
    });
  }

  /* Helpers */
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

    if(_.isObject(this.state.settings.pagination) && _.isInteger(this.state.settings.pagination.itemsPerPage ) && this.state.settings.pagination.itemsPerPage > -1){
      queryString += '&size=' + this.state.settings.pagination.itemsPerPage + '&page=' + parseInt(this.state.currentPage);
    }

    if(!_.isEmpty(this.state.sortField)){
      let sortType = (this.state.sortType) ? this.state.sortType : SortTypes.ASC ;
      queryString += '&sort=' +  JSON.stringify({ [this.state.sortField] : sortType });
    }

    if(queryString.startsWith('&')){
      queryString = queryString.replace('&','?');
    } else {
      queryString = (queryString.length) ? '?' + queryString : '';
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
           let rows = (response.details) ? response.details.slice(0, Math.min(response.details.length, 50)) : [];
           let itemsPerPage = (this.state.settings.pagination && this.state.settings.pagination.itemsPerPage) ? this.state.settings.pagination.itemsPerPage : '';
           this.setState({
              totalPages : this._setPagesAmount(response.count, itemsPerPage),
              rows : rows,
              loadingData : (rows.length > 0) ? '' : (<Toolbar style={styles.noDataMessage}> <ToolbarTitle text="No Data" /></Toolbar>),
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
      this.state.settings.fields.map((field, i) => {
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
        {<TableHeaderColumn style={{ width: 5}}>#</TableHeaderColumn>}
        {this.state.settings.fields.map((field, i) => {
          if( !(field.hidden  && field.hidden == true) ){
            if(field.sortable  && field.sortable == true){
              return <TableHeaderColumn key={i}><SortableTableHeaderColumn data={field} sort={(this.state.sortField == field.key) ? this.state.sortType : ''} onClick={this.onClickTableHeader} /></TableHeaderColumn>
            } else {
              return <TableHeaderColumn key={i}>{field.label}</TableHeaderColumn>
            }
          }
        })}
      </TableRow>
    );

    let rows = this.state.rows.map( (row, index) => (
      <TableRow key={index} selected={row.selected}>
        {<TableRowColumn style={{ width: 5}}>{index + 1}</TableRowColumn>}
        { this.state.settings.fields.map((field, i) => {
          if( !(field.hidden  && field.hidden == true) ){
            return <TableRowColumn style={styles.tableCell} key={i}>{this._formatField(row, field, i)}</TableRowColumn>
          }
        })}
      </TableRow>
    ));

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
