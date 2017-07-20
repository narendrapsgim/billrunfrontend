import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { Form } from 'react-bootstrap';
import ActionButtons from '../Elements/ActionButtons';
import EditBlock from './EditBlock';


class InvoiceTemplate extends Component {

  static propTypes = {
    header: PropTypes.string,
    footer: PropTypes.string,
    suggestions: PropTypes.instanceOf(Immutable.List),
    templates: PropTypes.instanceOf(Immutable.Map),
    getData: PropTypes.func,
    onChange: PropTypes.func,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    header: '',
    footer: '',
    suggestions: Immutable.List(),
    templates: Immutable.Map(),
    onChange: () => {},
    onSave: () => {},
    onCancel: () => {},
    getData: () => {},
  };

  componentDidMount() {
    this.props.getData();
  }

  loadTemplate = (name, index) => {
    const { templates } = this.props;
    const newContent = templates.getIn([name, index, 'content']);
    this.props.onChange(name, newContent);
  }

  render() {
    const { header, footer, suggestions, templates } = this.props;
    const fieldsList = suggestions.toArray();
    const headerTemplates = templates.get('header', Immutable.Map()).map(template => template.get('lable', 'Template')).toArray();
    const footerTemplates = templates.get('footer', Immutable.Map()).map(template => template.get('lable', 'Template')).toArray();
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <Form horizontal>
              { header !== null && (
                <EditBlock
                  name="header"
                  content={header}
                  onChange={this.props.onChange}
                  fields={fieldsList}
                  templates={headerTemplates}
                  loadTemplate={this.loadTemplate}
                />
              )}
              { footer !== null && (
                <EditBlock
                  name="footer"
                  content={footer}
                  onChange={this.props.onChange}
                  fields={fieldsList}
                  templates={footerTemplates}
                  loadTemplate={this.loadTemplate}
                />
              )}
            </Form>
          </div>
        </div>
        <ActionButtons onClickSave={this.props.onSave} onClickCancel={this.props.onCancel} />
      </div>
    );
  }
}

export default InvoiceTemplate;
