import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Table } from 'react-bootstrap';
import Play from './PlayContainer';
import { CreateButton } from '../../Elements';


const Plays = ({ data, onChange, onAddPlay }) => (
  <div className="Plays List row panel-body">
    <Table className="table table-hover table-striped table-bordered">
      <thead>
        <tr>
          <th className="state">Status</th>
          <th>Name</th>
          <th>Label</th>
          <th className="text-center list-status-col">Default</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        { data.map((play, index) => (
          <Play
            key={`play_${index}`}
            index={index}
            play={play}
            onChange={onChange}
            plays={data}
          />
        )) }
      </tbody>
    </Table>
    <CreateButton onClick={onAddPlay} type="Play" action="Add" />
  </div>
);

Plays.propTypes = {
  data: PropTypes.instanceOf(Immutable.List),
  onChange: PropTypes.func.isRequired,
  onAddPlay: PropTypes.func.isRequired,
};

Plays.defaultProps = {
  data: Immutable.List(),
};

export default Plays;
