import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import Immutable from 'immutable';
import classNames from 'classnames';
import { NavDropdown, Button, MenuItem as BootstrapMenuItem } from 'react-bootstrap';
import { userDoLogout } from '../../actions/userActions';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
/* Assets */
import LogoImg from 'img/billrun-logo-tm.png';

class Navigator extends Component {

  static defaultProps = {
    companyNeme: '',
    userName: '',
    menuItems: Immutable.List(),
    userRoles: [],
  };

  static propTypes = {
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    menuItems: PropTypes.instanceOf(Immutable.Iterable),
    userDoLogout: PropTypes.func.isRequired,
    companyNeme: PropTypes.string,
    userName: PropTypes.string,
    userRoles: PropTypes.array,
  };

  state = {
    showCollapseButton: false,
    showFullMenu: true,
    collapseSideBar: false,
    openSubMenu: [],
  };

  componentWillMount() {
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize);
  }

  componentDidMount() {
    const { router, menuItems } = this.props;
    const { openSubMenu } = this.state;
    menuItems
      .filter(this.filterEnabledMenu)
      .filter(this.filterPermission)
      .forEach((item) => {
        if (item.get('subMenus', Immutable.List()).filter(subMenu => router.isActive(subMenu.route)).length > 0) {
          this.setState({ openSubMenu: [...openSubMenu, item.get('id')] });
        }
      });
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
    const { openSubMenu } = this.state;
    const toggleSubMenu = openSubMenu.includes(id) ? openSubMenu.filter(item => item != id) : [...openSubMenu, id];
    this.setState({ openSubMenu: toggleSubMenu, collapseSideBar: false });
  };

  clickLogout = (e) => {
    e.preventDefault();
    this.props.userDoLogout().then((res) => {
      this.props.router.push('/');
    });
  };

  filterEnabledMenu = menu => menu.get('show', false);

  filterPermission = (menu) => {
    const { userRoles } = this.props;
    const menuRoles = menu.get('roles', Immutable.List());
    // If menu doesn't limitation to role, return true
    if (menuRoles.size === 0) {
      return true;
    }
    // If user is Admin, return true
    if (userRoles.includes('admin')) {
      return true;
    }
    return menuRoles.toSet().intersect(userRoles).size > 0;
  }

  renderSubMenu = (item, key) => {
    const { openSubMenu } = this.state;
    const id = item.get('id', '');
    const icon = item.get('icon', '');
    const title = item.get('title', '');
    const subMenus = item.get('subMenus', Immutable.List());
    return (
      <SubMenu
        icon={`fa ${icon} fa-fw`}
        id={id}
        key={key}
        onClick={this.onToggleSubMenu}
        open={openSubMenu.includes(id)}
        title={title}
      >
        { subMenus
            .filter(this.filterEnabledMenu)
            .filter(this.filterPermission)
            .map(this.renderMenu)
        }
      </SubMenu>
    );
  }

  renderMenu = (menuItem, key) => (
    menuItem.get('subMenus') ? this.renderSubMenu(menuItem, key) : this.renderMenuItem(menuItem, key)
  );

  renderMenuItem = (item, key) => {
    const { router } = this.props;
    const id = item.get('id', '');
    const icon = item.get('icon', '');
    const title = item.get('title', '');
    const route = item.get('route', '');
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
    const { userName, companyNeme, menuItems } = this.props;
    const overallNavClassName = classNames({
      'navbar navbar-default navbar-fixed-top': true,
      'collapse-sizebar': collapseSideBar,
    });

    return (
      <nav className={overallNavClassName} id="top-nav" role="navigation">
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">
            <img src={LogoImg} style={{ height: 22 }} alt="Logo" />
            <span className="brand-name">{ companyNeme }</span>
          </Link>
          <Button bsSize="xsmall" id="btn-collapse-menu" onClick={this.onCollapseSidebar}>
            <i className="fa fa-chevron-left" />
            <i className="fa fa-chevron-left" />
          </Button>
        </div>

        <ul className="nav navbar-top-links navbar-right">
          <NavDropdown id="nav-user-menu" title={<span><i className="fa fa-user fa-fw" />{ userName }</span>}>
            <BootstrapMenuItem eventKey="4" onClick={this.clickLogout}>
              <i className="fa fa-sign-out fa-fw" /> Logout
              </BootstrapMenuItem>
          </NavDropdown>
        </ul>
        <div className="navbar-default sidebar" role="navigation">
          <div className="sidebar-nav navbar-collapse">

            <ul className="nav in" id="side-menu">
              { menuItems
                  .filter(this.filterEnabledMenu)
                  .filter(this.filterPermission)
                  .map(this.renderMenu)
              }
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
const mapStateToProps = state => ({
  companyNeme: state.settings.get('tenant', Immutable.Map()).get('name'),
  userName: state.user.get('name'),
  menuItems: state.settings.getIn(['menu', 'main'], Immutable.List()),
  userRoles: state.user.get('roles'),
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigator));
