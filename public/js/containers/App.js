import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PageHeader, Col, Row } from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import BraasTheme from '../theme';
import ProgressIndicator from '../components/ProgressIndicator';
import Navigator from '../components/Navigator';
import Alerts from '../components/Alerts';
import { userCheckLogin } from '../actions/userActions';
import { setPageTitle } from '../actions/guiStateActions/pageActions';
/* Assets */
import LogoImg from 'img/billrun-logo-tm.png';

class App extends Component {

  static propTypes = {
    setPageTitle: React.PropTypes.func.isRequired,
    userCheckLogin: React.PropTypes.func.isRequired,
    auth: React.PropTypes.bool,
    routes: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
    children: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
    title: React.PropTypes.string,
  };

  static defaultProps = {
    auth: undefined,
    title: '',
  };

  componentWillMount() {
    this.props.userCheckLogin();
    this.setState({ Height: '100%' });
  }

  componentDidMount() {
    const { routes, title } = this.props;
    const newTitle = routes[routes.length - 1].title || title;
    if (newTitle.length) {
      this.props.setPageTitle(newTitle);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { title } = this.props;
    const nextTitle = nextProps.routes[nextProps.routes.length - 1].title;
    if (typeof nextTitle !== 'undefined' && nextTitle !== title) {
      this.props.setPageTitle(nextTitle);
    }
  }

  getView = () => {
    const { auth } = this.props;
    switch (auth) {
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
    const { title } = this.props;
    return (
      <div id="wrapper" style={{ height: '100%' }}>
        <ProgressIndicator />
        <Alerts />
        <Navigator />
        <div id="page-wrapper" className="page-wrapper" style={{ minHeight: this.state.Height }}>
          <Row>
            <Col lg={12}>
              {title ? <PageHeader>{title}</PageHeader> : null }
            </Col>
          </Row>
          <Row>
            { this.props.children }
          </Row>
        </div>
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

const mapDispatchToProps = dispatch => bindActionCreators({
  setPageTitle,
  userCheckLogin,
}, dispatch);

const mapStateToProps = state => ({
  auth: state.user.get('auth'),
  title: state.guiState.page.get('title'),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
