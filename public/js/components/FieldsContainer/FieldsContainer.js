import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import FlatButton from 'material-ui/FlatButton';
import { updateFieldValue, removeField } from '../../actions';

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
  
  crudActionButtons(crud, path, expandable) {
    let onClickNew = (path) => {
      let p = prompt("Please insert new type");
      this.props.dispatch(updateFieldValue(`${path}.${p}`, {}, this.props.pageName));
    };
    let onClickRemove = (path) => {
      let c = confirm("Are you sure you want to delete?");
      if (c) {
        this.props.dispatch(removeField(path, this.props.pageName));
      }
    };

    let addButton = (crud && crud[0] === '1') ? (
      <FloatingActionButton mini={true} onClick={onClickNew.bind(this, path)}>
        <ContentAdd />
      </FloatingActionButton>
    ) : (null);
    let removeButton = (crud && crud[3] === '1') ? (
      <FloatingActionButton mini={true} secondary={true} onClick={onClickRemove.bind(this, path)}>
        <ContentRemove />
      </FloatingActionButton>
    ) : (null);
    let crudActionBtns = crud ? (
      <CardActions expandable={expandable}>
        {addButton}
        {removeButton}
      </CardActions>
    ) : (null);
    return crudActionBtns;
  }

  render() {
    if(!this.props.collapsible){
      return (
        <Card style={style.card} key={"block_collapsible_" + this.props.index}>
          <CardHeader title={this.props.label}/>
          <CardText expandable={false} children={this.props.content}/>
        </Card>
      );
    } else {
      return (
        <Card
            style={style.card}
            expanded={this.state.expanded}
            onExpandChange={this.handleExpandChange}
        >
          <CardHeader title={this.props.label} actAsExpander={true} showExpandableButton={true} />
          <CardText expandable={true} children={this.props.content}/>
          {this.crudActionButtons(this.props.crud, this.props.path, this.props.collapsible)}
        </Card>
      );
    }
  }
}
