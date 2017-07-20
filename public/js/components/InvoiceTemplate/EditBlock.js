import React, { PropTypes } from 'react';
import { Panel, ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import { Actions } from '../Elements';
import Field from '../Field';

const EditBlock = (props) => {
  const loadTemplate = (index) => {
    props.loadTemplate(props.name, index);
  };

  const onChange = (content) => {
    props.onChange(props.name, content);
  };

  const onClickEnabled = () => {
    console.log('onClickEnabled', props.name);
    props.onChangeStatus(props.name, true);
  };

  const onClickDisabled = () => {
    console.log('onClickDisabled', props.name);
    props.onChangeStatus(props.name, false);
  };

  const getListActions = () => ([
    { type: 'enable', helpText: 'Enable', onClick: onClickEnabled, show: !props.enabled },
    { type: 'disable', helpText: 'Disable', onClick: onClickDisabled, show: props.enabled },
  ]);

  const panelHeader = (
    <span>{`Invoice ${props.name}`}
      <div className="pull-right" style={{ marginTop: -5 }}>
        { props.loadTemplate && props.templates.length > 0 && (
          <ButtonToolbar className="inline" style={{ verticalAlign: 'middle' }}>
            <DropdownButton bsSize="xsmall" title="Load default" id="dropdown-size-medium" onSelect={loadTemplate}>
              { props.templates.map((name, key) =>
                <MenuItem key={key} eventKey={key}>{name}</MenuItem>)
              }
            </DropdownButton>
          </ButtonToolbar>
        )}
        <div className="inline">
          <Actions actions={getListActions()} />
        </div>
      </div>
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
  enabled: false,
  loadTemplate: () => {},
  onChangeStatus: () => {},
};

EditBlock.propTypes = {
  content: PropTypes.string,
  fields: PropTypes.array,
  templates: PropTypes.array,
  enabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  loadTemplate: PropTypes.func,
  onChangeStatus: PropTypes.func,
};

export default EditBlock;
