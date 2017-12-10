import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import Immutable from 'immutable';
import classNames from 'classnames';
import { NavDropdown, Button, MenuItem as BootstrapMenuItem } from 'react-bootstrap';
import { toggleSideBar } from '../../actions/guiStateActions/menuActions';
import { userDoLogout } from '../../actions/userActions';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import { OnBoardingNavigation } from '../OnBoarding';


class Navigator extends Component {

  static defaultProps = {
    companyNeme: '',
    userName: '',
    menuItems: Immutable.List(),
    userRoles: [],
    collapseSideBar: false,
    routes: [],
  };

  static propTypes = {
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    routes: PropTypes.array,
    menuItems: PropTypes.instanceOf(Immutable.Iterable),
    companyNeme: PropTypes.string,
    logo: PropTypes.string.isRequired,
    userName: PropTypes.string,
    userRoles: PropTypes.array,
    collapseSideBar: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    showCollapseButton: false,
    openSmallMenu: false,
    openSubMenu: [],
  };

  componentWillMount() {
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize);
  }

  componentDidMount() {
    this.setOpenMenusItems();
  }

  componentDidUpdate(prevProps) {
    const { routes, collapseSideBar } = this.props;
    const oldpath = prevProps.routes[prevProps.routes.length - 1].path;
    const newpath = routes[routes.length - 1].path;
    if (!collapseSideBar && oldpath !== newpath) {
      this.setOpenMenusItems();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  setOpenMenusItems = () => {
    const { router, menuItems } = this.props;
    const { openSubMenu } = this.state;
    menuItems
      .filter(this.filterEnabledMenu)
      .filter(this.filterPermission)
      .forEach((item) => {
        if (item.get('subMenus', Immutable.List()).filter(subMenu => router.isActive(subMenu.get('route', ''))).size > 0) {
          this.setState({ openSubMenu: [...openSubMenu, item.get('id')] });
        }
      });
  }

  onWindowResize = () => {
    const small = window.innerWidth < 768;
    if (this.state.showCollapseButton !== small) {
      this.setState({
        showCollapseButton: small,
        openSmallMenu: !small,
      });
    }
  }

  onCollapseSidebar = () => {
    this.props.dispatch(toggleSideBar());
  }

  onSetActive = () => {
    this.setState({ openSmallMenu: false });
  };

  onToggleSubMenu = (id) => {
    const { openSubMenu } = this.state;
    const toggleSubMenu = openSubMenu.includes(id)
      ? openSubMenu.filter(item => item !== id)
      : [...openSubMenu, id];
    this.setState({ openSubMenu: toggleSubMenu });
    this.props.dispatch(toggleSideBar(false));
  };

  toggleSmallMenu = () => {
    this.setState({ openSmallMenu: !this.state.openSmallMenu });
  }

  resetMenuActive = () => {
    this.onSetActive('');
  }

  clickLogout = (e) => {
    e.preventDefault();
    this.props.dispatch(userDoLogout()).then(() => {
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
    const { router } = this.props;
    const { openSubMenu } = this.state;
    const id = item.get('id', '');
    const icon = item.get('icon', '');
    const title = item.get('title', '');
    const subMenus = item
      .get('subMenus', Immutable.List())
      .filter(this.filterEnabledMenu)
      .filter(this.filterPermission);
    const isSubmenuActive = subMenus.reduce((acc, subMenu) => (acc || router.isActive(subMenu.get('route', ''))), false);
    return (
      <SubMenu
        active={isSubmenuActive}
        icon={`fa ${icon} fa-fw`}
        id={id}
        key={key}
        onClick={this.onToggleSubMenu}
        open={openSubMenu.includes(id)}
        title={title}
      >
        {subMenus.map(this.renderMenu)}
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
    const { showCollapseButton, openSmallMenu } = this.state;
    const { userName, companyNeme, menuItems, logo, collapseSideBar, router } = this.props;
    const overallNavClassName = classNames('navbar', 'navbar-default', 'navbar-fixed-top', {
      'collapse-sizebar': collapseSideBar,
      'small-screen-menu': showCollapseButton,
    });
    const mainNavClassName = classNames('navbar-default', 'sidebar', 'main-menu', 'scrollbox', {
      'small-screen-menu': showCollapseButton && openSmallMenu,
    });

    const topNavClassName = classNames('nav', 'navbar-top-links', 'navbar-right', {
      'small-screen-menu': showCollapseButton,
    });
    return (
      <nav className={overallNavClassName} id="top-nav" role="navigation">

        { showCollapseButton &&
          <button
            type="button"
            className="navbar-toggle"
            onClick={this.toggleSmallMenu}
            style={{ position: 'absolute', right: 0, top: 0 }}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
        }

        <div className="navbar-header">
          <Link to="/" className="navbar-brand" onClick={this.resetMenuActive}>
            <img src={logo} style={{ height: 22 }} alt="Logo" />
            <span className="brand-name">{ companyNeme }</span>
          </Link>
          { !showCollapseButton &&
            <Button bsSize="xsmall" id="btn-collapse-menu" onClick={this.onCollapseSidebar}>
              <i className="fa fa-chevron-left" />
              <i className="fa fa-chevron-left" />
            </Button>
          }
        </div>

        <ul className={topNavClassName}>
          <OnBoardingNavigation eventKeyBase={2} />
          <NavDropdown id="nav-user-menu" eventKey={1} title={<span><i className="fa fa-user fa-fw" />{ userName }</span>}>
            <BootstrapMenuItem eventKey={1.1} href="#about" active={router.isActive('about')}>
              <i className="fa fa-question-circle fa-fw" /> About
            </BootstrapMenuItem>
            <BootstrapMenuItem eventKey={1.2} onClick={this.clickLogout}>
              <i className="fa fa-sign-out fa-fw" /> Logout
            </BootstrapMenuItem>
          </NavDropdown>
        </ul>

        { (!showCollapseButton || (showCollapseButton && openSmallMenu)) &&
        <div className={mainNavClassName} role="navigation">
          <div className="sidebar-nav">

            <ul className="nav in" id="side-menu">
              { menuItems
                  .filter(this.filterEnabledMenu)
                  .filter(this.filterPermission)
                  .map(this.renderMenu)
              }
            </ul>
          </div>
        </div>
      }
      </nav>
    );
  }
}


const mapStateToProps = state => ({
  companyNeme: state.settings.get('tenant', Immutable.Map()).get('name'),
  userName: state.user.get('name') || undefined,
  menuItems: state.guiState.menu.get('main') || undefined,
  collapseSideBar: state.guiState.menu.get('collapseSideBar') || undefined,
  userRoles: state.user.get('roles') || undefined,
  logo: state.settings.getIn(['files', 'logo']) || undefined,
});
export default withRouter(connect(mapStateToProps)(Navigator));
