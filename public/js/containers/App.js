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
import { setPageTitle, systemRequirementsLoadingComplete } from '../actions/guiStateActions/pageActions';
import { initMainMenu } from '../actions/guiStateActions/menuActions';
import { getSettings, fetchFile } from '../actions/settingsActions';


class App extends Component {

  static propTypes = {
    auth: PropTypes.bool,
    systemRequirementsLoad: PropTypes.bool,
    routes: PropTypes.array,
    children: PropTypes.element,
    title: PropTypes.string,
    logo: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    mainMenuOverrides: React.PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.Iterable),
      null,
    ]),
    logoName: React.PropTypes.oneOfType([
      PropTypes.string,
      null,
    ]),
  };

  static defaultProps = {
    mainMenuOverrides: null,
    auth: null,
    title: '',
    logoName: '',
    systemRequirementsLoad: false,
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

    // Update main menu with tenant overrides
    if (mainMenuOverrides === null && nextProps.mainMenuOverrides !== null) {
      this.props.dispatch(initMainMenu(nextProps.mainMenuOverrides));
    }

    const nextTitle = nextProps.routes[nextProps.routes.length - 1].title;
    if (typeof nextTitle !== 'undefined' && nextTitle !== title) {
      this.props.dispatch(setPageTitle(nextTitle));
    }
    if (auth !== true && nextProps.auth === true) { // user did success login
      // get global system settings
      this.props.dispatch(getSettings(['pricing', 'tenant', 'menu', 'billrun']))
        .then(responce => ((responce) ? this.props.logoName : ''))
        .then((logoFileName) => {
          if (logoFileName && logoFileName.length > 0) {
            return this.props.dispatch(fetchFile({ filename: logoFileName }, 'logo'));
          }
          return true;
        })
        .then(() => {
          this.props.dispatch(systemRequirementsLoadingComplete());
        });
    }
  }

  getView = () => {
    const { auth, systemRequirementsLoad } = this.props;
    let appState = 'waiting';
    if (auth === false) {
      appState = 'noLogin';
    } else if (systemRequirementsLoad && auth === true) {
      appState = 'ready';
    }

    switch (appState) {
      case 'ready':
        return this.renderWithLayout();
      case 'noLogin':
        return this.renderWithoutLayout();
      default: // 'waiting'
        return this.renderAppLoading();
    }
  }

  renderAppLoading = () => {
    const { logo } = this.props;
    return (
      <div>
        <ProgressIndicator />
        <Alerts />
        <div className="container">
          <Col md={4} mdOffset={4}>
            <div style={{ marginTop: '33%', textAlign: 'center' }}>
              <img alt="logo" src={logo} style={{ height: 50 }} />
              <br />
              <br />
              <br />
              <p>Loading...</p>
            </div>
          </Col>
        </div>
      </div>
    );
  }

  renderWithoutLayout = () => (
    <div>
      <ProgressIndicator />
      <Alerts />
      <div className="container">
        { this.props.children }
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
          <div>{children}</div>
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
  auth: state.user.get('auth'),
  title: state.guiState.page.get('title'),
  systemRequirementsLoad: state.guiState.page.get('systemRequirementsLoad'),
  mainMenuOverrides: state.settings.getIn(['menu', 'main']),
  logo: state.settings.getIn(['files', 'logo']),
  logoName: state.settings.getIn(['tenant', 'logo']),
});

export default connect(mapStateToProps)(App);
