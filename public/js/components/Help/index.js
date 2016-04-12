import React, { Component, PropTypes } from 'react';
import HelpOutline from 'material-ui/lib/svg-icons/action/help-outline';

class Help extends Component {
  constructor(props) {
    super(props);
    this.showHelpContents = this.showHelpContents.bind(this);
  }

  showHelpContents() {
    /* Show Tooltip */
    console.log(this.props.contents);
  }
  
  render() {
    return (
      <HelpOutline
          onClick={this.showHelpContents}
          style={{cursor: "pointer"}} />
    );
  }
}

Help.propTypes = {
  contents: PropTypes.string.isRequired
};

export default Help;
