import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Panel, PageHeader, Col, Row} from 'react-bootstrap';

import Navigator from '../components/Navigator';
import Alerts from '../components/Alerts';
import { userCheckLogin } from '../actions/userActions';

require('../../css/style.css');


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.routes[props.routes.length-1].title || props.routes[props.routes.length-1].name
    }
  }

  componentWillMount() {
    this.props.userCheckLogin();
    this.setState({Height: "100%"});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      title: nextProps.routes[nextProps.routes.length-1].title || nextProps.routes[nextProps.routes.length-1].name
    });
  }

  renderWithoutLayout(){
    return (
      <div className="container">
        <Row>
          { this.props.children }
        </Row>
      </div>
    );
  }

  renderWithLayout(){
    return (
      <div id="wrapper">
        <Alerts />
        <Navigator />
        <div id="page-wrapper" style={{minHeight: this.state.Height}}>
          <Row>
            <Col lg={12}>
                <PageHeader>{this.state.title}</PageHeader>
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
    const { user } = this.props;
    return (user.get('auth') == true) ? this.renderWithLayout() : this.renderWithoutLayout();
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
