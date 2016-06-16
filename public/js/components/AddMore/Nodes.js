import React, {Component} from 'react';
import Node from './Node';

export default class Nodes extends React.Component {

  constructor(props) {
    super(props);
    this.style = {
      listStyle: 'none',
      margin: 0,
      padding: 0
    };
    this.renderNodes = this.renderNodes.bind(this);
    this.renderNode = this.renderNode.bind(this);
  }

  renderNode(node, index) {
    return (<Node key={node.id} item={node.item} onRemoveClick={this.props.onRemoveClick} index={index}/>);
  }

  renderNodes() {
    return this.props.content.map((node, index) => this.renderNode(node, index));
  }

  render() {
    return (
      <ul style={this.style}>
        {this.renderNodes()}
      </ul>
    );
  }

}
