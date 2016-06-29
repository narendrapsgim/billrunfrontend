import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import FlatButton from 'material-ui/FlatButton';
import { updateFieldValue, newField, removeField } from '../../actions';

const style = {
  card : { margin: "10px 0" },
  cardTextCollapsed: {display:'none'},
  cardTextExpanded: {display:'block'}
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
    let {content, label, index} = this.props;

    if(typeof this.props.collapsible === 'undefined'){
      return (
        <div key={"block_collapsible_" + this.props.index} style={{marginBottom: "15px"}}>
          {label.length > 0 && <h4>{label}</h4>}
          <div>
            {content}
            {this.crudActionButtons()}
          </div>
        </div>
      );
    }
    else if(!this.props.collapsible){
      return (
        <Card style={style.card} key={"block_collapsible_" + this.props.index}>
          {label.length > 0 && <CardHeader title={label}/>}
          <CardText expandable={false} children={content}/>
          {this.crudActionButtons()}
        </Card>
      );
    } else if(this.props.collapsibleTyle === 'css'){
        return (
          <Card style={style.card} onExpandChange={this.handleExpandChange} initiallyExpanded={this.state.expanded}>
            <CardHeader title={label} actAsExpander={true} showExpandableButton={true} />
            <CardText style={this.state.expanded ? style.cardTextExpanded : style.cardTextCollapsed} children={content}/>
            {this.crudActionButtons()}
          </Card>
    );
    } else {
      return (
        <Card style={style.card} expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
          <CardHeader title={label} actAsExpander={true} showExpandableButton={true} />
          <CardText expandable={true} children={content}/>
          {this.crudActionButtons()}
        </Card>
      );
    }
  }
}
