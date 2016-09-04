import React from 'react';
import Datamap from 'react-datamaps';

// https://github.com/markmarkoh/datamaps/blob/master/README.md#getting-started
export default class MapChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Datamap {...this.props} />
    );
  }
}
