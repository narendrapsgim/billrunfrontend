import React from 'react';

const Checkbox = (props) => {
  const onChange = (e) => {
    const { id, checked } = e.target;
    props.onChange({target: {id, value: checked}});
  };

  const { id, value, editable, disabled, label } = props;
  return editable
       ? (<label><input type="checkbox"
                 id={ id }
                 checked={ value }
                 disabled={ disabled }
                 onChange={ onChange } />&nbsp;&nbsp;{ label }</label> )
       : (<span>{ value }</span>);
};

export default Checkbox;
