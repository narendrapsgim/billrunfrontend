import React, { Component } from 'react';
import { Panel, PageHeader, Col, Row} from 'react-bootstrap';

import Navigator from '../components/Navigator';


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.routes[props.routes.length-1].title || props.routes[props.routes.length-1].name
    }
  }

  componentWillMount() {
    this.setState({Height: "100%"});
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps");
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
