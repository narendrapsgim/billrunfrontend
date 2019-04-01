import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

const SubMenu = (props) => {
  const { id, open, active, icon, title, children } = props;

  const onClick = (e) => {
    e.preventDefault();
    props.onClick(id);
  };

  const liClass = classNames('sub-menu', {
    open,
  });

  const aClass = classNames({
    active,
  });

  return (
    <li className={liClass}>
      <a href={`#id`} id={id} onClick={onClick} className={aClass}>
        <i className={icon} /><span>{title}</span>
        <span className="fa arrow" />
      </a>
      <ul className="nav nav-second-level">
        { children }
      </ul>
    </li>
  );
};

SubMenu.defaultProps = {
  children: null,
  id: '',
  title: '',
  icon: '',
  open: false,
  active: false,
  onClick: () => {},
};

SubMenu.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.string,
  open: PropTypes.bool,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};

export default connect()(SubMenu);
