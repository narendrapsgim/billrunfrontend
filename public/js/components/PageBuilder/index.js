import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';

import { updateFieldValue, getCollectionEntity, getCollectionEntites, saveCollectionEntity, setInitialItem } from '../../actions';

import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import View from '../../views';
import Field from './Field';
import List from '../List';
import Help from '../Help';
import FieldsContainer from '../FieldsContainer';
import Auth from './Auth';

import _ from 'lodash';

class PageBuilder extends Component {
  constructor(props) {
    super(props);
    this.createSectionsHTML = this.createSectionsHTML.bind(this);
    this.actionButtons = this.actionButtons.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onSave = this.onSave.bind(this);

    this.isFieldExistInAllItems = this.isFieldExistInAllItems.bind(this);
    this.setItemMapper = this.setItemMapper.bind(this);
    this.setItemsMapper = this.setItemsMapper.bind(this);
    this.isArrayOfObjects = this.isArrayOfObjects.bind(this);
    this.parseObjectsArray = this.parseObjectsArray.bind(this);
    this.parseValue = this.parseValue.bind(this);
    this.parseRaw = this.parseRaw.bind(this);
    this.parseFields = this.parseFields.bind(this);
    this.parseData = this.parseData.bind(this);

    this.mapper = {};
    // window.mapper = this.mapper;

    this.state = {
      action: props.params.action
    };
  }




  setItemMapper(item, key, itemKey){
    let id = item._id['$id'];
    if(typeof this.mapper[key] === 'undefined'){
      this.mapper[key] = {};
    }
    this.mapper[key][id] = itemKey;
  }

  setItemsMapper(items, key){
    items.forEach( (item) => {
      this.setItemMapper(item, key, key);
    });
  }

  isArrayOfObjects(element){
    var result = Array.isArray(element);
    if(!result) return false;

    result = element.length > 0;
    if(!result) return false;

    result = Object.prototype.toString.call(element[0]) === "[object Object]";
    if(!result) return false;
    return true;
  }

  parseObjectsArray (items, blocks, key = '', parent = {}){
    let html = [];
    if(parent.key == "region"){
      //Create Mapper
      var all = items.map((item, i) => _.get(item, key).map( (node) => node[parent.key]));
      var intersected = _.intersection(...all);
      var mapper = {};
      items.forEach( (item) => {
          var indexes = intersected.map((intersect) => _.get(item, key).findIndex( (node) => node[parent.key] == intersect));
          mapper[item._id['$id']] = indexes;
      });
      //loop through all commom values
      for (var i = 0; i < intersected.length; i++) {
        let blockFields = [];
        blocks.forEach( (block) => {
          let reducedValue = items.reduce( (prevValues, item, index) => {
            //build item key by mapper
            let arrayKey = key + "[" + mapper[item._id['$id']][i] + "]." + block.dbkey;
            //set mapper
            this.setItemMapper(item, key + "[" + i +"]." + block.dbkey, arrayKey);
            //Compare values
            if(index == 0) return _.get(item, arrayKey);
            let values = _.get(item, arrayKey);
            if(Array.isArray(values)){
              values.sort();
            };
            let equal = _.isEqual(values, prevValues);
            return equal ? values : ['multipleValues'];
          }, null);
          blockFields.push(<Field size={block.size} field={block} value={reducedValue} path={key + "[" + i +"]." + block.dbkey} onChange={this.onFieldChange} key={key + block.dbkey + "[" + i +"][value]"} label={block.label}/>);
        });
        blockFields.push( <div style={{clear: 'both'}}  key={key + "[" + i +"]" + "[clear-both]"}></div>);
        let container = (
          <div className={'col-md-' + parent.size} key={key + parent.dbkey + "[" + i +"][blok]"}>
              <FieldsContainer
                path={key + parent.dbkey + "[" + i +"]"}
                label={''}
                content={blockFields}
                crud={parent.crud}
                expanded={parent.collapsed}
                fieldType={parent.fieldType}
                pageName={this.getPageName()}
                dispatch={this.props.dispatch}
                collapsible={parent.collapsible}
              />
          </div>);
        html.push(container);
      }
    } else {
      var itemsKeys = items.map( (item) => Object.keys(_.get(item, key)));
      _.intersection(...itemsKeys).forEach( (index) => {
          let newKey = key + "[" + index + "]";
          blocks.forEach( (block) => {
            html.push(this.parseData(items, block, newKey, parent));
          });
      });
    }
    return html;
  }

  parseValue(items, block, key = '', parent = {}){
    //build current key
    var dbkey  = (key.length) ? key + "." + block.dbkey : block.dbkey;
    //set key in mapper object
    this.setItemsMapper(items, dbkey);
    //Create marged value from all items
    let mergedValue = items.map(
      (item, i) => _.get(item, dbkey, '')
    ).reduce(
      (prev, current, i) => _.isEqual(prev,current) ? current : 'multipleValues'
    );
    if(this.isFieldExistInAllItems(items, block, key)){
      return (<Field size={block.size} field={block} value={mergedValue} path={dbkey} onChange={this.onFieldChange} key={dbkey} label={block.label}/>);
    }
  }

  parseRaw(items, block, key ='', parent = {}){
    var html = [];
    if(parent.type == 'objectsArray' /*isArrayOfObjects(block)*/){
      html.push(this.parseObjectsArray(items, block.row, key, parent));
    } else {
      block.row.map((row, i) => {
         html.push(this.parseData(items, row, key, parent));
      });
    }
    return <div className="row">{html}</div>;
  }

  parseFields(items, block, key ='', parent={}){
    var html = [];
    var label = null;
    block.fields.forEach((field, i) => {
      if(typeof block.dbkey !== 'undefined'){
        if(block.dbkey == "*"){
          var valuesKeys = items.map(
            (item, i) => _.get(item, key, '')
          ).map(
            (value, i) => Object.keys(value)
          );
          _.intersection(...valuesKeys).forEach((objectKey, i) => {
            var dbkey = key + "." + objectKey;
            label = this.titlize(objectKey);
            html.push(this.parseData(items, field, dbkey, block));
          });
        } else {
          var dbkey = (key.length) ? key + "." +  block.dbkey : block.dbkey;
          html.push(this.parseData(items, field, dbkey, block));
        }
      } else {
        html.push(this.parseData(items, field, key, block));
      }
    });
    html.push(<div style={{clear: 'both'}} key={key + block.dbkey + "[clear-both]"}></div>);

    let reactKey = (key ? key + "." : 'section.') + (block.dbkey ? block.dbkey + "." :  '');
    let size = block.size || 12;
    let container = (
      <div className={'col-md-' + size} key={reactKey + "[block]"}>
        <FieldsContainer
          path={reactKey}
          label={label || block.label || parent.label || ''}
          content={html}
          crud={block.crud}
          expanded={block.collapsed}
          fieldType={block.fieldType}
          pageName={this.getPageName()}
          dispatch={this.props.dispatch}
          collapsible={block.collapsible}
        />
      </div>);
    return container;
  }

  parseData(items, block, key ='', parent = {}){
    var html = [];
    if(block.hasOwnProperty('fields')){
      html.push(this.parseFields(items, block, key, parent));
    } else if (block.hasOwnProperty('row')){
      html.push(this.parseRaw(items, block, key, parent));
    } else {
        html.push(this.parseValue(items, block, key, parent));
    }
    return html;
  }

  isFieldExistInAllItems(items, block, key){
    //return false for fields that not exist in all items (display only commom fields)
    let itemsKeys = items.map( (item, i) => {
      let vals = (key.length > 0) ? _.get(item, key) : item;
      return Object.keys(vals);
    });
    if(_.intersection(...itemsKeys).includes(block.dbkey)){
      return true
    }
    return false;
  }














  getPageName(props = this.props) {
    return props.params.page.replace(/-/g, '_').toLowerCase();
  }

  componentDidMount() {
    switch (this.props.params.action) {
      case 'edit':
      case 'close_and_new':
      case 'clone':
        this.getCollectionItem(this.props);
        break;
      case 'new':
        this.setInitialState(this.props);
        break;
      case 'edit_multiple':
        this.getCollectionItems(this.props);
        break;
      case 'list':
        // get list data
        break;
      default:

    }
  }

  getCollectionItems(props) {
    let pageName = this.getPageName(props);
    let { collection, entity_id, action } = props.params;
    this.setState({collection, entity_id, pageName, action});

    if (collection && entity_id) {
      props.dispatch(getCollectionEntites(entity_id, collection, pageName));
    }
  }

  getCollectionItem(props) {
    let pageName = this.getPageName(props);
    let { collection, entity_id, action } = props.params;
    this.setState({collection, entity_id, pageName, action});

    if (collection && entity_id) {
      props.dispatch(getCollectionEntity(entity_id, collection, pageName));
    }
  }

  setInitialState(props) {
    let pageName = this.getPageName(props);
    let { collection, entity_id, action } = props.params;
    this.setState({collection, entity_id, pageName, action});
    this.props.dispatch(setInitialItem(pageName));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      if (nextProps.params.action === "edit" || nextProps.params.action == "clone" || nextProps.params.action == "close_and_new") {
        this.getCollectionItem(nextProps);
      } else if(nextProps.params.action == "edit_multiple"){
        this.getCollectionItems(nextProps);
      } else {
        this.setInitialState(nextProps);
      }
    }
  }

  onFieldChange(evt, index, value) {
    if(evt.target.type == "checkbox") {
      value = evt.target.checked;
    } else {
      if (!value && evt.target) value = evt.target.value
    }
    let { dispatch } = this.props;
    let path = evt.target.dataset.path;

    dispatch(updateFieldValue(path, value, this.getPageName(), this.state.action, this.mapper));
  }

  onSave(e) {
    let { item, dispatch } = this.props;
    let pageName = this.getPageName();
    let action = e.currentTarget.dataset.action;
    let actionType = action; //close_and_new / duplicate / update / new
    switch (action) {
      case 'edit_multiple':
      case 'edit':
          actionType = 'update';
        break;
      case 'clone': actionType = 'duplicate';
        break;
      case 'new': actionType = 'new';
        break;
    }
    if(action == 'edit_multiple'){
      this.props.items.forEach( (item) => {
        dispatch(saveCollectionEntity(item, this.props.params.collection, pageName, actionType, true));
      });
    } else {
      dispatch(saveCollectionEntity(item, this.props.params.collection, pageName, actionType));
    }
  }

  onCancel() {
    browserHistory.goBack();
  }

  titlize(str) {
    return _.capitalize(str.replace(/_/g, ' ').toLowerCase());
  }

  sectionTitle(section) {
    let tooltip;
    if (section.description) {
      tooltip = <Help contents={section.description} />;
    }

    return (
      <h4>{section.title}  {tooltip}</h4>
    );
  }

  createTabsHTML(tabs) {
    let tabsHTML = tabs.map((tab, tab_key) => {
      if (!tab.sections) {
        return (
          <Tab key={tab_key} label={tab.title} style={this.tabStyle()}>
          </Tab>
        );
      }
      let sectionsHTML = this.createSectionsHTML(tab.sections);
      return (
        <Tab key={tab_key} label={tab.title} style={this.tabStyle()}>
          {sectionsHTML}
        </Tab>
      );
    });

    return (
      <Tabs inkBarStyle={this.inkBarStyle()}>
        {tabsHTML}
      </Tabs>
    );
  }

  createConfigFieldsFromItem(item) {
    let from_array = false;
    if (Array.isArray(item)) {
      item = item[0];
      from_array = true;
    }
    if (!item) return;
    let item_keys = Object.keys(item);
    return item_keys.map(item_key => {
      let value = item[item_key];
      if (_.isObject(value)) {
        return { dbkey: item_key, fields: this.createConfigFieldsFromItem(value) };
      }
      return { dbkey: item_key, label: this.titlize(item_key), size: (from_array ? 3 : 10) };
    });
  }

  createFieldHTML(field, path, field_index, source = null) {
    if ((this.state.action === 'edit' || this.state.action === 'clone' || this.state.action === 'close_and_new') && (!this.props.item || _.isEmpty(this.props.item))) {
      return null;
    }

    if(typeof field.row !== 'undefined'){
      return this.createRowHTML(field.row, path, field_index);
    }

    if (path.endsWith(".*")) {
      let recpath = path.replace('.*', '');
      let res = _.result(this.props, recpath);
      if (!res){
        return null;
      };
      return Object.keys(res).map((obj_key, obj_idx) => {
        return this.createFieldHTML(field, `${recpath}.${obj_key}`, obj_idx);
      });
    }

    let value = _.result(this.props, path);
    let size = field.size || 12;

    let label = field.label;
    if(typeof field.label === 'undefined'){
      label = this.titlize(_.last(path.split('.')));
    } else if (_.isObject(field.label) && _.has(field.label,'dbkey')){
      label = _.result({item:this.props.items[0]}, path.replace(field.dbkey, field.label.dbkey));
    }

    //print only fields that exist in item
    if(typeof value === 'undefined'){
      return null;
    }

    if (Array.isArray(value) && _.isObject(value[0])) {
      return value.map((elm, idx) => {
         return this.createFieldHTML(field, `${path}[${idx}]`,idx)
       });
    } else if (field.fields) {
      let subfields = field.fields.map((subfield, field_idx) => {
        if(typeof subfield.row !== 'undefined') {
          return this.createRowHTML(subfield.row, path, field_idx);
        } else {
          return this.createFieldHTML(subfield, `${path}.${subfield.dbkey}`, field_idx);
        }
      });
      subfields.push(<div key={field.fields.length++} style={{clear: 'both'}}></div>);
      return (
        <div className={'col-md-' + size} key={field_index}>
          <FieldsContainer
            path={path}
            label={label}
            content={subfields}
            crud={field.crud}
            expanded={field.collapsed}
            fieldType={field.fieldType}
            pageName={this.getPageName()}
            dispatch={this.props.dispatch}
            collapsible={field.collapsible}
          />
        </div>
      );
    }

    return (
      <Field size={size} field={field} value={value} path={path} onChange={this.onFieldChange} key={field_index} label={label}/>
    );
  }

  createRowHTML(row, path, row_idx){
    let output = row.map((field, field_idx) => {
      let newPath = (typeof field.dbkey !== 'undefined' ) ?  path + '.' + field.dbkey : path ;
      return this.createFieldHTML(field, newPath, field_idx);
    });
    output.push(<div key={row.length++} style={{clear: 'both'}}></div>);
    return (<div key={row_idx} className="row">{output}</div>);
  }

  createSectionsHTML(sections = []) {
    let sectionsHTML = sections.map((section, section_idx) => {
      let output;
      if(this.state.action == 'edit_multiple'){
        output = this.props.items ? this.parseData(this.props.items, section) : null;
      } else if(section.fields) {
        let fields = section.fields ? section.fields : this.createConfigFieldsFromItem(this.props.item);
        output = fields.map((field, field_idx) => {
          if(field.row){
            return this.createFieldHTML(field, `item`, field_idx);
          } else {
            return this.createFieldHTML(field, `item.${field.dbkey}`, field_idx);
          }
        });
      }

      if(section.lists){
        output = section.lists.map((list, idx) => {
          return (
            <List settings={list}
                  page={this.props.params.page}
                  collection={this.props.params.collection}
                  key={idx} />
          );
        });
      }
      if(section.html){
        output = <section.html/>;
      }
      return (
        <div key={"section_" + section_idx}>
          {this.sectionTitle(section)}
          {output}
        </div>
      );
    });

    return (
      <div className="container-fluid">{sectionsHTML}</div>
    );
  }

  tabStyle() {
    return { backgroundColor: "#272A39" };
  }

  inkBarStyle() {
    return { backgroundColor: "#C0C0C0", height: "4px", bottom: "2px" };
  }

  actionButtons(action = this.state.action) {
    if (action === "edit" || action === "new" || action === "clone" || action === "close_and_new" || action === "edit_multiple") {
      let style = {
        margin: "12px"
      };
      return (
        <div className="action-buttons">
          <RaisedButton
              label="Save"
              primary={true}
              style={style}
              onMouseUp={this.onSave}
              data-action={action}
          />
          <RaisedButton
              label="Cancel"
              style={style}
              onMouseUp={this.onCancel}
          />
        </div>
      );
    }
  }

  render() {

    let { pageName = this.getPageName(),
          action } = this.state;
    if ((action === 'edit' || action === 'clone' ||  action === 'close_and_new') && !this.props.item) return (null);
    let sectionsHTML;
    let page_view = View.pages[pageName].views ?
                    View.pages[pageName].views[action] :
                    View.pages[pageName];

    // Check page permission
    if(_.intersection(View.pages[pageName].permission, this.props.user.roles).length == 0){
      return (<Auth pagePermission = {View.pages[pageName].permission} userRoles = {this.props.user.roles} auth={this.props.user.auth}/>);
    }

    if (!page_view) {
      return (null);
    }

    let { title, sections = [] } = page_view;
    if (page_view.view_type === "tabs") {
      sectionsHTML = this.createTabsHTML(page_view.tabs);
    } else if(page_view.view_type === "html") {
      sectionsHTML = this.createSectionsHTML(page_view.html.sections)
    } else {
      sectionsHTML = this.createSectionsHTML(page_view.sections)
    }

    return (
      <div>
        <h3>{title}</h3>
        {sectionsHTML}
        <Divider style={{ marginTop: '10px'}}/>
        {this.actionButtons()}
      </div>
    );
  }
}

PageBuilder.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state, ownProps) {
  return {
    item: (state.pages && state.pages.page && state.pages.page.item) ?  state.pages.page.item : null,
    items: (state.pages && state.pages.page && state.pages.page.items) ?  state.pages.page.items : null,
    user: state.users
  }
}

export default connect(mapStateToProps)(PageBuilder);
