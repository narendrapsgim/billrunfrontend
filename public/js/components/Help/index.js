import React, { Component, PropTypes } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import HelpOutline from 'material-ui/svg-icons/action/help-outline';
import _ from 'lodash';

class Help extends Component {
  constructor(props) {
    super(props);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.state = { open: false };
  }

  handleTouchTap(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  render() {
    const { contents } = this.props;
    if (!contents || _.isEmpty(contents)) return (null);

    const tooltip = (
      <Tooltip id="tooltip">{contents}</Tooltip>
    );

    return (
      <span style={{margin: 5}}>
        <OverlayTrigger placement="top" overlay={tooltip}>
          <i className="glyphicon glyphicon-question-sign" style={{cursor: "pointer"}}></i>
        </OverlayTrigger>
      </span>
    );
  }
}

Help.propTypes = {
  contents: PropTypes.string.isRequired
};

export default Help;
