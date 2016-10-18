import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, FormGroup, Col, FormControl, ControlLabel} from 'react-bootstrap';
import { showDanger } from '../../actions/alertsActions';

/* COMPONENTS */
import ActionButtons from '../Elements/ActionButtons';
import StateDropDown from '../Elements/StateDropDown';
import Field from '../Field';

class Collection extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
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
    console.log(e);

  }

  handleCancel() {
    let r = confirm("are you sure you want to stop editing Export Generator?");
    const { dispatch, fileType } = this.props;
    if (r) {
      if (fileType !== true) {
        dispatch(clearExportGenerator());
        this.goBack();
      } else {
        const cb = (err) => {
          if (err) {
            dispatch(showDanger("Please try again"));
            return;
          }
          dispatch(clearExportGenerator());
          this.goBack();
        };
        // need to handle
        dispatch(clearExportGenerator(this.props.settings.get('file_type'), cb));
      }
    }
  }

  render() {
    const { settings } = this.props;
    const { action } = this.props.location.query;
    const title = action === 'new' ? "New Collection" : `Edit Collection - ${settings.get('id')}`;

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
                      <FormControl type="text" onChange={this.onChange} value={settings.name}/>
                    </Col>
                  </FormGroup>

                  <FormGroup controlId='days'>
                    <Col componentClass={ControlLabel} md={2}>Send in</Col>
                    <Col sm={2} className="form-input-with-hint-60">
                      <Field onChange={this.onChange} value={settings.days} fieldType="number" min="1"/>
                      <span className="help-block">Days</span>
                    </Col>
                  </FormGroup>
                </div>
              </div>

              <div className="panel panel-default">
                <div className="panel-heading">
                  Email
                </div>
                <div className="panel-body">
                  <FormGroup controlId='name'>
                    <Col componentClass={ControlLabel} md={2}>Subject</Col>
                    <Col sm={10}>
                      <FormControl type="text" onChange={this.onChange} value={settings.Subject}/>
                    </Col>
                  </FormGroup>
                  
                  <Col componentClass={ControlLabel} md={2}>Email Body</Col>
                  <Col md={12}>
                    <Col md={8}>
                      Editor
                    </Col>
                    <Col md={4}>
                      PlaceHolders
                    </Col>
                  </Col>
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

Collection.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
     }, dispatch);
}

function mapStateToProps(state, props) {
  return { settings: state.collections.collection};
}

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
