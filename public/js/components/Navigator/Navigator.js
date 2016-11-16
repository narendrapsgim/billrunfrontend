import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import classNames from 'classnames';
import { NavDropdown, Button, MenuItem as BootstrapMenuItem } from 'react-bootstrap';
import { userDoLogout } from '../../actions/userActions';
/* Assets */
import LogoImg from 'img/billrun-logo-tm.png';
import MenuItem from './MenuItem';
import MenuItems from '../../MenuItems';
import SubMenu from './SubMenu';

class Navigator extends Component {

  static propTypes = {
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired,
    }).isRequired,
    userDoLogout: React.PropTypes.func.isRequired,
  };

  state = {
    showCollapseButton: false,
    showFullMenu: true,
    collapseSideBar: false,
    openSubMenu: [],
  };

  componentDidMount(){
    const { router } = this.props;
    const {openSubMenu} = this.state;
    MenuItems.filter(this.filterEnabledMenu).map((item,key) => {
      if (item.subMenus && item.subMenus.filter(subMenu => router.isActive(subMenu.route)).length > 0){
        openSubMenu.push(item.id);
        this.setState({openSubMenu: openSubMenu});
      }
    });
  }

  componentWillMount() {
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => {
    const small = window.innerWidth < 768;
    this.setState({ showCollapseButton: small, showFullMenu: !small });
  }

  onToggleMenu = () => {
    const { showFullMenu } = this.state;
    this.setState({ showFullMenu: !showFullMenu });
  }

  onCollapseSidebar = () => {
    this.setState({ collapseSideBar: !this.state.collapseSideBar });
  }

  onSetActive = (id) => {
    this.setState({ activeMenuItem: id });
  };


  onToggleSubMenu = (id) => {
    const {openSubMenu, collapseSideBar} = this.state;
    const toggleSubMenu =  openSubMenu.includes(id)? openSubMenu.filter(item => item!= id):[...openSubMenu,id];
    this.setState({ openSubMenu: toggleSubMenu, collapseSideBar:false});
  };

  clickLogout = (e) => {
    e.preventDefault();
    this.props.userDoLogout().then((res) => {
      this.props.router.push('/');
    });
  };

  filterEnabledMenu = menu => menu.show;

  renderSubMenu = (item, key) => {
    const { id, icon, title } = item;
    const {openSubMenu} = this.state;
    return (
      <SubMenu
        icon={`fa ${icon} fa-fw`}
        id={id}
        key={key}
        onClick={this.onToggleSubMenu}
        open={openSubMenu.includes(item.id)}
        title={title}
      >
        { item.subMenus.filter(this.filterEnabledMenu).map(this.renderMenu) }
      </SubMenu>
    );
  }

  renderMenu = (menuItem, key) => (
    menuItem.subMenus ? this.renderSubMenu(menuItem, key) : this.renderMenuItem(menuItem, key)
  );

  renderMenuItem = (item, key) => {
    const { router } = this.props;
    const { id, route, icon, title } = item;
    return (
      <MenuItem
        active={router.isActive(route)}
        icon={`fa ${icon} fa-fw`}
        id={id}
        key={key}
        onSetActive={this.onSetActive}
        route={route}
        title={title}
      />
    );
  }

  render() {
    const { collapseSideBar } = this.state;
    const overallNavClassName = classNames({
      'navbar navbar-default navbar-fixed-top': true,
      'collapse-sizebar': collapseSideBar,
    });

    return (
      <nav className={overallNavClassName} id="top-nav" role="navigation">
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">
            <img src={LogoImg} style={{ height: 22 }} alt="Logo" />
          </Link>
          <Button bsSize="xsmall" id="btn-collapse-menu" onClick={this.onCollapseSidebar}>
            <i className="fa fa-chevron-left" />
            <i className="fa fa-chevron-left" />
          </Button>
        </div>

        <ul className="nav navbar-top-links navbar-right">
          <NavDropdown id="nav-user-menu" title={<i className="fa fa-user fa-fw" />}>
            <BootstrapMenuItem eventKey="4" onClick={this.clickLogout}>
              <i className="fa fa-sign-out fa-fw" /> Logout
              </BootstrapMenuItem>
          </NavDropdown>
        </ul>
        <div className="navbar-default sidebar" role="navigation">
          <div className="sidebar-nav navbar-collapse">

            <ul className="nav in" id="side-menu">
              { MenuItems.filter(this.filterEnabledMenu).map(this.renderMenu) }
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapDispatchToProps = {
  userDoLogout,
};
export default withRouter(connect(null, mapDispatchToProps)(Navigator));
