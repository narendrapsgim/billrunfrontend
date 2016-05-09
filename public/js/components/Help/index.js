import React, { Component, PropTypes } from 'react';
import HelpOutline from 'material-ui/svg-icons/action/help-outline';
import Popover from 'material-ui/Popover';

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
    return (
      <span>
        <HelpOutline
            onTouchTap={this.handleTouchTap}
            style={{cursor: "pointer", fill: "#333"}} />
        <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
            style={{padding: "10px"}}>
          {this.props.contents}
        </Popover>
      </span>
    );
  }
}

Help.propTypes = {
  contents: PropTypes.string.isRequired
};

export default Help;
