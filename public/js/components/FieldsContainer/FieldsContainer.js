import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

const style = {
  card : {
    margin: "10px auto 10px 15px"
  }
}

export default class FieldsContainer extends Component {
  constructor(props) {
    super(props);
    this.handleExpandChange = this.handleExpandChange.bind(this);
    this.state = {
      expanded: (typeof props.expanded !== 'undefined') ? !props.expanded : true,
    };
  }

  handleExpandChange(expanded) {
    this.setState({expanded: expanded});
  };
  render() {
    if(!this.props.collapsible){
      return (
        <Card className={"col-md-" + (this.props.size || 10)} style={style.card} key={"block_collapsible_" + this.props.index}>
          <CardHeader title={this.props.label}/>
          <CardText expandable={false} children={this.props.content}/>
        </Card>
      );
    } else {
      return (
        <Card
          className={"col-md-" + (this.props.size || 10)}
          style={style.card}
          expanded={this.state.expanded}
          onExpandChange={this.handleExpandChange}
        >
          <CardHeader title={this.props.label} actAsExpander={true} showExpandableButton={true}/>
          <CardText expandable={true} children={this.props.content}/>
        </Card>
      );
    }
  }
}
