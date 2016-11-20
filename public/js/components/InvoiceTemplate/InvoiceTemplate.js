import React, { Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import ConfirmModal from '../ConfirmModal';
import ActionButtons from '../Elements/ActionButtons';
import EditBlock from './EditBlock';
import { getSettings, saveSettings, updateSetting } from '../../actions/settingsActions';


class InvoiceTemplate extends Component {

  static propTypes = {
    settings: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    confirmMessage: React.PropTypes.string,
  };

  static defaultProps = {
    settings: Immutable.Map(),
    confirmMessage: 'Are you sure you want to discard editing Invoice Template?',
  };

  state = {
    showConfirm: false,
  }

  componentDidMount() {
    this.props.dispatch(getSettings('wkpdf'));
  }

  onChange = (name, content) => {
    this.props.dispatch(updateSetting('wkpdf', name, content));
  }

  onSave = () => {
    this.props.dispatch(saveSettings('wkpdf'));
  }

  onCancel = () => {
    this.setState({ showConfirm: true });
  }

  onConfirmCancel = () => {
    this.setState({ showConfirm: false });
  }

  onConfirmOk = () => {
    this.props.dispatch(getSettings('wkpdf'));
    this.setState({ showConfirm: false });
  }

  loadTemplate = (name, index) => {
    const { settings } = this.props;
    const newContent = settings.getIn(['templates', name, index, 'content']);
    // console.log('loadTemplate:', name, newContent);
    this.props.dispatch(updateSetting('wkpdf', name, newContent));
  }

  render() {
    const { settings, confirmMessage } = this.props;
    const { showConfirm } = this.state;
    const header = settings.get('header', '');
    const footer = settings.get('footer', '');

    if (!settings.has('header') || !settings.has('footer')) {
      return (<p>loading...</p>);
    }

    const htmlTranslation = settings.get('html_translation', Immutable.Map());
    const fieldsList = Array.from(htmlTranslation.keys());
    const headerTemplates = settings.getIn(['templates', 'header'], Immutable.Map()).map(template => template.get('lable', 'Template')).toArray();
    const footerTemplates = settings.getIn(['templates', 'footer'], Immutable.Map()).map(template => template.get('lable', 'Template')).toArray();

    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <Form horizontal>
              <EditBlock key="1" loadTemplate={this.loadTemplate} onChange={this.onChange} fields={fieldsList} templates={headerTemplates} name="header" content={header} />
              <EditBlock key="2" loadTemplate={this.loadTemplate} onChange={this.onChange} fields={fieldsList} templates={footerTemplates} name="footer" content={footer} />
            </Form>
          </div>
        </div>
        <ActionButtons onClickSave={this.onSave} onClickCancel={this.onCancel} />
        <ConfirmModal onOk={this.onConfirmOk} onCancel={this.onConfirmCancel} show={showConfirm} message={confirmMessage} labelOk="Yes" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings.get('wkpdf'),
});
export default connect(mapStateToProps)(InvoiceTemplate);
