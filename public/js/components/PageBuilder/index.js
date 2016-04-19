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
    this.createSectionsHTML = this.createSectionsHTML.bind(this);
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

  getFieldViewConfig(fields, dbkey) {
    return R.find(R.propEq('dbkey', dbkey))(fields);
  }

  createConfigFieldsFromItem(item) {
    if (Array.isArray(item)) {
      item = item[0];
    }
    let item_keys = Object.keys(item);
    return item_keys.map(item_key => {
      let value = item[item_key];
      if (_.isObject(value)) {
        return { dbkey: item_key, fields: this.createConfigFieldsFromItem(value) };
      }
      return { dbkey: item_key, label: this.titlize(item_key), size: 10 };
    });
  }
  
  createFieldHTML(field, path, field_index) {
    if (!this.props.item) return (<div></div>);
    let value = _.result(this.props, path);
    if (Array.isArray(value)) {
      return value.map((elm, idx) => {
        return this.createFieldHTML(field, `${path}[${idx}]`, idx);
      });
    } else if (field.fields) {
      return field.fields.map((field, field_idx) => {
        return this.createFieldHTML(field, `${path}.${field.dbkey}`, field_idx);
      });
    }
    return (
      <Field field={field} value={value} path={path} onChange={this.onChange} key={field_index} />
    );
  }
  
  createSectionsHTML(sections = []) {
    let sectionsHTML = sections.map((section, section_idx) => {
      let fields = section.fields ? section.fields : this.createConfigFieldsFromItem(this.props.item);
      console.log(JSON.stringify(fields));
      let fieldsHTML = fields.map((field, field_idx) => {
        return this.createFieldHTML(field, `item.${field.dbkey}`);
      });
      return (
        <div>
          {this.sectionTitle(section)}
          {fieldsHTML}
          <div className="row"></div>
          <hr/>
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
      sectionsHTML = this.createSectionsHTML(page_view.sections)
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
