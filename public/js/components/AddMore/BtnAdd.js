import React, {Component} from 'react';
import IconAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export default class BtnAdd extends React.Component {

  constructor(props) {
    super(props);
    this.styles = {
      btnAdd: {
        textAlign: 'center'
      },
      btnAddWrapper: {
        textAlign: 'right',
        margin: '10px 5px'
      },
    };
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    this.props.onAddClick();
  }

  render() {
    return (
      <div style={this.styles.btnAddWrapper}>
        <FloatingActionButton mini={true} style={this.styles.addBtn} onClick={this.handleOnClick}>
          <IconAdd/>
        </FloatingActionButton>
      </div>
    );
  }
  
}
