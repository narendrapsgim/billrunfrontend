export const SET_GENERATOR_NAME = 'SET_GENERATOR_NAME';
export const SELECT_INPUT_PROCESSOR = 'SELECT_INPUT_PROCESSOR';
export const SET_SEGMENTATION = 'SET_SEGMENTATION';

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

export function setSegmentation(segment, values, oldSegment) {
  return {
    type: SET_SEGMENTATION,
    segment,
    values,
    oldSegment
  };
}

