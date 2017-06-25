import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { Row, Col, FormGroup, HelpBlock } from 'react-bootstrap';
import { ReportDescription } from '../../../FieldDescriptions';
import { CreateButton } from '../../Elements';
import Condition from './Condition';


class Conditions extends Component {

  static propTypes = {
    conditions: PropTypes.instanceOf(Immutable.List),
    fieldsOptions: PropTypes.instanceOf(Immutable.List),
    operators: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    onRemove: PropTypes.func,
    onAdd: PropTypes.func,
    onChangeField: PropTypes.func,
    onChangeOperator: PropTypes.func,
    onChangeValue: PropTypes.func,
  }

  static defaultProps = {
    conditions: Immutable.List(),
    fieldsOptions: Immutable.List(),
    operators: Immutable.List(),
    mode: 'update',
    onChangeField: () => {},
    onChangeOperator: () => {},
    onChangeValue: () => {},
    onAdd: () => {},
    onRemove: () => {},
  }

  shouldComponentUpdate(nextProps) {
    const { conditions, fieldsOptions, mode, operators } = this.props;
    return (
      !Immutable.is(conditions, nextProps.conditions)
      || !Immutable.is(fieldsOptions, nextProps.fieldsOptions)
      || !Immutable.is(operators, nextProps.operators)
      || mode !== nextProps.mode
    );
  }

  renderRow = (filter, index) => {
    const { mode, operators, fieldsOptions } = this.props;
    const disabled = mode === 'view';
    return (
      <Condition
        key={index}
        item={filter}
        index={index}
        fieldsConfig={fieldsOptions}
        operators={operators}
        disabled={disabled}
        onChangeField={this.props.onChangeField}
        onChangeOperator={this.props.onChangeOperator}
        onChangeValue={this.props.onChangeValue}
        onRemove={this.props.onRemove}
      />
    );
  }

  render() {
    const { conditions, mode, fieldsOptions } = this.props;
    const conditionsRows = conditions.map(this.renderRow);
    const disableAdd = fieldsOptions.isEmpty();
    const disableCreateNewtitle = disableAdd ? ReportDescription.add_conditions_disabled_no_entity : '';
    return (
      <Row className="report-editor-conditions">
        <Col sm={12}>
          { !conditionsRows.isEmpty() ? (
            <FormGroup className="form-inner-edit-row">
              <Col sm={4}><label htmlFor="field_field">Field</label></Col>
              <Col sm={2}><label htmlFor="operator_field">Operator</label></Col>
              <Col sm={4}><label htmlFor="value_field">Value</label></Col>
            </FormGroup>
          ) : (
            <HelpBlock>{ReportDescription.block_conditions}</HelpBlock>
          )}
        </Col>

        <Col sm={12}>
          { conditionsRows }
        </Col>
        { mode !== 'view' && (
          <Col sm={12}>
            <CreateButton
              onClick={this.props.onAdd}
              label="Add Condition"
              disabled={disableAdd}
              title={disableCreateNewtitle}
            />
          </Col>
        )}
      </Row>
    );
  }

}

export default Conditions;
