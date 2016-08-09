import FieldValidations from '../FieldValidations';

export const INVALID_FORM = 'INVALID_FORM';

export function validate(entity, page) {
  let valid = true;
  const valid_form = entity.map((value, name) => {
    let validation = FieldValidations.getIn([page, name]);
    if (!validation) return true;
    return validation.map((v, type) => {
      let field_valid = eval(`${type}_validator(value, v)`);
      valid &= field_valid;
      return field_valid;
    });
  });
  return valid_form.set('valid', valid);
}

export function invalidForm(validations) {
  return {
    type: INVALID_FORM,
    validations
  };
}


/** VALIDATORS **/

function mandatory_validator(value, def) {
  if (!def) return true;
  return !_.isUndefined(value) && !_.isEmpty(value);
}

function size_validator(value, def) {
  let valid = true;
  if (!_.isUndefined(def.get('$gte'))) valid = value.size >= def.get('$gte');
  if (!_.isUndefined(def.get('$lt'))) valid = value.size < def.get('$lt');
  return valid;
}
