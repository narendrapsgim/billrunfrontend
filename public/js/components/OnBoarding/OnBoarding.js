import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Button, Panel, ButtonGroup } from 'react-bootstrap';
import renderHTML from 'react-render-html';
import Draggable from 'react-draggable';
import { ModalWrapper, DragHandle } from '../Elements';
import { showOnBoarding } from '../../actions/guiStateActions/pageActions';
import htmlInvoce from './invoice.html';


class OnBoarding extends Component {

  static propTypes = {
    show: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,

  };

  static defaultProps = {
    show: false,
  };

  state = {
    state: 'maximize',
  };


  onCloseImprt = () => {
    const { show } = this.props;
    this.props.dispatch(showOnBoarding(!show));
  }

  onMinimize = () => {
    this.setState({ state: 'minimize' });
  }

  onMaximize = () => {
    this.setState({ state: 'maximize' });
  }

  renderHeader = () => {
    const { state } = this.state;
    return (
      <div>
        <div className="handle pull-left"><DragHandle /></div>
        &nbsp;
        <ButtonGroup className="pull-right">
          { (state === 'maximize')
            ? <Button onClick={this.onMinimize} bsSize="small"><i className="fa fa-window-minimize" /></Button>
            : <Button onClick={this.onMaximize} bsSize="small"><i className="fa fa-window-maximize" /></Button>
          }
          <Button onClick={this.onCloseImprt} bsSize="small"><i className="fa fa-window-close" /></Button>
        </ButtonGroup>
      </div>
    );
  }

  render() {
    const { show } = this.props;
    const { state } = this.state;
    if (!show) {
      return null;
    }

    const wrapperClass = classNames('on-boarding-wrapper', {
      minimized: state === 'minimize',
    });
    return (
      <Draggable handle=".handle" defaultPosition={{ x: 200, y: 50 }}>
        <Panel className={wrapperClass} header={this.renderHeader()}>
          <h1>We will take you to a tour...</h1>
          <div className="text-center">
            <Button>Start invoice tour</Button>
          </div>
          {renderHTML(htmlInvoce)}
        </Panel>
      </Draggable>
    );
  }
}

const mapStateToProps = state => ({
  show: state.guiState.page.get('onBoarding'),
});

export default connect(mapStateToProps)(OnBoarding);
