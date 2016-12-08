import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Grid, Col } from 'react-bootstrap';
import SortableMenuItem from './EditMenu/SortableMenuItem';
import SortableMenuList from './EditMenu/SortableMenuList';


export default class EditMenu extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    data: PropTypes.instanceOf(Immutable.Iterable),
  };

  onChangeField = (path, value) => {
    this.props.onChange('menu', ['main', ...path], value);
  }

  onDragEnd = ({ oldIndex, newIndex, collection }) => {
    const { data } = this.props;
    const path = (collection === '') ? [] : collection.split('-');
    const pathFrom = [...path, oldIndex];
    const sortedMenuItem = data.getIn(pathFrom);
    const newOrder = data
      .deleteIn(pathFrom)
      .updateIn([...path], Immutable.List(), list => list.insert(newIndex, sortedMenuItem));
    this.onChangeField([], newOrder);
  };

  renderMenu = (item, index, path) => {
    const subMenus = item.get('subMenus', Immutable.List());
    const newPath = [...path, index];
    const collection = path.join('-');
    return (
      <SortableMenuItem
        collection={collection}
        idx={index}
        index={index}
        item={item}
        key={newPath.join('-')}
        newPath={newPath}
        onChangeField={this.onChangeField}
        path={path}
        renderTree={this.renderTree}
        subMenus={subMenus}
      />
    );
  }

  renderTree = (tree, path) => (
    <SortableMenuList
      items={tree}
      key={path.join('-')}
      onSortEnd={this.onDragEnd}
      path={path}
      useDragHandle={true}
      renderMenu={this.renderMenu}
    />
  )


  render() {
    const { data } = this.props;
    return (
      <div>
        <Col md={1} className="text-left">&nbsp;</Col>
        <Col md={5} className="text-left">&nbsp;</Col>
        <Col md={4} className="text-right">Roles</Col>
        <Col md={2} className="text-right">Show/Hide</Col>
        <Grid bsClass="wrapper">
          { this.renderTree(data, []) }
        </Grid>
      </div>
    );
  }
}
