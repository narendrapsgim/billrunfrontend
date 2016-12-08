import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Col, Form, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../../Field';
import EditMenuItemsDetails from './EditMenuItemsDetails';


class EditMenuItem extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    path: PropTypes.array,
    idx: PropTypes.number,
    onChangeField: PropTypes.func,
    onChangeShowHide: PropTypes.func,
  };

  state = {
    editMode: false,
    mouseOver: false,
  }

  onChangeShowHide = (e) => {
    const { value } = e.target;
    const { path, idx } = this.props;
    this.props.onChangeShowHide([...path, idx], value);
  }

  onChangeTitle = (e) => {
    const { value } = e.target;
    const { path, idx } = this.props;
    this.props.onChangeField([...path, idx, 'title'], value);
  }

  onChangeRoles = (roles) => {
    const { path, idx } = this.props;
    const rolesList = (roles.length) ? roles.split(',') : [];
    this.props.onChangeField([...path, idx, 'roles'], rolesList);
  }

  onMouseEnter = (e) => {
    this.setState({ mouseOver: true });
  }

  onMouseLeave = (e) => {
    this.setState({ mouseOver: false });
  }

  toggleEdit = (e) => {
    e.preventDefault();
    const { editMode } = this.state;
    const isEditMode = !editMode;
    this.setState({ editMode: isEditMode });
  }

  renderEditModal = () => {
    const { editMode } = this.state;
    const { item } = this.props;
    const title = item.get('title', '');
    const roles = item.get('roles', []).join(',');
    const availableRoles = ['admin', 'read', 'write'].map(role => ({
      value: role,
      label: role,
    }));

    return (
      <EditMenuItemsDetails show={editMode} onOk={this.toggleEdit} title="Edit Menu details">
        <Form horizontal>
          <FormGroup>
            <Col sm={2} componentClass={ControlLabel}>Label</Col>
            <Col sm={10}>
              <Field autoFocus onChange={this.onChangeTitle} value={title} />
            </Col>
          </FormGroup>

          <FormGroup >
            <Col sm={2} componentClass={ControlLabel}>Roles</Col>
            <Col sm={10}>
              <Select multi={true} value={roles} options={availableRoles} onChange={this.onChangeRoles} />
            </Col>
          </FormGroup>
        </Form>
      </EditMenuItemsDetails>
    )
  }

  renderRole = () => {
    const { item } = this.props;
    const roles = item.get('roles', []).join(',');
    if (roles.length === 0) {
      return (<small>Visible to all roles</small>);
    }
    return (<small>{roles}</small>);
  }

  renderTitle = () => {
    const { item } = this.props;
    const title = item.get('title', '');
    const icon = item.get('icon', '');
    const menuIcon = icon.length ? (<i className={`fa ${icon} fa-fw`} />) : (null);
    return (<span>{menuIcon} {title}</span>);
  }

  renderMouseOver = () => <span>&nbsp;<i className="fa fa-pencil-square-o fa-fw" /></span>;

  render() {
    const { item } = this.props;
    const { mouseOver, editMode } = this.state;
    const show = item.get('show', false);

    return (
      <Col md={12} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>

        <Col md={6} style={{ color: '#008cba', cursor: 'pointer' }} onClick={this.toggleEdit}>
          { this.renderTitle() }
          { mouseOver && !editMode && this.renderMouseOver() }
        </Col>

        <Col md={4} className="text-right" style={{ cursor: 'pointer' }} onClick={this.toggleEdit}>
          { this.renderRole() }
          { mouseOver && !editMode && this.renderMouseOver() }
        </Col>

        <Col md={2} className="text-right">
          <Field onChange={this.onChangeShowHide} value={show} fieldType="checkbox" />
        </Col>

        {this.renderEditModal()}
      </Col>
    );
  }
}

export default EditMenuItem;
