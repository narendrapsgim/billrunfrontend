import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateFieldValue, getCollectionEntity } from '../../actions';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import View from '../../view';
import Field from './Field';
import Help from '../Help';
import R from 'ramda';

class PageBuilder extends Component {
  constructor(props) {
    super(props);
    this.createSectionHTML = this.createSectionHTML.bind(this);
    this.onChange = this.onChange.bind(this);
    this.action = this.props.params.action;
  }

  componentDidMount() {
    let pageName = this.props.params.page.replace(/-/g, '_').toLowerCase();
    let { collection, entity_id } = this.props.params;

    if (collection && entity_id) {
      let { dispatch } = this.props;
      dispatch(getCollectionEntity(collection, entity_id, pageName));
    }
  }
  
  onChange(evt) {
    let { dispatch } = this.props;
    let [ id, value ] = [ evt.target.id, evt.target.value ];
    let pageName = this.props.params.page.replace(/-/g, '_').toLowerCase();    
    dispatch(updateFieldValue(id, value, pageName));
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
  
  createSectionHTML(section, key) {
    let rechtml,
        fieldshtml;

    if (this.action === "edit" && this.props && this.props.item) {
      let field_names = Object.keys(this.props.item);
      fieldshtml = field_names.map((field_name, k) => {
        let type = typeof this.props.item[field_name] === "object" ?
                   "select" :
                   typeof this.props.item[field_name];
        return (
          <Field field={{dbkey: field_name, type}} value={this.props.item[field_name]} onChange={this.onChange} key={k} />
        );
      });
    }
    
    if (section.sections && !R.isEmpty(section.sections)) {
      rechtml =
      <div>
        {section.sections.map((section, k) => {
           return this.createSectionHTML(section, k);
         })}
      </div>
    } 

    if (section.fields) {
      fieldshtml = section.fields.map((field, k) => {
        let html_id = field.dbkey ? field.dbkey : field.label.toLowerCase().replace(/ /g, '_');
        let value = (this.action === "edit") ? this.props.item[html_id] : this.props[html_id];
        return (
          <Field field={field} value={value} onChange={this.onChange} key={k}/>
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
    return {backgroundColor: "#272A39"};
  }

  inkBarStyle() {
    return {backgroundColor: "#C0C0C0", height: "4px", bottom: "2px"};
  }

  render() {
    let pageName = this.props.params.page.replace(/-/g, '_').toLowerCase();
    let sectionsHTML;
    
    if (!View.pages[pageName]) {
      return (<div></div>);
    }

    let { title, sections = [] } = View.pages[pageName];

    if (View.pages[pageName].view_type === "tabs") {
      return this.createTabsHTML(View.pages[pageName].tabs);
    } else {
      sectionsHTML = this.createSectionHTML(sections);
    }

    return (
      <div>
        <h4>{title}</h4>
        {sectionsHTML}
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
