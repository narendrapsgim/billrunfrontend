import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import {
  sendImport,
} from '../../actions/importerActions';

class StepFinish extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    item: Immutable.Map(),
  };


  componentDidMount() {
    this.createItems();
  }

  createItems = () => {
    const { item } = this.props;

    const fileContent = item.get('fileContent', '');
    const fileDelimiter = item.get('fileDelimiter', '');
    const map = item.get('map', Immutable.List());

    const rows = [];

    const lines = fileContent.split('\n');
    if (Array.isArray(lines)) {
      lines.forEach((line, idx) => {
        if (idx !== 0) {
          const row = Immutable.Map().withMutations((mapWithMutations)  => {
            const data = line.split(fileDelimiter);
            data.forEach((value, key) => {
              mapWithMutations.set(map.get(key), value);
            });
          });
          rows.push(row);
        }
      });
    }
    console.log('send rows: ', rows);
    this.props.dispatch(sendImport('account', rows));
  }


  render() {
    return (
      <div>
        StepFinish
      </div>
    );
  }
}

export default connect()(StepFinish);
