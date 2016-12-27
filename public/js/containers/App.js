import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { PageHeader, Col, Row } from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import BraasTheme from '../theme';
import ProgressIndicator from '../components/ProgressIndicator';
import Navigator from '../components/Navigator';
import Alerts from '../components/Alerts';
import Footer from '../components/Footer';
import { userCheckLogin } from '../actions/userActions';
import { setPageTitle } from '../actions/guiStateActions/pageActions';
import { initMainMenu } from '../actions/guiStateActions/menuActions';
import { getSettings } from '../actions/settingsActions';
/* Assets */
import LogoImg from 'img/billrun-logo-tm.png';

class App extends Component {

  static propTypes = {
    auth: PropTypes.bool,
    routes: PropTypes.array,
    children: PropTypes.element,
    title: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    mainMenuOverrides: React.PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.Iterable),
      null,
    ]),
    menuItems: React.PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.Iterable),
      null,
    ]),
  };

  static defaultProps = {
    mainMenuOverrides: null,
    auth: undefined,
    title: '',
  };

  componentWillMount() {
    this.props.dispatch(userCheckLogin());
    this.setState({ Height: '100%' });
  }

  componentDidMount() {
    const { routes, title } = this.props;
    const newTitle = routes[routes.length - 1].title || title;
    if (newTitle.length) {
      this.props.dispatch(setPageTitle(newTitle));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { title, auth, mainMenuOverrides } = this.props;

    // Update main menu with telant overrides
    if (mainMenuOverrides === null && nextProps.mainMenuOverrides !== null) {
      this.props.dispatch(initMainMenu(nextProps.mainMenuOverrides));
    }

    const nextTitle = nextProps.routes[nextProps.routes.length - 1].title;
    if (typeof nextTitle !== 'undefined' && nextTitle !== title) {
      this.props.dispatch(setPageTitle(nextTitle));
    }
    if (auth !== true && nextProps.auth === true) { // user did success login
      // get global system settings
      this.props.dispatch(getSettings(['pricing', 'tenant', 'menu']));
    }
  }

  getView = () => {
    const { auth, menuItems } = this.props;
    let appState = null;
    if (auth === false) {
      appState = false;
    } else if (auth === null || menuItems === null) {
      appState = 'waiting';
    } else if (auth !== null && menuItems !== null) {
      appState = true;
    }

    switch (appState) {
      case true:
        return this.renderWithLayout();
      case false:
        return this.renderWithoutLayout();
      default:
        return this.renderAppLoading();
    }
  }

  renderAppLoading = () => (
    <div>
      <ProgressIndicator />
      <Alerts />
      <div className="container">
        <Row>
          <Col md={4} mdOffset={4}>
            <div style={{ marginTop: '33%', textAlign: 'center' }}>
              <img alt="logo" src={LogoImg} style={{ height: 50 }} />
              <br />
              <br />
              <br />
              <p>Loading...</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )

  renderWithoutLayout = () => (
    <div>
      <ProgressIndicator />
      <Alerts />
      <div className="container">
        <Row>
          { this.props.children }
        </Row>
      </div>
    </div>
  );

  renderWithLayout = () => {
    const { title, children } = this.props;
    return (
      <div id="wrapper" style={{ height: '100%' }}>
        <ProgressIndicator />
        <Alerts />
        <Navigator />
        <div id="page-wrapper" className="page-wrapper" style={{ minHeight: this.state.Height }}>
          <Row>
            <Col lg={12}>{title && <PageHeader>{title}</PageHeader> }</Col>
          </Row>
          <Row>{children}</Row>
        </div>
        <Footer />
      </div>
    );
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(BraasTheme)}>
        { this.getView() }
      </MuiThemeProvider>
    );
  }
}


const mapStateToProps = state => ({
  auth: state.user.get('auth', null),
  title: state.guiState.page.get('title'),
  mainMenuOverrides: state.settings.getIn(['menu', 'main'], null),
  menuItems: state.guiState.menu.get('main', null),
});

export default connect(mapStateToProps)(App);
