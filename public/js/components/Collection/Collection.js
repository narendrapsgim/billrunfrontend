import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { Form, FormGroup, Col, FormControl, ControlLabel} from 'react-bootstrap';
import { showDanger } from '../../actions/alertsActions';
import Help from '../Help';
import {
  setCollectionName,
  setCollectionDays,
  setCollectionActive,
  setCollectionMailSubject,
  setCollectionMailBody,
  clearCollection
} from '../../actions/collectionsActions';

/* COMPONENTS */
import ActionButtons from '../Elements/ActionButtons';
import StateDropDown from '../Elements/StateDropDown';
import Field from '../Field';
import MailEditorRich from '../MailEditor/MailEditorRich';

/* DEV - TO replace with real API */
import fieldsList from './stub_fields.json';

class Collection extends Component {
  static propTypes = {
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired
    }).isRequired
  }

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onActiveChange = this.onActiveChange.bind(this);
    this.onMailChange = this.onMailChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { file_type, action } = this.props.location.query;

    // Should be deal with edit
    // if (action !== "new") dispatch(getProcessorSettings(file_type));
  }

  onError(message) {
    this.props.dispatch(showDanger(message));
  }

  onChange (e) {
    switch (e.target.name) {
      case 'name':
        this.props.dispatch(setCollectionName(e.target.value));
        break;

      case 'days':
        this.props.dispatch(setCollectionDays(e.target.value));
        break;

      case 'active':
        this.props.dispatch(setCollectionActive(e.target.value));
        break;

      case 'subject':
        this.props.dispatch(setCollectionMailSubject(e.target.value));
        break;
    }
  }

  onActiveChange (val) {
    let active = false;
    if (val === 1) {
      active = true;
    }
    this.props.dispatch(setCollectionActive(active));
  }

  onMailChange (val) {
    this.props.dispatch(setCollectionMailBody(val));
  }

  onCancel() {
    let r = confirm("are you sure you want to stop editing Collection?");
    const { dispatch } = this.props;
    if (r) {
      dispatch(clearCollection());

      this.props.router.push(`/collections`);
    }
  }

  render() {
    const { settings } = this.props;
    const { active } = settings.get('active', 1);
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <Form horizontal>
              <div className="panel panel-default">
                <div className="panel-heading">
                  Collection Details
                </div>
                <div className="panel-body">
                  <FormGroup controlId='name'>
                    <Col componentClass={ControlLabel} md={2}>Name</Col>
                    <Col sm={10}>
                      <FormControl type="text" name="name" onChange={this.onChange} value={settings.get('name', '')}/>
                    </Col>
                  </FormGroup>

                  <FormGroup controlId='days'>
                    <Col componentClass={ControlLabel} md={2}>Send in</Col>
                    <Col sm={2} className="form-input-with-hint-60">
                      <Field name="days" onChange={this.onChange} value={settings.get('days',1)} fieldType="number" min="1"/>
                      <span className="help-block">Days</span>
                    </Col>
                  </FormGroup>

                  <FormGroup controlId='active'>
                    <Col componentClass={ControlLabel} md={2}>Active</Col>
                    <Col sm={2}>
                      <StateDropDown name="active" onChange={this.onActiveChange} value={active}/>
                    </Col>
                  </FormGroup>
                </div>
              </div>

              <div className="panel panel-default">
                <div className="panel-heading">
                  Email Template <Help contents={"Template for email that will be send to customer"} />
                </div>
                <div className="panel-body">
                  <FormGroup controlId='name'>
                    <Col componentClass={ControlLabel} md={2}>Subject</Col>
                    <Col sm={10}>
                      <FormControl name="subject" type="text" onChange={this.onChange} value={settings.get('subject','')}/>
                    </Col>
                  </FormGroup>
                  
                  <div>
                    <MailEditorRich value={settings.get('body','body of the fucking ediutor')} name="body" fields={fieldsList} onChange={this.onMailChange} />
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <ActionButtons
          onClickSave={this.onSave}
          onClickCancel={this.onCancel}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setCollectionName,
    setCollectionDays,
    setCollectionActive,
    setCollectionMailSubject,
    setCollectionMailBody,
    clearCollection
  }, dispatch);
}

function mapStateToProps(state, props) {
  return { settings: state.collections.collection};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Collection));
