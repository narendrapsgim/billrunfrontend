import { createSelector } from 'reselect';
import Immutable from 'immutable';
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

const getMainMenu = state => state.guiState.menu.getIn(['main']);
export const permissionsSelector = createSelector(
  getMainMenu,
  (mainMenu = Immutable.Map()) => mainMenu
    .reduce((acc, menuItem) => {
      if (!menuItem.get('subMenus', Immutable.List()).isEmpty()) {
        return acc.push(...menuItem.get('subMenus', Immutable.List()))
      }
      return acc;
    }, mainMenu)
    .reduce((acc, menuItem) => {
      if (menuItem.get('route', '') !== '') {
        const routePermission = Immutable.Map({
          'view':  menuItem.get('roles', Immutable.List())
        });
        return acc.set(menuItem.get('route', '-'), routePermission)
      }
      return acc;
    }, Immutable.Map())
);
