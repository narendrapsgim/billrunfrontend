import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Panel, PageHeader, Col, Row} from 'react-bootstrap';

import Navigator from '../components/Navigator';
import { userCheckLogin } from '../actions/userActions';


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

  render() {
    return (
      <div id="wrapper">
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
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    userCheckLogin }, dispatch);
}
function mapStateToProps(state) {
  return { user: state.user };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
