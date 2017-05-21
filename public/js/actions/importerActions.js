import Immutable from 'immutable';
import {
  gotEntity,
  clearEntity,
  updateEntityField,
  deleteEntityField,
} from './entityActions';

export const initImporter = () => gotEntity('importer', Immutable.Map());

export const deleteImporter = () => clearEntity('importer');

export const updateImporterValue = (path, value) => updateEntityField('importer', path, value);

export const deleteImporterValue = path => deleteEntityField('importer', path);
