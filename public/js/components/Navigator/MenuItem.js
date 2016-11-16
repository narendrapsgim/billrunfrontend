import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link, withRouter} from 'react-router';
import classNames from "classnames";
import { NavDropdown, Button } from "react-bootstrap";

const MenuItem = (props) =>{
    const { route, id, active, icon, title, onSetActive } = props;

    const setActive = () => {
        onSetActive(id)
    };

    return  (
        <li>
            <Link to={'/' + route}
                  id={id}
                  className={(active) ? "active" : ""}
                  onClick={setActive}>
                <i className={icon} /><span>{ title }</span>
            </Link>
        </li>
    );
};

export default connect()(MenuItem);