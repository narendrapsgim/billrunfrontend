import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import FlatButton from 'material-ui/FlatButton';
import activeComponent from 'react-router-active-component';

import SettingsInputComponent from 'material-ui/svg-icons/action/settings-input-component';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import Layers from 'material-ui/svg-icons/maps/layers';
import Receipt from 'material-ui/svg-icons/action/receipt';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import View from '../../views';

let routes = [
  {to: "plans", label: "Plans"},
  {to: "plan_setup", label: "Plan Setup"},
  {to: "products", label: "Products"}
];

export default class Navigator extends Component {
  constructor(props) {
    super(props);
  }

  isMenuItemVisible(neddedPpermission) {
    return  _.intersection(neddedPpermission, this.props.users.roles).length > 0;
  }

  render() {

    // let buttons = Object.keys(View.pages).map((page, key) => {
    //     let label = View.pages[page].menu_title || View.pages[page].title;
    //     let route = View.pages[page].route ? View.pages[page].route : page;
    //     if(this.isMenuItemVisible( View.pages[page].permission , label)){
    //         return (
    //             <Link key={key} to={route} activeClassName='active'>
    //               <FlatButton label={label} labelStyle={{textTransform: "none"}}/>
    //             </Link>
    //         )
    //     } else {
    //       return null;
    //     }
    //   });

    let buttons = routes.map((route, key) => (
      <Link to={route.to} key={key} activeClassName='active'>
        <FlatButton label={route.label} labelStyle={{textTransform: "none"}} />
      </Link>
    ));

    return (
      <div className="navigator">
        {buttons}
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    users: state.users,
    pages: state.pages
  };
}

export default connect(mapStateToProps)(Navigator);
