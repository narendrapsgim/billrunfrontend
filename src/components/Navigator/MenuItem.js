import React from 'react';
import { Link } from 'react-router';


const MenuItem = ({ route, id, active, icon, title, onSetActive }) =>{
  const setActive = () => {
    onSetActive(id)
  };
  return (
    <li>
      <Link to={`/${route}`}
        id={id}
        className={(active) ? "active" : ""}
        onClick={setActive}
      >
      <i className={icon} /><span>{ title }</span>
      </Link>
    </li>
  );
};

export default MenuItem;
