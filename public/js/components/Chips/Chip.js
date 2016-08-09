import React from 'react';
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
 iconColor: 'rgba(0,0,0,0.3)',
 iconColorHover: 'white',
}

export default class Chip extends React.Component {

  constructor(props) {
    super(props);

    this._handleRemoveClick = this._handleRemoveClick.bind(this);

    this.state = {
      hover: false,
    };
  }

  renderRemoveButton(index) {
    return (
      <CloseIcon
        style={styles.iconStyle}
        color={this.state.hover ? styles.iconColorHover : styles.iconColor}
        size={20}
        onClick={() => this._handleRemoveClick(index)}
      />
    );
  }

  _handleRemoveClick(index) {
    this.props.onRemoveClick(index);
  }

  _handleOnMouseEnter() {
    this.setState({hover: true});
  }

  _handleOnMouseLeave() {
    this.setState({hover: false});
  }

  render() {
    const {value, allowRemove, index} = this.props;
    return (
      <div
        style={this.state.hover ? styles.chipStyleHover : styles.chipStyle}
        onMouseEnter={this._handleOnMouseEnter.bind(this)}
        onMouseLeave={this._handleOnMouseLeave.bind(this)}
      >
        <span style={this.state.hover ? styles.textStyleHover : styles.textStyle}>
          {value}
        </span>
        { allowRemove ? this.renderRemoveButton(index) : null}
      </div>
    );
  }
}

Chip.defaultProps = {
  onRemoveClick: () => {},
  value: 'Chip',
  allowRemove: true,
};
