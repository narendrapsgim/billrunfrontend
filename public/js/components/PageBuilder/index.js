import React, { Component, PropTypes } from 'react';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import View from '../../view';
import Field from './Field';
import R from 'ramda';

class PageBuilder extends Component {
  constructor(props) {
    super(props);
    this.page_settings = View.pages[props.route.page];
    this.createSectionHTML = this.createSectionHTML.bind(this);
  }

  createSectionHTML(section, key) {
    let rechtml,
        fieldshtml;

    if (section.sections && !R.isEmpty(section.sections)) {
      rechtml = section.sections.map((section, k) => {
        return this.createSectionHTML(section, k);
      });
    }

    if (section.fields) {
      fieldshtml = section.fields.map((field, k) => {
        return (
          <Field field={field} key={k}/>
        );
      });
    }

    return (
      <div key={key}>
        <h4>{section.title}</h4>
        {fieldshtml}
        <div className="row"></div>
        <hr/>
        {rechtml}
      </div>
    );
  }
  
  render() {

    let pageName = this.props.params.page.replace(/-/g, '_').toLowerCase();
    if (!View.pages[pageName]) {
      return (<div></div>);
    }

    if (View.pages[pageName].view_type === "tabs") {
      let tabs = View.pages[pageName].tabs.map((tab, tab_key) => {
        if (!tab.sections) {
          return (
            <Tab key={tab_key} label={tab.title} style={{backgroundColor: "#272A39"}}>
            </Tab>
          );
        }
        let sectionsHTML = tab.sections.map((section, key) => {
          return this.createSectionHTML(section, key);
        });
        return (
          <Tab key={tab_key} label={tab.title} style={{backgroundColor: "#272A39"}}>
            {sectionsHTML}
          </Tab>
        );
      });

      return (
        <Tabs inkBarStyle={{backgroundColor: "#C0C0C0", height: "4px", bottom: "2px"}}>
          {tabs}
        </Tabs>
      );
    };

    let { title, sections = [] } = View.pages[pageName];
    let sectionsHTML = sections.map((section, key) => {
      return this.createSectionHTML(section, key);
    });

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

export default PageBuilder;
