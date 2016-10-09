export const SET_GENERATOR_NAME = 'SET_GENERATOR_NAME';
export const SELECT_INPUT_PROCESSOR = 'SELECT_INPUT_PROCESSOR';
export const SET_SEGMENTATION = 'SET_SEGMENTATION';
export const ADD_SEGMENTATION = 'ADD_SEGMENTATION';
export const DELETE_SEGMENTATION = 'DELETE_SEGMENTATION';
export const CLEAR_EXPORT_GENERATOR = 'CLEAR_EXPORT_GENERATOR';

export function setGeneratorName(name) {
  return {
    type: SET_GENERATOR_NAME,
    name
  };
}

export function selectInputProcessor(inputProcessor) {
  return {
    type: SELECT_INPUT_PROCESSOR,
    inputProcessor
  };
}

export function setSegmentation(index, key, value) {
  return {
    type: SET_SEGMENTATION,
    index,
    key,
    value
  };
}

export function addSegmentation() {
  return {
    type: ADD_SEGMENTATION
  };
}

export function deleteSegmentation(index) {
  return {
    type: DELETE_SEGMENTATION,
    index
  };
}

export function clearExportGenerator() {
  return {
    type: CLEAR_EXPORT_GENERATOR
  };
}