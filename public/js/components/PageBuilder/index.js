import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';

import { updateFieldValue, getCollectionEntity, saveForm, setInitialItem } from '../../actions';

import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import View from '../../view';
import Field from './Field';
import List from '../List';
import Help from '../Help';
import FieldsContainer from '../FieldsContainer';

import R from 'ramda';
import _ from 'lodash';

class PageBuilder extends Component {
  constructor(props) {
    super(props);
    this.createSectionsHTML = this.createSectionsHTML.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.actionButtons = this.actionButtons.bind(this);
    this.state = {action: this.props.params.action};
  }

  getPageName(props = this.props) {
    return props.params.page.replace(/-/g, '_').toLowerCase();
  }

  componentWillMount() {
    this.setInitialState(this.props);
  }
  componentDidMount() {
    this.getCollectionItem(this.props);
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
      if (nextProps.params.action === "edit") {
        this.getCollectionItem(nextProps);
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
    dispatch(updateFieldValue(path, value, this.getPageName()));
  }

  onSave() {
    let { dispatch } = this.props;
    let pageName = this.getPageName();
    dispatch(saveForm(pageName));
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

  createFieldHTML(field, path, field_index) {
    if (this.state.action === 'edit' && (!this.props.item || _.isEmpty(this.props.item))) {
      return null;
    }
    if (path.endsWith(".*") && field.fields) {
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
    let size = field.size || 10;
    if (Array.isArray(value) && _.isObject(value[0])) {
      let fieldsHTML = value.map((elm, idx) => {
         return this.createFieldHTML(field, `${path}[${idx}]`,idx)
       });
      return (
        <div className={"col-md-" + size} key={field_index}>
          {fieldsHTML}
        </div>
      );
    } else if (field.fields) {
      let content = field.fields.map((subfield, field_idx) => {
        return this.createFieldHTML(subfield, `${path}.${subfield.dbkey}`, field_idx);
      });
      let label = field.label ?
                  field.label :
                  this.titlize(_.last(path.split('.')));
      if (typeof field.collapsible !== 'undefined') {
        return (
          <FieldsContainer size={size} label={label} content={content} key={field_index} collapsible={field.collapsible} expanded={field.collapsed} />
        );
      }
      return (
        <div className={"col-md-" + size} style={{marginBottom: "15px"}}>
          <h4>{label}</h4>
          <div>
            {content}
          </div>
        </div>
      );
    }

    return (
      <Field field={field} value={value} path={path} onChange={this.onFieldChange} key={field_index} />
    );
  }

  createSectionsHTML(sections = []) {
    let sectionsHTML = sections.map((section, section_idx) => {
      let output;
      if(section.fields) {
        let fields = section.fields ? section.fields : this.createConfigFieldsFromItem(this.props.item);
        output = fields.map((field, field_idx) => {
          return this.createFieldHTML(field, `item.${field.dbkey}`, field_idx);
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
      <div>
        {sectionsHTML}
        <div className="row"></div>
      </div>
    );
  }

  tabStyle() {
    return { backgroundColor: "#272A39" };
  }

  inkBarStyle() {
    return { backgroundColor: "#C0C0C0", height: "4px", bottom: "2px" };
  }

  actionButtons(action = this.state.action) {
    if (action === "edit" || action === "new") {
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
    if (action === 'edit' && !this.props.item) return (<div></div>);
    let sectionsHTML;
    let page_view = View.pages[pageName].views ?
                    View.pages[pageName].views[action] :
                    View.pages[pageName];

    if (!page_view) {
      return (<div></div>);
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

function mapStateToProps(state, ownProps) {
  let pageName = ownProps.params.page.replace(/-/g, '_').toLowerCase();
  return (state[pageName]) ? state[pageName] : state;
}

export default connect(mapStateToProps)(PageBuilder);
