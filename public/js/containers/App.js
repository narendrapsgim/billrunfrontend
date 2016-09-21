import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Panel, PageHeader, Col, Row} from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import BraasTheme from '../theme';

import ProgressIndicator from '../components/ProgressIndicator';
import Navigator from '../components/Navigator';
import Alerts from '../components/Alerts';
import { userCheckLogin } from '../actions/userActions';

require('../../css/style.css');


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.routes[props.routes.length-1].title || ''
    }
  }

  componentWillMount() {
    this.props.userCheckLogin();
    this.setState({Height: "100%"});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      title: nextProps.routes[nextProps.routes.length-1].title || ''
    });
  }

  renderAppLoading(){
    return (
      <div>
        <ProgressIndicator />
        <Alerts />
        <div className="container">
          <Row>
            <Col md={4} mdOffset={4}>
              <div style={{marginTop: '33%', textAlign: 'center'}}>
                <img src="/img/billrun-logo-tm.png" style={{ height: 50 }} />
                <br />
                <br />
                <br />
                <p>Loading...</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  renderWithoutLayout(){
    return (
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
  }

  renderWithLayout(){
    return (
      <div id="wrapper" style={{height: "100%"}}>
        <Alerts />
        <Navigator />
        <div id="page-wrapper" className="page-wrapper" ref="pageWrapper" style={{minHeight: this.state.Height}}>
          <Row>
            <Col lg={12}>
              {this.state.title.length ? <PageHeader>{this.state.title}</PageHeader> : null }
            </Col>
          </Row>
          <Row>
            { this.props.children }
          </Row>
        </div>
      </div>
    );
  }

  getView = () => {
    const { user } = this.props;

    switch (user.get('auth')) {
      case true:
        return this.renderWithLayout();

      case false:
        return this.renderWithoutLayout();

      default:
        return this.renderAppLoading();
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(BraasTheme)}>
        { this.getView() }
      </MuiThemeProvider>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    userCheckLogin }, dispatch);
}
function mapStateToProps(state) {
  return { user: state.user };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
