import { createSelector } from 'reselect';
import { onBoardingStates } from '../actions/guiStateActions/pageActions'

const getOnBoardingShow = state => state.guiState.page.getIn(['onBoarding', 'show']);
export const onBoardingShowSelector = createSelector(
  getOnBoardingShow,
  show => show,
);

const getOnBoardingState = state => state.guiState.page.getIn(['onBoarding', 'state']);
export const onBoardingStateSelector = createSelector(
  getOnBoardingState,
  state => state,
);

const getOnBoardingStep = state => state.guiState.page.getIn(['onBoarding', 'step']);
export const onBoardingStepSelector = createSelector(
  getOnBoardingStep,
  step => step,
);

export const onBoardingIsRunnigSelector = createSelector(
  onBoardingStateSelector,
  state => state === onBoardingStates.RUNNING,
);

export const onBoardingIsFinishedSelector = createSelector(
  onBoardingStateSelector,
  state => state === onBoardingStates.FINISHED,
);

export const onBoardingIsReadySelector = createSelector(
  onBoardingStateSelector,
  state => state === onBoardingStates.READY,
);
