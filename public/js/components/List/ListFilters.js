import React from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import Chips from '../Chips';
import AddMore from '../AddMore';
import AdvancedFilter from '../AdvancedFilter';
import FieldsContainer from '../FieldsContainer';
import Aggregate from '../Aggregate/Aggregate';
import theme from '../../theme'

const styles = {
  filterInput : {
    margin : '10px',
  },
  filterChips : {
    margin : '10px',
    display : 'inline-block',
  },
  filterDatePicker: {
    margin : '10px',
    display: 'inline-block'
  },
  filterSelect: {
    verticalAlign: 'top',
    margin: '10px'
  }
}
export default class ListFilters extends React.Component {

  constructor(props) {
    super(props);
    this.state = { progress : props.progress};

    this.renderFilterFields = this.renderFilterFields.bind(this);
    this.renderAdvancedFilter = this.renderAdvancedFilter.bind(this);
    this.renderAction = this.renderAction.bind(this);

    this.onChangeFilterMultiselect = this.onChangeFilterMultiselect.bind(this);
    this.onChangeFilterSelectField = this.onChangeFilterSelectField.bind(this);
    this.onAdvFilterChange = this.onAdvFilterChange.bind(this);
    this.onAdvFilterRemove = this.onAdvFilterRemove.bind(this);
    this.onFilterApplyClick = this.onFilterApplyClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      progress: nextProps.progress
    });
  }

  onChangeFilterMultiselect(name, value) {
    let evt = {
      target: { name }
    };
    this.props.onChangeFilter(evt, value);
  }

  onChangeFilterSelectField(name, e, index, value) {
    let evt = {
      target: { name }
    };
    this.setState({
      [name]: value
    }, () => {this.props.onChangeFilter(evt, value);});
  }


  renderFilterFields(){
    let filters = [];
    this.props.fields.forEach((field, i) => {
      if(field.filter && !field.filter.system){
        let filterKey = this.props.page + "-" + field.key;
        let filterVal = localStorage.getItem(filterKey);
        let defVal = (filterVal !== null) ? filterVal : field.filter.defaultValue;
        if(field.type == 'urt') {
          filters.push(<DatePicker
                  key={this.props.page + "-" + i} name={field.key}
                  defaultDate={(defVal) ? new Date(defVal) : null}
                  hintText={"Enter " + field.label + "..."}
                  floatingLabelText={"Search by " + field.label}
                  container="inline" mode="landscape" style={styles.filterDatePicker}
                  onChange={this.props.onChangeFilterDate.bind(null, field.key)} autoOk={true}
                  formatDate={this.props.formatDate}
                />);
        } else if(field.type == 'multiselect'){
          filters.push(<Chips
                  items={(defVal) ? defVal.split(",") : []}
                  key={this.props.page + "-" + i} name={field.key} style={{wrapper:styles.filterChips}}
                  options={field.filter.options}
                  onChange={this.onChangeFilterMultiselect.bind(null, field.key)}
                  label={field.label} inputType='select'
                />);
        } else if(field.type == 'select'){
          let val = typeof filterVal !== 'undefined' ? filterVal : null;
          val = typeof this.state[field.key] !== 'undefined' ? this.state[field.key] : val;
          filters.push(<SelectField
                    key={this.props.page + "-" + i} name={field.key} style={styles.filterSelect}
                    value={val}
                    onChange={this.onChangeFilterSelectField.bind(null, field.key)}
                    floatingLabelText={field.label}
                  >
                    { field.filter.options.map((field, option_index) =>  { return ( <MenuItem value={field.key} key={i + "-" + option_index} primaryText={field.value} />); }) }
                  </SelectField>);
        } else {
          filters.push(<TextField
                   style={styles.filterInput}
                   key={this.props.page + "-" + i} name={field.key}
                   hintText={"enter " + field.label + "..."}
                   floatingLabelText={"Search by " + field.label}
                   errorText=""
                   defaultValue={(defVal) ? defVal : ''}
                   onChange={this.props.onChangeFilter}
                 />);
         }
      }
    });
    return filters;
  }

  onFilterApplyClick(){
    this.props.filterApply();
  }

  onAdvFilterChange(filter){
    this.props.onChangeAdvFilter(filter);
  }
  onAdvFilterRemove(index){
    this.props.onRemoveAdvFilter(index);
  }

  renderAdvancedFilter(){
    let { advancedFilter } = this.props;
    if(advancedFilter){
      let advFilter = <AdvancedFilter fields={advancedFilter} onFilterChanged={this.onAdvFilterChange}/>;
      let addMore = <AddMore item={advFilter} removeItem={this.onAdvFilterRemove}/>
      return <FieldsContainer size="12" label="Advenced Filter" content={addMore} collapsible={true} collapsibleType={'css'} expanded={true}/>
    }
  }

  renderAggregate(){
    let { aggregate } = this.props;
    if(aggregate) {
      let aggregateFilter = <Aggregate
                              fields={this.props.aggregate.fields}
                              methods={this.props.aggregate.methods}
                              groupBy={this.props.aggregate.groupBy}
                              filters={this.props.filters}
                              onClear={this.props.onClearAggregate}
                              onDataChange={this.props.onChangeAggregate}
                              buildSearchQueryArg={this.props.buildSearchQueryArg}
                            />;
      return <FieldsContainer size="12" label="Aggregate" content={aggregateFilter} collapsible={true} collapsibleType={'css'} expanded={true}/>
    }
  }

  renderAction(){
    let { advancedFilter } = this.props;
    let filters = false;
    this.props.fields.forEach((field, i) => {
      if(field.filter && !field.filter.system){
        filters = true;
      }
    });
    if (advancedFilter || filters) {
      return (
        <div className='row'>
          <div className="col-md-12">
            <RaisedButton
              style={{display:'block'}}
              backgroundColor={theme.palette.primary1Color}
              labelStyle={{color:'#fff'}}
              fullWidth={false}
              label={this.state.progress ? "Please Wait While Filtering...." : "Apply Filter"}
              disabled={this.state.progress ? true : false}
              onClick={this.onFilterApplyClick} />
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderFilterFields()}
        {this.renderAdvancedFilter()}
        {this.renderAction()}
        {this.renderAggregate()}
      </div>
    )
  }
}
