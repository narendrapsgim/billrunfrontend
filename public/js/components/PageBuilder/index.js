import React, { Component, PropTypes } from 'react';
import Fields from '../../fields';
import Field from './Field';
import R from 'ramda';

class PageBuilder extends Component {
  constructor(props) {
    super(props);
    this.page_settings = Fields.pages[props.route.page];
    this.createSectionHTML = this.createSectionHTML.bind(this);
  }

  createSectionHTML(section) {
    let rechtml,
        fieldshtml;

    if (section.sections && !R.isEmpty(section.sections)) {
      rechtml = section.sections.map((section, key) => {
        return this.createSectionHTML(section);
      });
    }

    if (section.fields) {
      fieldshtml = section.fields.map((field, key) => {
        return (
          <Field field={field} />
        );
      });
    }

    return (
      <div>
        <h4>{section.title}</h4>
        {fieldshtml}
        <hr/>
        {rechtml}
      </div>
    );
  }
  
  render() {
    let { title, sections = [] } = this.page_settings;
    let sectionsHTML = sections.map((section, key) => {
      return this.createSectionHTML(section);
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
