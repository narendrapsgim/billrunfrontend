import React, { Component, PropTypes } from 'react';
import Fields from '../../fields';
import R from 'ramda';

class PageBuilder extends Component {
  constructor(props) {
    super(props);
    this.page_settings = Fields.pages[props.route.page];
    this.createSectionHTML = this.createSectionHTML.bind(this);
  }

  createSectionHTML(section) {

  }
  
  render() {
    let { title, sections } = this.page_settings;
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
