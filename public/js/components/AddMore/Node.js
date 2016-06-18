import React, {Component} from 'react';
import BtnRemove from './BtnRemove';

export default class Node extends React.Component {

  constructor(props) {
    super(props);
    this.styles = {
      itemWrapper: {
        display: 'table-cell'
      },
      childWrapper: {
        display: 'table',
        width: '100%',
      }
    };
  }

  render() {
    let { item, index } = this.props;
    item = React.cloneElement(item, {index:index});
    return (
      <li style={this.styles.childWrapper}>
        <div style={this.styles.itemWrapper}>
          {item}
        </div>
        <BtnRemove onRemoveClick={this.props.onRemoveClick} index={index}/>
      </li>
    );
  }

}
