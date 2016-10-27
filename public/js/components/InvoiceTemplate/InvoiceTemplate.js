import React, { Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { Button , Form } from 'react-bootstrap';
import { showDanger } from '../../actions/alertsActions';
import Help from '../Help';
import {
  setInvoiceTemplate,
  clearInvoiceTemplate
} from '../../actions/invoiceTemplateActions';

/* COMPONENTS */
import ActionButtons from '../Elements/ActionButtons';
import MailEditorRich from '../MailEditor/MailEditorRich';

/* DEV - TO replace with real API */
import templates from './invoiceTemplates.json';

/* DEV - TO replace with real API */
import fieldsList from './stub_fields.json';

class InvoiceTemplate extends Component {
  static propTypes = {
    settings: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.loadTemplate = this.loadTemplate.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // const { file_type, action } = this.props.location.query;

    // Should be deal with edit
    // if (action !== "new") dispatch(getProcessorSettings(file_type));
  }

  onError(message) {
    this.props.dispatch(showDanger(message));
  }

  onChange (content, name) {
    this.props.dispatch(setInvoiceTemplate(name, content));
  }

  loadTemplate (e) {
    let templateName= e.target.dataset.template;
    this.props.dispatch(setInvoiceTemplate(templateName, templates[templateName]));
  }

  onCancel() {
    let r = confirm("are you sure you want to stop editing Invoice Template?");
    const { dispatch } = this.props;
    if (r) {
      dispatch(clearInvoiceTemplate());

      this.props.router.push(`/`);
    }
  }

  render() {
    const { settings } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <Form horizontal>
              <div className="panel panel-default">
                <div className="panel-heading">
                  Invoice Header
                  <div className="pull-right">
                    <Button bsSize="xsmall" className="btn-primary" data-template="header" onClick={this.loadTemplate}>Load default</Button>
                  </div>
                </div>
                <div className="panel-body">
                  <MailEditorRich value={settings.get('header')}
                                  editorName="editor-header"
                                  name="header"
                                  configPath="config-br-invoices.js"
                                  editorHeight="150"
                                  fields={fieldsList}
                                  onChange={this.onChange} />
                </div>
              </div>

              <div className="panel panel-default">
                <div className="panel-heading">
                  Invoice Footer
                  <div className="pull-right">
                    <Button bsSize="xsmall" className="btn-primary" data-template="footer" onClick={this.loadTemplate}>Load default</Button>
                  </div>
                </div>
                <div className="panel-body">
                  <MailEditorRich value={settings.get('footer')}
                                  editorName="editor-footer"
                                  name="footer"
                                  configPath="config-br-invoices.js"
                                  editorHeight="150"
                                  fields={fieldsList}
                                  onChange={this.onChange} />
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
    setInvoiceTemplate,
    clearInvoiceTemplate
  }, dispatch);
}

function mapStateToProps(state, props) {
  return { settings: state.invoiceTemplate.invoiceTemplate};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InvoiceTemplate));
