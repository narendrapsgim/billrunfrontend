import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ModalWrapper } from '../Elements';
import { showOnBoarding } from '../../actions/guiStateActions/pageActions';


class OnBoarding extends Component {

  static propTypes = {
    show: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,

  };

  static defaultProps = {
    show: false,
  };


  onCloseImprt = () => {
    const { show } = this.props;
    this.props.dispatch(showOnBoarding(!show));
  }

  render() {
    const { show } = this.props;
    return (
      <ModalWrapper show={show} title="Help" onHide={this.onCloseImprt}>
        <h1>On Boarding ...</h1>
      </ModalWrapper>
    );
  }
}

const mapStateToProps = state => ({
  show: state.guiState.page.get('onBoarding'),
});

export default connect(mapStateToProps)(OnBoarding);
