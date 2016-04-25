import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { updateFieldValue, getCollectionEntity, saveForm, setInitialItem } from '../../actions';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import View from '../../view';
import Field from './Field';
import List from '../List';
import Help from '../Help';
import R from 'ramda';
import _ from 'lodash';

class PageBuilder extends Component {
  constructor(props) {
    super(props);
    this.createSectionsHTML = this.createSectionsHTML.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.state = {action: this.props.params.action};
  }

  getPageName(props = this.props) {
    return props.params.page.replace(/-/g, '_').toLowerCase();
  }
  
  componentWillMount() {
    let pageName = this.getPageName();
    this.props.dispatch(setInitialItem(pageName));
  }

  getCollectionItem(props) {
    let pageName = this.getPageName(props);
    let { collection, entity_id, action } = props.params;
    this.setState({collection, entity_id, pageName, action});

    if (collection && entity_id) {
      let { dispatch } = props;
      dispatch(getCollectionEntity(collection, entity_id, pageName));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.getCollectionItem(nextProps);
    }
  }

  componentDidMount() {
    this.getCollectionItem(this.props);
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
    if (this.state.action === 'edit' && (!this.props.item || _.isEmpty(this.props.item))) return (<div></div>);
    if (path.endsWith(".*") && field.fields) {
      let recpath = path.replace('.*', '');
      let res = _.result(this.props, recpath);
      if (!res) return; (<div></div>);
      return Object.keys(res).map((obj_key, obj_idx) => {
        return this.createFieldHTML(field, `${recpath}.${obj_key}`, obj_idx);
      });
    }
    let value = _.result(this.props, path);
    if (Array.isArray(value) && _.isObject(value[0])) {
      return value.map((elm, idx) => {
        return this.createFieldHTML(field, `${path}[${idx}]`, idx);
      });
    } else if (field.fields) {
      let ret = field.fields.map((field, field_idx) => {
        return this.createFieldHTML(field, `${path}.${field.dbkey}`, field_idx);
      });
      let label = field.label ?
                  field.label :
                  this.titlize(_.last(path.split('.')));
      return (
        <div className="col-md-10">
          <h4>{label}</h4>
          <div>
            {ret}
          </div>
        </div>
      );
    }
    return (
      <Field field={field} value={value} path={path} onChange={this.onChange} key={field_index} />
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
            <List settings={list} key={idx}/>
          );
        });
      }
      return (
        <div key={section_idx}>
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

  render() {
    let { collection,
          entity_id,
          pageName = this.getPageName(),
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
    } else {
      sectionsHTML = this.createSectionsHTML(page_view.sections)
    }

    return (
      <div>
        {/*<Link to="plans/plans/edit/123">To Plan</Link>*/}
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
