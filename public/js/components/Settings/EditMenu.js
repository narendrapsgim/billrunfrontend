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

  onChangeShowHide = (path, value) => {
    const { data } = this.props;
    if (value === false && data.getIn(path).has('subMenus')) {
      data.getIn([...path, 'subMenus']).forEach((menu, idx) => {
        this.props.onChange('menu', ['main', ...path, 'subMenus', idx, 'show'], value);
      });
    }
    this.props.onChange('menu', ['main', ...path, 'show'], value);
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
        onChangeShowHide={this.onChangeShowHide}
        path={path}
        renderTree={this.renderTree}
        subMenus={subMenus}
      />
    );
  }

  renderTree = (tree, path) => (
    <SortableMenuList
      axis="y"
      helperClass="draggable-menu"
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
        <Col md={6} className="text-left">Main Menu</Col>
        <Col md={4} className="text-right">Roles</Col>
        <Col md={2} className="text-right">Show/Hide</Col>
        <Grid bsClass="wrapper" style={{ paddingTop: 35 }}>
          { this.renderTree(data, []) }
        </Grid>
      </div>
    );
  }
}
