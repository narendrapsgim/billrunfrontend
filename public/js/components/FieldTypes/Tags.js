import React, { PropTypes } from 'react';
import TagsInput from 'react-tagsinput';

const Tags = (props) => {
  const { editable, value, disabled, placeholder, onChange, inputProps, ...otherProps } = props;

  const renderTag = (args) => {
    const { tag, key, disabled: allowRemove, onRemove, classNameRemove, getTagDisplayValue, ...other } = args;
    const remove = () => { onRemove(key); };
    return (
      <span key={key} {...other}>
        {!allowRemove && (<span className={classNameRemove} onClick={remove}>×</span>)}
        {getTagDisplayValue(tag)}
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
      value={value}
      onChange={onChange}
      inputProps={tagInputProps}
      disabled={disabled}
      renderTag={renderTag}
    />
  );
};

Tags.defaultProps = {
  required: false,
  disabled: false,
  editable: true,
  placeholder: '',
  inputProps: {},
  onChange: () => {},
};

Tags.propTypes = {
  value: PropTypes.array,
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  placeholder: PropTypes.string,
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
};

export default Tags;
