import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import Navigator from '../components/Navigator';
import Topbar from '../components/Topbar';
import { routes } from '../routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';
import BraasTheme from '../theme';
import axios from 'axios';
import * as actions from '../actions'
import LoginPopup from '../components/Authorization/LoginPopup';
import StatusBar from '../components/StatusBar/StatusBar';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import { hideModal } from '../actions/modalActions';

export default class App extends Component {
  constructor(props) {
    super(props);
    injectTapEventPlugin();
  }

  componentWillMount() {
    this.props.dispatch(actions.userCheckLogin());
  }

  render() {
    const { users, modal, dispatch } = this.props;

    const onClose = () => {
      dispatch(hideModal());
    };
    
    const ModalInstance = React.createClass({
      render() {
        const { onClose } = this.props;
        let { message } = this.props;
        message = (!Array.isArray(message)) ? message : this.props.message.map( (item, i) => <p key={i}>{item}</p>);
        return (
          <div className="static-modal">
            <Modal show={this.props.show}>
              <Modal.Header>
                <Modal.Title>{this.props.title}</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                { message }
              </Modal.Body>

              <Modal.Footer>
                <Button onClick={onClose}>Close</Button>
              </Modal.Footer>

            </Modal>
          </div>
        );
      }
    });
    
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(BraasTheme)}>
        <div className="App">
          <ModalInstance show={modal.get('show')} message={modal.get('message')} title={modal.get('title')} onClose={onClose} />
          <Topbar />
          {(() => {
             if (users.get('auth'))
               return (
                 <Navigator />
               );
           })()
          }
          <StatusBar />
            <div className="container-fluid main-content">
              <div className="contents">
                {this.props.children}
              </div>
            </div>
          <footer className="footer">
            <div className="container-fluid">
              <p style={{color: "white"}}>
                (c) 2016 Billrun All Right Reserved
              </p>
            </div>
          </footer>
          <LoginPopup />
        </div>
      </MuiThemeProvider>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return { users: state.users,
           modal: state.modal };
}

export default connect(mapStateToProps)(App);
