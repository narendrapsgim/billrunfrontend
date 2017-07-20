import React from 'react';
import { Panel, ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import Field from '../Field';

const EditBlock = (props) => {
  const loadTemplate = (index) => {
    props.loadTemplate(props.name, index);
  };

  const onChange = (content) => {
    props.onChange(props.name, content);
  };

  const loadTemplateBtn = (
    <ButtonToolbar>
      <DropdownButton bsSize="xsmall" title="Load default" id="dropdown-size-medium" onSelect={loadTemplate}>
        { props.templates.map((name, key) => <MenuItem key={key} eventKey={key}>{name}</MenuItem>) }
      </DropdownButton>
    </ButtonToolbar>
  );

  const panelHeader = (
    <span>{`Invoice ${props.name}`}
      { props.loadTemplate && props.templates.length > 0 && (
        <span className="pull-right">{loadTemplateBtn}</span>
      )}
    </span>
  );

  return (
    <Panel header={panelHeader}>
      <Field
        fieldType="textEditor"
        value={props.content}
        editorName={`editor-${props.name}`}
        name={props.name}
        configName="invoices"
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
  loadTemplate: () => {},
};

EditBlock.propTypes = {
  content: React.PropTypes.string,
  fields: React.PropTypes.array,
  templates: React.PropTypes.array,
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  loadTemplate: React.PropTypes.func,
};

export default EditBlock;
