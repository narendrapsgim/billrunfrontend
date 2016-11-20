import React from 'react';
import { Panel, ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import MailEditorRich from '../MailEditor/MailEditorRich';

const EditBlock = (props) => {
  const loadTemplate = (index) => {
    if (typeof props.loadTemplate === 'function') {
      props.loadTemplate(props.name, index);
    }
  };

  const onChange = (content) => {
    props.onChange(props.name, content);
  };

  const loadTemplateBtn = (
    <ButtonToolbar>
      <DropdownButton bsSize="xsmall" title={props.loadTemplateLabel} id="dropdown-size-medium" onSelect={loadTemplate}>
        { props.templates.map((name, key) => <MenuItem key={key} eventKey={key}>{name}</MenuItem>) }
      </DropdownButton>
    </ButtonToolbar>
  );

  const panelHeader = (
    <span>{`Invoice ${props.name}`}
      { props.loadTemplate && props.templates.length > 0 &&
        <span className="pull-right">{loadTemplateBtn}
        </span>
      }
    </span>
  );

  return (
    <Panel header={panelHeader}>
      <MailEditorRich
        value={props.content}
        editorName={`editor-${props.name}`}
        name={props.name}
        configPath="config-br-invoices.js"
        editorHeight={150}
        fields={props.fields}
        onChange={onChange}
      />
    </Panel>
  );
};

EditBlock.defaultProps = {
  content: '',
  fields: [],
  templates: [],
  loadTemplate: null,
  loadTemplateLabel: 'Load default',
};

EditBlock.propTypes = {
  content: React.PropTypes.string,
  loadTemplateLabel: React.PropTypes.string,
  fields: React.PropTypes.array,
  templates: React.PropTypes.array,
  loadTemplate: React.PropTypes.func,
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
};

export default EditBlock;
