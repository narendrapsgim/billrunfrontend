import Immutable from 'immutable';
import {
  gotEntity,
  clearEntity,
  updateEntityField,
  deleteEntityField,
  saveEntities,
} from './entityActions';

const defaultImporter = Immutable.Map({
  map: Immutable.List(),
  fileDelimiter: ',',
});

export const initImporter = () => gotEntity('importer', defaultImporter);

export const deleteImporter = () => clearEntity('importer');

export const updateImporterValue = (path, value) => updateEntityField('importer', path, value);

export const deleteImporterValue = path => deleteEntityField('importer', path);

export const sendImport = (collection, items) => saveEntities(collection, items);
