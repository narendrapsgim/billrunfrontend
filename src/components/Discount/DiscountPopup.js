import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import DiscountDetails from './DiscountDetails';
import { currencySelector } from '@/selectors/settingsSelector';


class DiscountPopup extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string.isRequired,
    hideKey: PropTypes.bool,
    currency: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    item: Immutable.Map(),
    hideKey: false,
    currency: '',
  }

  onRemoveFieldValue = (path) => {
    console.log("onRemoveFieldValue: ", path);
    this.props.removeField(path);
  }

  onChangeFieldValue = (path, value) => {
    console.log("onChangeFieldValue: ", path, value);
    // this.props.setError(path);
    this.props.updateField(path, value);
  }

  render() {
    const { item, mode, currency, hideKey } = this.props;
    return (
      <div className="discount-setup">
        <DiscountDetails
          discount={item}
          mode={mode}
          hideKey={hideKey}
          currency={currency}
          onFieldUpdate={this.onChangeFieldValue}
          onFieldRemove={this.onRemoveFieldValue}
        />
      </div>
    );
  }
}


const mapStateToProps = (state, props) => ({
  currency: currencySelector(state, props) || undefined,
});

export default withRouter(connect(mapStateToProps)(DiscountPopup));
