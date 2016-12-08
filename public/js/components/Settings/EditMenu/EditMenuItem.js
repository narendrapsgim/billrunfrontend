import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Col } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../../Field';


class EditMenuItem extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    path: PropTypes.array,
    idx: PropTypes.number,
    onChangeField: PropTypes.func,
  };

  state = {
    editTitleMode: false,
    editRoleMode: false,
    mouseOver: false,
  }

  componentDidUpdate(prevProps, prevState) {
    const { editRoleMode } = this.state;
    if (editRoleMode) {
      this.refs.selectRole.focus();
    }
  }

  onKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.finishEditing();
    } else if (event.keyCode === 27) {
      this.finishEditing();
    }
  }

  onChangeShowHide = (e) => {
    const { value } = e.target;
    const { path, idx } = this.props;
    this.props.onChangeField([...path, idx, 'show'], value);
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

  toggleEditTitle = (e) => {
    e.preventDefault();
    const { editTitleMode } = this.state;
    const isEditMode = !editTitleMode;
    this.setState({ editTitleMode: isEditMode });
  }

  toggleEditRole = (e) => {
    e.preventDefault();
    const { editRoleMode } = this.state;
    const isEditMode = !editRoleMode;
    this.setState({ editRoleMode: isEditMode });
  }

  finishEditing = () => {
    this.setState({ editTitleMode: false, editRoleMode: false });
  }

  renderInput = () => {
    const { editTitleMode } = this.state;
    const { item } = this.props;
    const value = item.get('title', '');

    if (editTitleMode) {
      return (
        <div style={{ display: 'inline-block' }}>
          <div style={{ display: 'inline-block' }}>
            <Field
              autoFocus
              onBlur={this.finishEditing}
              onChange={this.onChangeTitle}
              onKeyDown={this.fonKeyDown}
              value={value}
            />
          </div>
          <span style={{ verticalAlign: 'text-bottom', cursor: 'pointer', color: 'green' }}>&nbsp;<i className="fa fa-check fa-fw" onClick={this.toggleEditTitle} /></span>
        </div>
      );
    }
    return (<span style={{ cursor: 'pointer' }} onClick={this.toggleEditTitle}>{value}</span>);
  }

  renderRoleSelect = () => {
    const { editRoleMode } = this.state;
    const { item } = this.props;
    const roles = item.get('roles', []).join(',');
    const availableRoles = ['admin', 'read', 'write'].map(role => ({
      value: role,
      label: role,
    }));

    if (editRoleMode) {
      return (
        <div style={{ display: 'inline-block', width: '100%' }}>
          <div style={{ display: 'inline-block', width: '85%' }}>
            <Select
              autofocus
              ref="selectRole"
              multi={true}
              value={roles}
              options={availableRoles}
              onChange={this.onChangeRoles}
              onKeyDown={this.onKeyDown}
            />
          </div>
          <span style={{ verticalAlign: 'text-bottom', cursor: 'pointer', lineHeight: '39px', color: 'green' }}>&nbsp;<i className="fa fa-check fa-fw" onClick={this.toggleEditRole} /></span>
        </div>
      );
    } else if (roles.length === 0) {
      return (<small style={{ cursor: 'pointer' }} onClick={this.toggleEditRole}>Visible to all roles</small>);
    }
    return (<small style={{ cursor: 'pointer' }} onClick={this.toggleEditRole}>{roles}</small>);
  }

  rendermouseOver = (type) => {
    let onClick = () => {};
    switch (type) {
      case 'roles': onClick = this.toggleEditRole
        break;
      case 'title': onClick = this.toggleEditTitle
        break;
    }
    return <span>&nbsp;<i className="fa fa-pencil-square-o fa-fw" onClick={onClick} /></span>;
  }

  render() {
    const { item } = this.props;
    const { mouseOver, editRoleMode, editTitleMode } = this.state;
    const icon = item.get('icon', '');
    const show = item.get('show', false);

    return (
      <Col md={12} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>

        <Col md={6} style={{ color: '#008cba' }}>
          { icon.length > 0
            ? <span><i className={`fa ${icon} fa-fw`} />&nbsp;</span>
            : <span>&nbsp;</span>
          }
          { this.renderInput() }
          { mouseOver && !editTitleMode && this.rendermouseOver('title') }
        </Col>

        <Col md={4} className="text-right">
          { this.renderRoleSelect() }
          { mouseOver && !editRoleMode && this.rendermouseOver('roles') }
        </Col>

        <Col md={2} className="text-right">
          <Field onChange={this.onChangeShowHide} value={show} fieldType="checkbox" />
        </Col>
      </Col>
    );
  }
}

export default EditMenuItem;
