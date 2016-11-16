import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link, withRouter} from 'react-router';
import classNames from "classnames";
import { NavDropdown, Button } from "react-bootstrap";

const SubMenu = (props) =>{
    const { id, open, icon, title, children} = props;

    const onClick = (e) => {
        e.preventDefault();
        props.onClick(id);
    };


    return  (
        <li className={open?"open" :""}>
            <a href  id={id} onClick={onClick}>
                <i className={icon} /><span>{title}</span>
                <span className="fa arrow"></span>
            </a>
            {/*<ul className={classNames({'nav nav-second-level': true, 'collapse': this.state.uiOpenSetting})}>*/}
            <ul className="nav nav-second-level">
                { children}
            </ul>
        </li>
    );
};

export default connect()(SubMenu);