import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';

const Tags = (props) => {
  const { editable, value, disabled, placeholder, onChange, inputProps, onlyUnique, ...otherProps } = props;
  const valueArr = Array.isArray(value) ? value : [value];
  if (!editable) {
    const displayValue = valueArr.join(', ');
    return (
      <div className="non-editable-field">
        {displayValue}
      </div>
    );
  }
  const renderTag = (args) => {
    const { tag, key, disabled: allowRemove, onRemove, classNameRemove, getTagDisplayValue, ...other } = args;
    const remove = () => { onRemove(key); };
    const renderDisplayValue = props.getTagDisplayValue || getTagDisplayValue;
    return (
      <span key={key} {...other}>
        {!allowRemove && (<span className={classNameRemove} onClick={remove}>×</span>)}
        {renderDisplayValue(tag)}
      </span>
    );
  };
  const placeholderText = (disabled) ? '' : placeholder;
  const defautlInputProps = {
    placeholder: placeholderText,
  };
  const tagInputProps = Object.assign(defautlInputProps, inputProps);
  return (
    <TagsInput
      {...otherProps}
      addOnBlur={true}
      value={valueArr}
      onChange={onChange}
      inputProps={tagInputProps}
      disabled={disabled}
      renderTag={renderTag}
      onlyUnique={onlyUnique}
    />
  );
};

Tags.defaultProps = {
  value: [],
  required: false,
  disabled: false,
  editable: true,
  placeholder: '',
  inputProps: {},
  onChange: () => {},
  getTagDisplayValue: null,
  onlyUnique: false,
};

Tags.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
  ]),
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  placeholder: PropTypes.string,
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  getTagDisplayValue: PropTypes.func,
  onlyUnique: PropTypes.bool,
};

export default Tags;
