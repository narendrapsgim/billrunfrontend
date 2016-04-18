import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { updateFieldValue, getCollectionEntity, saveForm, setInitialItem } from '../../actions';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import View from '../../view';
import Field from './Field';
import Help from '../Help';
import R from 'ramda';
import _ from 'lodash';

class PageBuilder extends Component {
  constructor(props) {
    super(props);
    this.createSectionHTML = this.createSectionHTML.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.action = this.props.params.action;
  }

  getPageName() {
    return this.props.params.page.replace(/-/g, '_').toLowerCase();
  }
  
  componentWillMount() {
    let pageName = this.getPageName();
    this.props.dispatch(setInitialItem(pageName));
  }

  componentDidMount() {
    let pageName = this.getPageName();
    let { collection, entity_id } = this.props.params;

    if (collection && entity_id) {
      let { dispatch } = this.props;
      dispatch(getCollectionEntity(collection, entity_id, pageName));
    }
  }
  
  onChange(evt) {
    let { dispatch } = this.props;
    let [ path, value ] = [ evt.target.dataset.path, evt.target.value ];
    dispatch(updateFieldValue(path, value, this.getPageName()));
  }

  onSave() {
    let { dispatch } = this.props;
    let pageName = this.getPageName();
    dispatch(saveForm(pageName));
  }

  titlize(str) {
    return _.capitalize(str.replace(/_/g, ' '));
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
      let sectionsHTML = tab.sections.map((section, key) => {
        return this.createSectionHTML(section, key);
      });
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

  getFieldViewConfig(fields, dbkey) {
    return R.find(R.propEq('dbkey', dbkey))(fields);
  }

  createHTMLFromObject(object, path) {
    let object_keys = Object.keys(object);
    return object_keys.map((key, index) => {
      if (Object.prototype.toString.call(object[key]) === "[object Object]") {
        return this.createHTMLFromObject(object[key], `${path}.${key}`);
      } else if (Array.isArray(object[key])) {
        return object[key].map((elm, elm_key) => {
          return this.createHTMLFromObject(elm, `${path}.${key}[${elm_key}]`);
        });
      }
      let label = this.titlize(key);
      let value = object[key];
      return (
        <Field field={{dbkey: key, label}} value={value} path={`${path}.${key}`} onChange={this.onChange} key={index} />
      );
    });
  }

  createSectionHTML(section, key, path = 'item') {
    let rechtml,
        fieldshtml;

    if (section.sections && !R.isEmpty(section.sections)) {
      rechtml =
	<div>
            {section.sections.map((section, k) => {
		 return this.createSectionHTML(section, k);
             })}
	</div>;
    } 

    if (section.fields) {
      fieldshtml = section.fields.map((field, k) => {
        if (field.fields) {
          return this.createSectionHTML(field, field.dbkey, `${path}.${field.dbkey}`);
        }
        if (Object.prototype.toString.call(_.result(this.props.item, path.replace('item.', ''))) === "[object Object]") {
          return (
            <div key={k}>
              {this.createHTMLFromObject(_.result(this.props.item, path.replace('item.', '')), `${path}.${item_key}`)}
            </div>
          );
        } else if (Array.isArray(_.result(this.props.item, path.replace('item.', '')))) {
          return _.result(this.props.item, path.replace('item.', '')).map((elm, elm_key) => {
            return this.createSectionHTML(elm, elm_key, `${path}[${elm_key}]`);
          });
        }

        let html_id = field.dbkey ? field.dbkey : field.label.toLowerCase().replace(/ /g, '_');
        let value = this.props.item[html_id];
        return (
          <Field field={field} path={`${path}.${field.dbkey}`} value={value} onChange={this.onChange} key={k} />
        );
      });
    } else {
      let item_keys = Object.keys(this.props.item);
      fieldshtml = item_keys.map((item_key, k) => {
        if (Object.prototype.toString.call(this.props.item[item_key]) === "[object Object]") {
          return (
            <div key={k}>
              {this.createHTMLFromObject(this.props.item[item_key], `${path}.${item_key}`)}
            </div>
          );
        } else if (Array.isArray(this.props.item[item_key])) {
          return this.props.item[item_key].map((elm, elm_key) => {
            return this.createSectionHTML(elm, key, `${path}[${elm_key}]`);
          });
        }
        let value = (this.action === "edit") ? this.props.item[item_key] : this.props[item_key];
        return (
          <Field field={{dbkey: item_key, label: this.titlize(item_key)}} path={`${path}.${item_key}`} value={value} onChange={this.onChange} key={k} />
        );
      }); 
    }

    return (
      <div key={key}>
        {this.sectionTitle(section)}
        {fieldshtml}
        <div className="row"></div>
        <hr/>
        {rechtml}
      </div>
    );
  }
  
  tabStyle() {
    return { backgroundColor: "#272A39" };
  }

  inkBarStyle() {
    return { backgroundColor: "#C0C0C0", height: "4px", bottom: "2px" };
  }

  render() {
    let pageName = this.getPageName();
    if (!this.props.item) return (<div></div>);
    let sectionsHTML;
    let page_view = View.pages[pageName].views ? 
      View.pages[pageName].views[this.action] :
      View.pages[pageName];

    if (!page_view) {
      return (<div></div>);
    }

    let { title, sections = [] } = page_view;

    if (page_view.view_type === "tabs") {
      sectionsHTML = this.createTabsHTML(page_view.tabs);
    } else {
      sectionsHTML = sections.map((section, key) => {
	return this.createSectionHTML(section, key)
      });
    }

    return (
      <div>
        <h3>{title}</h3>
        {sectionsHTML}
	<button
	    className="btn btn-primary"
	    type="submit"
	    onClick={this.onSave}>
	  Save
	</button>
      </div>
    );
  }
}

PageBuilder.propTypes = {

};

function mapStateToProps(state, ownProps) {
  let pageName = ownProps.params.page.replace(/-/g, '_').toLowerCase();
  return (state[pageName]) ? state[pageName] : state;
}

export default connect(mapStateToProps)(PageBuilder);
