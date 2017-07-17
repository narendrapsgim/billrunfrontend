import { createSelector } from 'reselect';
import { onBoardingStates } from '../actions/guiStateActions/pageActions';


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

export const onBoardingIsPausedSelector = createSelector(
  onBoardingStateSelector,
  state => state === onBoardingStates.PAUSED,
);

export const onBoardingIsStartingSelector = createSelector(
  onBoardingStateSelector,
  state => state === onBoardingStates.STARTING,
);

const getConfirm = state => state.guiState.page.getIn(['confirm']);
export const confirmSelector = createSelector(
  getConfirm,
  confirm => confirm,
);
