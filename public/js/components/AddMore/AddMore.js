import React, {Component} from 'react';
import Nodes from './Nodes';
import BtnAdd from './BtnAdd';

export default class AddMore extends React.Component {

  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.state = {
      nodes: [ { item: this.props.item, id: 0 } ],
      count: 0,
    };
  }

  removeItem(index) {
    this.setState({
      nodes: this.state.nodes.filter((node, nodeIndex) => index !== nodeIndex)
    }, () => {
      if(typeof this.props.removeItem === 'function')(
        this.props.removeItem(index)
      )
    });
  }

  addItem() {
    let newNode = {
      item: this.props.item,
      id: ++this.state.count,
    };
    this.setState({
      nodes: [...this.state.nodes, newNode],
      count: this.state.count++,
    });
  }

  render() {
    return (
      <div>
        <Nodes content={this.state.nodes} onRemoveClick={this.removeItem}/>
        <BtnAdd onAddClick={this.addItem}/>
      </div>
    );
  }

}
