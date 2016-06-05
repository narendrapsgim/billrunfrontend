import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import FlatButton from 'material-ui/FlatButton';
import { updateFieldValue, newField, removeField } from '../../actions';

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

  crudActionButtons() {
    let { crud, path } = this.props;
    let onClickNew = (path) => {
      let type;
      if (this.props.fieldType) type = this.props.fieldType;
      else type = (path.match(/(\d])$/) ? "array" : "object");
      let new_path = path;
      if (type === "object") {
        let p = prompt("Please insert name");
        if (p != null && p.length > 0) {
          new_path += `.${p}`;
        } else {
          return;
        }
      }
      this.props.dispatch(newField(new_path, type, this.props.pageName));
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
      <CardActions expandable={true}>
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
          {this.crudActionButtons()}
        </Card>
      );
    }
  }
}
