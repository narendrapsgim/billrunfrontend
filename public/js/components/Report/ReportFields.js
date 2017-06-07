import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { ControlLabel, FormGroup, Col, Button } from 'react-bootstrap';
import Select from 'react-select';
import { CreateButton } from '../Elements';
import {
  getConfig,
  parseConfigSelectOptions,
} from '../../common/Util';

class ReportFields extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    fieldsConfig: PropTypes.instanceOf(Immutable.List),
    groupByOperators: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    onChangeBroupByField: PropTypes.func,
    onChangeGroupByOperator: PropTypes.func,
    onGroupByRemove: PropTypes.func,
    onGroupByAdd: PropTypes.func,
    onChangeGroupByFields: PropTypes.func,
    onChangeDisplayFields: PropTypes.func,
  }

  static defaultProps = {
    item: Immutable.Map(),
    fieldsConfig: Immutable.List(),
    groupByOperators: getConfig(['reports', 'groupByOperators'], Immutable.List()),
    mode: 'update',
    onChangeBroupByField: () => {},
    onChangeGroupByOperator: () => {},
    onGroupByRemove: () => {},
    onGroupByAdd: () => {},
    onChangeGroupByFields: () => {},
    onChangeDisplayFields: () => {},
  }

  shouldComponentUpdate(nextProps) {
    const { mode, item, fieldsConfig, groupByOperators } = this.props;
    return (
      !Immutable.is(item, nextProps.item)
      || !Immutable.is(fieldsConfig, nextProps.fieldsConfig)
      || !Immutable.is(groupByOperators, nextProps.groupByOperators)
      || mode !== nextProps.mode
    );
  }

  renderGroupByInputs = (filter, index) => {
    const { mode, groupByOperators, fieldsConfig } = this.props;
    const confField = fieldsConfig.find(conf => conf.get('id', '') === filter.get('field', ''), null, Immutable.Map());

    const disabled = mode === 'view';

    const fieldOptions = fieldsConfig
      .filter(filed => filed.get('groupBy', true))
      .map(parseConfigSelectOptions)
      .toArray();

    const opOptions = groupByOperators
      .filter(option => option
        .get('types', Immutable.List())
        .includes(confField.get('type', 'string')),
      )
      .map(parseConfigSelectOptions)
      .toArray();

    const onChangeField = (e) => { this.props.onChangeBroupByField(index, e); };
    const onChangeOperator = (e) => { this.props.onChangeGroupByOperator(index, e); };
    const onRemove = (e) => { this.props.onGroupByRemove(index, e); };

    return (
      <FormGroup className="form-inner-edit-row" key={index}>
        <Col sm={5}>
          <Select
            options={fieldOptions}
            value={filter.get('field', '')}
            onChange={onChangeField}
            disabled={disabled}
          />
        </Col>
        <Col sm={3}>
          <Select
            clearable={false}
            options={opOptions}
            value={filter.get('op', '')}
            onChange={onChangeOperator}
            disabled={disabled}
          />
        </Col>
        <Col sm={2} className="action">
          <Button onClick={onRemove} bsSize="small" className="pull-left" disabled={disabled} block>
            <i className="fa fa-trash-o danger-red" />&nbsp;Remove
          </Button>
        </Col>
      </FormGroup>
    );
  }

  render() {
    const { item, mode, fieldsConfig, groupByOperators } = this.props;
    const disabled = mode === 'view';
    const isGroupBy = !item.get('group_by_fields', Immutable.List()).isEmpty();
    const disableCreateGroupBy = disabled || !isGroupBy;

    const groupByFieldsValues = item
      .get('group_by_fields', Immutable.List())
      .join(',');

    const displayFieldsValues = item
      .get('display', Immutable.List())
      .join(',');

    let displayOptions = [];
    if (isGroupBy) {
      displayOptions = Immutable.List().withMutations((listWithMutations) => {
        item.get('group_by_fields', Immutable.List()).forEach((groupByField) => {
          const field = fieldsConfig.find(conf => conf.get('id', '') === groupByField, null, Immutable.Map());
          listWithMutations.push(Immutable.Map({
            id: groupByField,
            title: field.get('title', groupByField),
          }));
        });
        item.get('group_by', Immutable.List()).forEach((groupBy) => {
          if (groupBy.get('field', '') !== '' && groupBy.get('op', '') !== '') {
            const field = fieldsConfig.find(conf => conf.get('id', '') === groupBy.get('field', ''), null, Immutable.Map());
            const operator = groupByOperators.find(op => op.get('id', '') === groupBy.get('op', ''), null, Immutable.Map());
            listWithMutations.push(Immutable.Map({
              id: `${groupBy.get('field', '')}_${groupBy.get('op', '')}`,
              title: `${field.get('title', '')} (${operator.get('title', groupBy.get('op', ''))})`,
            }));
          }
        });
      })
      .map(parseConfigSelectOptions)
      .toArray();
    } else {
      displayOptions = fieldsConfig
        .filter(field => field.get('display', true))
        .map(parseConfigSelectOptions).toArray();
    }

    const groupByOptions = fieldsConfig
      .filter(field => field.get('display', true))
      .map(parseConfigSelectOptions)
      .toArray();

    const groupByInputs = item
      .get('group_by', Immutable.List())
      .map(this.renderGroupByInputs);

    return (
      <div>
        <Col sm={12}>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>
              Group By
            </Col>
            <Col sm={7}>
              <Select
                multi={true}
                options={groupByOptions}
                value={groupByFieldsValues}
                onChange={this.props.onChangeGroupByFields}
                disabled={disabled}
              />
            </Col>
          </FormGroup>
        </Col>
        <Col sm={12}>{ groupByInputs }</Col>
        { (mode !== 'view') && (
          <Col sm={12}>
            <CreateButton onClick={this.props.onGroupByAdd} label="Add Group By Operator" disabled={disableCreateGroupBy} />
          </Col>
        )}
        <Col sm={12}>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>
              Display Fields
            </Col>
            <Col sm={7}>
              <Select
                multi={true}
                options={displayOptions}
                value={displayFieldsValues}
                onChange={this.props.onChangeDisplayFields}
                disabled={disabled}
              />
            </Col>
          </FormGroup>
        </Col>
      </div>
    );
  }

}

export default ReportFields;
