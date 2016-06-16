import React, {Component} from 'react';
import IconRemove from 'material-ui/svg-icons/content/remove';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export default class BtnRemove extends React.Component {

  constructor(props) {
    super(props);
    this.style = {
      verticalAlign: 'middle'
    };
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    this.props.onRemoveClick(this.props.index);
  }

  render() {
    return (
      <FloatingActionButton mini={true} style={this.style} onClick={this.handleOnClick} secondary={true}>
        <IconRemove/>
      </FloatingActionButton>
    );
  }
  
}
