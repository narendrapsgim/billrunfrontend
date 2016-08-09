import FieldValidations from '../FieldValidations';

export default function validator(entity, page) {
  return entity.map((value, name) => {
    let validation = FieldValidations.getIn([page, name]);
    if (!validation) return true;
    let valid = true;
    return validation.map((v, type) => {
      return eval(`${type}_validator(value, v)`);
    });
  });
}

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
