import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Field from '../../Field';
import ActionButtons from '../../Elements/ActionButtons';
import { updateCollectionSettings, getCollection, saveCollection } from '../../../actions/collectionsActions';


class CollectionSettings extends Component {

  static defaultProps = {
    minDebt: '',
  };

  static propTypes = {
    minDebt: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
  }

  state = {
    edit: false,
  }

  componentDidMount() {
    this.onInitSettings();
  }

  componentWillUnmount() {
    // Reset changes if user change settings without cancelation
    this.onInitSettings();
  }

  onInitSettings = () => {
    this.props.dispatch(getCollection('min_debt'));
    this.setState({ edit: false });
  }

  onClickEdit = () => {
    this.setState({ edit: true });
  }

  onChangeMinDeb = (e) => {
    const { value } = e.target;
    this.props.dispatch(updateCollectionSettings('min_debt', value));
  }

  onSaveSettings = () => {
    this.props.dispatch(saveCollection('min_debt'));
    this.setState({ edit: false });
  }

  renderView = () => {
    const { minDebt } = this.props;
    return (
      <Form horizontal>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} lg={2}>
            Min Debt
          </Col>
          <Col sm={8} lg={9}>
            <div style={{ lineHeight: '36px', paddingLeft: 12 }}>{minDebt}</div>
          </Col>
        </FormGroup>
        <hr />
        <Button className="pull-right" bsStyle="primary" onClick={this.onClickEdit} style={{ minWidth: 90 }}>Edit</Button>
      </Form>
    );
  }

  renderEdit = () => {
    const { minDebt } = this.props;
    return (
      <Form horizontal>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} lg={2}>
            Min Debt
          </Col>
          <Col sm={4} lg={4}>
            <Field value={minDebt} onChange={this.onChangeMinDeb} fieldType="number" />
          </Col>
        </FormGroup>
        <hr />
        <ActionButtons onClickSave={this.onSaveSettings} onClickCancel={this.onInitSettings} />
      </Form>
    );
  }

  render() {
    const { edit } = this.state;
    return (
      <div className="col-md-12">
        {edit ? this.renderEdit() : this.renderView()}

      </div>
    );
  }
}


const mapStateToProps = state => ({
  minDebt: state.settings.getIn(['collection', 'min_debt']),
});
export default connect(mapStateToProps)(CollectionSettings);
