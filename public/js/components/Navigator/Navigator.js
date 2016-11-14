import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link, withRouter} from 'react-router';
import {userDoLogout} from '../../actions/userActions';
import classNames from "classnames";
import { NavDropdown, Button } from "react-bootstrap";
/* Assets */
import LogoImg from 'img/billrun-logo-tm.png';
import MenuItem from './MenuItem';
import MenuItems from '../../MenuItems';
import SubMenu from './SubMenu';

class Navigator extends Component {
  constructor(props) {
    super(props);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onCollapseSidebar = this.onCollapseSidebar.bind(this);

    this.state = {
      showCollapseButton: false,
      showFullMenu: true,
      collapseSideBar: false,
      openSubMenu:'',
    };
  }

  componentWillMount() {
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize() {
    const small = window.innerWidth < 768;
    this.setState({showCollapseButton: small, showFullMenu: !small});
  }

  onToggleMenu() {
    const {showFullMenu} = this.state;
    this.setState({showFullMenu: !showFullMenu});
  }

  clickLogout = (e) => {
    e.preventDefault();
    this.props.userDoLogout().then(res => {
      this.props.router.push('/');
    });
  };

  onCollapseSidebar() {

    this.setState({collapseSideBar: !this.state.collapseSideBar});
  };

  onSetActive = (id) => {
    this.setState({activeMenuItem: id});
  };


  onToggleSubMenu = (id) => {

    this.setState({openSubMenu: this.state.openSubMenu !== id? id : ''});
  };

  render() {

    const { router } = this.props;

    let overallNavClassName = classNames({
      'navbar navbar-default navbar-fixed-top': true,
      'collapse-sizebar': this.state.collapseSideBar
    });

    const filterMenuFunc = (v) => {
      return v.show;
    };


    const renderMenu = (v, k) => {

      let openSubMenu = (this.state.openSubMenu === v.id) ||
                              (v.subMenus &&
                               v.subMenus.filter(subMenu => router.isActive(subMenu.route)).length > 0);

      return v.subMenus ?

          (<SubMenu id={ v.id } key={k}
                    title={ v.title }
                    icon={ `fa ${v.icon} fa-fw` }
                    open={openSubMenu}
                    onClick={this.onToggleSubMenu}
          >
            { v.subMenus.filter(filterMenuFunc).map(renderMenu) }
          </SubMenu>)
          :
          (<MenuItem id={ v.id } key={k}
                       route={ v.route }
                       title={ v.title }
                       icon={ `fa ${v.icon} fa-fw` }
                       active={ router.isActive(v.route) }
                       onSetActive={this.onSetActive}
         />);
    };


    return (
        <nav className={overallNavClassName} id="top-nav" role="navigation">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">
              <img src={LogoImg} style={{height: 22}}/>
            </Link>
            <Button bsSize="xsmall" id="btn-collapse-menu" onClick={this.onCollapseSidebar}>
              <i className="fa fa-chevron-left" />
              <i className="fa fa-chevron-left" />
            </Button>
          </div>

          <ul className="nav navbar-top-links navbar-right">
            <NavDropdown id="nav-user-menu" title={<i className="fa fa-user fa-fw"></i>}>
              <MenuItem eventKey="4" onClick={this.clickLogout}>
                <i className="fa fa-sign-out fa-fw"></i> Logout
              </MenuItem>
            </NavDropdown>
          </ul>
          <div className="navbar-default sidebar" role="navigation">
            <div className="sidebar-nav navbar-collapse">

              <ul className="nav in" id="side-menu">
                { MenuItems.filter(filterMenuFunc).map(renderMenu) }
              </ul>
            </div>
          </div>
        </nav>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    userDoLogout
  }, dispatch);
}
export default withRouter(connect(null, mapDispatchToProps)(Navigator));
