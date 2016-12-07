import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Grid, Col } from 'react-bootstrap';
import EditMenuItem from './EditMenu/EditMenuItem';


export default class EditMenu extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    data: PropTypes.instanceOf(Immutable.Iterable),
  };

  onChangeField = (path, value) => {
    this.props.onChange('menu', ['main', ...path], value);
  }

  renderMenu = (item, index, path) => {
    const subMenus = item.get('subMenus', Immutable.List());
    const newPath = [...path, index];
    return (
      <div key={newPath.join('-')} >
        <EditMenuItem item={item} index={index} path={path} onChangeField={this.onChangeField} />
        <Col lg={12} md={12} className="pr0"><hr style={{ margin: '10px 0' }} /></Col>
        {subMenus.size > 0 && this.renderTree(subMenus, [...newPath, 'subMenus'])}
      </div>
    );
  }

  renderTree = (tree, path) => (
    <Col lg={12} md={12} className="pr0">
      {tree.map((item, index) => this.renderMenu(item, index, path))}
    </Col>
  );

  render() {
    const { data } = this.props;
    return (
      <div>
        <Col lg={1} md={1} className="text-left">&nbsp;</Col>
        <Col lg={5} md={5} className="text-left">Menu</Col>
        <Col lg={4} md={4} className="text-left">Roles</Col>
        <Col lg={2} md={2} className="text-left">Show/Hide</Col>
        <Col lg={12} md={12} className="pr0"><hr /></Col>
        <Grid bsClass="wrapper">
          { this.renderTree(data, []) }
        </Grid>
      </div>
    );
  }
}
