import React, { Component } from 'react';
import CloseIcon from 'material-ui/svg-icons/navigation/cancel';

const styles = {
  chipStyle: {
    height: '32px',
    lineHeight: '32px',
    padding: '0 12px',
    fontSize: '13px',
    fontWeight: '500',
    backgroundColor: '#efefef',
    borderRadius: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'default',
    margin: '5px',
  },
  chipStyleHover: {
    height: '32px',
    lineHeight: '32px',
    padding: '0 12px',
    fontSize: '13px',
    fontWeight: '500',
    backgroundColor: '#aaa',
    borderRadius: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'default',
    margin: '5px',
  },
  textStyle: {
    fontSize: '13px',
    fontWeight: '400',
    lineHeight: '16px',
    color: 'rgba(0,0,0,0.87)',
  },
  textStyleHover:{
    fontSize: '13px',
    fontWeight: '400',
    lineHeight: '16px',
    color: 'white',
  },
  iconStyle: {
   height: '20px',
   width: '20px',
   margin: '4px -6px 4px 4px',
   transition: 'none',
   cursor: 'pointer',
 },
}

export default class Chip extends Component {

  static defaultProps = {
    allowRemove: true,
  }

  static propTypes = {
    index: React.PropTypes.number.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.node
    ]).isRequired,
    onRemoveClick: React.PropTypes.func.isRequired
  }

  state = {
    hover: false
  }

  renderRemoveButton = () => {
    const { hover } = this.state;
    return (
      <CloseIcon style={styles.iconStyle} color={hover ? 'white' : 'rgba(0,0,0,0.3)'} size={20}
        onClick={this.handleRemoveClick}
      />
    );
  }

  handleRemoveClick = () => {
    const { index } = this.props;
    this.props.onRemoveClick(index);
  }

  handleOnMouseEnter = () => {
    this.setState({ hover: true });
  }

  handleOnMouseLeave = () => {
    this.setState({ hover: false });
  }

  render() {
    const {value, allowRemove, index} = this.props;

    return (
      <div style={this.state.hover ? styles.chipStyleHover : styles.chipStyle}
        onMouseEnter={this.handleOnMouseEnter}
        onMouseLeave={this.handleOnMouseLeave}
      >
        <span style={this.state.hover ? styles.textStyleHover : styles.textStyle}>
          {value}
        </span>
        { allowRemove && this.renderRemoveButton() }
      </div>
    );
  }
}
